"use client"

import { useState } from "react"
import { useApiConfig, type ApiConfigWithMeta } from "./api-config-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Pencil, Trash2, Play, Copy } from "lucide-react"
import ApiConfigForm from "./api-config-form"
import { useToast } from "@/components/ui/use-toast"

export default function ApiConfigList() {
  const { configs, loading, deleteConfig, addConfig } = useApiConfig()
  const [editingConfig, setEditingConfig] = useState<ApiConfigWithMeta | null>(null)
  const { toast } = useToast()

  // 处理编辑
  const handleEdit = (config: ApiConfigWithMeta) => {
    setEditingConfig(config)
  }

  // 处理删除
  const handleDelete = (id: string) => {
    deleteConfig(id)
  }

  // 处理复制
  const handleDuplicate = (config: ApiConfigWithMeta) => {
    try {
      // 创建配置的副本
      const { id, createdAt, updatedAt, ...configData } = config
      const newName = `${config.name} (副本)`

      // 使用API配置管理器添加副本
      // const { addConfig } = useApiConfig() // This hook is being called conditionally, but all hooks must be called in the exact same order in every component render.
      addConfig({
        ...configData,
        name: newName,
      })

      toast({
        title: "复制成功",
        description: `已创建 "${newName}" 配置。`,
      })
    } catch (error) {
      console.error("复制配置失败:", error)
      toast({
        title: "复制失败",
        description: "无法复制API配置。",
        variant: "destructive",
      })
    }
  }

  // 关闭编辑表单
  const handleCloseEdit = () => {
    setEditingConfig(null)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 获取认证类型标签
  const getAuthTypeBadge = (authType: string, enabled: boolean) => {
    if (!enabled) return <Badge variant="outline">无认证</Badge>

    switch (authType) {
      case "basic":
        return <Badge variant="secondary">基本认证</Badge>
      case "bearer":
        return <Badge variant="secondary">Bearer令牌</Badge>
      case "api-key":
        return <Badge variant="secondary">API密钥</Badge>
      case "oauth2":
        return <Badge variant="secondary">OAuth2</Badge>
      case "custom":
        return <Badge variant="secondary">自定义认证</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-8">加载API配置...</div>
  }

  if (configs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="mb-4">暂无API配置</p>
        <Button variant="default" onClick={() => (window.location.href = "/api-config?tab=add")}>
          添加第一个API配置
        </Button>
      </div>
    )
  }

  return (
    <div>
      {editingConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">编辑API配置</h2>
                <Button variant="ghost" onClick={handleCloseEdit}>
                  关闭
                </Button>
              </div>
              <ApiConfigForm initialConfig={editingConfig} onComplete={handleCloseEdit} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => (
          <Card key={config.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{config.name}</CardTitle>
              <CardDescription className="truncate" title={config.config.baseUrl}>
                {config.config.baseUrl}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">认证方式:</span>
                  <span>{getAuthTypeBadge(config.auth.type, config.auth.enabled)}</span>
                </div>

                {config.config.version && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">API版本:</span>
                    <span>{config.config.version}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">超时设置:</span>
                  <span>{config.config.timeout ? `${config.config.timeout}ms` : "默认"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">更新时间:</span>
                  <span className="text-sm">{formatDate(config.updatedAt)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(config)} title="编辑">
                  <Pencil className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon" title="删除">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除</AlertDialogTitle>
                      <AlertDialogDescription>
                        您确定要删除 "{config.name}" 配置吗？此操作无法撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(config.id)}>删除</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" size="icon" onClick={() => handleDuplicate(config)} title="复制">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={() => (window.location.href = `/api-config?tab=test&id=${config.id}`)}
              >
                <Play className="h-4 w-4 mr-2" />
                测试
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
