"use client"
import { useState } from "react"
import { Mic, FileText, CheckSquare, BookOpen, GitBranch, Bell, ArrowRight } from "lucide-react"

const outputs = [
  { icon: FileText, label: "Notion Page", desc: "Auto-formatted meeting notes", color: "#a855f7", delay: 0 },
  { icon: CheckSquare, label: "Action Items", desc: "Tasks created & assigned", color: "#3b82f6", delay: 200 },
  { icon: BookOpen, label: "Decision Log", desc: "Key decisions documented", color: "#22c55e", delay: 400 },
  { icon: GitBranch, label: "GitHub Issues", desc: "Bugs & tasks opened", color: "#06b6d4", delay: 600 },
  { icon: Bell, label: "Team Update", desc: "Summary sent to channel", color: "#eab308", delay: 800 },
]

const sampleTranscript = `Alex: The auth bug is blocking everything. We need it done by Friday.
Sarah: Agreed. Marcus, can you prioritize the design tokens so Alex can finish the screens?
Marcus: Yes, I'll have them ready by tomorrow noon.
Sarah: Perfect. Let's also schedule a demo for next Wednesday. Alex, you good with that?
Alex: Works for me. I'll also open a GitHub issue for the rate limiting problem we found.`

export function MeetingPipeline() {
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [completedOutputs, setCompletedOutputs] = useState<number[]>([])
  const [transcript, setTranscript] = useState(sampleTranscript)

  const processMeeting = async () => {
    setProcessing(true)
    setDone(false)
    setCompletedOutputs([])
    for (let i = 0; i < outputs.length; i++) {
      await new Promise((r) => setTimeout(r, outputs[i].delay + 600))
      setCompletedOutputs((prev) => [...prev, i])
    }
    setProcessing(false)
    setDone(true)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Mic className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-gray-300">Meeting Transcript</span>
          <span className="ml-auto text-xs text-gray-500">24 min</span>
        </div>
        <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)}
          className="w-full bg-transparent text-xs text-gray-400 resize-none focus:outline-none leading-relaxed" rows={4} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-px h-6 bg-gray-700" />
          <ArrowRight className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-gray-400">AI Processing Pipeline</span>
        </div>
        <button onClick={processMeeting} disabled={processing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg text-xs text-white font-medium transition-colors">
          <Mic className="w-3 h-3" />
          {processing ? "Processing..." : done ? "Process Again" : "Process Meeting"}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {outputs.map((output, i) => {
          const Icon = output.icon
          const isComplete = completedOutputs.includes(i)
          const isProcessing = processing && completedOutputs.length === i
          return (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-500"
              style={{ borderColor: isComplete ? output.color + "40" : "#1e2d50", backgroundColor: isComplete ? output.color + "08" : "transparent" }}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${isProcessing ? "animate-pulse" : ""}`}
                style={{ backgroundColor: isComplete ? output.color + "20" : "#1e2d50", border: `1px solid ${isComplete ? output.color + "40" : "#2a3558"}` }}>
                <Icon className="w-4 h-4" style={{ color: isComplete ? output.color : "#4b5563" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: isComplete ? output.color : "#6b7280" }}>{output.label}</p>
                <p className="text-xs text-gray-500 truncate">{output.desc}</p>
              </div>
              {isComplete && <span className="text-xs text-green-400 shrink-0">✓ Done</span>}
              {isProcessing && (
                <div className="flex gap-1">{[0,1,2].map((j) => (<div key={j} className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${j * 0.1}s` }} />))}</div>
              )}
            </div>
          )
        })}
      </div>
      {done && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
          <p className="text-xs font-semibold text-green-400">✅ Pipeline Complete!</p>
          <p className="text-xs text-gray-400 mt-1">3 action items assigned • 2 decisions logged • 1 GitHub issue opened • Notion page created</p>
        </div>
      )}
    </div>
  )
}
