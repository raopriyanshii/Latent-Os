"use client"
import { Bell, Settings, Zap, GitBranch } from "lucide-react"

interface TopBarProps {
  activeModule: string
}

const moduleLabels: Record<string, { label: string; desc: string }> = {
  overview: { label: "Mission Control", desc: "All systems at a glance" },
  timemachine: { label: "Startup Time Machine", desc: "Navigate your complete history" },
  digitaltwin: { label: "Digital Twin", desc: "AI-powered bottleneck prediction" },
  founder: { label: "AI Founder Dashboard", desc: "Your personal AI co-founder" },
  teamdna: { label: "Team DNA Engine", desc: "Deep team intelligence" },
  hiddenwork: { label: "Invisible Work Detector", desc: "Surface untracked effort" },
  debate: { label: "AI Debate Room", desc: "Engineer vs PM vs Designer" },
  meetings: { label: "Meeting → Everything", desc: "Auto-pipeline your meetings" },
  command: { label: "Command Center", desc: "Natural language OS control" },
  knowledge: { label: "Knowledge Graph", desc: "Connected startup intelligence" },
  reports: { label: "Daily AI Reports", desc: "AI-generated insights" },
  notion: { label: "Notion Sync", desc: "Real-time Notion integration" },
}

export function TopBar({ activeModule }: TopBarProps) {
  const info = moduleLabels[activeModule] || moduleLabels.overview

  return (
    <header className="h-14 border-b border-gray-800/50 flex items-center justify-between px-4 lg:px-6 bg-gray-950/50 backdrop-blur-sm shrink-0">
      <div>
        <h1 className="text-sm font-bold text-white">{info.label}</h1>
        <p className="text-xs text-gray-500 hidden sm:block">{info.desc}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30">
          <Zap className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-purple-300 font-medium">AI Active</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-300 font-medium hidden sm:block">Notion Synced</span>
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
          <GitBranch className="w-4 h-4" />
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-500 rounded-full" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
