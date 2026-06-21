"use client"
import { Brain, Clock, Cpu, Users, Eye, Swords, Mic, Terminal, Network, FileBarChart, Database, Zap } from "lucide-react"

const nav = [
  { icon: Zap, label: "Overview", id: "overview" },
  { icon: Clock, label: "Time Machine", id: "timemachine" },
  { icon: Cpu, label: "Digital Twin", id: "digitaltwin" },
  { icon: Brain, label: "AI Founder", id: "founder" },
  { icon: Users, label: "Team DNA", id: "teamdna" },
  { icon: Eye, label: "Hidden Work", id: "hiddenwork" },
  { icon: Swords, label: "Debate Room", id: "debate" },
  { icon: Mic, label: "Meetings", id: "meetings" },
  { icon: Terminal, label: "Command", id: "command" },
  { icon: Network, label: "Knowledge", id: "knowledge" },
  { icon: FileBarChart, label: "Reports", id: "reports" },
  { icon: Database, label: "Notion Sync", id: "notion" },
]

interface SidebarProps {
  active: string
  onChange: (id: string) => void
}

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="w-16 lg:w-52 h-screen flex flex-col border-r border-gray-800/50 bg-gray-950/80 backdrop-blur-sm shrink-0">
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 glow-purple">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-bold text-white leading-tight">LATENT OS</p>
            <p className="text-xs text-gray-500">Self-Driving Startup</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto scrollbar-hide">
        {nav.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-all duration-200 group ${
                isActive
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-purple-400" : "text-gray-600 group-hover:text-gray-400"}`} />
              <span className="hidden lg:block text-xs font-medium truncate">{item.label}</span>
              {isActive && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-800/50">
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-500">All systems nominal</span>
        </div>
        <div className="lg:hidden flex justify-center">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>
    </aside>
  )
}
