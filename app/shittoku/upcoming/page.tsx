import type { Metadata } from "next"
import ShittokuUpcomingPage from "./_components/upcoming"

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "今後のイベント | Cosmo Baseで宇宙知っトク",
}

export default ShittokuUpcomingPage
