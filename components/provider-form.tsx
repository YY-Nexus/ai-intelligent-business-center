"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_TYPES = [
  { value: "openai", label: "OpenAI 兼容" },
  { value: "wenxin", label: "百度文心一言" },
  { value: "spark", label: "讯飞星火" },
  { value: "zhipu", label: "智谱 AI" },
  { value: "qwen", label: "阿里通义千问" },
  { value: "hunyuan", label: "腾讯混元" },
  { value: "minimax", label: "MiniMax" },
  { value: "moonshot", label: "Moonshot AI" },
  { value: "baichuan", label: "百川智能" },
  { value: "custom", label: "自定义" },
]

export function ProviderForm({ provider = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: provider.name || "",
    description: provider.description || "",
    apiType: provider.apiType || "openai",
    apiKey: provider.apiKey || "",
    apiEndpoint: provider.apiEndpoint || "",
    defaultModel: provider.defaultModel || "",
    organizationId: provider.organizationId || "",
    customHeaders: provider.customHeaders || "",
    ...provider,
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // 清除该字段的错误
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "提供商名称不能为空"
    }

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "API密钥不能为空"
    }

    if (!formData.apiEndpoint.trim()) {
      newErrors.apiEndpoint = "API端点不能为空"
    }

    if (!formData.defaultModel.trim()) {
      newErrors.defaultModel = "默认模型不能为空"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            提供商名称
          </Label>
          <div className="col-span-3">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="例如：智谱 AI"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            描述
          </Label>
          <div className="col-span-3">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="提供商的简短描述"
              className="resize-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiType" className="text-right">
            API类型
          </Label>
          <div className="col-span-3">
            <Select value={formData.apiType} onValueChange={(value) => handleChange("apiType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="选择API类型" />
              </SelectTrigger>
              <SelectContent>
                {API_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiKey" className="text-right">
            API密钥
          </Label>
          <div className="col-span-3">
            <Input
              id="apiKey"
              type="password"
              value={formData.apiKey}
              onChange={(e) => handleChange("apiKey", e.target.value)}
              placeholder="输入API密钥"
              className={errors.apiKey ? "border-red-500" : ""}
            />
            {errors.apiKey && <p className="text-red-500 text-sm mt-1">{errors.apiKey}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="apiEndpoint" className="text-right">
            API端点
          </Label>
          <div className="col-span-3">
            <Input
              id="apiEndpoint"
              value={formData.apiEndpoint}
              onChange={(e) => handleChange("apiEndpoint", e.target.value)}
              placeholder="例如：https://api.zhipuai.cn/v1"
              className={errors.apiEndpoint ? "border-red-500" : ""}
            />
            {errors.apiEndpoint && <p className="text-red-500 text-sm mt-1">{errors.apiEndpoint}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="defaultModel" className="text-right">
            默认模型
          </Label>
          <div className="col-span-3">
            <Input
              id="defaultModel"
              value={formData.defaultModel}
              onChange={(e) => handleChange("defaultModel", e.target.value)}
              placeholder="例如：glm-4"
              className={errors.defaultModel ? "border-red-500" : ""}
            />
            {errors.defaultModel && <p className="text-red-500 text-sm mt-1">{errors.defaultModel}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="organizationId" className="text-right">
            组织ID
          </Label>
          <div className="col-span-3">
            <Input
              id="organizationId"
              value={formData.organizationId}
              onChange={(e) => handleChange("organizationId", e.target.value)}
              placeholder="可选，某些API需要"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="customHeaders" className="text-right">
            自定义请求头
          </Label>
          <div className="col-span-3">
            <Textarea
              id="customHeaders"
              value={formData.customHeaders}
              onChange={(e) => handleChange("customHeaders", e.target.value)}
              placeholder='可选，JSON格式，例如：{"X-Custom-Header": "value"}'
              className="resize-none"
            />
          </div>
        </div>

        {formData.apiType === "custom" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>自定义API类型需要额外配置适配器。请确保您已实现相应的适配器代码。</AlertDescription>
          </Alert>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </DialogFooter>
    </form>
  )
}
