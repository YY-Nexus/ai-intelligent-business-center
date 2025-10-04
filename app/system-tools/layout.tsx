import type React from "react"
import { SystemToolsProvider } from "@/components/system-tools/system-tools-context"
import { SystemToolsHeader } from "@/components/system-tools/system-tools-header"

export default function SystemToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SystemToolsProvider>
      <div className="flex flex-col min-h-screen">
        <SystemToolsHeader />
        <main className="flex-1">{children}</main>
      </div>
    </SystemToolsProvider>
  )
}
