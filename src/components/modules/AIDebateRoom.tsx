"use client"
import { useState, useRef, useEffect } from "react"
import { Send, Zap } from "lucide-react"

const agentConfig = {
  engineer: { name: "Eng", emoji: "⚙️", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  pm: { name: "PM", emoji: "📋", color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
  designer: { name: "Design", emoji: "🎨", color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
}

const presetTopics = [
  "Should we ship MVP with known bugs or delay?",
  "Mobile-first vs desktop-first approach?",
  "Build in-house auth vs use Auth0?",
  "Monorepo vs separate repos?",
]

const seedDebate = [
  { agent: "pm" as const, message: "We need to ship NOW. Users are waiting and every week we delay, we lose market share to competitors." },
  { agent: "engineer" as const, message: "The auth service has 3 critical security vulnerabilities. Shipping now means exposing user data. That's not a risk I can sign off on." },
  { agent: "designer" as const, message: "The onboarding flow is also incomplete — users won't understand what to do. We risk high churn even if we do ship." },
  { agent: "pm" as const, message: "Can we ship a private beta to 10 users? That limits exposure while generating real feedback." },
  { agent: "engineer" as const, message: "Private beta is acceptable. We can patch the critical bugs in 48 hours and gate access with feature flags." },
  { agent: "designer" as const, message: "I can do a quick onboarding overlay in a day. Imperfect but functional. Let's do the private beta." },
]

export function AIDebateRoom() {
  const [messages, setMessages] = useState(seedDebate)
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeAgent, setActiveAgent] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const startDebate = async (debateTopic: string) => {
    if (!debateTopic.trim() || loading) return
    setLoading(true)
    setMessages([])
    const agents: Array<"engineer" | "pm" | "designer"> = ["pm", "engineer", "designer", "pm", "engineer", "designer"]
    for (const agent of agents) {
      setActiveAgent(agent)
      await new Promise((r) => setTimeout(r, 800))
      const responses: Record<string, string[]> = {
        pm: [
          `From a product perspective, "${debateTopic}" directly impacts our Q2 OKRs. We need to prioritize user value over technical perfection.`,
          "Market timing is everything. Our competitors are moving fast. We need a decision now, not a perfect decision later.",
        ],
        engineer: [
          `Technically speaking, "${debateTopic}" has significant implications for our architecture. We need to think about scalability.`,
          "I can build this, but we need to allocate proper time. Cutting corners now means 3x the work in 6 months.",
        ],
        designer: [
          `The UX research clearly shows users are confused by "${debateTopic}". Simplicity should be our north star here.`,
          "If we don't get the experience right, great features won't matter. Users will bounce in the first 30 seconds.",
        ],
      }
      const pool = responses[agent]
      const msg = pool[Math.floor(Math.random() * pool.length)]
      setMessages((prev) => [...prev, { agent, message: msg }])
    }
    setActiveAgent(null)
    setLoading(false)
    setTopic("")
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <div className="flex gap-2">
        {Object.entries(agentConfig).map(([key, cfg]) => (
          <div
            key={key}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-all ${
              activeAgent === key ? "animate-pulse-slow" : ""
            }`}
            style={{ borderColor: cfg.color + "60", backgroundColor: activeAgent === key ? cfg.bg : "transparent", color: cfg.color }}
          >
            <span>{cfg.emoji}</span>
            <span>{cfg.name}</span>
            {activeAgent === key && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: cfg.color }} />}
          </div>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 max-h-56 scrollbar-hide">
        {messages.map((msg, i) => {
          const cfg = agentConfig[msg.agent]
          return (
            <div key={i} className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 border"
                style={{ borderColor: cfg.color + "60", backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.emoji}
              </div>
              <div className="rounded-lg px-3 py-2 text-xs text-gray-200 flex-1 border"
                style={{ borderColor: cfg.color + "20", backgroundColor: cfg.bg }}>
                <span className="font-semibold" style={{ color: cfg.color }}>{cfg.name}: </span>
                {msg.message}
              </div>
            </div>
          )
        })}
        {loading && activeAgent && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs border animate-pulse"
              style={{ borderColor: agentConfig[activeAgent as keyof typeof agentConfig].color + "60", backgroundColor: agentConfig[activeAgent as keyof typeof agentConfig].bg }}>
              {agentConfig[activeAgent as keyof typeof agentConfig].emoji}
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (<div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {presetTopics.map((t) => (
          <button key={t} onClick={() => startDebate(t)}
            className="text-xs px-2 py-1 rounded-full border border-gray-700 text-gray-400 hover:border-purple-500/50 hover:text-purple-300 transition-colors truncate max-w-[180px]">
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={topic} onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && startDebate(topic)}
          placeholder="Start a debate..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
        <button onClick={() => startDebate(topic)} disabled={loading || !topic.trim()}
          className="flex items-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs text-white transition-colors">
          <Zap className="w-3 h-3" />
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
