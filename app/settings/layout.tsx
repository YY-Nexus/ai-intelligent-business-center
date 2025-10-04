import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "设置 | API OS",
  description: "管理您的应用设置",
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container mx-auto py-6">{children}</div>
}
