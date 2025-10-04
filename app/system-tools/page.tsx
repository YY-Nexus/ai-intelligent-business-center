"use client"

import { SystemToolsProvider } from "@/components/system-tools/system-tools-context"
import { SystemToolsOverview } from "@/components/system-tools/system-tools-overview"
import { SystemToolsActivity } from "@/components/system-tools/system-tools-activity"

export default function SystemToolsPage() {
  return (
    <SystemToolsProvider>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">系统工具</h1>
        <SystemToolsOverview />
        <SystemToolsActivity />
      </div>
    </SystemToolsProvider>
  )
}
