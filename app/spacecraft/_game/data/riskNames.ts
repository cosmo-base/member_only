import type { RiskId } from '../engine/types';

export const RISK_NAMES: Record<RiskId, string> = {
  grant: '助成金の審査',
  crowdfunding: '支援の募集',
  emergencyFunding: '追加支援のお願い',
  vibration: '振動試験',
  contact: '最初の通信',
  recoverIsolate: '原因の切り分け',
  recoverProcedure: '復旧手順',
  recoverLast: '呼びかけ',
  deploy: 'パネルの展開',
  payloadHang: '機器の不具合',
  reset: 'リセット',
  extended: '延長運用',
  safetyReview: '安全審査',
  debrisPass: 'デブリの通過',
  grantRetry: '再申請の審査',
  testFind: '試験中の異常',
  launchDelay: '打ち上げ延期',
  tumble: '機体の回転',
  solarStorm: '太陽フレア',
  conjunction: 'デブリの接近',
  groundFault: '地上局のトラブル',
  partShortage: '部品の値上がり',
};

/** 発生判定で起きたイベントに添える「なぜ起きたか」の説明 */
export const OCCURRENCE_NOTES: Partial<Record<RiskId, string>> = {
  payloadHang: 'こうした不具合は、試験の網羅度・未解決の不具合・部品の選び方によって起きやすさが変わります。',
  testFind: '試験中の異常は、未解決の不具合や実績の少ない部品が多いほど見つかりやすくなります。打ち上げ前に見つかるのは、むしろ幸運です。',
  launchDelay: '打ち上げの延期は、天候やロケット側の都合でよく起きます。プロジェクトの準備とは関係なく起きることもあります。',
  tumble: '分離直後の回転は、姿勢制御の方式や、事前に手順を確かめていたかで起きやすさが変わります。',
  solarStorm: '太陽の活動は約11年周期で変わります。運用期間が長いほど、出会う可能性が高くなります。',
  conjunction: 'デブリ（宇宙ごみ）の接近は、軌道の高さや運用期間の長さで起きやすさが変わります。',
  groundFault: '地上局のトラブルは、設備の保守体制や、事前に地上局とつないで試験したかで起きやすさが変わります。',
  partShortage: '部品の値上がりは世の中の事情でも起きます。早めに費用を計画していたり、頼れる工場があったりすると影響を受けにくくなります。',
};
