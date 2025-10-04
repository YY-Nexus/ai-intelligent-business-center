"use client"

import { useState } from "react"
import { TechCard } from "@/components/ui/tech-card"
import { TechButton } from "@/components/ui/tech-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
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
import { Search, Trash2, Copy, Play, Download, RefreshCw, Settings, CheckSquare, XSquare } from "lucide-react"
import { useApiConfig } from "./api-config-manager"

export function ApiBatchOperations() {
  const { configs, loading, deleteConfig, addConfig, updateConfig } = useApiConfig()
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState(0)
  const [processTotal, setProcessTotal] = useState(0)
  const { toast } = useToast()

  // 筛选配置
  const filteredConfigs = configs.filter((config) => {
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

    try {
      for (let i = 0; i < selectedConfigs.length; i++) {
        await deleteConfig(selectedConfigs[i])
        setProcessProgress(i + 1)
      }

      toast({
        title: "批量删除成功",
        description: `已成功删除 ${selectedConfigs.length} 个API配置`,
      })

      setSelectedConfigs([])
    } catch (error) {
      toast({
        title: "批量删除失败",
        description: "部分API配置删除失败，请重试",
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

    try {
      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          const { id, createdAt, updatedAt, ...configData } = config
          await addConfig({
            ...configData,
            name: `${config.name} (副本)`,
          })
        }

        setProcessProgress(i + 1)
      }

      toast({
        title: "批量复制成功",
        description: `已成功复制 ${selectedConfigs.length} 个API配置`,
      })
    } catch (error) {
      toast({
        title: "批量复制失败",
        description: "部分API配置复制失败，请重试",
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

    try {
      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        await updateConfig(configId, { active })
        setProcessProgress(i + 1)
      }

      toast({
        title: active ? "批量启用成功" : "批量禁用成功",
        description: `已成功${active ? "启用" : "禁用"} ${selectedConfigs.length} 个API配置`,
      })
    } catch (error) {
      toast({
        title: active ? "批量启用失败" : "批量禁用失败",
        description: "操作失败，请重试",
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

    try {
      const results = {
        success: 0,
        failed: 0,
      }

      for (let i = 0; i < selectedConfigs.length; i++) {
        const configId = selectedConfigs[i]
        const config = configs.find((c) => c.id === configId)

        if (config) {
          try {
            // 这里应该调用实际的测试API
            // 模拟测试结果
            const success = Math.random() > 0.2
            if (success) {
              results.success++
              await updateConfig(configId, { lastTestResult: "success", lastTestTime: new Date().toISOString() })
            } else {
              results.failed++
              await updateConfig(configId, { lastTestResult: "failed", lastTestTime: new Date().toISOString() })
            }
          } catch (e) {
            results.failed++
          }
        }

        setProcessProgress(i + 1)
      }

      toast({
        title: "批量测试完成",
        description: `测试结果: ${results.success} 成功, ${results.failed} 失败`,
        variant: results.failed > 0 ? "default" : "default",
      })
    } catch (error) {
      toast({
        title: "批量测试失败",
        description: "操作失败，请重试",
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

    toast({
      title: "批量导出成功",
      description: `已成功导出 ${selectedConfigs.length} 个API配置`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">批量操作</h2>
        <p className="text-muted-foreground">同时管理多个API配置，提高工作效率</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
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
            {selectedConfigs.length === filteredConfigs.length ? "取消全选" : "全选"}
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
            icon={<Download className="h-4 w-4" />}
            disabled={selectedConfigs.length === 0}
            onClick={handleBatchExport}
          >
            批量导出
          </TechButton>
        </div>
      </div>

      {isProcessing && (
        <TechCard variant="glass" border="tech" contentClassName="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>处理中...</span>
              <span>
                {processProgress} / {processTotal}
              </span>
            </div>
            <div className="w-full bg-techblue-100 dark:bg-techblue-900 rounded-full h-2.5">
              <div
                className="bg-techblue-600 h-2.5 rounded-full"
                style={{ width: `${(processProgress / processTotal) * 100}%` }}
              ></div>
            </div>
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
              <div className="col-span-3">名称</div>
              <div className="col-span-3">基础URL</div>
              <div className="col-span-1">版本</div>
              <div className="col-span-1">状态</div>
              <div className="col-span-2">最后测试</div>
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

      <div className="flex justify-between">
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
    </div>
  )
}
