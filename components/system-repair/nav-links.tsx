"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, AlertTriangle, Zap, History } from "lucide-react"

export function SystemRepairNavLinks() {
  const pathname = usePathname()

  const links = [
    {
      href: "/system-repair",
      label: "系统修复",
      icon: <Zap className="h-4 w-4 mr-2" />,
    },
    {
      href: "/system-repair/diagnostics",
      label: "诊断工具",
      icon: <AlertTriangle className="h-4 w-4 mr-2" />,
    },
    {
      href: "/system-repair/history",
      label: "修复历史",
      icon: <History className="h-4 w-4 mr-2" />,
    },
    {
      href: "/system-repair/settings",
      label: "修复设置",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <nav className="flex flex-col space-y-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center px-3 py-2 text-sm rounded-md",
            pathname === link.href ? "bg-muted font-medium" : "hover:bg-muted/50",
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
