'use client'

import { useEffect, useState } from 'react'

export default function NotFound() {
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // ユーザーがアクセスしたURL（例: /member_only/CBED/123）を取得
    const path = window.location.pathname;
    const search = window.location.search;

    // もしURLの中に "/CBED/" が含まれていたら、新サイトへ転送！
    if (path.includes('/CBED/')) {
      setIsRedirecting(true);

      // "/CBED/" より後ろのID部分を切り出す（例: "123" や "search" など）
      const subPath = path.split('/CBED/')[1] || '';

      // 新しいデータベースのURLにくっつけてジャンプさせる
      const targetUrl = `https://cosmo-base.github.io/event_database/${subPath}${search}`;
      window.location.replace(targetUrl);
    }
  }, [])

  // 転送中（CBEDのURLにアクセスした時）の画面
  if (isRedirecting) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <p>新しいイベントデータベースへ移動しています...</p>
      </div>
    )
  }

  // CBED以外（本当に間違ったURL）にアクセスした時の画面
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>404 - ページが見つかりません</h1>
      <p>お探しのページは移動したか、削除された可能性があります。</p>
    </div>
  )
}