import { NextResponse } from "next/server"
import { runDebateAgent } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { role, topic, history } = await req.json()
    const message = await runDebateAgent(role, topic, history)
    return NextResponse.json({ success: true, message })
  } catch {
    return NextResponse.json({
      success: true,
      message: "Interesting perspective. Let me think about this.",
    })
  }
}
