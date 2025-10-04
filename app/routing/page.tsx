"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2 } from "lucide-react"
import { useProviders } from "@/hooks/use-providers"
import { useRouting } from "@/hooks/use-routing"
import { RoutingRuleForm } from "@/components/routing-rule-form"
import { ABTestingConfig } from "@/components/ab-testing-config"
import { RoutingSimulator } from "@/components/routing-simulator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RoutingPage() {
  const { toast } = useToast()
  const { providers } = useProviders()
  const { rules, addRule, updateRule, deleteRule, settings, updateSettings } = useRouting()
  const [editingRule, setEditingRule] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)

  const handleEditRule = (rule: any) => {
    setEditingRule(rule)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDelete(ruleId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteRule(ruleToDelete)
      toast({
        title: "路由规则已删除",
        description: "智能路由规则已成功从系统中移除",
      })
      setIsDeleteDialogOpen(false)
      setRuleToDelete(null)
    }
  }

  const handleSaveRule = (rule: any) => {
    if (rule.id) {
      updateRule(rule.id, rule)
      toast({
        title: "路由规则已更新",
        description: `规则"${rule.name}"已成功更新`,
      })
    } else {
      addRule({
        ...rule,
        id: Date.now().toString(),
        enabled: true,
        priority: rules.length + 1,
      })
      toast({
        title: "路由规则已添加",
        description: `规则"${rule.name}"已成功添加到系统`,
      })
    }
    setEditingRule(null)
  }

  const handleToggleRule = (ruleId: string, isEnabled: boolean) => {
    updateRule(ruleId, { enabled: isEnabled })
    toast({
      title: isEnabled ? "规则已启用" : "规则已禁用",
      description: `路由规则状态已更新为${isEnabled ? "启用" : "禁用"}`,
    })
  }

  const handleToggleSetting = (key: string, value: boolean) => {
    updateSettings({ [key]: value })
    toast({
      title: "设置已更新",
      description: `智能路由设置已更新`,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">智能路由与切换</h1>
            <p className="text-muted-foreground">配置AI提供商的智能路由规则和自动切换策略</p>
          </div>
          <Button onClick={() => setEditingRule({})}>添加路由规则</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>全局设置</CardTitle>
            <CardDescription>配置智能路由和自动切换的全局行为</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用智能路由</Label>
                  <p className="text-sm text-muted-foreground">根据规则自动选择最佳的AI提供商</p>
                </div>
                <Switch
                  checked={settings.enableSmartRouting}
                  onCheckedChange={(checked) => handleToggleSetting("enableSmartRouting", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>自动故障切换</Label>
                  <p className="text-sm text-muted-foreground">当主要提供商不可用时自动切换到备用提供商</p>
                </div>
                <Switch
                  checked={settings.enableFailover}
                  onCheckedChange={(checked) => handleToggleSetting("enableFailover", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>基于成本优化</Label>
                  <p className="text-sm text-muted-foreground">优先选择成本较低的提供商（在满足其他条件的情况下）</p>
                </div>
                <Switch
                  checked={settings.enableCostOptimization}
                  onCheckedChange={(checked) => handleToggleSetting("enableCostOptimization", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>启用A/B测试</Label>
                  <p className="text-sm text-muted-foreground">在多个提供商之间分配流量以测试性能和质量</p>
                </div>
                <Switch
                  checked={settings.enableABTesting}
                  onCheckedChange={(checked) => handleToggleSetting("enableABTesting", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rules">路由规则</TabsTrigger>
            <TabsTrigger value="abtesting">A/B测试</TabsTrigger>
            <TabsTrigger value="simulator">路由模拟器</TabsTrigger>
          </TabsList>
          <TabsContent value="rules" className="space-y-4">
            {rules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <p className="text-muted-foreground mb-4">暂无路由规则</p>
                  <Button onClick={() => setEditingRule({})}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加第一条规则
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium">{rule.name}</CardTitle>
                          <CardDescription>{rule.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={rule.enabled ? "default" : "outline"}>
                            {rule.enabled ? "已启用" : "已禁用"}
                          </Badge>
                          <Badge variant="secondary">优先级: {rule.priority}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">条件</h4>
                            <div className="space-y-2">
                              {rule.conditions.map((condition: any, index: number) => (
                                <div key={index} className="text-sm">
                                  <span className="font-medium">{condition.field}</span>{" "}
                                  <span>{condition.operator}</span>{" "}
                                  <span className="font-medium">{condition.value}</span>
                                </div>
                              ))}
                              {rule.conditions.length === 0 && (
                                <p className="text-sm text-muted-foreground">无条件（默认规则）</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">动作</h4>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <span>使用提供商: </span>
                                <span className="font-medium">
                                  {providers.find((p) => p.id === rule.action.providerId)?.name ||
                                    rule.action.providerId}
                                </span>
                              </div>
                              {rule.action.model && (
                                <div className="text-sm">
                                  <span>使用模型: </span>
                                  <span className="font-medium">{rule.action.model}</span>
                                </div>
                              )}
                              {rule.action.fallbackProviderId && (
                                <div className="text-sm">
                                  <span>备用提供商: </span>
                                  <span className="font-medium">
                                    {providers.find((p) => p.id === rule.action.fallbackProviderId)?.name ||
                                      rule.action.fallbackProviderId}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                        />
                        <Label>{rule.enabled ? "已启用" : "已禁用"}</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="abtesting">
            <Card>
              <CardHeader>
                <CardTitle>A/B测试配置</CardTitle>
                <CardDescription>配置多个AI提供商之间的流量分配，以测试性能和质量</CardDescription>
              </CardHeader>
              <CardContent>
                <ABTestingConfig providers={providers} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="simulator">
            <Card>
              <CardHeader>
                <CardTitle>路由模拟器</CardTitle>
                <CardDescription>模拟不同场景下的路由决策，测试规则效果</CardDescription>
              </CardHeader>
              <CardContent>
                <RoutingSimulator providers={providers} rules={rules} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {editingRule !== null && (
        <Dialog open={editingRule !== null} onOpenChange={(open) => !open && setEditingRule(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingRule.id ? "编辑路由规则" : "添加路由规则"}</DialogTitle>
              <DialogDescription>
                {editingRule.id ? "修改智能路由规则的条件和动作" : "创建新的智能路由规则"}
              </DialogDescription>
            </DialogHeader>
            <RoutingRuleForm
              rule={editingRule}
              providers={providers}
              onSave={handleSaveRule}
              onCancel={() => setEditingRule(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>您确定要删除这条路由规则吗？此操作无法撤销。</DialogDescription>
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
