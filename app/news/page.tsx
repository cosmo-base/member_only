import type { Metadata } from "next"
import NewsPage from "./_components/news"

export const metadata: Metadata = {
  title: "週刊宇宙ニュース",
}

export const dynamic = 'force-static'

export default NewsPage
