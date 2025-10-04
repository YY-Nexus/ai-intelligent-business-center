"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart4,
  FileText,
  Code,
  Users,
  Brain,
  GitBranch,
  Puzzle,
  RefreshCw,
} from "lucide-react"

// 模块完成状态类型
type ModuleStatus = "completed" | "partial" | "pending"

// 模块类型
interface Module {
  id: string
  name: string
  description: string
  status: ModuleStatus
  completionPercentage: number
  components: {
    name: string
    status: ModuleStatus
    details?: string
  }[]
  issues?: {
    type: "bug" | "improvement" | "missing"
    description: string
    priority: "high" | "medium" | "low"
  }[]
}

export function CompletionAnalysis() {
  // 模拟完成度数据
  const completionData = [
    { category: "框架完整性", completion: 85, total: 100 },
    { category: "文件合规性", completion: 78, total: 100 },
    { category: "交互流畅性", completion: 92, total: 100 },
    { category: "功能完整度", completion: 65, total: 100 },
    { category: "安全合规性", completion: 80, total: 100 },
    { category: "性能优化", completion: 72, total: 100 },
  ]
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [progress, setProgress] = useState(0)
  const [modules, setModules] = useState<Module[]>([])
  const [overallCompletion, setOverallCompletion] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // 启动分析
  const startAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setProgress(0)

    // 模拟分析过程
    for (let i = 1; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setProgress(i * 10)
    }

    // 设置模拟的分析结果
    const analysisResults = generateAnalysisResults()
    setModules(analysisResults)

    // 计算总体完成度
    const totalCompletion =
      analysisResults.reduce((sum, module) => sum + module.completionPercentage, 0) / analysisResults.length

    setOverallCompletion(Math.round(totalCompletion))
    setLastUpdated(new Date())
    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  // 生成分析结果
  const generateAnalysisResults = (): Module[] => {
    return [
      {
        id: "core",
        name: "核心审查功能",
        description: "系统的基础审查功能模块",
        status: "completed",
        completionPercentage: 95,
        components: [
          { name: "框架审计", status: "completed" },
          { name: "文件合规审计", status: "completed" },
          { name: "交互审计", status: "completed" },
          { name: "缺失功能审计", status: "completed" },
          { name: "审查仪表盘", status: "completed" },
        ],
        issues: [
          {
            type: "improvement",
            description: "框架审计可以添加更多自定义规则配置",
            priority: "medium",
          },
        ],
      },
      {
        id: "repair",
        name: "修复引擎",
        description: "自动修复发现的问题",
        status: "completed",
        completionPercentage: 90,
        components: [
          { name: "修复历史记录", status: "completed" },
          { name: "修复策略配置", status: "completed" },
          { name: "自动修复引擎", status: "completed" },
        ],
        issues: [
          {
            type: "improvement",
            description: "增强批量修复功能的稳定性",
            priority: "medium",
          },
          {
            type: "bug",
            description: "某些复杂场景下修复可能导致新问题",
            priority: "high",
          },
        ],
      },
      {
        id: "performance",
        name: "性能监控",
        description: "监控系统性能和资源使用",
        status: "completed",
        completionPercentage: 85,
        components: [
          { name: "性能指标监控", status: "completed" },
          { name: "资源使用分析", status: "completed" },
          { name: "性能优化建议", status: "completed" },
          { name: "历史性能趋势", status: "partial", details: "长期趋势分析功能尚未完全实现" },
        ],
        issues: [
          {
            type: "improvement",
            description: "添加更多自定义性能指标",
            priority: "low",
          },
        ],
      },
      {
        id: "plugins",
        name: "插件系统",
        description: "扩展系统功能的插件架构",
        status: "partial",
        completionPercentage: 75,
        components: [
          { name: "插件管理器", status: "completed" },
          { name: "插件API", status: "completed" },
          { name: "插件市场", status: "pending", details: "尚未开始实现" },
          { name: "插件配置界面", status: "partial", details: "基础功能已实现，高级配置尚未完成" },
        ],
        issues: [
          {
            type: "missing",
            description: "缺少插件版本管理功能",
            priority: "medium",
          },
          {
            type: "improvement",
            description: "插件安全沙箱需要加强",
            priority: "high",
          },
        ],
      },
      {
        id: "team",
        name: "团队协作",
        description: "支持团队成员协作处理问题",
        status: "completed",
        completionPercentage: 85,
        components: [
          { name: "团队管理", status: "completed" },
          { name: "任务分配", status: "completed" },
          { name: "协作工作流", status: "completed" },
          { name: "通知系统", status: "partial", details: "邮件通知功能尚未完全实现" },
        ],
        issues: [
          {
            type: "improvement",
            description: "增加更多团队角色和权限控制",
            priority: "medium",
          },
        ],
      },
      {
        id: "ml",
        name: "机器学习预测",
        description: "使用ML预测修复成功率和所需时间",
        status: "partial",
        completionPercentage: 70,
        components: [
          { name: "预测模型", status: "completed" },
          { name: "模型训练", status: "partial", details: "自动训练流程尚未完全实现" },
          { name: "预测可视化", status: "completed" },
          { name: "模型评估", status: "partial", details: "缺少全面的评估指标" },
        ],
        issues: [
          {
            type: "improvement",
            description: "提高预测准确率",
            priority: "high",
          },
          {
            type: "missing",
            description: "缺少模型解释功能",
            priority: "medium",
          },
        ],
      },
      {
        id: "ci",
        name: "CI/CD集成",
        description: "与CI/CD流程集成",
        status: "completed",
        completionPercentage: 80,
        components: [
          { name: "CI配置", status: "completed" },
          { name: "自动触发审查", status: "completed" },
          { name: "结果报告", status: "completed" },
          { name: "自动修复PR", status: "partial", details: "复杂修复场景支持有限" },
        ],
        issues: [
          {
            type: "improvement",
            description: "支持更多CI/CD平台",
            priority: "medium",
          },
        ],
      },
      {
        id: "docs",
        name: "文档与报告",
        description: "系统文档和报告生成",
        status: "partial",
        completionPercentage: 65,
        components: [
          { name: "用户文档", status: "partial", details: "部分高级功能文档缺失" },
          { name: "API文档", status: "completed" },
          { name: "报告生成", status: "partial", details: "自定义报告模板功能尚未实现" },
          { name: "导出功能", status: "completed" },
        ],
        issues: [
          {
            type: "missing",
            description: "缺少交互式文档教程",
            priority: "medium",
          },
          {
            type: "improvement",
            description: "增加更多报告格式",
            priority: "low",
          },
        ],
      },
      {
        id: "ui",
        name: "用户界面",
        description: "系统的用户界面和交互体验",
        status: "completed",
        completionPercentage: 90,
        components: [
          { name: "组件库", status: "completed" },
          { name: "响应式设计", status: "completed" },
          { name: "主题定制", status: "completed" },
          { name: "无障碍支持", status: "partial", details: "部分高级无障碍功能尚未实现" },
        ],
        issues: [
          {
            type: "improvement",
            description: "优化移动设备体验",
            priority: "medium",
          },
        ],
      },
      {
        id: "security",
        name: "安全与权限",
        description: "系统安全和访问控制",
        status: "partial",
        completionPercentage: 60,
        components: [
          { name: "认证系统", status: "completed" },
          { name: "权限控制", status: "partial", details: "细粒度权限控制尚未完全实现" },
          { name: "安全审计", status: "partial", details: "安全日志分析功能有限" },
          { name: "数据加密", status: "completed" },
        ],
        issues: [
          {
            type: "missing",
            description: "缺少双因素认证",
            priority: "high",
          },
          {
            type: "improvement",
            description: "增强API安全措施",
            priority: "high",
          },
        ],
      },
    ]
  }

  // 获取状态标签
  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            已完成
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            部分完成
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="mr-1 h-3 w-3" />
            未开始
          </Badge>
        )
    }
  }

  // 获取问题类型标签
  const getIssueTypeBadge = (type: "bug" | "improvement" | "missing") => {
    switch (type) {
      case "bug":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            缺陷
          </Badge>
        )
      case "improvement":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <RefreshCw className="mr-1 h-3 w-3" />
            改进
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Puzzle className="mr-1 h-3 w-3" />
            缺失
          </Badge>
        )
    }
  }

  // 获取优先级标签
  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            高
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            中
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            低
          </Badge>
        )
    }
  }

  // 获取模块图标
  const getModuleIcon = (moduleId: string) => {
    switch (moduleId) {
      case "core":
        return <FileText className="h-5 w-5" />
      case "repair":
        return <Code className="h-5 w-5" />
      case "performance":
        return <BarChart4 className="h-5 w-5" />
      case "plugins":
        return <Puzzle className="h-5 w-5" />
      case "team":
        return <Users className="h-5 w-5" />
      case "ml":
        return <Brain className="h-5 w-5" />
      case "ci":
        return <GitBranch className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // 自动启动分析
  useEffect(() => {
    startAnalysis()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">系统审查应用完成度分析</CardTitle>
            <CardDescription>全面评估系统各模块的实现状态和完成度</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={startAnalysis} disabled={isAnalyzing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            刷新分析
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAnalyzing ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">分析进度</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">正在分析系统组件和功能完成度...</p>
          </div>
        ) : analysisComplete ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">总体完成度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallCompletion / 100)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{overallCompletion}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {lastUpdated && `最后更新: ${lastUpdated.toLocaleString("zh-CN")}`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">模块状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">已完成</span>
                      </div>
                      <span className="font-medium">{modules.filter((m) => m.status === "completed").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">部分完成</span>
                      </div>
                      <span className="font-medium">{modules.filter((m) => m.status === "partial").length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                        <span className="text-sm">未开始</span>
                      </div>
                      <span className="font-medium">{modules.filter((m) => m.status === "pending").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">问题统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">缺陷</span>
                      </div>
                      <span className="font-medium">
                        {modules.reduce(
                          (count, module) => count + (module.issues?.filter((i) => i.type === "bug").length || 0),
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">改进</span>
                      </div>
                      <span className="font-medium">
                        {modules.reduce(
                          (count, module) =>
                            count + (module.issues?.filter((i) => i.type === "improvement").length || 0),
                          0,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span className="text-sm">缺失功能</span>
                      </div>
                      <span className="font-medium">
                        {modules.reduce(
                          (count, module) => count + (module.issues?.filter((i) => i.type === "missing").length || 0),
                          0,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="modules">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="modules">模块完成度</TabsTrigger>
                <TabsTrigger value="issues">问题与改进</TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {modules.map((module) => (
                    <Card key={module.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-4 md:w-1/3 border-r">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">{getModuleIcon(module.id)}</div>
                            <div>
                              <h3 className="font-medium">{module.name}</h3>
                              <p className="text-sm text-muted-foreground">{module.description}</p>
                              <div className="flex items-center mt-2">
                                {getStatusBadge(module.status)}
                                <span className="ml-2 text-sm font-medium">{module.completionPercentage}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  module.completionPercentage > 80
                                    ? "bg-green-500"
                                    : module.completionPercentage > 50
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{ width: `${module.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 md:w-2/3">
                          <h4 className="text-sm font-medium mb-2">组件状态</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {module.components.map((component, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                <span className="text-sm">{component.name}</span>
                                <div className="flex items-center">
                                  {getStatusBadge(component.status)}
                                  {component.details && (
                                    <span
                                      className="ml-2 text-xs text-muted-foreground max-w-[150px] truncate"
                                      title={component.details}
                                    >
                                      {component.details}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="issues">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">所有问题与改进点</CardTitle>
                    <CardDescription>按优先级排序的系统问题和改进建议</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {modules
                          .filter((module) => module.issues && module.issues.length > 0)
                          .map((module) => (
                            <div key={module.id} className="pb-4 border-b last:border-0">
                              <h3 className="font-medium mb-2 flex items-center">
                                {getModuleIcon(module.id)}
                                <span className="ml-2">{module.name}</span>
                              </h3>
                              <div className="space-y-2">
                                {module.issues
                                  ?.sort((a, b) => {
                                    const priorityOrder = { high: 0, medium: 1, low: 2 }
                                    return priorityOrder[a.priority] - priorityOrder[b.priority]
                                  })
                                  .map((issue, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-start p-2 bg-muted/50 rounded-md"
                                    >
                                      <div className="flex items-start gap-2">
                                        {getIssueTypeBadge(issue.type)}
                                        <span className="text-sm">{issue.description}</span>
                                      </div>
                                      <div>{getPriorityBadge(issue.priority)}</div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-8">
            <BarChart4 className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
            <p className="mt-2 text-muted-foreground">点击"刷新分析"按钮开始分析</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>系统审查应用完成度分析工具</div>
        <div>
          {analysisComplete &&
            `总体完成度: ${overallCompletion}% · ${modules.length} 个模块 · ${modules.reduce(
              (count, module) => count + (module.issues?.length || 0),
              0,
            )} 个问题`}
        </div>
      </CardFooter>
    </Card>
  )
}
