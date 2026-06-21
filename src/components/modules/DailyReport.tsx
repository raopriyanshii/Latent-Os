"use client"
import { useState } from "react"
import { TrendingUp, TrendingDown, Minus, RefreshCw, Download } from "lucide-react"

const report = {
  date: "June 21, 2026",
  launchReadiness: 73,
  launchDelta: 4,
  velocity: 42,
  velocityDelta: 12,
  wins: [
    "Auth system refactor complete — 3x faster load times",
    "Design system tokens finalized and shipped",
    "Notion-GitHub sync running with 99.9% uptime",
    "Zero P0 bugs for 5 consecutive days 🎉",
  ],
  blockers: [
    "Mobile responsive layout needs 2 more days",
    "AI report generation hitting OpenAI rate limits",
  ],
  tomorrowFocus: [
    "Ship mobile screens (Alex + Marcus)",
    "Fix rate limiting with request queuing",
    "User testing session at 2pm",
  ],
  teamMorale: 8.2,
  sprintProgress: 68,
}

export function DailyReport() {
  const [generating, setGenerating] = useState(false)
  const [generatedAt, setGeneratedAt] = useState("7:00 AM")

  const regenerate = async () => {
    setGenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setGeneratedAt("Just now")
    setGenerating(false)
  }

  const Delta = ({ value }: { value: number }) => (
    <span className={`flex items-center gap-0.5 text-xs ${value > 0 ? "text-green-400" : value < 0 ? "text-red-400" : "text-gray-400"}`}>
      {value > 0 ? <TrendingUp className="w-3 h-3" /> : value < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
      {Math.abs(value)}
    </span>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">AI-Generated Report</p>
          <p className="text-xs text-gray-400">Last updated {generatedAt}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={regenerate}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs text-gray-300 transition-colors">
            <RefreshCw className={`w-3 h-3 ${generating ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-xs text-white transition-colors">
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-bold text-purple-400">{report.launchReadiness}%</span>
            <Delta value={report.launchDelta} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Launch Ready</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-bold text-blue-400">{report.velocity}</span>
            <Delta value={report.velocityDelta} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Velocity pts</p>
        </div>
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3 text-center">
          <span className="text-xl font-bold text-green-400">{report.teamMorale}/10</span>
          <p className="text-xs text-gray-500 mt-1">Team Morale</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-green-400 mb-1.5">🎉 Today&apos;s Wins</p>
          <div className="space-y-1">{report.wins.map((win, i) => (<div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-green-400 shrink-0 mt-0.5">✓</span>{win}</div>))}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-400 mb-1.5">🚧 Blockers</p>
          <div className="space-y-1">{report.blockers.map((b, i) => (<div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-red-400 shrink-0 mt-0.5">⚠</span>{b}</div>))}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-blue-400 mb-1.5">🎯 Tomorrow&apos;s Focus</p>
          <div className="space-y-1">{report.tomorrowFocus.map((f, i) => (<div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-blue-400 shrink-0 mt-0.5">→</span>{f}</div>))}</div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs"><span className="text-gray-400">Sprint Progress</span><span className="text-gray-400">{report.sprintProgress}%</span></div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${report.sprintProgress}%`, background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }} />
        </div>
      </div>
    </div>
  )
}
