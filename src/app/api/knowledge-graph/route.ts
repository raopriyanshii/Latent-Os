import { NextResponse } from "next/server"
import { getKnowledgeGraph, saveKnowledgeNode } from "@/lib/supabase"

export async function GET() {
  try {
    const nodes = await getKnowledgeGraph()
    return NextResponse.json({ nodes })
  } catch {
    return NextResponse.json({
      nodes: [
        { id: "1", type: "person", label: "Alex Chen", connections: ["2", "3"], metadata: { role: "Lead Engineer" } },
        { id: "2", type: "task", label: "Auth System", connections: ["1", "4"], metadata: { status: "In Review" } },
      ],
    })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const node = await saveKnowledgeNode(body)
    return NextResponse.json({ success: true, node })
  } catch {
    return NextResponse.json({ error: "Failed to save node" }, { status: 500 })
  }
}
