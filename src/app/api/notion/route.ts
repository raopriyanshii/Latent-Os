import { NextResponse } from "next/server"
import { getNotionDatabase, createNotionPage } from "@/lib/notion"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const databaseId = searchParams.get("databaseId")

  if (!databaseId) {
    return NextResponse.json({
      pages: [
        { id: "1", title: "Sprint 8 Tasks", type: "task", status: "In Progress" },
        { id: "2", title: "Design Review Meeting", type: "meeting", status: "Done" },
        { id: "3", title: "Auth System PRD", type: "document", status: "Draft" },
      ],
    })
  }

  try {
    const pages = await getNotionDatabase(databaseId)
    return NextResponse.json({ pages })
  } catch {
    return NextResponse.json({ error: "Failed to fetch Notion database" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { databaseId, properties } = body

    const page = await createNotionPage(databaseId, properties)
    return NextResponse.json({ success: true, page })
  } catch {
    return NextResponse.json({ error: "Failed to create Notion page" }, { status: 500 })
  }
}
