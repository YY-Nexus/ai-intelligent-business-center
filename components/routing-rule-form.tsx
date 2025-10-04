"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface Condition {
  field: string
  operator: string
  value: string
}

interface Action {
  providerId: string
  model?: string
  fallbackProviderId?: string
  parameters?: Record<string, any>
}

interface RoutingRule {
  id?: string
  name: string
  description: string
  conditions: Condition[]
  action: Action
  priority: number
  enabled: boolean
}

interface RoutingRuleFormProps {
  rule: Partial<RoutingRule>
  providers: Array<{ id: string; name: string; models?: string[] }>
  onSave: (rule: RoutingRule) => void
  onCancel: () => void
}

export function RoutingRuleForm({ rule, providers, onSave, onCancel }: RoutingRuleFormProps) {
  const [formData, setFormData] = useState<Partial<RoutingRule>>({
    name: rule.name || "",
    description: rule.description || "",
    conditions: rule.conditions || [],
    action: rule.action || { providerId: "" },
    priority: rule.priority || 1,
    enabled: rule.enabled !== false,
    ...rule,
  })

  const conditionFields = [
    { value: "user_tier", label: "用户等级" },
    { value: "request_type", label: "请求类型" },
    { value: "model_type", label: "模型类型" },
    { value: "content_length", label: "内容长度" },
    { value: "time_of_day", label: "时间段" },
    { value: "region", label: "地区" },
    { value: "cost_limit", label: "成本限制" },
    { value: "response_time_requirement", label: "响应时间要求" },
  ]

  const operators = [
    { value: "equals", label: "等于" },
    { value: "not_equals", label: "不等于" },
    { value: "greater_than", label: "大于" },
    { value: "less_than", label: "小于" },
    { value: "contains", label: "包含" },
    { value: "not_contains", label: "不包含" },
    { value: "in", label: "在范围内" },
    { value: "not_in", label: "不在范围内" },
  ]

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...(formData.conditions || []), { field: "", operator: "", value: "" }],
    })
  }

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...(formData.conditions || [])]
    newConditions[index] = { ...newConditions[index], ...updates }
    setFormData({ ...formData, conditions: newConditions })
  }

  const removeCondition = (index: number) => {
    const newConditions = [...(formData.conditions || [])]
    newConditions.splice(index, 1)
    setFormData({ ...formData, conditions: newConditions })
  }

  const handleSave = () => {
    if (!formData.name || !formData.action?.providerId) {
      return
    }

    onSave({
      id: rule.id,
      name: formData.name,
      description: formData.description || "",
      conditions: formData.conditions || [],
      action: formData.action as Action,
      priority: formData.priority || 1,
      enabled: formData.enabled !== false,
    })
  }

  const selectedProvider = providers.find((p) => p.id === formData.action?.providerId)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">规则名称</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="输入规则名称"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">优先级</Label>
          <Input
            id="priority"
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: Number.parseInt(e.target.value) })}
            min="1"
            max="100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="输入规则描述"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>条件设置</CardTitle>
          <CardDescription>设置触发此路由规则的条件</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.conditions?.map((condition, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label>字段</Label>
                <Select value={condition.field} onValueChange={(value) => updateCondition(index, { field: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择字段" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>操作符</Label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, { operator: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择操作符" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>值</Label>
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="输入值"
                />
              </div>
              <Button variant="outline" size="icon" onClick={() => removeCondition(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" onClick={addCondition}>
            <Plus className="h-4 w-4 mr-2" />
            添加条件
          </Button>

          {(!formData.conditions || formData.conditions.length === 0) && (
            <div className="text-sm text-muted-foreground">没有条件时，此规则将作为默认规则</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>动作设置</CardTitle>
          <CardDescription>设置满足条件时的路由动作</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>主要提供商</Label>
              <Select
                value={formData.action?.providerId}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    action: { ...formData.action, providerId: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择提供商" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>备用提供商</Label>
              <Select
                value={formData.action?.fallbackProviderId || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    action: { ...formData.action, fallbackProviderId: value || undefined },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择备用提供商（可选）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无</SelectItem>
                  {providers
                    .filter((p) => p.id !== formData.action?.providerId)
                    .map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedProvider?.models && (
            <div className="space-y-2">
              <Label>指定模型（可选）</Label>
              <Select
                value={formData.action?.model || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    action: { ...formData.action, model: value || undefined },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择模型（使用默认模型）" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">使用默认模型</SelectItem>
                  {selectedProvider.models.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存规则</Button>
      </div>
    </div>
  )
}
