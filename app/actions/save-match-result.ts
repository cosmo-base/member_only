// app/actions/save-match-result.ts
"use server"

export async function saveDiagnosisResult(data: any) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfhx-DlgYauECo0vPZ8TJNjs1pIL96GxhifeB4FTfxN__jIpYoz9JdNMnLub9euDtORQ/exec";

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      // GASはリダイレクトを返す仕様があるため、text/plainで送るのが安定します
      headers: {
        "Content-Type": "text/plain", 
      },
      body: JSON.stringify(data),
    });
    return { success: true };
  } catch (error) {
    console.error("スプレッドシートへの保存に失敗しました:", error);
    return { success: false };
  }
}