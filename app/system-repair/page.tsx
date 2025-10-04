"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SystemDiagnostics } from "@/components/system-repair/system-diagnostics"
import { RepairHistory } from "@/components/system-repair/repair-history"
import { AutoFixEngine } from "@/components/system-repair/auto-fix-engine"
import { RepairStrategy } from "@/components/system-repair/repair-strategy"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle, Settings, RefreshCw, History, Zap } from "lucide-react"
import { useDiagnostics } from "@/hooks/use-diagnostics"
import { useRepair } from "@/hooks/use-repair"

export default function SystemRepairPage() {
  const [activeTab, setActiveTab] = useState("diagnostics")
  const [isAutoFixDialogOpen, setIsAutoFixDialogOpen] = useState(false)
  const { toast } = useToast()

  const {
    problems,
    isProblemDetectionRunning,
    detectionProgress,
    runSystemDiagnostics,
    diagnosticsResults,
    lastDiagnosticsRun,
  } = useDiagnostics()

  const { repairStrategy, setRepairStrategy, repairHistory, isRepairing } = useRepair()

  // 处理修复完成
  const handleFixComplete = (fixedProblems, snapshot) => {
    const fixedCount = fixedProblems.filter((p) => p.status === "fixed").length

    toast({
      title: "修复完成",
      description: `成功修复了 ${fixedCount} 个问题，${fixedProblems.length - fixedCount} 个问题需要手动处理`,
    })

    // 关闭对话框
    setIsAutoFixDialogOpen(false)

    // 重新运行诊断以验证修复效果
    runSystemDiagnostics()
  }

  // 打开自动修复对话框
  const openAutoFixDialog = () => {
    if (problems.length > 0) {
      setIsAutoFixDialogOpen(true)
    } else {
      toast({
        title: "没有可修复的问题",
        description: "当前没有发现需要修复的问题",
      })
    }
  }

  // 计算系统健康度
  const calculateSystemHealth = () => {
    if (!diagnosticsResults) return 100

    const { apiConnectivity, configurationIssues, performanceMetrics, securityIssues } = diagnosticsResults

    // 根据各项指标计算总体健康度
    const connectivityScore = apiConnectivity.score
    const configScore = configurationIssues.score
    const performanceScore = performanceMetrics.score
    const securityScore = securityIssues.score

    // 加权平均
    return Math.round(connectivityScore * 0.3 + configScore * 0.3 + performanceScore * 0.2 + securityScore * 0.2)
  }

  // 获取健康度状态样式
  const getHealthStatusStyle = (health) => {
    if (health >= 80) return "text-green-500"
    if (health >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">系统修复工具</CardTitle>
              <CardDescription>诊断并修复AI API管理系统中的问题，确保系统稳定运行</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {lastDiagnosticsRun && (
                <div className="text-sm text-muted-foreground">
                  上次诊断: {new Date(lastDiagnosticsRun).toLocaleString("zh-CN")}
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setActiveTab("strategy")}>
                <Settings className="h-4 w-4 mr-2" />
                修复策略
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 系统健康状态概览 */}
          {diagnosticsResults && (
            <div className="mb-6 p-4 bg-muted/40 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h3 className="text-lg font-medium">系统健康状态</h3>
                <div className="flex items-center">
                  <span className="text-sm mr-2">健康度:</span>
                  <span className={`text-xl font-bold ${getHealthStatusStyle(calculateSystemHealth())}`}>
                    {calculateSystemHealth()}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-background p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">API连接状态</span>
                    <Badge variant={diagnosticsResults.apiConnectivity.score >= 80 ? "default" : "destructive"}>
                      {diagnosticsResults.apiConnectivity.score}%
                    </Badge>
                  </div>
                  <Progress value={diagnosticsResults.apiConnectivity.score} className="h-2" />
                </div>

                <div className="bg-background p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">配置问题</span>
                    <Badge variant={diagnosticsResults.configurationIssues.score >= 80 ? "default" : "destructive"}>
                      {diagnosticsResults.configurationIssues.score}%
                    </Badge>
                  </div>
                  <Progress value={diagnosticsResults.configurationIssues.score} className="h-2" />
                </div>

                <div className="bg-background p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">性能指标</span>
                    <Badge variant={diagnosticsResults.performanceMetrics.score >= 80 ? "default" : "destructive"}>
                      {diagnosticsResults.performanceMetrics.score}%
                    </Badge>
                  </div>
                  <Progress value={diagnosticsResults.performanceMetrics.score} className="h-2" />
                </div>

                <div className="bg-background p-3 rounded-md shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">安全状态</span>
                    <Badge variant={diagnosticsResults.securityIssues.score >= 80 ? "default" : "destructive"}>
                      {diagnosticsResults.securityIssues.score}%
                    </Badge>
                  </div>
                  <Progress value={diagnosticsResults.securityIssues.score} className="h-2" />
                </div>
              </div>

              {problems.length > 0 && (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>发现 {problems.length} 个系统问题</AlertTitle>
                    <AlertDescription>系统诊断发现了需要修复的问题，建议使用自动修复工具解决这些问题</AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}

          {/* 主要功能标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="diagnostics" className="flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                系统诊断
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center">
                <History className="mr-2 h-4 w-4" />
                修复历史
              </TabsTrigger>
              <TabsTrigger value="strategy" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                修复策略
              </TabsTrigger>
            </TabsList>

            <TabsContent value="diagnostics">
              <SystemDiagnostics
                problems={problems}
                isProblemDetectionRunning={isProblemDetectionRunning}
                detectionProgress={detectionProgress}
                runSystemDiagnostics={runSystemDiagnostics}
                diagnosticsResults={diagnosticsResults}
              />
            </TabsContent>

            <TabsContent value="history">
              <RepairHistory history={repairHistory} />
            </TabsContent>

            <TabsContent value="strategy">
              <RepairStrategy strategy={repairStrategy} setStrategy={setRepairStrategy} />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={runSystemDiagnostics} disabled={isProblemDetectionRunning}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isProblemDetectionRunning ? "animate-spin" : ""}`} />
            重新诊断
          </Button>

          <Button
            onClick={openAutoFixDialog}
            disabled={problems.length === 0 || isProblemDetectionRunning || isRepairing}
          >
            <Zap className="mr-2 h-4 w-4" />
            自动修复问题
          </Button>
        </CardFooter>
      </Card>

      {/* 自动修复对话框 */}
      {isAutoFixDialogOpen && (
        <AutoFixEngine
          problems={problems}
          isOpen={isAutoFixDialogOpen}
          onClose={() => setIsAutoFixDialogOpen(false)}
          onFixComplete={handleFixComplete}
          strategy={repairStrategy}
        />
      )}
    </div>
  )
}
