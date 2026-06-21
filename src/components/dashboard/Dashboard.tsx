"use client"
import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { OverviewGrid } from "./OverviewGrid"

export function Dashboard() {
  const [activeModule, setActiveModule] = useState("overview")

  return (
    <div className="flex h-screen overflow-hidden neural-bg grid-bg">
      <Sidebar active={activeModule} onChange={setActiveModule} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar activeModule={activeModule} />
        <main className="flex-1 overflow-hidden">
          <OverviewGrid activeModule={activeModule} />
        </main>
      </div>
    </div>
  )
}
