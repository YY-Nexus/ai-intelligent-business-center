import type React from "react"
import { SystemRepairNavLinks } from "@/components/system-repair/nav-links"

export default function SystemRepairLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <aside className="hidden md:block">
          <SystemRepairNavLinks />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
