"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { ProviderForm } from "@/components/provider-form"
import { ProviderTestPanel } from "@/components/provider-test-panel"
import { ProviderHealthCheck } from "@/components/provider-health-check"
import { Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProviders } from "@/hooks/use-providers"

export default function ProvidersPage() {
  const { toast } = useToast()
  const { providers, updateProvider, deleteProvider, addProvider } = useProviders()
  const [editingProvider, setEditingProvider] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null)

  const handleEditProvider = (provider: any) => {
    setEditingProvider(provider)
  }

  const handleDeleteProvider = (providerId: string) => {
    setProviderToDelete(providerId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (providerToDelete) {
      deleteProvider(providerToDelete)
      toast({
        title: "提供商已删除",
        description: "AI提供商已成功从系统中移除",
      })
      setIsDeleteDialogOpen(false)
      setProviderToDelete(null)
    }
  }

  const handleSaveProvider = (provider: any) => {
    if (provider.id) {
      updateProvider(provider.id, provider)
      toast({
        title: "提供商已更新",
        description: `${provider.name}的配置已成功更新`,
      })
    } else {
      addProvider({
        ...provider,
        id: Date.now().toString(),
        status: "active",
        healthStatus: "healthy",
        lastChecked: new Date().toISOString(),
      })
      toast({
        title: "提供商已添加",
        description: `${provider.name}已成功添加到系统`,
      })
    }
    setEditingProvider(null)
  }

  const handleToggleProvider = (providerId: string, isEnabled: boolean) => {
    updateProvider(providerId, { status: isEnabled ? "active" : "inactive" })
    toast({
      title: isEnabled ? "提供商已启用" : "提供商已禁用",
      description: `提供商状态已更新为${isEnabled ? "启用" : "禁用"}`,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">提供商管理</h1>
            <p className="text-muted-foreground">管理AI服务提供商、API密钥和配置</p>
          </div>
          <Button onClick={() => setEditingProvider({})}>添加提供商</Button>
        </div>

        <Tabs defaultValue="providers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="providers">提供商列表</TabsTrigger>
            <TabsTrigger value="health">健康状态</TabsTrigger>
            <TabsTrigger value="test">测试面板</TabsTrigger>
          </TabsList>
          <TabsContent value="providers" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.map((provider) => (
                <Card key={provider.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium">{provider.name}</CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                      <Badge
                        variant={
                          provider.healthStatus === "healthy"
                            ? "success"
                            : provider.healthStatus === "degraded"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {provider.healthStatus === "healthy"
                          ? "正常"
                          : provider.healthStatus === "degraded"
                            ? "性能下降"
                            : "不可用"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">API类型</span>
                        <span className="text-sm font-medium">{provider.apiType}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">模型</span>
                        <span className="text-sm font-medium">{provider.defaultModel}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">状态</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{provider.status === "active" ? "启用" : "禁用"}</span>
                          <Switch
                            checked={provider.status === "active"}
                            onCheckedChange={(checked) => handleToggleProvider(provider.id, checked)}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">最后检查</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(provider.lastChecked).toLocaleString("zh-CN")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditProvider(provider)}>
                      <Edit className="h-4 w-4 mr-2" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>提供商健康检查</CardTitle>
                <CardDescription>监控各AI提供商的可用性和性能</CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderHealthCheck providers={providers} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>提供商测试面板</CardTitle>
                <CardDescription>测试各AI提供商的API连接和响应</CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderTestPanel providers={providers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {editingProvider && (
        <Dialog open={editingProvider !== null} onOpenChange={(open) => !open && setEditingProvider(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProvider.id ? "编辑提供商" : "添加提供商"}</DialogTitle>
              <DialogDescription>
                {editingProvider.id ? "修改AI提供商的配置和API密钥" : "添加新的AI提供商到系统"}
              </DialogDescription>
            </DialogHeader>
            <ProviderForm
              provider={editingProvider}
              onSave={handleSaveProvider}
              onCancel={() => setEditingProvider(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除这个AI提供商吗？此操作无法撤销，所有相关配置和API密钥将被永久删除。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
