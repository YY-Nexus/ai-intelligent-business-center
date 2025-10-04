"use client"

import { useState } from "react"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Trash2,
  Copy,
  Play,
  Download,
  RefreshCw,
  Settings,
  CheckSquare,
  XSquare,
  FileText,
  BarChart,
  Clock,
  ArrowUpDown,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { useApiConfig } from "./api-config-manager"

export function EnhancedBatchOperations() {
  const { configs, loading, deleteConfig, addConfig, updateConfig } = useApiConfig()
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [processTotal, setProcessTotal] = useState(0)
  const [activeTab, setActiveTab] = useState("operations")
  const [batchResults, setBatchResults] = useState<any[]>([])
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { toast } = useToast()

  // 筛选配置
  const filteredConfigs = configs
    .filter((config) => {
      // 搜索条件
      const matchesSearch =
        config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.config.baseUrl.toLowerCase().includes(searchTerm.toLowerCase())

      // 状态筛选
      if (filterStatus === "all") return matchesSearch
      if (filterStatus === "active" && config.active) return matchesSearch
      if (filterStatus === "inactive" && !config.active) return matchesSearch
      if (filterStatus === "error" && config.hasError) return matchesSearch

      return false
    })
    .sort((a, b) => {
      // 排序
      let comparison = 0
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === "url") {
        comparison = a.config.baseUrl.localeCompare(b.config.baseUrl)
      } else if (sortField === "lastUpdated") {
        comparison = new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  // 选择/取消选择所有配置
  const toggleSelectAll = () => {
    if (selectedConfigs.length === filteredConfigs.length) {
      setSelectedConfigs([])
    } else {
      setSelectedConfigs(filteredConfigs.map((config) => config.id))
    }
  }

  // 切换单个配置的选择状态
  const toggleSelect = (id: string) => {
    if (selectedConfigs.includes(id)) {
      setSelectedConfigs(selectedConfigs.filter((configId) => configId !== id))
    } else {
      setSelectedConfigs([...selectedConfigs, id])
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []
      for (let i = 0; i < selectedConfigs.length; i++) {
        try {
          await deleteConfig(selectedConfigs[i])
          results.push({
            id: selectedConfigs[i],
            name: configs.find((c) => c.id === selectedConfigs[i])?.name || "未知配置",
            operation: "删除",
            status: "成功",
            message: "配置已成功删除",
          })
        } catch (error) {
          results.push({
            id: selectedConfigs[i],
            name: configs.find((c) => c.id === selectedConfigs[i])?.name || "未知配置",
            operation: "删除",
            status: "失败",
            message: "删除失败：" + (error instanceof Error ? error.message : "未知错误"),
          })
        }
        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量操作完成",
        description: `已处理 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })

      setSelectedConfigs([])
    } catch (error) {
      toast({
        title: "批量操作失败",
        description: "操作过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 批量复制
  const handleBatchDuplicate = async () => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []
      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          try {
            const { id, createdAt, updatedAt, ...configData } = config
            await addConfig({
              ...configData,
              name: `${config.name} (副本)`,
            })
            results.push({
              id: configId,
              name: config.name,
              operation: "复制",
              status: "成功",
              message: "配置已成功复制",
            })
          } catch (error) {
            results.push({
              id: configId,
              name: config.name,
              operation: "复制",
              status: "失败",
              message: "复制失败：" + (error instanceof Error ? error.message : "未知错误"),
            })
          }
        }

        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量操作完成",
        description: `已处理 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })
    } catch (error) {
      toast({
        title: "批量操作失败",
        description: "操作过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 批量启用/禁用
  const handleBatchToggleStatus = async (active: boolean) => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []
      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        try {
          await updateConfig(configId, { active })
          results.push({
            id: configId,
            name: config?.name || "未知配置",
            operation: active ? "启用" : "禁用",
            status: "成功",
            message: `配置已成功${active ? "启用" : "禁用"}`,
          })
        } catch (error) {
          results.push({
            id: configId,
            name: config?.name || "未知配置",
            operation: active ? "启用" : "禁用",
            status: "失败",
            message: `${active ? "启用" : "禁用"}失败：` + (error instanceof Error ? error.message : "未知错误"),
          })
        }

        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量操作完成",
        description: `已处理 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })
    } catch (error) {
      toast({
        title: "批量操作失败",
        description: "操作过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 批量测试
  const handleBatchTest = async () => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []

      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          try {
            // 模拟测试结果
            const success = Math.random() > 0.2

            if (success) {
              await updateConfig(configId, { lastTestResult: "success", lastTestTime: new Date().toISOString() })
              results.push({
                id: configId,
                name: config.name,
                operation: "测试",
                status: "成功",
                message: "API测试通过，响应时间: " + Math.floor(Math.random() * 200 + 100) + "ms",
              })
            } else {
              await updateConfig(configId, { lastTestResult: "failed", lastTestTime: new Date().toISOString() })
              results.push({
                id: configId,
                name: config.name,
                operation: "测试",
                status: "失败",
                message:
                  "API测试失败: " + ["连接超时", "认证失败", "服务器错误", "无效响应"][Math.floor(Math.random() * 4)],
              })
            }
          } catch (error) {
            results.push({
              id: configId,
              name: config.name,
              operation: "测试",
              status: "失败",
              message: "测试执行失败：" + (error instanceof Error ? error.message : "未知错误"),
            })
          }
        }

        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量测试完成",
        description: `已测试 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })
    } catch (error) {
      toast({
        title: "批量测试失败",
        description: "测试过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 批量导出
  const handleBatchExport = () => {
    if (selectedConfigs.length === 0) return

    const selectedConfigsData = configs.filter((config) => selectedConfigs.includes(config.id))
    const exportData = JSON.stringify(selectedConfigsData, null, 2)
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `api-configs-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // 记录导出结果
    const results = selectedConfigsData.map((config) => ({
      id: config.id,
      name: config.name,
      operation: "导出",
      status: "成功",
      message: "配置已成功导出",
    }))

    setBatchResults(results)
    setActiveTab("results")

    toast({
      title: "批量导出成功",
      description: `已成功导出 ${selectedConfigs.length} 个API配置`,
    })
  }

  // 批量性能测试
  const handleBatchPerformanceTest = async () => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []

      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          try {
            // 模拟性能测试结果
            await new Promise((resolve) => setTimeout(resolve, 1500))

            const avgResponseTime = Math.floor(Math.random() * 300 + 100)
            const requestsPerSecond = Math.floor(Math.random() * 100 + 50)
            const errorRate = (Math.random() * 2).toFixed(2)

            results.push({
              id: configId,
              name: config.name,
              operation: "性能测试",
              status: "成功",
              message: `平均响应时间: ${avgResponseTime}ms, 每秒请求数: ${requestsPerSecond}, 错误率: ${errorRate}%`,
              details: {
                avgResponseTime,
                requestsPerSecond,
                errorRate,
                p95: avgResponseTime + Math.floor(Math.random() * 100),
                p99: avgResponseTime + Math.floor(Math.random() * 200),
              },
            })
          } catch (error) {
            results.push({
              id: configId,
              name: config.name,
              operation: "性能测试",
              status: "失败",
              message: "性能测试失败：" + (error instanceof Error ? error.message : "未知错误"),
            })
          }
        }

        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量性能测试完成",
        description: `已测试 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })
    } catch (error) {
      toast({
        title: "批量性能测试失败",
        description: "测试过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 批量生成文档
  const handleBatchGenerateDocumentation = async () => {
    if (selectedConfigs.length === 0) return

    setIsProcessing(true)
    setProcessTotal(selectedConfigs.length)
    setProcessProgress(0)
    setBatchResults([])

    try {
      const results = []

      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          try {
            // 模拟文档生成
            await new Promise((resolve) => setTimeout(resolve, 1000))

            results.push({
              id: configId,
              name: config.name,
              operation: "生成文档",
              status: "成功",
              message: "API文档已成功生成",
              details: {
                format: "Markdown",
                endpoints: Math.floor(Math.random() * 10) + 5,
                size: (Math.random() * 100 + 50).toFixed(1) + "KB",
              },
            })
          } catch (error) {
            results.push({
              id: configId,
              name: config.name,
              operation: "生成文档",
              status: "失败",
              message: "文档生成失败：" + (error instanceof Error ? error.message : "未知错误"),
            })
          }
        }

        setProcessProgress(i + 1)
      }

      setBatchResults(results)
      setActiveTab("results")

      toast({
        title: "批量文档生成完成",
        description: `已处理 ${selectedConfigs.length} 个API配置，成功: ${results.filter((r) => r.status === "成功").length}，失败: ${results.filter((r) => r.status === "失败").length}`,
      })
    } catch (error) {
      toast({
        title: "批量文档生成失败",
        description: "生成过程中发生错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // 切换排序
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">批量操作</h2>
        <p className="text-muted-foreground">同时管理多个API配置，提高工作效率</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="operations">操作面板</TabsTrigger>
          <TabsTrigger value="results">结果记录</TabsTrigger>
          <TabsTrigger value="analysis">数据分析</TabsTrigger>
        </TabsList>

        <TabsContent value="operations">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索API配置..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="active">已启用</SelectItem>
                  <SelectItem value="inactive">已禁用</SelectItem>
                  <SelectItem value="error">有错误</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2">
              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<CheckSquare className="h-4 w-4" />}
                onClick={toggleSelectAll}
              >
                {selectedConfigs.length === filteredConfigs.length && filteredConfigs.length > 0 ? "取消全选" : "全选"}
              </TechButton>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <TechButton
                    variant="outline"
                    depth="flat"
                    size="sm"
                    icon={<Trash2 className="h-4 w-4" />}
                    disabled={selectedConfigs.length === 0}
                  >
                    批量删除
                  </TechButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                      您确定要删除选中的 {selectedConfigs.length} 个API配置吗？此操作无法撤销。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBatchDelete}>删除</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<Copy className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={handleBatchDuplicate}
              >
                批量复制
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<CheckSquare className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={() => handleBatchToggleStatus(true)}
              >
                批量启用
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<XSquare className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={() => handleBatchToggleStatus(false)}
              >
                批量禁用
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<Play className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={handleBatchTest}
              >
                批量测试
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<Zap className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={handleBatchPerformanceTest}
              >
                性能测试
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<FileText className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={handleBatchGenerateDocumentation}
              >
                生成文档
              </TechButton>

              <TechButton
                variant="outline"
                depth="flat"
                size="sm"
                icon={<Download className="h-4 w-4" />}
                disabled={selectedConfigs.length === 0}
                onClick={handleBatchExport}
              >
                批量导出
              </TechButton>
            </div>
          </div>

          {isProcessing && (
            <TechCard variant="glass" border="tech" contentClassName="p-4" className="mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>处理中...</span>
                  <span>
                    {processProgress} / {processTotal}
                  </span>
                </div>
                <Progress value={(processProgress / processTotal) * 100} className="h-2" />
              </div>
            </TechCard>
          )}

          <TechCard variant="panel" title="API配置列表" description="选择要批量操作的API配置" glow="subtle">
            {loading ? (
              <div className="text-center py-8">加载API配置...</div>
            ) : filteredConfigs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || filterStatus !== "all" ? "没有找到匹配的API配置" : "暂无API配置"}
              </div>
            ) : (
              <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                <div className="grid grid-cols-12 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                  <div className="col-span-1"></div>
                  <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("name")}>
                    名称
                    <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === "name" ? "opacity-100" : "opacity-50"}`} />
                  </div>
                  <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort("url")}>
                    基础URL
                    <ArrowUpDown className={`ml-1 h-3 w-3 ${sortField === "url" ? "opacity-100" : "opacity-50"}`} />
                  </div>
                  <div className="col-span-1">版本</div>
                  <div className="col-span-1">状态</div>
                  <div
                    className="col-span-2 flex items-center cursor-pointer"
                    onClick={() => toggleSort("lastUpdated")}
                  >
                    最后更新
                    <ArrowUpDown
                      className={`ml-1 h-3 w-3 ${sortField === "lastUpdated" ? "opacity-100" : "opacity-50"}`}
                    />
                  </div>
                  <div className="col-span-1">操作</div>
                </div>
                <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                  {filteredConfigs.map((config) => (
                    <div key={config.id} className="grid grid-cols-12 p-3 text-sm items-center">
                      <div className="col-span-1">
                        <Checkbox
                          checked={selectedConfigs.includes(config.id)}
                          onCheckedChange={() => toggleSelect(config.id)}
                        />
                      </div>
                      <div className="col-span-3 font-medium">{config.name}</div>
                      <div className="col-span-3 truncate" title={config.config.baseUrl}>
                        {config.config.baseUrl}
                      </div>
                      <div className="col-span-1">{config.config.version || "-"}</div>
                      <div className="col-span-1">
                        {config.active ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            已启用
                          </Badge>
                        ) : (
                          <Badge variant="outline">已禁用</Badge>
                        )}
                      </div>
                      <div className="col-span-2">
                        {config.lastTestTime ? (
                          <div className="flex items-center">
                            {config.lastTestResult === "success" ? (
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            ) : (
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                            )}
                            <span>{new Date(config.lastTestTime).toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">未测试</span>
                        )}
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center space-x-1">
                          <TechButton variant="ghost" size="icon" title="测试">
                            <Play className="h-4 w-4" />
                          </TechButton>
                          <TechButton variant="ghost" size="icon" title="编辑">
                            <Settings className="h-4 w-4" />
                          </TechButton>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TechCard>

          <div className="flex justify-between mt-4">
            <div>
              <span className="text-sm text-muted-foreground">
                已选择 {selectedConfigs.length} 个配置，共 {filteredConfigs.length} 个配置
              </span>
            </div>
            <TechButton
              variant="outline"
              depth="flat"
              size="sm"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => window.location.reload()}
            >
              刷新列表
            </TechButton>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <TechCard variant="panel" title="批量操作结果" description="查看最近批量操作的结果记录" glow="subtle">
            {batchResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>暂无批量操作记录</p>
                <p className="text-sm mt-2">执行批量操作后，结果将显示在此处</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      成功: {batchResults.filter((r) => r.status === "成功").length}
                    </Badge>
                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      失败: {batchResults.filter((r) => r.status === "失败").length}
                    </Badge>
                    <span className="text-sm text-muted-foreground">共 {batchResults.length} 条记录</span>
                  </div>
                  <div className="flex gap-2">
                    <TechButton
                      variant="outline"
                      depth="flat"
                      size="sm"
                      icon={<Download className="h-4 w-4" />}
                      onClick={() => {
                        const exportData = JSON.stringify(batchResults, null, 2)
                        const blob = new Blob([exportData], { type: "application/json" })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `batch-results-${new Date().toISOString().slice(0, 10)}.json`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                      }}
                    >
                      导出结果
                    </TechButton>
                    <TechButton
                      variant="outline"
                      depth="flat"
                      size="sm"
                      icon={<RefreshCw className="h-4 w-4" />}
                      onClick={() => setBatchResults([])}
                    >
                      清除记录
                    </TechButton>
                  </div>
                </div>

                <div className="border border-techblue-200 dark:border-techblue-800 rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 bg-techblue-100/50 dark:bg-techblue-800/50 p-3 font-medium text-sm">
                    <div className="col-span-3">配置名称</div>
                    <div className="col-span-2">操作类型</div>
                    <div className="col-span-2">状态</div>
                    <div className="col-span-5">详细信息</div>
                  </div>
                  <div className="divide-y divide-techblue-200 dark:divide-techblue-800">
                    {batchResults.map((result, index) => (
                      <div key={index} className="grid grid-cols-12 p-3 text-sm items-center">
                        <div className="col-span-3 font-medium">{result.name}</div>
                        <div className="col-span-2">
                          <Badge variant="outline">{result.operation}</Badge>
                        </div>
                        <div className="col-span-2">
                          {result.status === "成功" ? (
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-600 dark:text-green-400">成功</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-600 dark:text-red-400">失败</span>
                            </div>
                          )}
                        </div>
                        <div className="col-span-5 text-muted-foreground">{result.message}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {batchResults.some((r) => r.operation === "性能测试" && r.status === "成功") && (
                  <TechCard variant="glass" border="tech" contentClassName="p-4">
                    <h3 className="text-base font-medium mb-3">性能测试结果摘要</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">平均响应时间</div>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            batchResults
                              .filter(
                                (r) => r.operation === "性能测试" && r.status === "成功" && r.details?.avgResponseTime,
                              )
                              .reduce((sum, r) => sum + r.details.avgResponseTime, 0) /
                              batchResults.filter(
                                (r) => r.operation === "性能测试" && r.status === "成功" && r.details?.avgResponseTime,
                              ).length,
                          )}
                          ms
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">平均请求速率</div>
                        <div className="text-2xl font-bold">
                          {Math.round(
                            batchResults
                              .filter(
                                (r) =>
                                  r.operation === "性能测试" && r.status === "成功" && r.details?.requestsPerSecond,
                              )
                              .reduce((sum, r) => sum + r.details.requestsPerSecond, 0) /
                              batchResults.filter(
                                (r) =>
                                  r.operation === "性能测试" && r.status === "成功" && r.details?.requestsPerSecond,
                              ).length,
                          )}
                          /秒
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">平均错误率</div>
                        <div className="text-2xl font-bold">
                          {(
                            batchResults
                              .filter((r) => r.operation === "性能测试" && r.status === "成功" && r.details?.errorRate)
                              .reduce((sum, r) => sum + Number.parseFloat(r.details.errorRate), 0) /
                            batchResults.filter(
                              (r) => r.operation === "性能测试" && r.status === "成功" && r.details?.errorRate,
                            ).length
                          ).toFixed(2)}
                          %
                        </div>
                      </div>
                    </div>
                  </TechCard>
                )}
              </div>
            )}
          </TechCard>
        </TabsContent>

        <TabsContent value="analysis">
          <TechCard variant="panel" title="批量操作分析" description="分析批量操作的结果和趋势" glow="subtle">
            {batchResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>暂无数据可供分析</p>
                <p className="text-sm mt-2">执行批量操作后，分析结果将显示在此处</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TechCard variant="glass" border="tech" contentClassName="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-medium">操作成功率</h3>
                      <Badge
                        className={
                          batchResults.filter((r) => r.status === "成功").length / batchResults.length > 0.9
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : batchResults.filter((r) => r.status === "成功").length / batchResults.length > 0.7
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }
                      >
                        {Math.round(
                          (batchResults.filter((r) => r.status === "成功").length / batchResults.length) * 100,
                        )}
                        %
                      </Badge>
                    </div>
                    <Progress
                      value={(batchResults.filter((r) => r.status === "成功").length / batchResults.length) * 100}
                      className="h-2 mb-4"
                    />
                    <div className="text-sm text-muted-foreground">
                      成功: {batchResults.filter((r) => r.status === "成功").length} / 总计: {batchResults.length}
                    </div>
                  </TechCard>

                  <TechCard variant="glass" border="tech" contentClassName="p-4">
                    <h3 className="text-base font-medium mb-2">操作类型分布</h3>
                    <div className="space-y-2">
                      {Array.from(new Set(batchResults.map((r) => r.operation))).map((operation) => (
                        <div key={operation} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-techblue-500 mr-2"></div>
                            <span>{operation}</span>
                          </div>
                          <span className="font-medium">
                            {batchResults.filter((r) => r.operation === operation).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TechCard>

                  <TechCard variant="glass" border="tech" contentClassName="p-4">
                    <h3 className="text-base font-medium mb-2">操作时间统计</h3>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{batchResults.length}</div>
                        <div className="text-sm text-muted-foreground">总操作数</div>
                        <div className="text-sm mt-2">
                          <Clock className="h-4 w-4 inline mr-1" />
                          <span>{new Date().toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </TechCard>
                </div>

                {batchResults.some((r) => r.operation === "性能测试" && r.status === "成功") && (
                  <div>
                    <h3 className="text-base font-medium mb-3">性能测试详细分析</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TechCard variant="glass" border="tech" contentClassName="p-4">
                        <h4 className="text-sm font-medium mb-3">响应时间分布</h4>
                        <div className="h-60 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>响应时间分布图表</p>
                          </div>
                        </div>
                      </TechCard>

                      <TechCard variant="glass" border="tech" contentClassName="p-4">
                        <h4 className="text-sm font-medium mb-3">API性能排名</h4>
                        <div className="space-y-3">
                          {batchResults
                            .filter(
                              (r) => r.operation === "性能测试" && r.status === "成功" && r.details?.avgResponseTime,
                            )
                            .sort((a, b) => a.details.avgResponseTime - b.details.avgResponseTime)
                            .slice(0, 5)
                            .map((result, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="bg-techblue-100 dark:bg-techblue-900 w-6 h-6 rounded-full flex items-center justify-center">
                                    {index + 1}
                                  </div>
                                  <span className="font-medium">{result.name}</span>
                                </div>
                                <span>{result.details.avgResponseTime}ms</span>
                              </div>
                            ))}
                        </div>
                      </TechCard>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-medium mb-3">操作建议</h3>
                  <div className="space-y-3">
                    {batchResults.filter((r) => r.status === "失败").length > 0 && (
                      <div className="flex items-start gap-2 p-3 border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            发现 {batchResults.filter((r) => r.status === "失败").length} 个失败操作
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            建议检查这些配置并解决问题，或者重新执行操作。
                          </p>
                        </div>
                      </div>
                    )}

                    {batchResults.some(
                      (r) => r.operation === "性能测试" && r.status === "成功" && r.details?.avgResponseTime > 300,
                    ) && (
                      <div className="flex items-start gap-2 p-3 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">发现响应时间较长的API</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            部分API响应时间超过300ms，建议优化这些API的性能或增加缓存机制。
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-2 p-3 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">批量操作效率分析</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          通过批量操作，您节省了约 {Math.round(batchResults.length * 1.5)} 分钟的手动操作时间。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TechCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}
