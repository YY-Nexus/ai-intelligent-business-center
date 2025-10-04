"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import type { RepairStrategyType } from "@/types/repair"

interface RepairStrategyProps {
  strategy: RepairStrategyType
  setStrategy: (strategy: RepairStrategyType) => void
}

export function RepairStrategy({ strategy, setStrategy }: RepairStrategyProps) {
  const { toast } = useToast()

  // 保存策略
  const saveStrategy = () => {
    toast({
      title: "修复策略已保存",
      description: "您的修复策略设置已成功保存",
    })
  }

  // 重置为默认策略
  const resetToDefault = () => {
    setStrategy({
      fixApiConnectivityIssues: true,
      fixConfigurationIssues: true,
      fixPerformanceIssues: true,
      fixSecurityIssues: true,
      priorityOrder: "severity",
      apiConnectivityPriority: 3,
      configurationPriority: 2,
      performancePriority: 1,
      securityPriority: 4,
      createBackupBeforeFix: true,
      rollbackOnFailureThreshold: 30,
      fixTimeout: 30,
    })

    toast({
      title: "已重置为默认策略",
      description: "修复策略已重置为系统默认设置",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">常规设置</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
          <TabsTrigger value="priority">优先级设置</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">修复范围</CardTitle>
              <CardDescription>选择需要修复的问题类型</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="fix-api-connectivity" className="flex-1">
                  修复API连接问题
                  <p className="text-sm text-muted-foreground">修复与AI提供商的API连接问题，包括超时、认证错误等</p>
                </Label>
                <Switch
                  id="fix-api-connectivity"
                  checked={strategy.fixApiConnectivityIssues}
                  onCheckedChange={(checked) => setStrategy({ ...strategy, fixApiConnectivityIssues: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fix-configuration" className="flex-1">
                  修复配置问题
                  <p className="text-sm text-muted-foreground">修复系统配置错误，包括缺失配置、格式错误等</p>
                </Label>
                <Switch
                  id="fix-configuration"
                  checked={strategy.fixConfigurationIssues}
                  onCheckedChange={(checked) => setStrategy({ ...strategy, fixConfigurationIssues: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fix-performance" className="flex-1">
                  修复性能问题
                  <p className="text-sm text-muted-foreground">修复影响系统性能的问题，包括缓存配置、并发设置等</p>
                </Label>
                <Switch
                  id="fix-performance"
                  checked={strategy.fixPerformanceIssues}
                  onCheckedChange={(checked) => setStrategy({ ...strategy, fixPerformanceIssues: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fix-security" className="flex-1">
                  修复安全问题
                  <p className="text-sm text-muted-foreground">修复系统安全隐患，包括密钥暴露、权限设置错误等</p>
                </Label>
                <Switch
                  id="fix-security"
                  checked={strategy.fixSecurityIssues}
                  onCheckedChange={(checked) => setStrategy({ ...strategy, fixSecurityIssues: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">高级设置</CardTitle>
              <CardDescription>配置修复过程的高级选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="create-backup" className="flex-1">
                  修复前创建备份
                  <p className="text-sm text-muted-foreground">在执行修复前创建系统状态快照，以便在修复失败时回滚</p>
                </Label>
                <Switch
                  id="create-backup"
                  checked={strategy.createBackupBeforeFix}
                  onCheckedChange={(checked) => setStrategy({ ...strategy, createBackupBeforeFix: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rollback-threshold">
                  自动回滚阈值 ({strategy.rollbackOnFailureThreshold}%)
                  <p className="text-sm text-muted-foreground">当修复失败率超过此阈值时，自动回滚到修复前状态</p>
                </Label>
                <Slider
                  id="rollback-threshold"
                  min={0}
                  max={100}
                  step={5}
                  value={[strategy.rollbackOnFailureThreshold]}
                  onValueChange={(value) => setStrategy({ ...strategy, rollbackOnFailureThreshold: value[0] })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%（不回滚）</span>
                  <span>50%</span>
                  <span>100%（总是回滚）</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fix-timeout">
                  修复超时时间 ({strategy.fixTimeout} 秒)
                  <p className="text-sm text-muted-foreground">单个问题的最大修复时间，超过此时间将中止修复</p>
                </Label>
                <Slider
                  id="fix-timeout"
                  min={5}
                  max={120}
                  step={5}
                  value={[strategy.fixTimeout]}
                  onValueChange={(value) => setStrategy({ ...strategy, fixTimeout: value[0] })}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5秒</span>
                  <span>60秒</span>
                  <span>120秒</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="priority">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">优先级设置</CardTitle>
              <CardDescription>配置问题修复的优先级顺序</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="priority-order">优先级顺序</Label>
                <Select
                  value={strategy.priorityOrder}
                  onValueChange={(value) => setStrategy({ ...strategy, priorityOrder: value as any })}
                >
                  <SelectTrigger id="priority-order">
                    <SelectValue placeholder="选择优先级顺序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="severity">按严重程度</SelectItem>
                    <SelectItem value="fixSuccess">按修复成功率</SelectItem>
                    <SelectItem value="custom">自定义优先级</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {strategy.priorityOrder === "custom" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="api-connectivity-priority">
                      API连接问题优先级 ({strategy.apiConnectivityPriority})
                    </Label>
                    <Slider
                      id="api-connectivity-priority"
                      min={1}
                      max={4}
                      step={1}
                      value={[strategy.apiConnectivityPriority]}
                      onValueChange={(value) => setStrategy({ ...strategy, apiConnectivityPriority: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>低</span>
                      <span>高</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="configuration-priority">配置问题优先级 ({strategy.configurationPriority})</Label>
                    <Slider
                      id="configuration-priority"
                      min={1}
                      max={4}
                      step={1}
                      value={[strategy.configurationPriority]}
                      onValueChange={(value) => setStrategy({ ...strategy, configurationPriority: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>低</span>
                      <span>高</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performance-priority">性能问题优先级 ({strategy.performancePriority})</Label>
                    <Slider
                      id="performance-priority"
                      min={1}
                      max={4}
                      step={1}
                      value={[strategy.performancePriority]}
                      onValueChange={(value) => setStrategy({ ...strategy, performancePriority: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>低</span>
                      <span>高</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="security-priority">安全问题优先级 ({strategy.securityPriority})</Label>
                    <Slider
                      id="security-priority"
                      min={1}
                      max={4}
                      step={1}
                      value={[strategy.securityPriority]}
                      onValueChange={(value) => setStrategy({ ...strategy, securityPriority: value[0] })}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>低</span>
                      <span>高</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={resetToDefault}>
          重置为默认
        </Button>
        <Button onClick={saveStrategy}>保存策略</Button>
      </div>
    </div>
  )
}
