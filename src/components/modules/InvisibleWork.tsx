"use client"

const hiddenPatterns = [
  { pattern: "Context switching overhead", hours: 8.5, impact: "Reduces deep work by 40%", color: "#ef4444", person: "Alex" },
  { pattern: "Async communication lag", hours: 5.2, impact: "Adds 2.1h latency to decisions", color: "#f97316", person: "Team" },
  { pattern: "Untracked code review", hours: 4.8, impact: "Real PR time 3x estimate", color: "#eab308", person: "Alex, Priya" },
  { pattern: "Meeting prep & follow-up", hours: 3.5, impact: "20% overhead on all meetings", color: "#a855f7", person: "Sarah" },
  { pattern: "Documentation debt", hours: 6.1, impact: "Slows onboarding by 2 days", color: "#3b82f6", person: "Team" },
  { pattern: "Debugging untracked bugs", hours: 7.3, impact: "High churn, unknown root causes", color: "#ef4444", person: "Alex, Priya" },
]

const totalHours = hiddenPatterns.reduce((sum, p) => sum + p.hours, 0)
const trackedHours = 120
const hiddenPercent = Math.round((totalHours / (trackedHours + totalHours)) * 100)

export function InvisibleWork() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
        <div className="text-center shrink-0">
          <p className="text-2xl font-bold text-yellow-400">{Math.round(totalHours)}h</p>
          <p className="text-xs text-gray-500">Hidden/wk</p>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-yellow-400 mb-1">{hiddenPercent}% of work is invisible to your PM tools</p>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="bg-green-500 rounded-l" style={{ width: `${100 - hiddenPercent}%` }} />
              <div className="bg-yellow-500 rounded-r" style={{ width: `${hiddenPercent}%` }} />
            </div>
          </div>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            <span><span className="text-green-400">●</span> Tracked {100 - hiddenPercent}%</span>
            <span><span className="text-yellow-400">●</span> Hidden {hiddenPercent}%</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {hiddenPatterns.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-900/50 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 4px ${item.color}` }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-medium text-gray-200">{item.pattern}</p>
                <span className="text-xs text-gray-500">{item.person}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 italic">{item.impact}</p>
            </div>
            <span className="text-xs font-bold shrink-0" style={{ color: item.color }}>+{item.hours}h</span>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
        <p className="text-xs font-semibold text-purple-300">🤖 AI Recommendation</p>
        <p className="text-xs text-gray-400 mt-1">
          Eliminating context switching alone would save <span className="text-purple-300 font-semibold">34 dev-hours/week</span> —
          equivalent to hiring 0.85 FTE. Consider async-first communication protocols.
        </p>
      </div>
    </div>
  )
}
