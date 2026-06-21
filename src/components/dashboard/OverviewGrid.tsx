"use client"
import { LaunchReadinessScore } from "@/components/modules/LaunchReadinessScore"
import { TimeMachine } from "@/components/modules/TimeMachine"
import { DigitalTwin } from "@/components/modules/DigitalTwin"
import { TeamDNA } from "@/components/modules/TeamDNA"
import { AIDebateRoom } from "@/components/modules/AIDebateRoom"
import { CommandCenter } from "@/components/modules/CommandCenter"
import { KnowledgeGraph } from "@/components/modules/KnowledgeGraph"
import { MeetingPipeline } from "@/components/modules/MeetingPipeline"
import { InvisibleWork } from "@/components/modules/InvisibleWork"
import { DailyReport } from "@/components/modules/DailyReport"
import { NotionSync } from "@/components/modules/NotionSync"

function ModuleCard({
  title,
  children,
  className = "",
  badge,
}: {
  title: string
  children: React.ReactNode
  className?: string
  badge?: string
}) {
  return (
    <div
      className={`rounded-xl border border-gray-800/60 bg-gray-900/40 backdrop-blur-sm flex flex-col overflow-hidden ${className}`}
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 shrink-0">
        <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{title}</h2>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto scrollbar-hide">{children}</div>
    </div>
  )
}

interface OverviewGridProps {
  activeModule: string
}

export function OverviewGrid({ activeModule }: OverviewGridProps) {
  if (activeModule !== "overview") {
    const singleModules: Record<string, React.ReactNode> = {
      timemachine: <TimeMachine />,
      digitaltwin: <DigitalTwin />,
      teamdna: <TeamDNA />,
      hiddenwork: <InvisibleWork />,
      debate: <AIDebateRoom />,
      meetings: <MeetingPipeline />,
      command: <CommandCenter />,
      knowledge: <KnowledgeGraph />,
      reports: <DailyReport />,
      notion: <NotionSync />,
    }

    const moduleTitle: Record<string, string> = {
      timemachine: "Startup Time Machine",
      digitaltwin: "Digital Twin — Bottleneck Prediction",
      teamdna: "Team DNA Engine",
      hiddenwork: "Invisible Work Detector",
      debate: "AI Debate Room",
      meetings: "Meeting → Everything Pipeline",
      command: "Natural Language Command Center",
      knowledge: "Knowledge Graph",
      reports: "Daily AI Report",
      notion: "Notion Database Sync",
      founder: "AI Founder Dashboard",
    }

    if (activeModule === "founder") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 h-full overflow-auto scrollbar-hide">
          <ModuleCard title="Launch Readiness Score" badge="Live">
            <LaunchReadinessScore />
          </ModuleCard>
          <ModuleCard title="Daily AI Report">
            <DailyReport />
          </ModuleCard>
          <ModuleCard title="Digital Twin — Risks">
            <DigitalTwin />
          </ModuleCard>
          <ModuleCard title="Invisible Work">
            <InvisibleWork />
          </ModuleCard>
        </div>
      )
    }

    return (
      <div className="p-4 h-full overflow-auto scrollbar-hide">
        <ModuleCard title={moduleTitle[activeModule] || activeModule} className="min-h-full">
          {singleModules[activeModule]}
        </ModuleCard>
      </div>
    )
  }

  return (
    <div className="p-4 h-full overflow-auto scrollbar-hide">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-min">

        <ModuleCard title="Launch Readiness" badge="Live" className="row-span-1">
          <LaunchReadinessScore />
        </ModuleCard>

        <ModuleCard title="⚡ Command Center" badge="AI" className="md:col-span-1 xl:col-span-2 min-h-64">
          <CommandCenter />
        </ModuleCard>

        <ModuleCard title="Notion Sync" badge="Connected" className="row-span-1">
          <NotionSync />
        </ModuleCard>

        <ModuleCard title="Digital Twin" badge="Predicting">
          <DigitalTwin />
        </ModuleCard>

        <ModuleCard title="AI Debate Room" badge="3 Agents" className="md:col-span-1 xl:col-span-2 min-h-72">
          <AIDebateRoom />
        </ModuleCard>

        <ModuleCard title="Team DNA Engine">
          <TeamDNA />
        </ModuleCard>

        <ModuleCard title="Knowledge Graph" badge="Live" className="md:col-span-2 xl:col-span-2">
          <KnowledgeGraph />
        </ModuleCard>

        <ModuleCard title="Meeting Pipeline" badge="Auto">
          <MeetingPipeline />
        </ModuleCard>

        <ModuleCard title="Invisible Work">
          <InvisibleWork />
        </ModuleCard>

        <ModuleCard title="Time Machine">
          <TimeMachine />
        </ModuleCard>

        <ModuleCard title="Daily AI Report" badge="Generated" className="md:col-span-2">
          <DailyReport />
        </ModuleCard>

      </div>
    </div>
  )
}
