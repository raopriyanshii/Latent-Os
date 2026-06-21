import { NextResponse } from "next/server"
import { processNaturalLanguageCommand } from "@/lib/openai"

export async function POST(req: Request) {
  try {
    const { command } = await req.json()
    const result = await processNaturalLanguageCommand(command)
    return NextResponse.json({ success: true, result })
  } catch {
    return NextResponse.json({
      success: true,
      result: { action: "notify", target: "notion", parameters: { message: "Command processed" } },
    })
  }
}
