"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, Save, RotateCcw } from "lucide-react"

// 修复策略配置类型
export interface RepairStrategy {
  // 通用设置
  enableAutoFix: boolean // 是否启用自动修复
  fixOnAuditComplete: boolean // 审查完成后自动修复
  createBackupBeforeFix: boolean // 修复前创建备份
  notifyOnFixComplete: boolean // 修复完成后通知

  // 优先级设置
  priorityOrder: "severity" | "fixSuccess" | "custom" // 优先级排序方式
  frameworkPriority: number // 框架完整性优先级 (1-10)
  fileCompliancePriority: number // 文件合规性优先级 (1-10)
  interactionPriority: number // 交互流畅性优先级 (1-10)
  missingFeaturePriority: number // 缺失功能优先级 (1-10)

  // 修复范围
  fixFrameworkIssues: boolean // 修复框架问题
  fixFileComplianceIssues: boolean // 修复文件合规性问题
  fixInteractionIssues: boolean // 修复交互流畅性问题
  implementMissingFeatures: boolean // 实现缺失功能

  // 高级设置
  maxFixAttempts: number // 最大修复尝试次数
  fixTimeout: number // 单个问题修复超时时间（秒）
  rollbackOnFailureThreshold: number // 失败回滚阈值（百分比）
  batchFixing: boolean // 批量修复（同类型问题一起修复）
}

// 默认修复策略
export const defaultRepairStrategy: RepairStrategy = {
  enableAutoFix: true,
  fixOnAuditComplete: false,
  createBackupBeforeFix: true,
  notifyOnFixComplete: true,

  priorityOrder: "severity",
  frameworkPriority: 10,
  fileCompliancePriority: 7,
  interactionPriority: 5,
  missingFeaturePriority: 3,

  fixFrameworkIssues: true,
  fixFileComplianceIssues: true,
  fixInteractionIssues: true,
  implementMissingFeatures: true,

  maxFixAttempts: 3,
  fixTimeout: 60,
  rollbackOnFailureThreshold: 50,
  batchFixing: false,
}

interface RepairStrategyConfigProps {
  strategy: RepairStrategy
  onStrategyChange: (strategy: RepairStrategy) => void
  onSave: () => void
  onReset: () => void
}

export function RepairStrategyConfig({ strategy, onStrategyChange, onSave, onReset }: RepairStrategyConfigProps) {
  const [activeTab, setActiveTab] = useState("general")

  // 更新策略的辅助函数
  const updateStrategy = (updates: Partial<RepairStrategy>) => {
    onStrategyChange({ ...strategy, ...updates })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              修复策略配置
            </CardTitle>
            <CardDescription>自定义系统问题修复的策略和规则</CardDescription>
          </div>
          <Switch
            checked={strategy.enableAutoFix}
            onCheckedChange={(checked) => updateStrategy({ enableAutoFix: checked })}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">通用设置</TabsTrigger>
            <TabsTrigger value="priority">优先级设置</TabsTrigger>
            <TabsTrigger value="scope">修复范围</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>

          {/* 通用设置 */}
          <TabsContent value="general">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>审查完成后自动修复</Label>
                  <div className="text-sm text-muted-foreground">系统审查完成后自动启动修复流程</div>
                </div>
                <Switch
                  checked={strategy.fixOnAuditComplete}
                  onCheckedChange={(checked) => updateStrategy({ fixOnAuditComplete: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>修复前创建备份</Label>
                  <div className="text-sm text-muted-foreground">在修复前创建系统状态备份，以便回滚</div>
                </div>
                <Switch
                  checked={strategy.createBackupBeforeFix}
                  onCheckedChange={(checked) => updateStrategy({ createBackupBeforeFix: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>修复完成后通知</Label>
                  <div className="text-sm text-muted-foreground">修复完成后显示通知消息</div>
                </div>
                <Switch
                  checked={strategy.notifyOnFixComplete}
                  onCheckedChange={(checked) => updateStrategy({ notifyOnFixComplete: checked })}
                />
              </div>
            </div>
          </TabsContent>

          {/* 优先级设置 */}
          <TabsContent value="priority">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>优先级排序方式</Label>
                <Select
                  value={strategy.priorityOrder}
                  onValueChange={(value) => updateStrategy({ priorityOrder: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择排序方式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="severity">按问题严重程度</SelectItem>
                    <SelectItem value="fixSuccess">按修复成功率</SelectItem>
                    <SelectItem value="custom">自定义优先级</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {strategy.priorityOrder === "custom" && (
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>框架完整性优先级</Label>
                      <Badge variant="outline">{strategy.frameworkPriority}</Badge>
                    </div>
                    <Slider
                      value={[strategy.frameworkPriority]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateStrategy({ frameworkPriority: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>文件合规性优先级</Label>
                      <Badge variant="outline">{strategy.fileCompliancePriority}</Badge>
                    </div>
                    <Slider
                      value={[strategy.fileCompliancePriority]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateStrategy({ fileCompliancePriority: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>交互流畅性优先级</Label>
                      <Badge variant="outline">{strategy.interactionPriority}</Badge>
                    </div>
                    <Slider
                      value={[strategy.interactionPriority]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateStrategy({ interactionPriority: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>缺失功能优先级</Label>
                      <Badge variant="outline">{strategy.missingFeaturePriority}</Badge>
                    </div>
                    <Slider
                      value={[strategy.missingFeaturePriority]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateStrategy({ missingFeaturePriority: value[0] })}
                    />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 修复范围 */}
          <TabsContent value="scope">
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="fix-framework"
                  checked={strategy.fixFrameworkIssues}
                  onCheckedChange={(checked) => updateStrategy({ fixFrameworkIssues: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="fix-framework">修复框架完整性问题</Label>
                  <p className="text-sm text-muted-foreground">修复系统框架、核心组件和配置相关问题</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="fix-compliance"
                  checked={strategy.fixFileComplianceIssues}
                  onCheckedChange={(checked) => updateStrategy({ fixFileComplianceIssues: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="fix-compliance">修复文件合规性问题</Label>
                  <p className="text-sm text-muted-foreground">修复代码规范、文件结构和命名相关问题</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="fix-interaction"
                  checked={strategy.fixInteractionIssues}
                  onCheckedChange={(checked) => updateStrategy({ fixInteractionIssues: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="fix-interaction">修复交互流畅性问题</Label>
                  <p className="text-sm text-muted-foreground">修复用户界面、交互流程和体验相关问题</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="implement-features"
                  checked={strategy.implementMissingFeatures}
                  onCheckedChange={(checked) => updateStrategy({ implementMissingFeatures: checked as boolean })}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="implement-features">实现缺失功能</Label>
                  <p className="text-sm text-muted-foreground">自动实现系统中缺失的功能模块</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 高级设置 */}
          <TabsContent value="advanced">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="max-attempts">最大修复尝试次数</Label>
                <Input
                  id="max-attempts"
                  type="number"
                  min={1}
                  max={10}
                  value={strategy.maxFixAttempts}
                  onChange={(e) => updateStrategy({ maxFixAttempts: Number.parseInt(e.target.value) || 1 })}
                />
                <p className="text-sm text-muted-foreground">单个问题最多尝试修复的次数</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="fix-timeout">修复超时时间（秒）</Label>
                <Input
                  id="fix-timeout"
                  type="number"
                  min={10}
                  max={300}
                  value={strategy.fixTimeout}
                  onChange={(e) => updateStrategy({ fixTimeout: Number.parseInt(e.target.value) || 60 })}
                />
                <p className="text-sm text-muted-foreground">单个问题修复的最大时间限制</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rollback-threshold">失败回滚阈值（%）</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="rollback-threshold"
                    value={[strategy.rollbackOnFailureThreshold]}
                    min={0}
                    max={100}
                    step={5}
                    className="flex-1"
                    onValueChange={(value) => updateStrategy({ rollbackOnFailureThreshold: value[0] })}
                  />
                  <Badge variant="outline" className="w-12 text-center">
                    {strategy.rollbackOnFailureThreshold}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">当失败率超过此阈值时自动回滚</p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>批量修复</Label>
                  <div className="text-sm text-muted-foreground">同类型问题一起修复（可能提高效率但增加风险）</div>
                </div>
                <Switch
                  checked={strategy.batchFixing}
                  onCheckedChange={(checked) => updateStrategy({ batchFixing: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          重置为默认
        </Button>
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          保存配置
        </Button>
      </CardFooter>
    </Card>
  )
}
