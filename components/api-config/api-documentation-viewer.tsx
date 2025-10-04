"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Copy, Code, RefreshCw, ExternalLink } from "lucide-react"
import { apiConfigStorage } from "@/lib/api-binding/config/config-storage"
import { DocumentationGenerator } from "@/lib/documentation/documentation-generator"
import { useToast } from "@/components/ui/use-toast"
import type { ApiConfig } from "@/lib/api-binding/config/config-types"
import type { ApiDocumentation } from "@/lib/documentation/documentation-generator"
import ReactMarkdown from "react-markdown"

export function ApiDocumentationViewer() {
  const { toast } = useToast()
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({})
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("markdown")
  const [documentation, setDocumentation] = useState<ApiDocumentation | null>(null)
  const [markdownDoc, setMarkdownDoc] = useState<string>("")
  const [openApiDoc, setOpenApiDoc] = useState<any>(null)

  // 加载API配置
  useEffect(() => {
    const loadConfigs = async () => {
      const configs = await apiConfigStorage.getAllConfigs()
      setConfigs(configs)

      // 如果有配置，选择第一个
      const configIds = Object.keys(configs)
      if (configIds.length > 0 && !selectedConfigId) {
        setSelectedConfigId(configIds[0])
      }
    }

    loadConfigs()
  }, [selectedConfigId])

  // 生成文档
  useEffect(() => {
    if (selectedConfigId && configs[selectedConfigId]) {
      const config = configs[selectedConfigId]
      const doc = DocumentationGenerator.generateFromConfig(config)
      setDocumentation(doc)

      // 生成Markdown
      const markdown = DocumentationGenerator.generateMarkdown(doc)
      setMarkdownDoc(markdown)

      // 生成OpenAPI
      const openapi = DocumentationGenerator.exportToOpenAPI(doc)
      setOpenApiDoc(openapi)
    }
  }, [selectedConfigId, configs])

  // 复制Markdown
  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownDoc)
    toast({
      title: "已复制",
      description: "Markdown文档已复制到剪贴板",
    })
  }

  // 复制OpenAPI
  const copyOpenApi = () => {
    navigator.clipboard.writeText(JSON.stringify(openApiDoc, null, 2))
    toast({
      title: "已复制",
      description: "OpenAPI文档已复制到剪贴板",
    })
  }

  // 下载Markdown
  const downloadMarkdown = () => {
    const blob = new Blob([markdownDoc], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentation?.title || "api-documentation"}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 下载OpenAPI
  const downloadOpenApi = () => {
    const blob = new Blob([JSON.stringify(openApiDoc, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentation?.title || "api-documentation"}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 刷新文档
  const refreshDocumentation = () => {
    if (selectedConfigId && configs[selectedConfigId]) {
      const config = configs[selectedConfigId]
      const doc = DocumentationGenerator.generateFromConfig(config)
      setDocumentation(doc)

      // 生成Markdown
      const markdown = DocumentationGenerator.generateMarkdown(doc)
      setMarkdownDoc(markdown)

      // 生成OpenAPI
      const openapi = DocumentationGenerator.exportToOpenAPI(doc)
      setOpenApiDoc(openapi)

      toast({
        title: "文档已刷新",
        description: "API文档已重新生成",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">API文档</h2>
          <p className="text-muted-foreground">生成和管理API文档</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedConfigId || ""} onValueChange={setSelectedConfigId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择API配置" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(configs).map(([id, config]) => (
                <SelectItem key={id} value={id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={refreshDocumentation}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
        </div>
      </div>

      {selectedConfigId && documentation ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{documentation.title}</CardTitle>
                <CardDescription>{documentation.description}</CardDescription>
              </div>
              <Badge variant="outline">版本 {documentation.version}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="markdown">
                  <FileText className="h-4 w-4 mr-2" />
                  Markdown
                </TabsTrigger>
                <TabsTrigger value="openapi">
                  <Code className="h-4 w-4 mr-2" />
                  OpenAPI
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  预览
                </TabsTrigger>
              </TabsList>

              <TabsContent value="markdown">
                <div className="flex justify-end gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={copyMarkdown}>
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </Button>
                </div>
                <ScrollArea className="h-[500px] rounded-md border">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{markdownDoc}</pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="openapi">
                <div className="flex justify-end gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={copyOpenApi}>
                    <Copy className="h-4 w-4 mr-2" />
                    复制
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadOpenApi}>
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </Button>
                </div>
                <ScrollArea className="h-[500px] rounded-md border">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{JSON.stringify(openApiDoc, null, 2)}</pre>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="preview">
                <ScrollArea className="h-[500px] rounded-md border">
                  <div className="p-4 prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{markdownDoc}</ReactMarkdown>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">端点数量: {documentation.endpoints.length}</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshDocumentation}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 rounded-full bg-muted p-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">未选择API配置</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
              请从下拉菜单中选择一个API配置，或者创建一个新��API配置来生成文档。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
