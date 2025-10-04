"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useNotifications } from "@/lib/notifications/notification-context"
import { FrameworkAudit } from "./framework-audit"
import { FileComplianceAudit } from "./file-compliance-audit"
import { InteractionAudit } from "./interaction-audit"
import { MissingFeaturesAudit } from "./missing-features-audit"

export function AuditDashboard() {
  const [isAuditing, setIsAuditing] = useState(false)
  const [lastAuditTime, setLastAuditTime] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState("framework")
  const { toast } = useToast()
  const { addSystemAuditNotification } = useNotifications()

  // 模拟审计结果
  const [frameworkIssues, setFrameworkIssues] = useState(0)
  const [fileIssues, setFileIssues] = useState(0)
  const [interactionIssues, setInteractionIssues] = useState(0)
  const [missingFeatures, setMissingFeatures] = useState(0)

  // 模拟审计过程
  const runAudit = async () => {
    setIsAuditing(true)

    // 通知审计开始
    addSystemAuditNotification({
      title: "系统审计开始",
      message: "系统审计已开始，这可能需要几分钟时间",
      level: "info",
      source: "系统审计",
    })

    toast({
      title: "审计开始",
      description: "系统审计已开始，这可能需要几分钟时间",
    })

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // 模拟随机结果
      const newFrameworkIssues = Math.floor(Math.random() * 5)
      const newFileIssues = Math.floor(Math.random() * 8)
      const newInteractionIssues = Math.floor(Math.random() * 3)
      const newMissingFeatures = Math.floor(Math.random() * 4)

      setFrameworkIssues(newFrameworkIssues)
      setFileIssues(newFileIssues)
      setInteractionIssues(newInteractionIssues)
      setMissingFeatures(newMissingFeatures)

      const totalIssues = newFrameworkIssues + newFileIssues + newInteractionIssues + newMissingFeatures

      // 更新最后审计时间
      const now = new Date()
      setLastAuditTime(now)
      localStorage.setItem("lastAuditTime", now.toISOString())

      // 通知审计完成
      addSystemAuditNotification({
        title: "系统审计完成",
        message: `审计完成，发现 ${totalIssues} 个问题`,
        level: totalIssues > 0 ? "warning" : "success",
        source: "系统审计",
        actionLabel: totalIssues > 0 ? "查看详情" : undefined,
        actionUrl: totalIssues > 0 ? "/system-repair" : undefined,
      })

      toast({
        title: "审计完成",
        description: `审计完成，发现 ${totalIssues} 个问题`,
        variant: totalIssues > 0 ? "destructive" : "default",
      })

      // 如果发现问题，为每种类型的问题发送通知
      if (newFrameworkIssues > 0) {
        addSystemAuditNotification({
          title: "框架问题",
          message: `发现 ${newFrameworkIssues} 个框架相关问题`,
          level: "warning",
          source: "框架审计",
          issueType: "framework",
          repairAvailable: true,
          actionLabel: "查看详情",
          actionUrl: "/system-repair?tab=framework",
        })
      }

      if (newFileIssues > 0) {
        addSystemAuditNotification({
          title: "文件合规问题",
          message: `发现 ${newFileIssues} 个文件合规问题`,
          level: "warning",
          source: "文件审计",
          issueType: "file",
          repairAvailable: true,
          actionLabel: "查看详情",
          actionUrl: "/system-repair?tab=file",
        })
      }

      if (newInteractionIssues > 0) {
        addSystemAuditNotification({
          title: "交互问题",
          message: `发现 ${newInteractionIssues} 个用户交互问题`,
          level: "warning",
          source: "交互审计",
          issueType: "interaction",
          repairAvailable: true,
          actionLabel: "查看详情",
          actionUrl: "/system-repair?tab=interaction",
        })
      }

      if (newMissingFeatures > 0) {
        addSystemAuditNotification({
          title: "缺失功能",
          message: `发现 ${newMissingFeatures} 个缺失功能`,
          level: "info",
          source: "功能审计",
          issueType: "feature",
          repairAvailable: false,
          actionLabel: "查看详情",
          actionUrl: "/system-repair?tab=feature",
        })
      }
    } catch (error) {
      console.error("审计过程中出错:", error)

      // 通知审计失败
      addSystemAuditNotification({
        title: "系统审计失败",
        message: "系统审计过程中发生错误",
        level: "error",
        source: "系统审计",
      })

      toast({
        title: "审计失败",
        description: "系统审计过程中发生错误",
        variant: "destructive",
      })
    } finally {
      setIsAuditing(false)
    }
  }

  // 从本地存储加载上次审计时间
  useEffect(() => {
    const storedTime = localStorage.getItem("lastAuditTime")
    if (storedTime) {
      setLastAuditTime(new Date(storedTime))
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>系统审计</CardTitle>
        <CardDescription>检查系统组件、文件和交互的问题</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div>
            {lastAuditTime ? (
              <p className="text-sm text-muted-foreground">上次审计时间: {lastAuditTime.toLocaleString("zh-CN")}</p>
            ) : (
              <p className="text-sm text-muted-foreground">尚未进行审计</p>
            )}
          </div>
          <Button onClick={runAudit} disabled={isAuditing}>
            {isAuditing ? "审计中..." : "运行审计"}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="framework">
              框架 {frameworkIssues > 0 && <span className="ml-1 text-red-500">({frameworkIssues})</span>}
            </TabsTrigger>
            <TabsTrigger value="file">
              文件 {fileIssues > 0 && <span className="ml-1 text-red-500">({fileIssues})</span>}
            </TabsTrigger>
            <TabsTrigger value="interaction">
              交互 {interactionIssues > 0 && <span className="ml-1 text-red-500">({interactionIssues})</span>}
            </TabsTrigger>
            <TabsTrigger value="features">
              功能 {missingFeatures > 0 && <span className="ml-1 text-red-500">({missingFeatures})</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="framework">
            <FrameworkAudit issueCount={frameworkIssues} />
          </TabsContent>
          <TabsContent value="file">
            <FileComplianceAudit issueCount={fileIssues} />
          </TabsContent>
          <TabsContent value="interaction">
            <InteractionAudit issueCount={interactionIssues} />
          </TabsContent>
          <TabsContent value="features">
            <MissingFeaturesAudit issueCount={missingFeatures} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          总问题数: {frameworkIssues + fileIssues + interactionIssues + missingFeatures}
        </p>
        {frameworkIssues + fileIssues + interactionIssues > 0 && (
          <Button variant="outline" onClick={() => (window.location.href = "/system-repair")}>
            修复问题
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
