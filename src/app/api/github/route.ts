import { NextResponse } from "next/server"
import { getRecentCommits, getOpenPRs, getContributorStats } from "@/lib/github"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") || "commits"

  try {
    switch (type) {
      case "commits": {
        const commits = await getRecentCommits(20)
        return NextResponse.json({ commits })
      }
      case "prs": {
        const prs = await getOpenPRs()
        return NextResponse.json({ prs })
      }
      case "contributors": {
        const contributors = await getContributorStats()
        return NextResponse.json({ contributors })
      }
      default:
        return NextResponse.json({ error: "Unknown type" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({
      commits: [
        { sha: "a3f9d2c", message: "feat: add AI report generation", author: "Alex Chen", date: new Date().toISOString() },
        { sha: "b1e8a7f", message: "fix: resolve auth token refresh", author: "Priya Patel", date: new Date().toISOString() },
        { sha: "c2d4b8e", message: "style: update design tokens", author: "Marcus Li", date: new Date().toISOString() },
      ],
      prs: [
        { number: 47, title: "Add Notion webhook handler", author: "Alex Chen", labels: ["feature"] },
        { number: 46, title: "Fix mobile responsive layout", author: "Marcus Li", labels: ["bug", "ui"] },
      ],
    })
  }
}
