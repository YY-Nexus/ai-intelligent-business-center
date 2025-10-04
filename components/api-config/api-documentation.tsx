"use client"

import { useState, useEffect } from "react"
import { useApiConfig } from "./api-config-manager"
import {
  ApiDocumentationService,
  type ApiDocumentation,
  type ApiEndpoint,
} from "@/lib/api-binding/documentation/documentation-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle, Save, Eye, Trash2, Plus, X, RefreshCw, Download, FileDown, Copy, ExternalLink } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function ApiDocumentation() {
  const { configs, getConfigById } = useApiConfig()
  const { toast } = useToast()
  const [selectedConfigId, setSelectedConfigId] = useState("")
  const [documentation, setDocumentation] = useState<ApiDocumentation | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [markdownPreview, setMarkdownPreview] = useState("")
  const [openApiPreview, setOpenApiPreview] = useState("")
  const [isAutoSave, setIsAutoSave] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // 加载文档
  useEffect(() => {
    if (selectedConfigId) {
      const doc = ApiDocumentationService.getDocumentationByApiId(selectedConfigId)
      if (doc) {
        setDocumentation(doc)
      } else {
        // 创建新文档
        const apiConfig = getConfigById(selectedConfigId)
        if (apiConfig) {
          const newDoc: ApiDocumentation = {
            id: `doc-${Date.now()}`,
            configId: selectedConfigId,
            title: `${apiConfig.name} API文档`,
            description: `${apiConfig.name} 的API文档`,
            version: apiConfig.config.version || "1.0.0",
            endpoints: [],
            updatedAt: new Date().toISOString(),
          }
          setDocumentation(newDoc)
        }
      }
    } else {
      setDocumentation(null)
    }
  }, [selectedConfigId, getConfigById])

  // 自动保存
  useEffect(() => {
    if (!isAutoSave || !documentation) return;
    
    const timer = setTimeout(() => {
      saveDocumentation(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [documentation, isAutoSave]);

  // 保存文档
  const saveDocumentation = (showToast = true) => {
    if (documentation) {
      const updatedDoc = {
        ...documentation,
        updatedAt: new Date().toISOString(),
      };
      
      const success = ApiDocumentationService.saveDocumentation(updatedDoc)

      setLastSaved(new Date());

      if (success && showToast) {
        toast({
          title: "文档已保存",
          description: "API文档已成功保存。",
        })
      }
    }
  }

  // 添加端点
  const addEndpoint = () => {
    if (documentation) {
      const newEndpoint = ApiDocumentationService.createEndpoint()
      setDocumentation({
        ...documentation,
        endpoints: [...documentation.endpoints, newEndpoint],
      })
    }
  }

  // 更新端点
  const updateEndpoint = (index: number, updatedEndpoint: ApiEndpoint) => {
    if (documentation) {
      const newEndpoints = [...documentation.endpoints]
      newEndpoints[index] = updatedEndpoint
      setDocumentation({
        ...documentation,
        endpoints: newEndpoints,
      })
    }
  }

  // 删除端点
  const deleteEndpoint = (index: number) => {
    if (documentation) {
      const newEndpoints = [...documentation.endpoints]
      newEndpoints.splice(index, 1)
      setDocumentation({
        ...documentation,
        endpoints: newEndpoints,
      })
    }
  }

  // 生成预览
  const generatePreviews = () => {
    if (documentation) {
      // 生成Markdown预览
      const markdown = ApiDocumentationService.exportToMarkdown(documentation)
      setMarkdownPreview(markdown)

      // 生成OpenAPI预览
      const openApi = ApiDocumentationService.exportToOpenAPI(documentation)
      setOpenApiPreview(JSON.stringify(openApi, null, 2))

      // 切换到预览标签
      setActiveTab("preview")
    }
  }

  // 下载文档
  const downloadDocumentation = (format: "markdown" | "openapi") => {
    if (!documentation) return

    let content: string
    let filename: string
    let mimeType: string

    if (format === "markdown") {
      content = ApiDocumentationService.exportToMarkdown(documentation)
      filename = `${documentation.title.replace(/\s+/g, "-")}.md`
      mimeType = "text/markdown"
    } else {
      content = JSON.stringify(ApiDocumentationService.exportToOpenAPI(documentation), null, 2)
      filename = `${documentation.title.replace(/\s+/g, "-")}.json`
      mimeType = "application/json"
    }

    // 创建下载链接
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "文档已下载",
      description: `API文档已成功下载为 ${filename}。`,
    })
  }

  // 自动生成文档
  const autoGenerateDocumentation = () => {
    if (!selectedConfigId) return;
    
    setIsGenerating(true);
    
    // 模拟异步操作
    setTimeout(() => {
      const apiConfig = getConfigById(selectedConfigId);
      if (!apiConfig) {
        setIsGenerating(false);
        return;
      }
      
      // 创建示例端点
      const sampleEndpoints: ApiEndpoint[] = [
        {
          id: `endpoint-${Date.now()}-1`,
          path: "/api/users",
          method: "GET",
          description: "获取用户列表",
          tags: ["用户"],
          parameters: [
            {
              name: "page",
              in: "query",
              description: "页码",
              required: false,
              schema: { type: "integer" }
            },
            {
              name: "limit",
              in: "query",
              description: "每页记录数",
              required: false,
              schema: { type: "integer" }
            }
          ],
          responses: [
            {
              statusCode: "200",
              description: "成功获取用户列表",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: {
                    users: [
                      { id: 1, name: "张三", email: "zhangsan@example.com" },
                      { id: 2, name: "李四", email: "lisi@example.com" }
                    ],
                    total: 2
                  }
                }
              }
            }
          ]
        },
        {
          id: `endpoint-${Date.now()}-2`,
          path: "/api/users/{id}",
          method: "GET",
          description: "获取指定用户详情",
          tags: ["用户"],
          parameters: [
            {
              name: "id",
              in: "path",
              description: "用户ID",
              required: true,
              schema: { type: "integer" }
            }
          ],
          responses: [
            {
              statusCode: "200",
              description: "成功获取用户详情",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: {
                    id: 1,
                    name: "张三",
                    email: "zhangsan@example.com",
                    profile: {
                      avatar: "https://example.com/avatar.jpg",
                      bio: "用户简介"
                    }
                  }
                }
              }
            },
            {
              statusCode: "404",
              description: "用户不存在",
              content: {
                "application/json": {
                  schema: { type: "object" },
                  example: {
                    error: "用户不存在"
                  }
                }
              }
            }
          ]
        }
      ];
      
      // 更新文档
      setDocumentation(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          endpoints: [...prev.endpoints, ...sampleEndpoints],
          updatedAt: new Date().toISOString()
        };
      });
      
      setIsGenerating(false);
      
      toast({
        title: "文档已生成",
        description: "已自动生成API文档示例。",
      });
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <Label htmlFor="config-select">选择API配置</Label>
          <Select value={selectedConfigId} onValueChange={setSelectedConfigId}>
            <SelectTrigger id="config-select">
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveDocumentation} disabled={!documentation} className="whitespace-nowrap">
            <Save className="mr-2 h-4 w-4" />
            保存文档
          </Button>

          <Button
            variant="outline"
            onClick={generatePreviews}
            disabled={!documentation || documentation.endpoints.length === 0}
          >
            <Eye className="mr-2 h-4 w-4" />
            预览
          </Button>
          
          <Button
            variant="outline"
            onClick={autoGenerateDocumentation}
            disabled={!selectedConfigId || isGenerating}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            自动生成
          </Button>
        </div>
      </div>

      {selectedConfigId ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="editor">文档编辑器</TabsTrigger>
            <TabsTrigger value="preview">文档预览</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            {documentation && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>设置API文档的基本信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doc-title">文档标题</Label>
                      <Input
                        id="doc-title"
                        value={documentation.title}
                        onChange={(e) => setDocumentation({ ...documentation, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc-description">文档描述</Label>
                      <Textarea
                        id="doc-description"
                        value={documentation.description}
                        onChange={(e) => setDocumentation({ ...documentation, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doc-version">API版本</Label>
                      <Input
                        id="doc-version"
                        value={documentation.version}
                        onChange={(e) => setDocumentation({ ...documentation, version: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-save"
                        checked={isAutoSave}
                        onCheckedChange={setIsAutoSave}
                      />
                      <Label htmlFor="auto-save">启用自动保存</Label>
                      {lastSaved && isAutoSave && (
                        <span className="text-xs text-muted-foreground ml-2">
                          上次保存: {lastSaved.toLocaleString("zh-CN")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>API端点</CardTitle>
                      <CardDescription>定义API的端点、参数和响应</CardDescription>
                    </div>
                    <Button onClick={addEndpoint} size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      添加端点
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {documentation.endpoints.length > 0 ? (
                      <Accordion type="multiple" className="w-full">
                        {documentation.endpoints.map((endpoint, index) => (
                          <AccordionItem key={endpoint.id} value={endpoint.id}>
                            <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-md">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    endpoint.method === "GET"
                                      ? "secondary"
                                      : endpoint.method === "POST"
                                        ? "default"
                                        : endpoint.method === "PUT"
                                          ? "outline"
                                          : endpoint.method === "DELETE"
                                            ? "destructive"
                                            : "default"
                                  }
                                >
                                  {endpoint.method}
                                </Badge>
                                <span className="font-mono text-sm">{endpoint.path || "/path"}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pt-2">
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`endpoint-method-${index}`}>请求方法</Label>
                                    <Select
                                      value={endpoint.method}
                                      onValueChange={(value) => updateEndpoint(index, { ...endpoint, method: value })}
                                    >
                                      <SelectTrigger id={`endpoint-method-${index}`}>
                                        <SelectValue placeholder="选择方法" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="HEAD">HEAD</SelectItem>
                                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor={`endpoint-path-${index}`}>路径</Label>
                                    <Input
                                      id={`endpoint-path-${index}`}
                                      value={endpoint.path}
                                      onChange={(e) => updateEndpoint(index, { ...endpoint, path: e.target.value })}
                                      placeholder="/api/resource/{id}"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`endpoint-desc-${index}`}>描述</Label>
                                  <Textarea
                                    id={`endpoint-desc-${index}`}
                                    value={endpoint.description}
                                    onChange={(e) =>
                                      updateEndpoint(index, {
                                        ...endpoint,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="描述此端点的功能和用途"
                                    rows={2}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor={`endpoint-tags-${index}`}>标签</Label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {endpoint.tags.map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="flex items-center gap-1">
                                        {tag}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newTags = [...endpoint.tags]
                                            newTags.splice(tagIndex, 1)
                                            updateEndpoint(index, { ...endpoint, tags: newTags })
                                          }}
                                          className="ml-1 rounded-full hover:bg-muted p-0.5"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      id={`endpoint-tags-${index}`}
                                      placeholder="添加标签"
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && e.currentTarget.value) {
                                          e.preventDefault()
                                          const newTag = e.currentTarget.value.trim()
                                          if (newTag && !endpoint.tags.includes(newTag)) {
                                            updateEndpoint(index, {
                                              ...endpoint,
                                              tags: [...endpoint.tags, newTag],
                                            })
                                            e.currentTarget.value = ""
                                          }
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={(e) => {
                                        const input = document.getElementById(
                                          `endpoint-tags-${index}`,
                                        ) as HTMLInputElement
                                        if (input && input.value.trim()) {
                                          const newTag = input.value.trim()
                                          if (!endpoint.tags.includes(newTag)) {
                                            updateEndpoint(index, {
                                              ...endpoint,
                                              tags: [...endpoint.tags, newTag],
                                            })
                                            input.value = ""
                                          }
                                        }
                                      }}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <Separator />

                                {/* 参数部分 */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>参数</Label>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newParam = ApiDocumentationService.createParameter()
                                        updateEndpoint(index, {
                                          ...endpoint,
                                          parameters: [...endpoint.parameters, newParam],
                                        })
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      添加参数
                                    </Button>
                                  </div>

                                  {endpoint.parameters.length > 0 ? (
                                    <div className="space-y-4">
                                      {endpoint.parameters.map((param, paramIndex) => (
                                        <Card key={paramIndex} className="border border-muted">
                                          <CardContent className="p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                                <div className="space-y-2">
                                                  <Label htmlFor={`param-name-${index}-${paramIndex}`}>参数名称</Label>
                                                  <Input
                                                    id={`param-name-${index}-${paramIndex}`}
                                                    value={param.name}
                                                    onChange={(e) => {
                                                      const newParams = [...endpoint.parameters]
                                                      newParams[paramIndex] = {
                                                        ...param,
                                                        name: e.target.value,
                                                      }
                                                      updateEndpoint(index, {
                                                        ...endpoint,
                                                        parameters: newParams,
                                                      })
                                                    }}
                                                    placeholder="参数名称"
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label htmlFor={`param-in-${index}-${paramIndex}`}>参数位置</Label>
                                                  <Select
                                                    value={param.in}
                                                    onValueChange={(value: "query" | "path" | "header" | "cookie") => {
                                                      const newParams = [...endpoint.parameters]
                                                      newParams[paramIndex] = {
                                                        ...param,
                                                        in: value,
                                                      }
                                                      updateEndpoint(index, {
                                                        ...endpoint,
                                                        parameters: newParams,
                                                      })
                                                    }}
                                                  >
                                                    <SelectTrigger id={`param-in-${index}-${paramIndex}`}>
                                                      <SelectValue placeholder="参数位置" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectItem value="query">查询参数</SelectItem>
                                                      <SelectItem value="path">路径参数</SelectItem>
                                                      <SelectItem value="header">请求头</SelectItem>
                                                      <SelectItem value="cookie">Cookie</SelectItem>
                                                    </SelectContent>
                                                  </Select>
                                                </div>
                                              </div>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                  const newParams = [...endpoint.parameters]
                                                  newParams.splice(paramIndex, 1)
                                                  updateEndpoint(index, {
                                                    ...endpoint,
                                                    parameters: newParams,
                                                  })
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div className="space-y-2">
                                                <Label htmlFor={`param-type-${index}-${paramIndex}`}>数据类型</Label>
                                                <Select
                                                  value={param.schema.type}
                                                  onValueChange={(value) => {
                                                    const newParams = [...endpoint.parameters]
                                                    newParams[paramIndex] = {
                                                      ...param,
                                                      schema: {
                                                        ...param.schema,
                                                        type: value,
                                                      },
                                                    }
                                                    updateEndpoint(index, {
                                                      ...endpoint,
                                                      parameters: newParams,
                                                    })
                                                  }}
                                                >
                                                  <SelectTrigger id={`param-type-${index}-${paramIndex}`}>
                                                    <SelectValue placeholder="数据类型" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="string">字符串</SelectItem>
                                                    <SelectItem value="number">数字</SelectItem>
                                                    <SelectItem value="integer">整数</SelectItem>
                                                    <SelectItem value="boolean">布尔值</SelectItem>
                                                    <SelectItem value="array">数组</SelectItem>
                                                    <SelectItem value="object">对象</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div className="flex items-center space-x-2 pt-8">
                                                <Switch
                                                  id={`param-required-${index}-${paramIndex}`}
                                                  checked={param.required}
                                                  onCheckedChange={(checked) => {
                                                    const newParams = [...endpoint.parameters]
                                                    newParams[paramIndex] = {
                                                      ...param,
                                                      required: checked,
                                                    }
                                                    updateEndpoint(index, {
                                                      ...endpoint,
                                                      parameters: newParams,
                                                    })
                                                  }}
                                                />
                                                <Label htmlFor={`param-required-${index}-${paramIndex}`}>
                                                  必填参数
                                                </Label>
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <Label htmlFor={`param-desc-${index}-${paramIndex}`}>参数描述</Label>
                                              <Textarea
                                                id={`param-desc-${index}-${paramIndex}`}
                                                value={param.description}
                                                onChange={(e) => {
                                                  const newParams = [...endpoint.parameters]
                                                  newParams[paramIndex] = {
                                                    ...param,
                                                    description: e.target.value,
                                                  }
                                                  updateEndpoint(index, {
                                                    ...endpoint,
                                                    parameters: newParams,
                                                  })
                                                }}
                                                placeholder="描述此参数的用途和格式"
                                                rows={2}
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-muted-foreground">尚未添加参数</div>
                                  )}
                                </div>

                                <Separator />

                                {/* 请求体部分 */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>请求体</Label>
                                    {!endpoint.requestBody ? (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          updateEndpoint(index, {
                                            ...endpoint,
                                            requestBody: {
                                              description: "",
                                              required: true,
                                              content: {
                                                "application/json": {
                                                  schema: { type: "object", properties: {} },
                                                },
                                              },
                                            },
                                          })
                                        }}
                                      >
                                        <Plus className="mr-2 h-4 w-4" />
                                        添加请求体
                                      </Button>
                                    ) : (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          updateEndpoint(index, {
                                            ...endpoint,
                                            requestBody: undefined,
                                          })
                                        }}
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        移除请求体
                                      </Button>
                                    )}
                                  </div>

                                  {endpoint.requestBody ? (
                                    <Card className="border border-muted">
                                      <CardContent className="p-4 space-y-4">
                                        <div className="space-y-2">
                                          <Label htmlFor={`req-desc-${index}`}>描述</Label>
                                          <Textarea
                                            id={`req-desc-${index}`}
                                            value={endpoint.requestBody.description}
                                            onChange={(e) => {
                                              updateEndpoint(index, {
                                                ...endpoint,
                                                requestBody: {
                                                  ...endpoint.requestBody,
                                                  description: e.target.value,
                                                },
                                              })
                                            }}
                                            placeholder="描述请求体的格式和用途"
                                            rows={2}
                                          />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                          <Switch
                                            id={`req-required-${index}`}
                                            checked={endpoint.requestBody.required}
                                            onCheckedChange={(checked) => {
                                              updateEndpoint(index, {
                                                ...endpoint,
                                                requestBody: {
                                                  ...endpoint.requestBody,
                                                  required: checked,
                                                },
                                              })
                                            }}
                                          />
                                          <Label htmlFor={`req-required-${index}`}>必填请求体</Label>
                                        </div>

                                        <div className="space-y-2">
                                          <Label htmlFor={`req-example-${index}`}>示例 (JSON)</Label>
                                          <Textarea
                                            id={`req-example-${index}`}
                                            value={
                                              endpoint.requestBody.content?.["application/json"]?.example
                                                ? JSON.stringify(
                                                    endpoint.requestBody.content["application/json"].example,
                                                    null,
                                                    2,
                                                  )
                                                : ""
                                            }
                                            onChange={(e) => {
                                              try {
                                                const example = e.target.value ? JSON.parse(e.target.value) : undefined
                                                updateEndpoint(index, {
                                                  ...endpoint,
                                                  requestBody: {
                                                    ...endpoint.requestBody,
                                                    content: {
                                                      "application/json": {
                                                        ...endpoint.requestBody.content["application/json"],
                                                        example,
                                                      },
                                                    },
                                                  },
                                                })
                                              } catch (error) {
                                                // 忽略JSON解析错误，等用户输入完成
                                              }
                                            }}
                                            placeholder='{"key": "value"}'
                                            rows={5}
                                            className="font-mono text-sm"
                                          />
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ) : (
                                    <div className="text-center py-4 text-muted-foreground">尚未添加请求体</div>
                                  )}
                                </div>

                                <Separator />

                                {/* 响应部分 */}
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <Label>响应</Label>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newResponse = ApiDocumentationService.createResponse()
                                        updateEndpoint(index, {
                                          ...endpoint,
                                          responses: [...endpoint.responses, newResponse],
                                        })
                                      }}
                                    >
                                      <Plus className="mr-2 h-4 w-4" />
                                      添加响应
                                    </Button>
                                  </div>

                                  {endpoint.responses.length > 0 ? (
                                    <div className="space-y-4">
                                      {endpoint.responses.map((response, respIndex) => (
                                        <Card key={respIndex} className="border border-muted">
                                          <CardContent className="p-4 space-y-4">
                                            <div className="flex justify-between items-start">
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                                <div className="space-y-2">
                                                  <Label htmlFor={`resp-status-${index}-${respIndex}`}>状态码</Label>
                                                  <Input
                                                    id={`resp-status-${index}-${respIndex}`}
                                                    value={response.statusCode}
                                                    onChange={(e) => {
                                                      const newResponses = [...endpoint.responses]
                                                      newResponses[respIndex] = {
                                                        ...response,
                                                        statusCode: e.target.value,
                                                      }
                                                      updateEndpoint(index, {
                                                        ...endpoint,
                                                        responses: newResponses,
                                                      })
                                                    }}
                                                    placeholder="200"
                                                  />
                                                </div>
                                                <div className="space-y-2">
                                                  <Label htmlFor={`resp-desc-${index}-${respIndex}`}>描述</Label>
                                                  <Input
                                                    id={`resp-desc-${index}-${respIndex}`}
                                                    value={response.description}
                                                    onChange={(e) => {
                                                      const newResponses = [...endpoint.responses]
                                                      newResponses[respIndex] = {
                                                        ...response,
                                                        description: e.target.value,
                                                      }
                                                      updateEndpoint(index, {
                                                        ...endpoint,
                                                        responses: newResponses,
                                                      })
                                                    }}
                                                    placeholder="成功响应"
                                                  />
                                                </div>
                                              </div>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                  const newResponses = [...endpoint.responses]
                                                  newResponses.splice(respIndex, 1)
                                                  updateEndpoint(index, {
                                                    ...endpoint,
                                                    responses: newResponses,
                                                  })
                                                }}
                                              >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                            </div>

                                            <div className="space-y-2">
                                              <Label htmlFor={`resp-example-${index}-${respIndex}`}>示例 (JSON)</Label>
                                              <Textarea
                                                id={`resp-example-${index}-${respIndex}`}
                                                value={
                                                  response.content?.["application/json"]?.example
                                                    ? JSON.stringify(
                                                        response.content["application/json"].example,
                                                        null,
                                                        2,
                                                      )
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  try {
                                                    const example = e.target.value ? JSON.parse(e.target.value) : undefined
                                                    const newResponses = [...endpoint.responses]
                                                    newResponses[respIndex] = {
                                                      ...response,
                                                      content: {
                                                        "application/json": {
                                                          schema: { type: "object" },
                                                          example,
                                                        },
                                                      },
                                                    }
                                                    updateEndpoint(index, {
                                                      ...endpoint,
                                                      responses: newResponses,
                                                    })
                                                  } catch (error) {
                                                    // 忽略JSON解析错误，等用户输入完成
                                                  }
                                                }}
                                                placeholder='{"key": "value"}'
                                                rows={5}
                                                className="font-mono text-sm"
                                              />
                                            </div>
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center py-4 text-muted-foreground">尚未添加响应</div>
                                  )}
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteEndpoint(index)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    删除端点
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">尚未添加任何API端点</p>
                        <Button onClick={addEndpoint}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          添加第一个端点
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">文档预览</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocumentation("markdown")}
                  disabled={!markdownPreview}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  下载Markdown
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocumentation("openapi")}
                  disabled={!openApiPreview}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  下载OpenAPI
                </Button>
              </div>
            </div>

            <Tabs defaultValue="markdown" className="w-full">
              <TabsList>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="openapi">OpenAPI</TabsTrigger>
              </TabsList>
              <TabsContent value="markdown">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Markdown预览</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(markdownPreview)
                        toast({
                          title: "已复制",
                          description: "Markdown内容已复制到剪贴板。",
                        })
                      }}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      复制
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {markdownPreview ? (
                      <div className="border rounded-md p-4 bg-muted/30">
                        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[500px]">
                          {markdownPreview}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>尚未生成预览</p>
                        <p className="text-sm mt-2">点击"预览"按钮生成文档预览</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="openapi">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>OpenAPI预览</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(openApiPreview)
                          toast({
                            title: "已复制",
                            description: "OpenAPI内容已复制到剪贴板。",
                          })
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        复制
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          window.open("https://editor.swagger.io", "_blank")
                        }}
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        在Swagger编辑器中打开
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {openApiPreview ? (
                      <div className="border rounded-md p-4 bg-muted/30">
                        <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[500px]">
                          {openApiPreview}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>尚未生成预览</p>
                        <p className="text-sm mt-2">点击"预览"按钮生成文档预览</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">选择API配置</h3>
              <p className="text-muted-foreground">请从上方下拉菜单选择一个API配置以开始编辑文档</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
