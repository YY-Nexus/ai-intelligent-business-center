"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X, Key, Brain, ImageIcon, Code, MessageSquare, Settings, Plus } from "lucide-react"
import { useAIConfig, type AIModelConfig } from "@/lib/ai/ai-config-manager"
import { AiModelSelector } from "@/components/ai/ai-model-selector"
import { AiChatInterface } from "@/components/ai/ai-chat-interface"
import OpenAIClient from "@/lib/ai/openai-client"
import AnthropicClient from "@/lib/ai/anthropic-client"
import GLM4VClient from "@/lib/ai/glm4v-client"
import CogViewClient from "@/lib/ai/cogview-client"
import CodeGeeXClient from "@/lib/ai/codegeex-client"

export default function AIModelsPage() {
  const { toast } = useToast()
  const {
    models,
    activeModelId,
    isLoaded,
    getModelConfig,
    getActiveModelConfig,
    updateModelConfig,
    setActiveModel,
    setApiKey,
  } = useAIConfig()

  const [activeTab, setActiveTab] = useState("models")
  const [isValidating, setIsValidating] = useState<Record<string, boolean>>({})
  const [validationResults, setValidationResults] = useState<Record<string, boolean>>({})
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})
  const [newModelData, setNewModelData] = useState<Partial<AIModelConfig>>({
    name: "",
    provider: "",
    description: "",
    capabilities: [],
  })
  const [isAddingModel, setIsAddingModel] = useState(false)

  // 初始化API密钥
  useEffect(() => {
    if (isLoaded) {
      const keys: Record<string, string> = {}
      models.forEach((model) => {
        if (model.apiKey) {
          keys[model.id] = model.apiKey
        }
      })
      setApiKeys(keys)
    }
  }, [isLoaded, models])

  // 验证API密钥
  const validateApiKey = async (modelId: string) => {
    const model = getModelConfig(modelId)
    if (!model) return

    setIsValidating((prev) => ({ ...prev, [modelId]: true }))

    try {
      let isValid = false

      switch (model.provider.toLowerCase()) {
        case "智谱ai":
          if (modelId.includes("glm")) {
            const client = new GLM4VClient(apiKeys[modelId])
            isValid = await client.validateApiKey()
          } else if (modelId.includes("cogview")) {
            const client = new CogViewClient({ apiKey: apiKeys[modelId] })
            isValid = await client.validateApiKey()
          } else if (modelId.includes("codegeex")) {
            const client = new CodeGeeXClient({ apiKey: apiKeys[modelId] })
            isValid = await client.validateApiKey()
          }
          break
        case "openai":
          const openaiClient = new OpenAIClient(apiKeys[modelId])
          isValid = await openaiClient.validateApiKey()
          break
        case "anthropic":
          const anthropicClient = new AnthropicClient(apiKeys[modelId])
          isValid = await anthropicClient.validateApiKey()
          break
        default:
          isValid = false
      }

      setValidationResults((prev) => ({ ...prev, [modelId]: isValid }))

      if (isValid) {
        setApiKey(modelId, apiKeys[modelId])
        toast({
          title: "API密钥验证成功",
          description: `${model.name} 的API密钥有效`,
        })
      } else {
        toast({
          title: "API密钥验证失败",
          description: `${model.name} 的API密钥无效`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("验证API密钥失败:", error)
      setValidationResults((prev) => ({ ...prev, [modelId]: false }))
      toast({
        title: "API密钥验证失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsValidating((prev) => ({ ...prev, [modelId]: false }))
    }
  }

  // 切换模型启用状态
  const toggleModelEnabled = (modelId: string) => {
    const model = getModelConfig(modelId)
    if (model) {
      updateModelConfig(modelId, { enabled: !model.enabled })
      toast({
        title: model.enabled ? "模型已禁用" : "模型已启用",
        description: `${model.name} 已${model.enabled ? "禁用" : "启用"}`,
      })
    }
  }

  // 设置活动模型
  const handleSetActiveModel = (modelId: string) => {
    setActiveModel(modelId)
    toast({
      title: "活动模型已更改",
      description: `当前活动模型: ${getModelConfig(modelId)?.name}`,
    })
  }

  // 添加新模型
  const handleAddModel = () => {
    if (!newModelData.name || !newModelData.provider || !newModelData.description) {
      toast({
        title: "无法添加模型",
        description: "请填写所有必填字段",
        variant: "destructive",
      })
      return
    }

    try {
      const newModel: AIModelConfig = {
        id: `custom-${Date.now()}`,
        name: newModelData.name,
        provider: newModelData.provider,
        description: newModelData.description,
        capabilities: newModelData.capabilities || ["聊天对话"],
        enabled: true,
      }

      updateModelConfig(newModel.id, newModel)

      setNewModelData({
        name: "",
        provider: "",
        description: "",
        capabilities: [],
      })

      setIsAddingModel(false)

      toast({
        title: "模型已添加",
        description: `${newModel.name} 已成功添加`,
      })
    } catch (error) {
      toast({
        title: "添加模型失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">加载AI模型配置...</span>
      </div>
    )
  }

  const activeModel = getActiveModelConfig()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI模型管理</h1>
        <p className="text-muted-foreground">管理和配置AI模型，设置API密钥，测试模型功能</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="models">
            <Brain className="h-4 w-4 mr-2" />
            模型管理
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            聊天测试
          </TabsTrigger>
          <TabsTrigger value="image">
            <ImageIcon className="h-4 w-4 mr-2" />
            图像生成
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            代码生成
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            高级设置
          </TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">可用模型</h2>
              <Button onClick={() => setIsAddingModel(true)} disabled={isAddingModel}>
                <Plus className="h-4 w-4 mr-2" />
                添加模型
              </Button>
            </div>

            {isAddingModel && (
              <Card>
                <CardHeader>
                  <CardTitle>添加新模型</CardTitle>
                  <CardDescription>添加自定义AI模型配置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model-name">模型名称</Label>
                      <Input
                        id="model-name"
                        value={newModelData.name}
                        onChange={(e) => setNewModelData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="例如: GPT-4o"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-provider">提供商</Label>
                      <Input
                        id="model-provider"
                        value={newModelData.provider}
                        onChange={(e) => setNewModelData((prev) => ({ ...prev, provider: e.target.value }))}
                        placeholder="例如: OpenAI"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model-description">描述</Label>
                    <Input
                      id="model-description"
                      value={newModelData.description}
                      onChange={(e) => setNewModelData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="���述这个模型的功能和特点"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setIsAddingModel(false)}>
                    取消
                  </Button>
                  <Button onClick={handleAddModel}>添加模型</Button>
                </CardFooter>
              </Card>
            )}

            {models.map((model) => (
              <Card key={model.id} className={model.id === activeModelId ? "border-primary" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {model.name}
                        {model.id === activeModelId && (
                          <Badge variant="outline" className="ml-2 bg-primary/10">
                            当前活动
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{model.provider}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={model.enabled} onCheckedChange={() => toggleModelEnabled(model.id)} />
                      <span className="text-sm text-muted-foreground">{model.enabled ? "已启用" : "已禁用"}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{model.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {model.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary">
                        {capability}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`api-key-${model.id}`} className="flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      API密钥
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id={`api-key-${model.id}`}
                        type="password"
                        value={apiKeys[model.id] || ""}
                        onChange={(e) => setApiKeys((prev) => ({ ...prev, [model.id]: e.target.value }))}
                        placeholder={`输入${model.provider}的API密钥`}
                      />
                      <Button
                        onClick={() => validateApiKey(model.id)}
                        disabled={isValidating[model.id] || !apiKeys[model.id]}
                        variant="outline"
                      >
                        {isValidating[model.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : validationResults[model.id] ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : validationResults[model.id] === false ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          "验证"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => handleSetActiveModel(model.id)}
                    disabled={model.id === activeModelId || !model.enabled}
                  >
                    设为活动模型
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat">
          {activeModel ? (
            <AiChatInterface
              apiKey={activeModel.apiKey}
              modelName={activeModel.name}
              systemPrompt="你是一个有用的AI助手，请用中文回答用户的问题。"
            />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-4">请先在"模型管理"标签页中设置活动模型和API密钥</p>
                  <Button onClick={() => setActiveTab("models")}>前往模型管理</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="image">
          {activeModel && activeModel.capabilities.includes("文生图") ? (
            <AiModelSelector apiKey={activeModel.apiKey} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-4">请先在"模型管理"标签页中设置支持图像生成的活动模型</p>
                  <Button onClick={() => setActiveTab("models")}>前往模型管理</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="code">
          {activeModel && activeModel.capabilities.includes("代码生成") ? (
            <AiModelSelector apiKey={activeModel.apiKey} />
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <p className="mb-4">请先在"模型管理"标签页中设置支持代码生成的活动模型</p>
                  <Button onClick={() => setActiveTab("models")}>前往模型管理</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
              <CardDescription>配置AI模型的高级参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>默认参数</Label>
                <p className="text-sm text-muted-foreground">这些参数将应用于所有支持的模型</p>
              </div>

              {activeModel && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeModel.temperature !== undefined && (
                      <div className="space-y-2">
                        <Label>温度: {activeModel.temperature}</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs">精确</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={activeModel.temperature}
                            onChange={(e) =>
                              updateModelConfig(activeModel.id, { temperature: Number.parseFloat(e.target.value) })
                            }
                            className="flex-1"
                          />
                          <span className="text-xs">创造性</span>
                        </div>
                      </div>
                    )}

                    {activeModel.maxTokens !== undefined && (
                      <div className="space-y-2">
                        <Label>最大令牌数: {activeModel.maxTokens}</Label>
                        <input
                          type="range"
                          min="256"
                          max="4096"
                          step="256"
                          value={activeModel.maxTokens}
                          onChange={(e) =>
                            updateModelConfig(activeModel.id, { maxTokens: Number.parseInt(e.target.value) })
                          }
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  toast({
                    title: "设置已保存",
                    description: "高级设置已成功保存",
                  })
                }}
              >
                保存设置
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
