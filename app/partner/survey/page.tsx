"use client"

import { useState } from "react"
import { StarBackground } from "@/components/star-background"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle2, Loader2, ClipboardCheck } from "lucide-react"
import Link from "next/link"

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdTcDE_jfE8x1ZM2MYI7DiknV1vcpyxfoDNarSYVrLyTCI1Gg/formResponse"

export default function SurveyRequestPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)

        try {
            // mode: 'no-cors' でGoogleフォームに直接送信
            await fetch(GOOGLE_FORM_ACTION, {
                method: "POST",
                mode: "no-cors",
                body: formData,
            })
            // 送信完了画面へ
            setIsSuccess(true)
        } catch (error) {
            console.error("送信エラー:", error)
            alert("送信に失敗しました。お手数ですが時間をおいて再度お試しください。")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen relative">
            <StarBackground />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
                    <div className="mb-6">
                        <Link href="/partner">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground -ml-4">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                パートナーマイページに戻る
                            </Button>
                        </Link>
                    </div>

                    <div className="mb-8 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">アンケート確認依頼</h1>
                        <p className="text-muted-foreground">
                            実施予定のアンケートや市場調査の内容確認依頼はこちらから送信してください。
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="glass-card rounded-xl p-10 text-center border border-primary/30 bg-primary/5 shadow-xl animate-in fade-in zoom-in duration-300">
                            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">送信完了しました</h2>
                            <p className="text-muted-foreground mb-8">
                                内容の確認依頼を受け付けました。Cosmo Base運営にて内容を確認後、ご連絡いたします。
                            </p>
                            <Link href="/partner">
                                <Button className="px-8 h-12">マイページに戻る</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 md:p-10 space-y-8 shadow-xl border border-border/50">

                            <div className="space-y-6">
                                {/* 企業・団体名 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        企業・団体名 <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">必須</span>
                                    </label>
                                    <Input
                                        name="entry.1005591774"
                                        required
                                        className="bg-secondary/40 border-border/40 focus:border-primary/50 h-12"
                                        placeholder="株式会社 宇宙開発"
                                    />
                                </div>

                                {/* アンケート目的 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">アンケート目的</label>
                                    <textarea
                                        name="entry.1573186624"
                                        className="w-full min-h-[100px] p-4 rounded-md border border-border/40 bg-secondary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="新規サービス開発のためのニーズ調査など"
                                    />
                                </div>

                                {/* 収拾する個人情報 */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        収集する個人情報 <span className="text-xs bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">必須</span>
                                    </label>
                                    <textarea
                                        name="entry.1035314661"
                                        required
                                        className="w-full min-h-[100px] p-4 rounded-md border border-border/40 bg-secondary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="氏名、メールアドレス、所属、年齢など"
                                    />
                                </div>

                                {/* 個人情報の取り扱い */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2">
                                        個人情報の取り扱い
                                    </label>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        ※外部サービス（Googleフォーム等）を利用する場合はその旨や、データの保管期限・利用目的の明示内容についてお書きください。
                                    </p>
                                    <textarea
                                        name="entry.620283929"
                                        className="w-full min-h-[120px] p-4 rounded-md border border-border/40 bg-secondary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="回答データは統計的に処理し、個人の特定ができない形で活用します。調査終了後にデータは破棄します。"
                                    />
                                </div>
                            </div>

                            {/* 送信ボタン */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-primary/20 transition-all"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                                            送信中...
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardCheck className="w-5 h-5 mr-2" />
                                            確認依頼を送信する
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </div>
    )
}