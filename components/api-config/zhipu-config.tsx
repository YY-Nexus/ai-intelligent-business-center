"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, Trash } from "lucide-react"
import ZhipuAIClient from "@/lib/api-binding/providers/zhipu/zhipu-client"
import { zhipuModels } from "@/lib/api-binding/providers/zhipu/zhipu-types"

export function ZhipuConfig() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [defaultModel, setDefaultModel] = useState("glm-3-turbo")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isEnabled, setIsEnabled] = useState(true)

  // 从localStorage加载配置
  useEffect(() => {
    const storedApiKey = localStorage.getItem("zhipu_api_key")
    const storedDefaultModel = localStorage.getItem("zhipu_default_model")
    const storedIsEnabled = localStorage.getItem("zhipu_is_enabled")

    if (storedApiKey) setApiKey(storedApiKey)
    if (storedDefaultModel) setDefaultModel(storedDefaultModel)
    if (storedIsEnabled !== null) setIsEnabled(storedIsEnabled === "true")
  }, [])

  // 保存配置
  const saveConfig = () => {
    setIsLoading(true)

    try {
      localStorage.setItem("zhipu_api_key", apiKey)
      localStorage.setItem("zhipu_default_model", defaultModel)
      localStorage.setItem("zhipu_is_enabled", String(isEnabled))

      toast({
        title: "配置已保存",
        description: "智谱AI配置已成功保存",
      })
    } catch (error) {
      console.error("保存智谱AI配置失败:", error)
      toast({
        title: "保存失败",
        description: "保存智谱AI配置时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 清除配置
  const clearConfig = () => {
    setIsLoading(true)

    try {
      localStorage.removeItem("zhipu_api_key")
      localStorage.removeItem("zhipu_default_model")
      localStorage.removeItem("zhipu_is_enabled")

      setApiKey("")
      setDefaultModel("glm-3-turbo")
      setIsEnabled(true)
      setIsValid(null)

      toast({
        title: "配置已清除",
        description: "智谱AI配置已成功清除",
      })
    } catch (error) {
      console.error("清除智谱AI配置失败:", error)
      toast({
        title: "清除失败",
        description: "清除智谱AI配置时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 验证API密钥
  const validateApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "无法验证",
        description: "请先输入API密钥",
        variant: "destructive",
      })
      return
    }

    setIsValidating(true)
    setIsValid(null)

    try {
      const client = new ZhipuAIClient({ apiKey })
      const isValid = await client.validateApiKey()

      setIsValid(isValid)

      if (isValid) {
        toast({
          title: "验证成功",
          description: "智谱AI API密钥有效",
        })
      } else {
        toast({
          title: "验证失败",
          description: "智谱AI API密钥无效",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("验证智谱AI API密钥失败:", error)
      setIsValid(false)
      toast({
        title: "验证失败",
        description: "验证智谱AI API密钥时发生错误",
        variant: "destructive",
      })
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>智谱AI配置</CardTitle>
        <CardDescription>配置智谱AI大模型API密钥和默认设置。您可以在智谱AI官网获取API密钥。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="is-enabled">启用智谱AI</Label>
            <Switch id="is-enabled" checked={isEnabled} onCheckedChange={setIsEnabled} disabled={isLoading} />
          </div>
          <p className="text-sm text-muted-foreground">启用或禁用智谱AI大模型服务</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">API密钥</Label>
          <div className="flex space-x-2">
            <Input
              id="api-key"
              type="password"
              placeholder="输入智谱AI API密钥"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              disabled={isLoading || !isEnabled}
            />
            <Button
              variant="outline"
              onClick={validateApiKey}
              disabled={isValidating || isLoading || !apiKey || !isEnabled}
            >
              {isValidating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isValid === true ? (
                "已验证"
              ) : isValid === false ? (
                "验证失败"
              ) : (
                "验证"
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">API密钥格式为"id.secret"，请在智谱AI开放平台获取</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default-model">默认模型</Label>
          <Select value={defaultModel} onValueChange={setDefaultModel} disabled={isLoading || !isEnabled}>
            <SelectTrigger id="default-model">
              <SelectValue placeholder="选择默认模型" />
            </SelectTrigger>
            <SelectContent>
              {zhipuModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">选择默认使用的智谱AI模型</p>
        </div>

        <div className="space-y-2">
          <Label>价格信息</Label>
          <div className="rounded-md border p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium">模型</div>
              <div className="font-medium">输入价格(元/千tokens)</div>
              <div className="font-medium">输出价格(元/千tokens)</div>
              {zhipuModels.map((model) => (
                <>
                  <div key={`${model.id}-name`}>{model.name}</div>
                  <div key={`${model.id}-input`}>{model.inputPrice}</div>
                  <div key={`${model.id}-output`}>{model.outputPrice}</div>
                </>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">智谱AI模型的价格信息，仅供参考，具体请以官方为准</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={clearConfig} disabled={isLoading || !isEnabled}>
          <Trash className="mr-2 h-4 w-4" />
          清除配置
        </Button>
        <Button onClick={saveConfig} disabled={isLoading || !isEnabled}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          保存配置
        </Button>
      </CardFooter>
    </Card>
  )
}
