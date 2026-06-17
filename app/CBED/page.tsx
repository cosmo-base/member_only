'use client'

import { useEffect } from 'react'

export default function RedirectPage() {
  useEffect(() => {
    // 現在のURLパス（例: /member_only/CBED/search）と検索パラメータを取得
    const currentPath = window.location.pathname
    const currentSearch = window.location.search

    // "/CBED" より後ろのパスを切り出す（例: /CBED/search -> /search）
    const subPath = currentPath.split('/CBED')[1] || ''

    // 新しいリポジトリのURLへ、パスを維持したまま転送
    window.location.replace(`https://cosmo-base.github.io/event_database${subPath}${currentSearch}`)
  }, [])

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', color: '#333' }}>
      <h2>新しいイベントデータベースへ移動しています...</h2>
      <p>自動的に切り替わらない場合は、以下のリンクをクリックしてください。</p>
      <a href="https://cosmo-base.github.io/event_database/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
        新しいサイトへ移動する
      </a>
    </div>
  )
}