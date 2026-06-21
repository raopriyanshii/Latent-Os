"use client"
import { useState } from "react"
import { Database, RefreshCw, CheckCircle, ExternalLink } from "lucide-react"

const databases = [
  { name: "Sprint Tasks", records: 47, lastSync: "2 min ago", status: "synced" as const, color: "#a855f7" },
  { name: "Team Members", records: 8, lastSync: "5 min ago", status: "synced" as const, color: "#3b82f6" },
  { name: "Decisions Log", records: 23, lastSync: "1 hr ago", status: "synced" as const, color: "#22c55e" },
  { name: "Meeting Notes", records: 15, lastSync: "Just now", status: "syncing" as const, color: "#eab308" },
  { name: "Knowledge Base", records: 91, lastSync: "10 min ago", status: "synced" as const, color: "#06b6d4" },
]

const recentChanges = [
  { type: "created", title: "Sprint 8 Retrospective template", time: "2 min ago", icon: "✨" },
  { type: "updated", title: "Auth System task → In Review", time: "8 min ago", icon: "📝" },
  { type: "synced", title: "15 GitHub commits linked", time: "12 min ago", icon: "🔗" },
  { type: "created", title: "Design Review meeting notes", time: "1 hr ago", icon: "📅" },
]

export function NotionSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState("2 min ago")

  const triggerSync = async () => {
    setSyncing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLastSync("Just now")
    setSyncing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${syncing ? "bg-yellow-400 animate-pulse" : "bg-green-400"}`} />
          <span className="text-xs text-gray-400">{syncing ? "Syncing with Notion..." : `Synced ${lastSync}`}</span>
        </div>
        <button onClick={triggerSync} disabled={syncing}
          className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-xs text-gray-300 transition-colors">
          <RefreshCw className={`w-3 h-3 ${syncing ? "animate-spin" : ""}`} />
          Sync
        </button>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400">Connected Databases</p>
        {databases.map((db) => (
          <div key={db.name} className="flex items-center gap-3 p-2 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors group">
            <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: db.color + "20" }}>
              <Database className="w-3.5 h-3.5" style={{ color: db.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white">{db.name}</p>
              <p className="text-xs text-gray-500">{db.records} records • {db.lastSync}</p>
            </div>
            <div className="flex items-center gap-2">
              {db.status === "syncing" ? <RefreshCw className="w-3.5 h-3.5 text-yellow-400 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5 text-green-400" />}
              <ExternalLink className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-gray-300" />
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400">Recent Changes</p>
        {recentChanges.map((change, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span>{change.icon}</span>
            <span className="text-gray-300 flex-1">{change.title}</span>
            <span className="text-gray-600 shrink-0">{change.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
