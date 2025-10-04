"use client"

import { useState, useEffect } from "react"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  CheckCircle,
  Shield,
  Lock,
  Key,
  FileText,
  RefreshCw,
  Download,
  ExternalLink,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import { useApiConfig } from "./api-config-manager"

// 安全问题类型
type SecurityIssue = {
  id: string
  configId: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  category: "authentication" | "authorization" | "data" | "configuration" | "other"
  title: string
  description: string
  impact: string
  remediation: string
  createdAt: string
  status: "open" | "in_progress" | "resolved" | "ignored"
}

export function ApiSecurityAnalyzer() {
  const { configs } = useApiConfig()
  const [selectedConfigId, setSelectedConfigId] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [securityScore, setSecurityScore] = useState(0)
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const { toast } = useToast()

  // 当选择的配置变化时，重置状态
  useEffect(() => {
    if (selectedConfigId) {
      setSecurityIssues([])
      setSecurityScore(0)
      setAnalysisProgress(0)
      setIsAnalyzing(false)
    }
  }, [selectedConfigId])

  // 开始安全分析
  const startAnalysis = () => {
    if (!selectedConfigId) {
      toast({
        title: "请选择API配置",
        description: "请先选择要分析的API配置",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // 模拟分析过程
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          generateAnalysisResults()
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // 生成分析结果
  const generateAnalysisResults = () => {
    // 模拟安全问题
    const mockIssues: SecurityIssue[] = [
      {
        id: "issue-1",
        configId: selectedConfigId,
        severity: "critical",
        category: "authentication",
        title: "缺少API密钥轮换机制",
        description: "API密钥没有定期轮换机制，增加了密钥泄露的风险。",
        impact: "如果API密钥泄露，攻击者可能获得对API的完全访问权限。",
        remediation: "实施API密钥自动轮换机制，并确保密钥至少每90天更新一次。",
        createdAt: new Date().toISOString(),
        status: "open",
      },
      {
        id: "issue-2",
        configId: selectedConfigId,
        severity: "high",
        category: "data",
        title: "敏感数据未加密传输",
        description: "API请求中的敏感数据未使用加密传输，可能被中间人攻击截获。",
        impact: "敏感信息可能在传输过程中被窃取，导致数据泄露。",
        remediation: "确保所有API通信使用HTTPS，并实施TLS 1.3或更高版本。",
        createdAt: new Date().toISOString(),
        status: "open",
      },
      {
        id: "issue-3",
        configId: selectedConfigId,
        severity: "medium",
        category: "authorization",
        title: "缺少细粒度访问控制",
        description: "API缺少基于角色的访问控制(RBAC)，所有认证用户拥有相同的访问权限。",
        impact: "用户可能访问到超出其权限范围的数据或功能。",
        remediation: "实施RBAC系统，根据用户角色限制API访问权限。",
        createdAt: new Date().toISOString(),
        status: "open",
      },
      {
        id: "issue-4",
        configId: selectedConfigId,
        severity: "low",
        category: "configuration",
        title: "缺少请求速率限制",
        description: "API未实施请求速率限制，可能导致资源耗尽。",
        impact: "攻击者可能通过大量请求导致服务不可用(DoS)。",
        remediation: "实施基于IP和用户的请求速率限制。",
        createdAt: new Date().toISOString(),
        status: "open",
      },
      {
        id: "issue-5",
        configId: selectedConfigId,
        severity: "info",
        category: "other",
        title: "缺少API文档",
        description: "API缺少完整的安全文档，包括认证和授权机制的说明。",
        impact: "开发人员可能错误实施安全措施，增加安全风险。",
        remediation: "创建全面的API安全文档，包括所有安全机制的详细说明。",
        createdAt: new Date().toISOString(),
        status: "open",
      },
    ]

    setSecurityIssues(mockIssues)

    // 计算安全评分
    const severityWeights = {
      critical: 10,
      high: 5,
      medium: 3,
      low: 1,
      info: 0,
    }

    const totalWeight = mockIssues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0)
    const maxPossibleWeight = 5 * severityWeights.critical // 假设最差情况是5个严重问题
    const score = Math.max(0, Math.min(100, Math.round(100 - (totalWeight / maxPossibleWeight) * 100)))

    setSecurityScore(score)

    toast({
      title: "安全分析完成",
      description: `发现 ${mockIssues.length} 个安全问题，安全评分: ${score}/100`,
    })
  }

  // 更新问题状态
  const updateIssueStatus = (issueId: string, status: SecurityIssue["status"]) => {
    setSecurityIssues((issues) => issues.map((issue) => (issue.id === issueId ? { ...issue, status } : issue)))

    toast({
      title: "状态已更新",
      description: `问题状态已更新为: ${
        status === "open" ? "待处理" : status === "in_progress" ? "处理中" : status === "resolved" ? "已解决" : "已忽略"
      }`,
    })
  }

  // 筛选问题
  const filteredIssues = securityIssues.filter((issue) => {
    const matchesSeverity = filterSeverity === "all" || issue.severity === filterSeverity
    const matchesCategory = filterCategory === "all" || issue.category === filterCategory
    const matchesStatus = filterStatus === "all" || issue.status === filterStatus
    return matchesSeverity && matchesCategory && matchesStatus
  })

  // 获取安全评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    if (score >= 50) return "text-orange-500"
    return "text-red-500"
  }

  // 获取严重性标签
  const getSeverityBadge = (severity: SecurityIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">严重</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">高危</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">中危</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">低危</Badge>
      case "info":
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">信息</Badge>
    }
  }

  // 获取分类标签
  const getCategoryBadge = (category: SecurityIssue["category"]) => {
    switch (category) {
      case "authentication":
        return <Badge variant="outline">认证</Badge>
      case "authorization":
        return <Badge variant="outline">授权</Badge>
      case "data":
        return <Badge variant="outline">数据安全</Badge>
      case "configuration":
        return <Badge variant="outline">配置</Badge>
      case "other":
        return <Badge variant="outline">其他</Badge>
    }
  }

  // 获取状态标签
  const getStatusBadge = (status: SecurityIssue["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">待处理</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">处理中</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">已解决</Badge>
      case "ignored":
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">已忽略</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API安全分析</h2>
        <p className="text-muted-foreground">分析API配置中的安全问题并提供修复建议</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="w-full md:w-64">
          <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
            <SelectTrigger>
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <TechButton
            variant="primary"
            depth="3d"
            glow="soft"
            icon={<Shield className="h-4 w-4" />}
            onClick={startAnalysis}
            disabled={!selectedConfigId || isAnalyzing}
          >
            开始安全分析
          </TechButton>

          <TechButton
            variant="outline"
            depth="flat"
            icon={<RefreshCw className="h-4 w-4" />}
            disabled={!selectedConfigId || isAnalyzing}
            onClick={() => {
              setSecurityIssues([])
              setSecurityScore(0)
            }}
          >
            重置结果
          </TechButton>

          <TechButton
            variant="outline"
            depth="flat"
            icon={<Download className="h-4 w-4" />}
            disabled={securityIssues.length === 0}
            onClick={() => {
              const report = {
                configId: selectedConfigId,
                configName: configs.find((c) => c.id === selectedConfigId)?.name,
                score: securityScore,
                issues: securityIssues,
                generatedAt: new Date().toISOString(),
              }

              const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `security-report-${new Date().toISOString().slice(0, 10)}.json`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)

              toast({
                title: "报告已导出",
                description: "安全分析报告已成功导出",
              })
            }}
          >
            导出报告
          </TechButton>

          <TechButton
            variant="outline"
            depth="flat"
            icon={<ExternalLink className="h-4 w-4" />}
            disabled={securityIssues.length === 0}
          >
            分享报告
          </TechButton>
        </div>
      </div>

      {isAnalyzing && (
        <TechCard variant="glass" border="tech" contentClassName="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>正在分析API安全性...</span>
              <span>{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} />
          </div>
        </TechCard>
      )}

      {securityScore > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">安全评分</h3>
              <div className={`text-4xl font-bold ${getScoreColor(securityScore)}`}>{securityScore}/100</div>
              <div className="mt-2">
                {securityScore >= 90 ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    优秀
                  </Badge>
                ) : securityScore >= 70 ? (
                  <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    良好
                  </Badge>
                ) : securityScore >= 50 ? (
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    一般
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="h-3 w-3 mr-1" />
                    风险
                  </Badge>
                )}
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">严重问题</p>
                <h3 className="text-2xl font-bold mt-1">
                  {securityIssues.filter((i) => i.severity === "critical").length}
                </h3>
              </div>
              <div className="bg-red-100/50 dark:bg-red-900/30 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">高危问题</p>
                <h3 className="text-2xl font-bold mt-1">
                  {securityIssues.filter((i) => i.severity === "high").length}
                </h3>
              </div>
              <div className="bg-orange-100/50 dark:bg-orange-900/30 p-2 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </TechCard>

          <TechCard variant="glass" border="tech" contentClassName="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总问题数</p>
                <h3 className="text-2xl font-bold mt-1">{securityIssues.length}</h3>
              </div>
              <div className="bg-techblue-100/50 dark:bg-techblue-900/30 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-techblue-500" />
              </div>
            </div>
          </TechCard>
        </div>
      )}

      {securityIssues.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-4 bg-techblue-100/50 dark:bg-techblue-800/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              概览
            </TabsTrigger>
            <TabsTrigger value="issues" className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white">
              安全问题
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="data-[state=active]:bg-techblue-500 data-[state=active]:text-white"
            >
              修复建议
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <TechCard variant="panel" title="安全评估概览" description="API安全状况总体评估" glow="subtle">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">安全评分详情</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">认证安全</span>
                          <span className="text-sm">
                            {securityIssues.some((i) => i.category === "authentication" && i.severity === "critical")
                              ? "60%"
                              : "85%"}
                          </span>
                        </div>
                        <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-techblue-500 rounded-full"
                            style={{
                              width: securityIssues.some(
                                (i) => i.category === "authentication" && i.severity === "critical",
                              )
                                ? "60%"
                                : "85%",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">授权控制</span>
                          <span className="text-sm">
                            {securityIssues.some(
                              (i) =>
                                i.category === "authorization" && (i.severity === "critical" || i.severity === "high"),
                            )
                              ? "70%"
                              : "90%"}
                          </span>
                        </div>
                        <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-techblue-500 rounded-full"
                            style={{
                              width: securityIssues.some(
                                (i) =>
                                  i.category === "authorization" &&
                                  (i.severity === "critical" || i.severity === "high"),
                              )
                                ? "70%"
                                : "90%",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">数据安全</span>
                          <span className="text-sm">
                            {securityIssues.some((i) => i.category === "data" && i.severity === "high") ? "65%" : "95%"}
                          </span>
                        </div>
                        <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-techblue-500 rounded-full"
                            style={{
                              width: securityIssues.some((i) => i.category === "data" && i.severity === "high")
                                ? "65%"
                                : "95%",
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">配置安全</span>
                          <span className="text-sm">
                            {securityIssues.some((i) => i.category === "configuration") ? "80%" : "100%"}
                          </span>
                        </div>
                        <div className="h-2 bg-techblue-100 dark:bg-techblue-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-techblue-500 rounded-full"
                            style={{
                              width: securityIssues.some((i) => i.category === "configuration") ? "80%" : "100%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-4">问题分布</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <span>认证问题</span>
                        </div>
                        <span className="font-medium">
                          {securityIssues.filter((i) => i.category === "authentication").length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                          <span>授权问题</span>
                        </div>
                        <span className="font-medium">
                          {securityIssues.filter((i) => i.category === "authorization").length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span>数据安全问题</span>
                        </div>
                        <span className="font-medium">
                          {securityIssues.filter((i) => i.category === "data").length}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-techblue-200 dark:border-techblue-800 rounded-md">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span>配置问题</span>
                        </div>
                        <span className="font-medium">
                          {securityIssues.filter((i) => i.category === "configuration").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">主要安全风险</h3>
                  <div className="space-y-3">
                    {securityIssues
                      .filter((issue) => issue.severity === "critical" || issue.severity === "high")
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="p-3 border border-techblue-200 dark:border-techblue-800 rounded-md"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              {issue.severity === "critical" ? (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                              )}
                            </div>
                            <div className="ml-3">
                              <div className="flex items-center">
                                <h4 className="font-medium">{issue.title}</h4>
                                <div className="ml-2">{getSeverityBadge(issue.severity)}</div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="issues">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div className="flex flex-wrap gap-2">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="严重性" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有严重性</SelectItem>
                    <SelectItem value="critical">严重</SelectItem>
                    <SelectItem value="high">高危</SelectItem>
                    <SelectItem value="medium">中危</SelectItem>
                    <SelectItem value="low">低危</SelectItem>
                    <SelectItem value="info">信息</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="问题类别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类别</SelectItem>
                    <SelectItem value="authentication">认证</SelectItem>
                    <SelectItem value="authorization">授权</SelectItem>
                    <SelectItem value="data">数据安全</SelectItem>
                    <SelectItem value="configuration">配置</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="open">待处理</SelectItem>
                    <SelectItem value="in_progress">处理中</SelectItem>
                    <SelectItem value="resolved">已解决</SelectItem>
                    <SelectItem value="ignored">已忽略</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                显示 {filteredIssues.length} 个问题，共 {securityIssues.length} 个
              </div>
            </div>

            <TechCard variant="panel" title="安全问题列表" description="发现的API安全问题详情" glow="subtle">
              <div className="space-y-4">
                {filteredIssues.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">没有找到匹配的安全问题</div>
                ) : (
                  filteredIssues.map((issue) => (
                    <div key={issue.id} className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-medium">{issue.title}</h4>
                            {getSeverityBadge(issue.severity)}
                            {getCategoryBadge(issue.category)}
                            {getStatusBadge(issue.status)}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>

                          <div className="space-y-2">
                            <div>
                              <h5 className="text-sm font-medium">影响:</h5>
                              <p className="text-sm text-muted-foreground">{issue.impact}</p>
                            </div>

                            <div>
                              <h5 className="text-sm font-medium">修复建议:</h5>
                              <p className="text-sm text-muted-foreground">{issue.remediation}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 mt-2 md:mt-0">
                          <Select
                            value={issue.status}
                            onValueChange={(value: SecurityIssue["status"]) => updateIssueStatus(issue.id, value)}
                          >
                            <SelectTrigger className="w-full md:w-36">
                              <SelectValue placeholder="更新状态" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">待处理</SelectItem>
                              <SelectItem value="in_progress">处理中</SelectItem>
                              <SelectItem value="resolved">已解决</SelectItem>
                              <SelectItem value="ignored">已忽略</SelectItem>
                            </SelectContent>
                          </Select>

                          <TechButton variant="outline" depth="flat" size="sm" className="w-full">
                            查看详情
                          </TechButton>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TechCard>
          </TabsContent>

          <TabsContent value="recommendations">
            <TechCard variant="panel" title="安全修复建议" description="针对发现的安全问题的修复建议" glow="subtle">
              <div className="space-y-6">
                <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center mb-2">
                    <Lock className="h-5 w-5 text-techblue-500 mr-2" />
                    <h4 className="font-medium">认证安全增强</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">增强API认证机制，防止未授权访问和凭证泄露风险。</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>实施API密钥自动轮换机制，确保密钥至少每90天更新一次</li>
                      <li>使用强密码策略，要求至少12个字符，包含大小写字母、数字和特殊字符</li>
                      <li>实施多因素认证(MFA)，特别是对于管理员账户</li>
                      <li>限制失败登录尝试次数，防止暴力破解攻击</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center mb-2">
                    <Key className="h-5 w-5 text-techblue-500 mr-2" />
                    <h4 className="font-medium">授权控制优化</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      优化API授权控制，确保用户只能访问其权限范围内的资源。
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>实施基于角色的访问控制(RBAC)，根据用户角色限制API访问权限</li>
                      <li>使用最小权限原则，只授予用户完成任务所需的最小权限</li>
                      <li>实施API访问审计日志，记录所有API访问和操作</li>
                      <li>定期审查用户权限，移除不必要的访问权限</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center mb-2">
                    <Shield className="h-5 w-5 text-techblue-500 mr-2" />
                    <h4 className="font-medium">数据安全保护</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      加强数据传输和存储的安全性，防止数据泄露和未授权访问。
                    </p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>确保所有API通信使用HTTPS，并实施TLS 1.3或更高版本</li>
                      <li>对敏感数据进行加密存储，使用行业标准的加密算法</li>
                      <li>实施数据脱敏技术，减少敏感信息的暴露</li>
                      <li>定期进行数据备份，并测试恢复流程</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-techblue-200 dark:border-techblue-800 rounded-md bg-techblue-50/30 dark:bg-techblue-900/30">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 text-techblue-500 mr-2" />
                    <h4 className="font-medium">安全文档和培训</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">完善API安全文档，提高开发团队的安全意识。</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>创建全面的API安全文档，包括所有安全机制的详细说明</li>
                      <li>为开发团队提供定期的安全培训，提高安全意识</li>
                      <li>建立安全编码规范，确保代码安全性</li>
                      <li>定期进行安全审计和渗透测试，及时发现和修复安全问题</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TechCard>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
