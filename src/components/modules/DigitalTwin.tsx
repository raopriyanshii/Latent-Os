"use client"
import { useState } from "react"
import { AlertTriangle, Clock, TrendingDown, CheckCircle, RefreshCw } from "lucide-react"

const bottlenecks = [
  { id: 1, title: "Auth service review pending", severity: "critical" as const, delay: 3, assignee: "Alex", suggestion: "Unblock by splitting review into two parallel sessions", probability: 92 },
  { id: 2, title: "Design handoff for mobile screens", severity: "high" as const, delay: 2, assignee: "Sarah", suggestion: "Use Figma's dev mode to reduce handoff time by 60%", probability: 78 },
  { id: 3, title: "API rate limit on Notion sync", severity: "medium" as const, delay: 1, assignee: "System", suggestion: "Implement request batching — reduces calls by 80%", probability: 65 },
]

const severityConfig = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", label: "CRITICAL" },
  high: { color: "#f97316", bg: "rgba(249,115,22,0.1)", label: "HIGH" },
  medium: { color: "#eab308", bg: "rgba(234,179,8,0.1)", label: "MEDIUM" },
  low: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", label: "LOW" },
}

export function DigitalTwin() {
  const [dismissed, setDismissed] = useState<number[]>([])
  const [simulating, setSimulating] = useState(false)

  const runSimulation = () => {
    setSimulating(true)
    setTimeout(() => setSimulating(false), 2000)
  }

  const active = bottlenecks.filter((b) => !dismissed.includes(b.id))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-gray-400">Predicting next 72 hours</span>
        </div>
        <button onClick={runSimulation}
          className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors">
          <RefreshCw className={`w-3 h-3 ${simulating ? "animate-spin" : ""}`} />
          {simulating ? "Simulating..." : "Run Simulation"}
        </button>
      </div>
      {simulating && (
        <div className="rounded-lg border border-purple-500/30 bg-purple-500/5 p-3">
          <div className="shimmer h-2 rounded w-full mb-2" />
          <div className="shimmer h-2 rounded w-3/4 mb-2" />
          <div className="shimmer h-2 rounded w-1/2" />
        </div>
      )}
      <div className="space-y-3">
        {active.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="text-sm font-medium text-green-400">No bottlenecks detected!</p>
            <p className="text-xs text-gray-500">Your team is operating at peak efficiency</p>
          </div>
        ) : (
          active.map((b) => {
            const cfg = severityConfig[b.severity]
            return (
              <div key={b.id} className="rounded-lg p-3 border transition-all duration-200 hover:scale-[1.01]" style={{ borderColor: cfg.color + "40", backgroundColor: cfg.bg }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                        <span className="text-xs text-gray-400">{b.probability}% likely</span>
                      </div>
                      <p className="text-sm font-medium text-white mt-0.5 truncate">{b.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" />+{b.delay}d delay</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><TrendingDown className="w-3 h-3" />{b.assignee}</span>
                      </div>
                      <p className="text-xs text-gray-300 mt-2 italic">💡 {b.suggestion}</p>
                    </div>
                  </div>
                  <button onClick={() => setDismissed((prev) => [...prev, b.id])} className="text-xs text-gray-500 hover:text-gray-300 shrink-0">✕</button>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800">
        <div className="text-center"><p className="text-xl font-bold text-red-400">6d</p><p className="text-xs text-gray-500">Total Risk</p></div>
        <div className="text-center"><p className="text-xl font-bold text-yellow-400">3</p><p className="text-xs text-gray-500">Risks Found</p></div>
        <div className="text-center"><p className="text-xl font-bold text-green-400">2d</p><p className="text-xs text-gray-500">Saved This Week</p></div>
      </div>
    </div>
  )
}
