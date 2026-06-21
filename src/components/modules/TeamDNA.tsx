"use client"
import { useState } from "react"

const team = [
  { name: "Alex Chen", role: "Lead Engineer", avatar: "AC", color: "#3b82f6", dna: { focus: 92, collab: 70, innovation: 85, execution: 88 }, hiddenWork: 12, commits: 47, mood: "🔥" },
  { name: "Sarah Kim", role: "Product Manager", avatar: "SK", color: "#a855f7", dna: { focus: 75, collab: 95, innovation: 80, execution: 90 }, hiddenWork: 8, commits: 5, mood: "⚡" },
  { name: "Marcus Li", role: "Designer", avatar: "ML", color: "#06b6d4", dna: { focus: 88, collab: 82, innovation: 95, execution: 72 }, hiddenWork: 15, commits: 12, mood: "🎨" },
  { name: "Priya Patel", role: "Full Stack", avatar: "PP", color: "#22c55e", dna: { focus: 80, collab: 78, innovation: 72, execution: 85 }, hiddenWork: 6, commits: 31, mood: "💻" },
]

const dnaKeys = ["focus", "collab", "innovation", "execution"] as const

export function TeamDNA() {
  const [selected, setSelected] = useState(0)
  const member = team[selected]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {team.map((m, i) => (
          <button key={m.name} onClick={() => setSelected(i)}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left ${
              selected === i ? "border-purple-500/50 bg-purple-500/10" : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
            }`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: m.color }}>{m.avatar}</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{m.name}</p>
              <p className="text-xs text-gray-500 truncate">{m.role}</p>
            </div>
            <span className="ml-auto text-sm">{m.mood}</span>
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-gray-800 bg-gray-900/30 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: member.color, boxShadow: `0 0 15px ${member.color}60` }}>{member.avatar}</div>
          <div>
            <p className="font-semibold text-white">{member.name} {member.mood}</p>
            <p className="text-xs text-gray-400">{member.role} • {member.commits} commits this sprint</p>
          </div>
        </div>
        <div className="space-y-2">
          {dnaKeys.map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 capitalize">{key === "collab" ? "Collaboration" : key}</span>
                <span className="font-semibold" style={{ color: member.color }}>{member.dna[key]}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${member.dna[key]}%`, background: `linear-gradient(90deg, ${member.color}80, ${member.color})`, boxShadow: `0 0 6px ${member.color}` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-yellow-400 text-lg">👁️</span>
          <div>
            <p className="text-xs font-semibold text-yellow-400">Hidden Work Detected</p>
            <p className="text-xs text-gray-400">{member.hiddenWork}h of untracked work this week</p>
          </div>
        </div>
      </div>
    </div>
  )
}
