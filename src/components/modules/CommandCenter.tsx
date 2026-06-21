"use client"
import { useState, useRef, useEffect } from "react"
import { Terminal, Zap, ChevronRight } from "lucide-react"

const suggestions = [
  "Create a task: Fix login bug P0",
  "Summarize today's standup",
  "Show launch readiness score",
  "Who is blocked right now?",
  "Generate sprint summary",
  "What decisions were made this week?",
  "Start a debate about mobile-first",
  "Show team DNA overview",
]

const commandHistory = [
  { input: "Generate daily AI report", output: "📊 Daily report generated: 3 wins, 2 blockers, 73% launch readiness. Sent to Notion and team Slack.", type: "success" },
  { input: "Who is blocked?", output: "🚧 Alex: Waiting on design review for auth screens\n🚧 Marcus: Needs API spec from backend", type: "info" },
  { input: "Create sprint retrospective", output: "✅ Created Notion page: 'Sprint 8 Retrospective' with AI-generated template. 4 action items auto-assigned.", type: "success" },
]

export function CommandCenter() {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState(commandHistory)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history])

  const filtered = suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && input.length > 0)

  const runCommand = async (cmd: string) => {
    if (!cmd.trim() || loading) return
    setLoading(true)
    setInput("")
    setShowSuggestions(false)
    await new Promise((r) => setTimeout(r, 1200))
    const responses: Record<string, string> = {
      default: "✅ Command processed. Notion updated, team notified, knowledge graph synced.",
      report: "📊 AI Report: Sprint velocity at 42 points (+12%). 5 PRs merged, 0 critical bugs. Launch readiness: 73% (+4%).",
      task: "✅ Task created in Notion and assigned. GitHub issue #47 opened. Added to Sprint 8 backlog.",
      standup: "📝 Standup summary: Alex working on auth, Sarah reviewing PRD v2, Marcus finishing mobile screens. 1 blocker flagged.",
      blocked: "🚧 2 team members blocked:\n• Alex → Waiting on design tokens from Marcus\n• Priya → API auth endpoint not ready",
      debate: "🎭 AI Debate Room activated. Engineer, PM, and Designer agents ready to argue.",
    }
    let output = responses.default
    const lower = cmd.toLowerCase()
    if (lower.includes("report")) output = responses.report
    else if (lower.includes("task") || lower.includes("create")) output = responses.task
    else if (lower.includes("standup") || lower.includes("summarize")) output = responses.standup
    else if (lower.includes("block")) output = responses.blocked
    else if (lower.includes("debate")) output = responses.debate
    setHistory((prev) => [...prev, { input: cmd, output, type: "success" }])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Terminal className="w-3.5 h-3.5 text-green-400" />
        <span className="text-green-400">LATENT OS</span>
        <span>•</span>
        <span>Natural language command interface</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 max-h-48 scrollbar-hide font-mono">
        {history.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-purple-400">❯</span>
              <span className="text-white">{item.input}</span>
            </div>
            <div className="text-xs pl-4 whitespace-pre-line" style={{ color: item.type === "success" ? "#86efac" : "#93c5fd" }}>
              {item.output}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-purple-400">❯</span>
            <span className="text-gray-400 animate-pulse">Processing with AI...</span>
            <span className="inline-flex gap-1">
              {[0, 1, 2].map((i) => (<span key={i} className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="relative">
        {showSuggestions && filtered.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-gray-900 border border-gray-700 rounded-lg overflow-hidden z-10">
            {filtered.slice(0, 4).map((s) => (
              <button key={s} onClick={() => { setInput(s); setShowSuggestions(false); inputRef.current?.focus() }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:bg-gray-800 transition-colors text-left">
                <ChevronRight className="w-3 h-3 text-purple-400 shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2 items-center bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus-within:border-purple-500 transition-colors">
          <span className="text-purple-400 font-mono text-sm">❯</span>
          <input ref={inputRef} value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true) }}
            onKeyDown={(e) => { if (e.key === "Enter") runCommand(input); if (e.key === "Escape") setShowSuggestions(false) }}
            placeholder='Try: "Create a task for login bug" or "Generate daily report"'
            className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none" />
          <button onClick={() => runCommand(input)} disabled={loading || !input.trim()} className="shrink-0">
            <Zap className={`w-4 h-4 transition-colors ${loading || !input.trim() ? "text-gray-600" : "text-purple-400 hover:text-purple-300"}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
