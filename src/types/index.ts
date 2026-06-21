export interface KnowledgeNode {
  id: string
  type: "person" | "task" | "meeting" | "commit" | "decision" | "document"
  label: string
  metadata: Record<string, unknown>
  connections: string[]
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar?: string
  contributions: number
  hiddenWork: number
  dna: {
    focus: number
    collaboration: number
    innovation: number
    execution: number
  }
}

export interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  velocity: number
  completedTasks: number
  totalTasks: number
  launchReadiness: number
}

export interface AIDebateMessage {
  agent: "engineer" | "pm" | "designer"
  message: string
  timestamp: string
}

export interface Meeting {
  id: string
  title: string
  date: string
  duration: number
  participants: string[]
  summary?: string
  actionItems?: string[]
  decisions?: string[]
  notionPageId?: string
}

export interface Bottleneck {
  id: string
  title: string
  severity: "low" | "medium" | "high" | "critical"
  affectedTasks: string[]
  predictedDelay: number
  suggestion: string
}

export interface DailyReport {
  date: string
  launchReadiness: number
  completedTasks: number
  blockers: string[]
  wins: string[]
  tomorrowFocus: string[]
  teamMorale: number
}
