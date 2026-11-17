/**
 * 宇宙機プロジェクトシミュレーター：プレイデータ受信用 Google Apps Script
 *
 * スプレッドシートの「拡張機能 → Apps Script」に貼り付け、ウェブアプリとしてデプロイする。
 * 手順は apps-script/README.md を参照。
 *
 * - ゲームからは text/plain で JSON が送られてくる（CORS の事前確認を避けるため）
 * - 受け取った内容は検証・長さ制限・数式化の無害化をしてから 1 行追記する
 * - IP アドレスなどは Apps Script からは取得できず、記録もしない
 */

const SHEET_PLAY = 'play';
const SHEET_FEEDBACK = 'feedback';
const FEEDBACK_MAX = 1000;
const MAX_BODY = 120000; // 1回の送信で受け付ける最大文字数
const MAX_CELL = 45000; // スプレッドシートの1セルの上限（50,000文字）より少し小さく
const MAX_CHOICES = 300;

/**
 * play シートの列。
 * seed・design・choiceIds と appVersion があれば、同じバージョンのゲームでプレイを再現できる
 * （src/engine/replay.ts の replayPlay に、このシートの値をそのまま渡す）。
 */
const PLAY_HEADERS = [
  'receivedAt', 'playId', 'appVersion', 'mode', 'seed', 'ending', 'endingTitle', 'phaseReached',
  'progress', 'progressBand', 'design', 'choiceCount', 'choiceIds', 'finalValues', 'flags',
  'log', 'reportText', 'report',
];
const FEEDBACK_HEADERS = ['receivedAt', 'playId', 'appVersion', 'feedback'];

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (raw.length > MAX_BODY) return json_({ ok: false, error: 'too_large' });
    const p = JSON.parse(raw);
    if (p.schema !== 3) return json_({ ok: false, error: 'schema' });
    if (p.type !== 'play' && p.type !== 'feedback') return json_({ ok: false, error: 'type' });

    const playId = str_(p.playId, 64);
    const appVersion = str_(p.appVersion, 16);
    if (!playId) return json_({ ok: false, error: 'invalid' });

    let row;
    let sheetName;
    let headers;
    if (p.type === 'play') {
      const mode = oneOf_(p.mode, ['beginner', 'expert']);
      const ending = oneOf_(p.ending, ['success', 'partial', 'extended', 'lesson', 'early']);
      if (!mode || !ending) return json_({ ok: false, error: 'invalid' });
      const choices = Array.isArray(p.choiceIds) ? p.choiceIds.slice(0, MAX_CHOICES).map((c) => str_(c, 64)) : [];
      const report = p.report && typeof p.report === 'object' ? p.report : {};
      const values = p.finalValues && typeof p.finalValues === 'object' ? p.finalValues : {};
      sheetName = SHEET_PLAY;
      headers = PLAY_HEADERS;
      row = [
        new Date(), playId, appVersion, mode,
        typeof p.seed === 'number' && isFinite(p.seed) ? p.seed : '',
        ending, str_(report.endingTitle, 64), num_(p.phaseReached),
        num_(values.progress, 100), str_(p.progressBand, 16),
        jsonCell_(p.design), choices.length, choices.join(' '),
        jsonCell_(values),
        Array.isArray(p.flags) ? p.flags.slice(0, 200).map((f) => str_(f, 32)).join(' ') : '',
        jsonCell_(p.log), str_(report.text, MAX_CELL), jsonCell_(report),
      ];
    } else {
      const text = str_(p.feedback, FEEDBACK_MAX);
      if (!text) return json_({ ok: false, error: 'empty' });
      sheetName = SHEET_FEEDBACK;
      headers = FEEDBACK_HEADERS;
      row = [new Date(), playId, appVersion, text];
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet_(sheetName, headers).appendRow(row.map(safe_));
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'server' });
  }
}

/** ブラウザで URL を開いたときの確認用 */
function doGet() {
  return json_({ ok: true, service: 'project-spacecraft-analytics' });
}

/**
 * 保存期間の運用：コンテンツ提供終了後、半年以内にこの関数を実行して全データを削除する。
 * （スプレッドシートの版の履歴にも残るため、必要に応じてファイル自体も削除する）
 */
function deleteAllData() {
  [SHEET_PLAY, SHEET_FEEDBACK].forEach((name) => {
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
    if (sh && sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1);
  });
}

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function str_(v, max) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, max);
}

function num_(v, max) {
  const hi = max === undefined ? 99 : max;
  return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(hi, Math.floor(v))) : '';
}

/** オブジェクトや配列を JSON 文字列として1セルに入れる。大きすぎる場合は記録しない */
function jsonCell_(v) {
  if (v === undefined || v === null) return '';
  const s = JSON.stringify(v);
  return s.length <= MAX_CELL ? s : '(too large)';
}

function oneOf_(v, list) {
  return list.indexOf(v) >= 0 ? v : '';
}

/** 「=」「+」「-」「@」で始まる値は数式として解釈されないよう先頭に ' を付ける */
function safe_(v) {
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(v)) return "'" + v;
  return v;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
