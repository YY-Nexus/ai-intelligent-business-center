"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FileText, Database, Settings, BarChart2, Code, Zap } from "lucide-react"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// 模拟搜索结果
const mockResults = [
  {
    id: "1",
    title: "API配置",
    description: "管理和配置API连接",
    icon: <Database className="h-4 w-4" />,
    href: "/api-config",
  },
  {
    id: "2",
    title: "智谱AI集成",
    description: "配置智谱AI大模型集成",
    icon: <Zap className="h-4 w-4" />,
    href: "/api-config/zhipu",
  },
  {
    id: "3",
    title: "系统设置",
    description: "管理系统全局设置",
    icon: <Settings className="h-4 w-4" />,
    href: "/settings",
  },
  {
    id: "4",
    title: "API文档",
    description: "查看API使用文档",
    icon: <FileText className="h-4 w-4" />,
    href: "/api-documentation",
  },
  {
    id: "5",
    title: "数据分析",
    description: "查看API使用统计和分析",
    icon: <BarChart2 className="h-4 w-4" />,
    href: "/api-config/analytics",
  },
  {
    id: "6",
    title: "代码生成",
    description: "使用CodeGeeX生成代码",
    icon: <Code className="h-4 w-4" />,
    href: "/api-documentation/codegeex",
  },
]

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState(mockResults)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // 模拟搜索功能
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setResults(mockResults)
      return
    }

    const filtered = mockResults.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setResults(filtered)
    setSelectedIndex(0)
  }, [searchQuery])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prevIndex) => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex))
          break
        case "Enter":
          e.preventDefault()
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          onOpenChange(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, selectedIndex, onOpenChange])

  const handleSelect = (item: (typeof results)[0]) => {
    router.push(item.href)
    onOpenChange(false)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-12 rounded-md border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        {results.length > 0 ? (
          <ScrollArea className="h-72">
            <div className="p-2">
              {results.map((item, index) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start text-left ${index === selectedIndex ? "bg-muted" : ""}`}
                  onClick={() => handleSelect(item)}
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md border">{item.icon}</div>
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">未找到匹配的结果</div>
        )}
        <div className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground">
          <div>
            <span className="hidden sm:inline-block">按</span>{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↑</span>
            </kbd>{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↓</span>
            </kbd>{" "}
            <span className="hidden sm:inline-block">浏览</span>
          </div>
          <div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">↵</span>
            </kbd>{" "}
            <span className="hidden sm:inline-block">选择</span>
          </div>
          <div>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Esc</span>
            </kbd>{" "}
            <span className="hidden sm:inline-block">关闭</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
