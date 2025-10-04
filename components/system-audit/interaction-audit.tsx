"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MousePointer, Keyboard, Smartphone, Accessibility, CheckCircle2, XCircle } from "lucide-react"

export interface InteractionAuditProps {
  targetUrl?: string
}

export function InteractionAudit({ targetUrl = "/dashboard" }: InteractionAuditProps) {
  const [activeTab, setActiveTab] = useState("mouse")
  const [isAuditing, setIsAuditing] = useState(false)
  const [results, setResults] = useState<{
    mouse: { completed: boolean; issues: string[] }
    keyboard: { completed: boolean; issues: string[] }
    touch: { completed: boolean; issues: string[] }
    accessibility: { completed: boolean; issues: string[] }
  }>({
    mouse: { completed: false, issues: [] },
    keyboard: { completed: false, issues: [] },
    touch: { completed: false, issues: [] },
    accessibility: { completed: false, issues: [] },
  })

  const runAudit = async () => {
    setIsAuditing(true)

    // 模拟审计过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = {
      mouse: {
        completed: true,
        issues: activeTab === "mouse" ? ["部分按钮点击区域过小", "下拉菜单悬停状态不明显"] : [],
      },
      keyboard: {
        completed: activeTab === "keyboard",
        issues: activeTab === "keyboard" ? ["表单元素缺少键盘导航", "模态框无法通过ESC键关闭"] : [],
      },
      touch: {
        completed: activeTab === "touch",
        issues: activeTab === "touch" ? ["触摸目标太小，不符合移动设计标准", "滑动手势未实现"] : [],
      },
      accessibility: {
        completed: activeTab === "accessibility",
        issues:
          activeTab === "accessibility"
            ? ["图片缺少alt属性", "颜色对比度不足", "表单缺少标签关联", "页面结构缺少适当的标题层级"]
            : [],
      },
    }

    setResults((prev) => ({
      ...prev,
      [activeTab]: mockResults[activeTab as keyof typeof mockResults],
    }))

    setIsAuditing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>交互审计</CardTitle>
        <CardDescription>评估用户界面的交互体验和可访问性</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mouse" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="mouse" className="flex items-center">
              <MousePointer className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">鼠标</span>
            </TabsTrigger>
            <TabsTrigger value="keyboard" className="flex items-center">
              <Keyboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">键盘</span>
            </TabsTrigger>
            <TabsTrigger value="touch" className="flex items-center">
              <Smartphone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">触摸</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center">
              <Accessibility className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">无障碍</span>
            </TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">目标URL: {targetUrl}</span>
              <Button onClick={runAudit} disabled={isAuditing} size="sm">
                {isAuditing ? "审计中..." : "运行审计"}
              </Button>
            </div>

            <TabsContent value="mouse" className="mt-0">
              {results.mouse.completed ? <AuditResults issues={results.mouse.issues} /> : <EmptyState type="mouse" />}
            </TabsContent>

            <TabsContent value="keyboard" className="mt-0">
              {results.keyboard.completed ? (
                <AuditResults issues={results.keyboard.issues} />
              ) : (
                <EmptyState type="keyboard" />
              )}
            </TabsContent>

            <TabsContent value="touch" className="mt-0">
              {results.touch.completed ? <AuditResults issues={results.touch.issues} /> : <EmptyState type="touch" />}
            </TabsContent>

            <TabsContent value="accessibility" className="mt-0">
              {results.accessibility.completed ? (
                <AuditResults issues={results.accessibility.issues} />
              ) : (
                <EmptyState type="accessibility" />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function AuditResults({ issues }: { issues: string[] }) {
  return (
    <div className="rounded-md border p-4">
      {issues.length > 0 ? (
        <>
          <div className="flex items-center mb-2 text-destructive">
            <XCircle className="h-5 w-5 mr-2" />
            <h4 className="font-medium">发现 {issues.length} 个问题</h4>
          </div>
          <ScrollArea className="h-[150px]">
            <ul className="space-y-2 pl-7 list-disc">
              {issues.map((issue, i) => (
                <li key={i} className="text-sm">
                  {issue}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </>
      ) : (
        <div className="flex items-center justify-center h-[150px] text-green-500">
          <CheckCircle2 className="h-6 w-6 mr-2" />
          <span className="text-lg font-medium">所有检查通过</span>
        </div>
      )}
    </div>
  )
}

function EmptyState({ type }: { type: string }) {
  const typeLabels = {
    mouse: "鼠标交互",
    keyboard: "键盘导航",
    touch: "触摸操作",
    accessibility: "无障碍功能",
  }

  return (
    <div className="rounded-md border border-dashed p-8 flex flex-col items-center justify-center text-center text-muted-foreground h-[150px]">
      <span className="block mb-2">
        {type === "mouse" && <MousePointer className="h-10 w-10 mx-auto mb-2 opacity-20" />}
        {type === "keyboard" && <Keyboard className="h-10 w-10 mx-auto mb-2 opacity-20" />}
        {type === "touch" && <Smartphone className="h-10 w-10 mx-auto mb-2 opacity-20" />}
        {type === "accessibility" && <Accessibility className="h-10 w-10 mx-auto mb-2 opacity-20" />}
      </span>
      <p>点击"运行审计"按钮开始{typeLabels[type as keyof typeof typeLabels]}检查</p>
    </div>
  )
}
