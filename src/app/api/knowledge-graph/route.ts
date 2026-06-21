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
        { id: "3", type: "commit", label: "fix/auth-bug", connections: ["1", "2"], metadata: { sha: "a3f9d2c" } },
        { id: "4", type: "decision", label: "Ship private beta", connections: ["2", "5"], metadata: { date: new Date().toISOString() } },
        { id: "5", type: "meeting", label: "Sprint Planning", connections: ["1", "4"], metadata: { date: new Date().toISOString() } },
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
