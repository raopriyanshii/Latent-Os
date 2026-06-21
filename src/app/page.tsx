"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Brain, Zap, GitBranch, Database, Network, Terminal, ArrowRight, Star } from "lucide-react"

const features = [
  { icon: Brain, label: "AI Founder Dashboard", desc: "Your co-founder that never sleeps" },
  { icon: Zap, label: "Digital Twin", desc: "Predict delays before they happen" },
  { icon: GitBranch, label: "Meeting Pipeline", desc: "Meetings → Tasks → Decisions → Notion" },
  { icon: Database, label: "Notion Deep Sync", desc: "Live two-way integration" },
  { icon: Network, label: "Knowledge Graph", desc: "People, tasks, code, meetings — connected" },
  { icon: Terminal, label: "NL Command Center", desc: "Run your startup with plain English" },
]

const stats = [
  { value: "10x", label: "Faster Decisions" },
  { value: "40%", label: "Hidden Work Found" },
  { value: "73%", label: "Launch Readiness" },
  { value: "∞", label: "Context Retained" },
]

export default function LandingPage() {
  const [typed, setTyped] = useState("")
  const fullText = "The Self-Driving Startup OS"

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen neural-bg grid-bg overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/50 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center glow-purple">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">LATENT OS</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 hidden sm:block">Built for NeuroX × Notion Track</span>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm text-white font-medium transition-all"
          >
            Launch App
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-8">
          <Star className="w-3 h-3 text-purple-400" />
          <span className="text-xs text-purple-300">NeuroX Hackathon 2026 — Notion Track</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          <span className="gradient-text">LATENT OS</span>
        </h1>

        <div className="h-10 flex items-center justify-center mb-6">
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            {typed}<span className="animate-pulse text-purple-400">|</span>
          </p>
        </div>

        <p className="text-gray-500 max-w-2xl mb-10 text-lg leading-relaxed">
          The AI-native operating system that turns your Notion workspace into a
          <span className="text-purple-300"> self-managing startup</span>. Predict bottlenecks,
          surface hidden work, and run your company in plain English.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold text-lg transition-all hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            Open Dashboard
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-8 py-4 border border-gray-700 hover:border-purple-500/50 rounded-xl text-gray-300 font-semibold text-lg transition-all hover:bg-gray-800/50"
          >
            See Features
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 w-full max-w-3xl">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black gradient-text">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mb-20 max-w-6xl mx-auto">
        <div className="rounded-2xl border border-purple-500/20 overflow-hidden bg-gray-950/50" style={{ boxShadow: "0 0 80px rgba(124,58,237,0.15)" }}>
          <div className="border-b border-gray-800/50 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-500 ml-2">latent-os.app/dashboard</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Notion Connected</span>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-center">
                <p className="text-4xl font-black text-purple-400">73%</p>
                <p className="text-xs text-gray-500 mt-1">Launch Readiness</p>
                <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-purple-500 rounded-full" />
                </div>
              </div>
              <div className="col-span-2 rounded-xl border border-gray-800 bg-gray-900/50 p-4">
                <p className="text-xs text-gray-500 mb-2">⚡ Command Center</p>
                <div className="font-mono text-xs space-y-1">
                  <div className="flex gap-2"><span className="text-purple-400">❯</span><span className="text-white">Generate sprint summary</span></div>
                  <div className="text-green-400 pl-3">✅ Sprint 8: 42 pts velocity (+12%). 5 PRs merged. Launch: 73%</div>
                  <div className="flex gap-2"><span className="text-purple-400">❯</span><span className="text-gray-500 animate-pulse">_</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                <p className="text-xs text-red-400 font-semibold">⚠ Critical Risk</p>
                <p className="text-xs text-gray-400 mt-1">Auth review blocked — +3d delay predicted</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-3">
                <p className="text-xs text-yellow-400 font-semibold">👁 Hidden: 35h</p>
                <p className="text-xs text-gray-400 mt-1">Untracked code review &amp; context switching</p>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                <p className="text-xs text-blue-400 font-semibold">🎭 AI Debate</p>
                <p className="text-xs text-gray-400 mt-1">3 agents debating mobile-first strategy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 pb-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center text-white mb-3">Built Different</h2>
        <p className="text-gray-500 text-center mb-12">Everything judges have never seen inside Notion</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.label}
                className="rounded-xl border border-gray-800 hover:border-purple-500/40 bg-gray-900/30 p-6 transition-all hover:bg-gray-900/60 group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <Icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.label}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="border-t border-gray-800/50 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold text-white">LATENT OS</span>
        </div>
        <p className="text-xs text-gray-600">Built for NeuroX Hackathon 2026 · Notion Track · Next.js 15 + AI + Supabase</p>
      </footer>
    </div>
  )
}
