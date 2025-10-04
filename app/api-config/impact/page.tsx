"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertTriangle,
  ChevronRight,
  FileText,
  GitBranch,
  GitPullRequest,
  History,
  RefreshCw,
  Download,
  Plus,
  Trash2,
  Edit,
} from "lucide-react"
import { useChangesList, useImpactAnalysis, useChangeOperations } from "@/lib/hooks/use-impact-analysis"
import { AnimatedTransition } from "@/components/ui/animated-transition"
import { ImpactChart } from "@/components/impact-analysis/impact-chart"
import { RiskGauge } from "@/components/impact-analysis/risk-gauge"
import { toast } from "@/components/ui/use-toast"
import { ChangeDialog } from "@/components/impact-analysis/change-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Change } from "@/lib/models/impact-analysis-types"

export default function ImpactAnalysisPage() {
  const [selectedChange, setSelectedChange] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterLevel, setFilterLevel] = useState<string | null>(null)

  // 使用SWR钩子获取数据
  const {
    changes,
    isLoading: isChangesLoading,
    isError: changesError,
    refresh: refreshChanges,
  } = useChangesList({
    type: filterType as any,
    impactLevel: filterLevel as any,
    sortBy: "date",
    sortOrder: "desc",
  })

  const {
    analysis,
    isLoading: isAnalysisLoading,
    isError: analysisError,
    refresh: refreshAnalysis,
  } = useImpactAnalysis(showAnalysis ? selectedChange : null)

  const { remove } = useChangeOperations()

  // 获取变更类型标签
  const getChangeTypeBadge = (type: string) => {
    switch (type) {
      case "add":
        return <Badge className="bg-green-50 text-green-700 border-green-200">新增</Badge>
      case "modify":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">修改</Badge>
      case "remove":
        return <Badge className="bg-red-50 text-red-700 border-red-200">移除</Badge>
      default:
        return null
    }
  }

  // 获取影响级别标签
  const getImpactLevelBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-red-50 text-red-700 border-red-200">高</Badge>
      case "medium":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">中</Badge>
      case "low":
        return <Badge className="bg-green-50 text-green-700 border-green-200">低</Badge>
      default:
        return null
    }
  }

  // 处理变更选择
  const handleChangeSelect = (changeId: string) => {
    setSelectedChange(changeId)
    setShowAnalysis(false)
  }

  // 执行影响分析
  const runImpactAnalysis = () => {
    setShowAnalysis(true)
  }

  // 刷新数据
  const handleRefresh = () => {
    refreshChanges()
    if (showAnalysis && selectedChange) {
      refreshAnalysis()
    }
    toast({
      title: "刷新成功",
      description: "数据已更新",
    })
  }

  // 导出分析报告
  const exportAnalysisReport = () => {
    if (!analysis) return

    const selectedChangeData = changes.find((c) => c.id === selectedChange)
    if (!selectedChangeData) return

    const reportData = {
      change: selectedChangeData,
      analysis: analysis,
      generatedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = `impact-analysis-${selectedChangeData.path.replace(/\//g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "导出成功",
      description: "分析报告已下载",
    })
  }

  // 处理变更创建/更新成功
  const handleChangeSuccess = (change: Change) => {
    refreshChanges()
    toast({
      title: "操作成功",
      description: change.id ? "变更信息已更新" : "新变更已创建",
    })
  }

  // 处理变更删除
  const handleDeleteChange = async () => {
    if (!selectedChange) return

    try {
      await remove(selectedChange)
      toast({
        title: "删除成功",
        description: "变更已被删除",
      })
      setSelectedChange(null)
      setShowAnalysis(false)
      refreshChanges()
    } catch (error) {
      toast({
        title: "删除失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // 过滤变更列表
  const handleFilterChange = (type: string | null, level: string | null) => {
    setFilterType(type)
    setFilterLevel(level)
  }

  // 如果正在加载变更列表，显示加载状态
  if (isChangesLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中，请稍候...</p>
          </div>
        </div>
      </div>
    )
  }

  // 如果有错误，显示错误信息
  if (changesError) {
    return (
      <div className="container mx-auto py-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              加载错误
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{changesError.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => refreshChanges()}>
              重试
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">变更分析</h1>
          <p className="text-muted-foreground">分析API变更的影响范围，评估风险并提供迁移建议。</p>
        </div>
        <div className="flex space-x-2">
          <ChangeDialog
            onSuccess={handleChangeSuccess}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                添加变更
              </Button>
            }
          />
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新数据
          </Button>
          {showAnalysis && analysis && (
            <Button variant="outline" onClick={exportAnalysisReport}>
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>变更列表</CardTitle>
                  <CardDescription>选择一个变更进行影响分析</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant={filterType === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(null, filterLevel)}
                >
                  全部类型
                </Button>
                <Button
                  variant={filterType === "add" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("add", filterLevel)}
                >
                  新增
                </Button>
                <Button
                  variant={filterType === "modify" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("modify", filterLevel)}
                >
                  修改
                </Button>
                <Button
                  variant={filterType === "remove" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("remove", filterLevel)}
                >
                  移除
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterLevel === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filterType, null)}
                >
                  全部级别
                </Button>
                <Button
                  variant={filterLevel === "high" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filterType, "high")}
                >
                  高影响
                </Button>
                <Button
                  variant={filterLevel === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filterType, "medium")}
                >
                  中影响
                </Button>
                <Button
                  variant={filterLevel === "low" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filterType, "low")}
                >
                  低影响
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {changes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">没有找到符合条件的变更</div>
                  ) : (
                    changes.map((change) => (
                      <div
                        key={change.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedChange === change.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleChangeSelect(change.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            {getChangeTypeBadge(change.type)}
                            <span className="font-medium">{change.path}</span>
                          </div>
                          {getImpactLevelBadge(change.impactLevel)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{change.author}</span>
                          <span>{change.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedChange ? (
            <div className="space-y-6">
              <AnimatedTransition isVisible={true}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>变更详情</CardTitle>
                      <div className="flex space-x-2">
                        <ChangeDialog
                          change={changes.find((c) => c.id === selectedChange)}
                          onSuccess={handleChangeSuccess}
                          trigger={
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              编辑
                            </Button>
                          }
                        />
                        <Button variant="outline" size="sm" onClick={() => setDeleteDialogOpen(true)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                        <Button onClick={runImpactAnalysis} disabled={showAnalysis}>
                          运行影响分析
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const change = changes.find((c) => c.id === selectedChange)
                      if (!change) return null

                      return (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">变更类型</h3>
                              <div>{getChangeTypeBadge(change.type)}</div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">影响级别</h3>
                              <div>{getImpactLevelBadge(change.impactLevel)}</div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">路径</h3>
                              <div className="font-mono text-sm">{change.path}</div>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-muted-foreground mb-1">作者</h3>
                              <div>
                                {change.author} ({change.date})
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">描述</h3>
                            <p>{change.description}</p>
                          </div>

                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">依赖服务</h3>
                            <ul className="list-disc list-inside">
                              {change.dependencies.map((dep, index) => (
                                <li key={index} className="text-sm">
                                  {dep}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )
                    })()}
                  </CardContent>
                </Card>
              </AnimatedTransition>

              {showAnalysis && (
                <AnimatedTransition isVisible={true}>
                  {isAnalysisLoading ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-muted-foreground">正在分析变更影响...</p>
                      </CardContent>
                    </Card>
                  ) : analysisError ? (
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="text-red-600 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          分析错误
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{analysisError.message}</p>
                        <Button variant="outline" className="mt-4" onClick={() => refreshAnalysis()}>
                          重试
                        </Button>
                      </CardContent>
                    </Card>
                  ) : analysis ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>影响分析结果</CardTitle>
                        <CardDescription>基于变更的影响范围、风险级别和迁移建议</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="overview">
                          <TabsList className="mb-4">
                            <TabsTrigger value="overview">概览</TabsTrigger>
                            <TabsTrigger value="affected">受影响组件</TabsTrigger>
                            <TabsTrigger value="recommendations">建议</TabsTrigger>
                          </TabsList>

                          <TabsContent value="overview">
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-bold mb-2">{analysis.affectedApis.length}</div>
                                    <div className="text-sm text-center text-muted-foreground">受影响API</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-bold mb-2">{analysis.affectedServices.length}</div>
                                    <div className="text-sm text-center text-muted-foreground">受影响服务</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 flex flex-col items-center justify-center">
                                    <div className="text-4xl font-bold mb-2">{analysis.affectedClients.length}</div>
                                    <div className="text-sm text-center text-muted-foreground">受影响客户端</div>
                                  </CardContent>
                                </Card>
                              </div>

                              <RiskGauge
                                riskLevel={analysis.riskLevel}
                                title="风险评估"
                                description="基于影响范围和复杂度的风险评估"
                              />
                            </div>
                          </TabsContent>

                          <TabsContent value="affected">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <ImpactChart
                                analysis={analysis}
                                type="apis"
                                title="受影响的API"
                                description="直接受到变更影响的API"
                              />

                              <ImpactChart
                                analysis={analysis}
                                type="services"
                                title="受影响的服务"
                                description="依赖于变更API的服务"
                              />

                              <ImpactChart
                                analysis={analysis}
                                type="clients"
                                title="受影响的客户端"
                                description="使用变更API的客户端"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <Card className="md:col-span-1">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">受影响的API</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {analysis.affectedApis.map((api, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <code className="text-sm font-mono">{api}</code>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              <Card className="md:col-span-1">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">受影响的服务</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {analysis.affectedServices.map((service, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                                        <span>{service}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              <Card className="md:col-span-1">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">受影响的客户端</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {analysis.affectedClients.map((client, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                                        <span>{client}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="recommendations">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">迁移建议</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-3">
                                  {analysis.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <ChevronRight className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ) : null}
                </AnimatedTransition>
              )}
            </div>
          ) : (
            <AnimatedTransition isVisible={true}>
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">选择变更</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    从左侧列表中选择一个API变更，查看详情并运行影响分析。
                  </p>
                </CardContent>
              </Card>
            </AnimatedTransition>
          )}
        </div>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除此变更吗？此操作无法撤销，相关的分析结果也将被删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChange}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
