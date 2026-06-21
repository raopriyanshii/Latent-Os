"use client"
import { useState, useEffect } from "react"

export function LaunchReadinessScore() {
  const [score, setScore] = useState(0)
  const target = 73

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= target) { clearInterval(interval); return target }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getColor = (s: number) => s >= 80 ? "#22c55e" : s >= 60 ? "#eab308" : "#ef4444"
  const color = getColor(score)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1e2d50" strokeWidth="10" />
          <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.05s ease", filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>
          {score >= 80 ? "🚀 Launch Ready" : score >= 60 ? "⚡ Getting There" : "🔧 In Progress"}
        </p>
        <p className="text-xs text-gray-500 mt-1">Updated 2 min ago</p>
      </div>
      <div className="w-full space-y-1.5">
        {[
          { label: "MVP Features", value: 85 },
          { label: "Bug Fixes", value: 62 },
          { label: "Docs", value: 45 },
          { label: "Testing", value: 70 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className="text-gray-400 w-24 shrink-0">{item.label}</span>
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.value}%`, background: getColor(item.value) }} />
            </div>
            <span className="text-gray-400 w-8 text-right">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
