"use client"
import { useState } from "react"
import { Clock, GitCommit, FileText, Users, Zap } from "lucide-react"

const timelineEvents = [
  { id: 1, date: "2024-01-15", type: "milestone", title: "Project Kickoff", description: "Team assembled, vision set", icon: Zap, color: "#a855f7" },
  { id: 2, date: "2024-02-01", type: "commit", title: "First Commit", description: "Initial codebase structure", icon: GitCommit, color: "#3b82f6" },
  { id: 3, date: "2024-02-20", type: "meeting", title: "Investor Meeting", description: "Series A discussions", icon: Users, color: "#22c55e" },
  { id: 4, date: "2024-03-10", type: "document", title: "PRD v1.0", description: "Product requirements defined", icon: FileText, color: "#eab308" },
  { id: 5, date: "2024-03-25", type: "milestone", title: "MVP Launch", description: "First 100 users onboarded", icon: Zap, color: "#a855f7" },
  { id: 6, date: "2024-04-15", type: "commit", title: "v0.5 Release", description: "Core features shipped", icon: GitCommit, color: "#3b82f6" },
  { id: 7, date: "TODAY", type: "milestone", title: "← You Are Here", description: "Sprint 8 in progress", icon: Clock, color: "#ef4444" },
  { id: 8, date: "2024-06-01", type: "milestone", title: "Launch Day", description: "Public release target", icon: Zap, color: "#06b6d4", future: true },
]

export function TimeMachine() {
  const [selected, setSelected] = useState<number | null>(7)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Clock className="w-4 h-4 text-purple-400" />
        <span>Drag through your startup&apos;s complete history</span>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/30 to-cyan-500/50" />
        <div className="space-y-3 pl-10">
          {timelineEvents.map((event) => {
            const Icon = event.icon
            const isSelected = selected === event.id
            return (
              <div key={event.id} className={`relative cursor-pointer transition-all duration-200 ${isSelected ? "scale-100" : "scale-95 opacity-70"}`} onClick={() => setSelected(event.id)}>
                <div className="absolute -left-7 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: event.color, backgroundColor: isSelected ? event.color : "transparent", boxShadow: isSelected ? `0 0 12px ${event.color}` : "none" }}>
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>
                <div className={`rounded-lg p-3 border transition-all duration-200 ${(event as { future?: boolean }).future ? "opacity-60 border-dashed" : ""}`}
                  style={{ borderColor: isSelected ? event.color : "#1e2d50", backgroundColor: isSelected ? `${event.color}15` : "#0d1224" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: event.color }}>{(event as { future?: boolean }).future ? "🔮 " : ""}{event.date}</span>
                    <span className="text-xs text-gray-500 capitalize">{event.type}</span>
                  </div>
                  <p className="text-sm font-medium text-white mt-1">{event.title}</p>
                  {isSelected && <p className="text-xs text-gray-400 mt-1">{event.description}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mt-4 p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
        <p className="text-xs text-purple-300 font-medium">🤖 AI Insight</p>
        <p className="text-xs text-gray-400 mt-1">Based on your velocity, you&apos;re 8 days ahead of the June 1st launch target. The MVP milestone at sprint 5 was your inflection point.</p>
      </div>
    </div>
  )
}
