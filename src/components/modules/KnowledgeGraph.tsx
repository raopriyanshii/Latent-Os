"use client"
import { useEffect, useRef, useState } from "react"

const nodes = [
  { id: "n1", label: "Alex Chen", type: "person", x: 50, y: 30, color: "#3b82f6" },
  { id: "n2", label: "Auth System", type: "task", x: 78, y: 20, color: "#a855f7" },
  { id: "n3", label: "Sprint 8", type: "task", x: 30, y: 15, color: "#a855f7" },
  { id: "n4", label: "Design Review", type: "meeting", x: 20, y: 45, color: "#22c55e" },
  { id: "n5", label: "PRD v2", type: "document", x: 65, y: 55, color: "#eab308" },
  { id: "n6", label: "Launch Decision", type: "decision", x: 40, y: 70, color: "#ef4444" },
  { id: "n7", label: "Sarah Kim", type: "person", x: 15, y: 70, color: "#3b82f6" },
  { id: "n8", label: "Marcus Li", type: "person", x: 82, y: 60, color: "#3b82f6" },
  { id: "n9", label: "fix/auth-bug", type: "commit", x: 70, y: 80, color: "#06b6d4" },
  { id: "n10", label: "API Rate Limit", type: "task", x: 88, y: 38, color: "#f97316" },
]

const edges = [
  ["n1", "n2"], ["n1", "n3"], ["n1", "n9"],
  ["n7", "n4"], ["n7", "n6"], ["n7", "n5"],
  ["n8", "n2"], ["n8", "n10"],
  ["n4", "n5"], ["n5", "n6"],
  ["n3", "n2"], ["n3", "n6"],
  ["n2", "n9"],
]

const typeLabels: Record<string, string> = {
  person: "👤", task: "✅", meeting: "📅", document: "📄", decision: "💡", commit: "💻",
}

export function KnowledgeGraph() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t + 1), 50)
    return () => clearInterval(interval)
  }, [])

  const pulse = Math.sin(time * 0.1) * 0.5 + 0.5

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeLabels).map(([type, emoji]) => (
          <span key={type} className="flex items-center gap-1 text-xs text-gray-400">
            <span>{emoji}</span><span className="capitalize">{type}</span>
          </span>
        ))}
      </div>
      <div className="relative rounded-lg border border-gray-800 bg-gray-950 overflow-hidden" style={{ height: 260 }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {nodes.map((n) => (
              <radialGradient key={`grad-${n.id}`} id={`grad-${n.id}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={n.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          {edges.map(([a, b], i) => {
            const na = nodes.find((n) => n.id === a)
            const nb = nodes.find((n) => n.id === b)
            if (!na || !nb) return null
            const isActive = hovered === a || hovered === b
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={isActive ? "#a855f7" : "#1e2d50"}
                strokeWidth={isActive ? 0.5 : 0.2}
                strokeOpacity={isActive ? 1 : 0.6}
                style={{ transition: "all 0.3s" }} />
            )
          })}
          {nodes.map((node) => {
            const isHovered = hovered === node.id
            const connectedIds = edges.filter(([a, b]) => a === node.id || b === node.id).flatMap(([a, b]) => [a, b]).filter((id) => id !== node.id)
            const isConnected = hovered ? connectedIds.includes(node.id) || node.id === hovered : true
            return (
              <g key={node.id} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", opacity: isConnected ? 1 : 0.2, transition: "opacity 0.3s" }}>
                {isHovered && (
                  <circle cx={node.x} cy={node.y} r={4 + pulse * 2} fill={`url(#grad-${node.id})`} />
                )}
                <circle cx={node.x} cy={node.y} r={isHovered ? 3 : 2} fill={node.color}
                  style={{ filter: isHovered ? `drop-shadow(0 0 4px ${node.color})` : "none", transition: "all 0.2s" }} />
                <text x={node.x + 3} y={node.y - 2.5} fontSize="3" fill={isHovered ? "#ffffff" : "#6b7a9d"}
                  style={{ pointerEvents: "none", transition: "fill 0.2s" }}>
                  {node.label.length > 10 ? node.label.slice(0, 10) + "…" : node.label}
                </text>
              </g>
            )
          })}
        </svg>
        {hovered && (() => {
          const node = nodes.find((n) => n.id === hovered)!
          const connections = edges.filter(([a, b]) => a === hovered || b === hovered).map(([a, b]) => (a === hovered ? b : a)).map((id) => nodes.find((n) => n.id === id)?.label).filter(Boolean)
          return (
            <div className="absolute bottom-2 left-2 right-2 bg-gray-900/90 border border-gray-700 rounded-lg p-2 backdrop-blur-sm">
              <p className="text-xs font-semibold text-white">{typeLabels[node.type]} {node.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">Connected to: {connections.slice(0, 3).join(", ")}{connections.length > 3 ? ` +${connections.length - 3} more` : ""}</p>
            </div>
          )
        })()}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded bg-gray-900 p-2"><p className="text-lg font-bold text-purple-400">10</p><p className="text-xs text-gray-500">Nodes</p></div>
        <div className="rounded bg-gray-900 p-2"><p className="text-lg font-bold text-blue-400">14</p><p className="text-xs text-gray-500">Connections</p></div>
        <div className="rounded bg-gray-900 p-2"><p className="text-lg font-bold text-green-400">Live</p><p className="text-xs text-gray-500">Sync</p></div>
      </div>
    </div>
  )
}
