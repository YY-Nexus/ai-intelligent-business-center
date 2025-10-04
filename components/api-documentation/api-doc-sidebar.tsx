"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ApiDocSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] py-6 pr-6">
      <div className="space-y-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">API 文档</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={isActive("/api-documentation") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation">概览</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/api-types") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/api-types">API 类型</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/sdk-auth-guide") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/sdk-auth-guide">SDK 鉴权指南</Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">中文大模型</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={isActive("/api-documentation/chinese-llm") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/chinese-llm">中文大模型概览</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/model-comparison") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/model-comparison">模型对比</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/codegeex") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/codegeex">CodeGeeX</Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">集成指南</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={isActive("/api-documentation/databases") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/databases">数据库集成</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/media-channels") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/media-channels">媒体渠道</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/api-documentation/business-platforms") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/api-documentation/business-platforms">商业平台</Link>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
