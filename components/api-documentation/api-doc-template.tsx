"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, ExternalLink, Eye, FileJson, FileText, Terminal } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ApiDocTemplateProps {
  title: string
  description: string
  language: string
  category: string
  lastUpdated: string
  author: string
  tags: string[]
  markdown: string
  requestExample: string
  responseExample: string
  sdkExample: string
  apiSpecification: any
}

export function ApiDocTemplate({
  title,
  description,
  language,
  category,
  lastUpdated,
  author,
  tags,
  markdown,
  requestExample,
  responseExample,
  sdkExample,
  apiSpecification,
}: ApiDocTemplateProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("documentation")

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制到剪贴板",
      description: message,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{language}</Badge>
            <Badge variant="outline">{category}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4 text-sm text-muted-foreground">
          <div>最后更新: {lastUpdated}</div>
          <div className="hidden sm:block">•</div>
          <div>作者: {author}</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full">
          <TabsTrigger value="documentation">文档</TabsTrigger>
          <TabsTrigger value="examples">代码示例</TabsTrigger>
          <TabsTrigger value="sdk">SDK用法</TabsTrigger>
          <TabsTrigger value="specification">API规范</TabsTrigger>
          <TabsTrigger value="playground" className="hidden lg:inline-flex">
            在线测试
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API文档</CardTitle>
              <CardDescription>详细的API使用说明和参考文档</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {/* 这里渲染Markdown内容 */}
                <div dangerouslySetInnerHTML={{ __html: "<p>这里是Markdown渲染后的HTML内容</p>" }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>请求示例</CardTitle>
              <CardDescription>API请求代码示例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{requestExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(requestExample, "请求示例代码已复制")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>响应示例</CardTitle>
              <CardDescription>API响应数据示例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{responseExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(responseExample, "响应示例代码已复制")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SDK使用示例</CardTitle>
              <CardDescription>使用SDK调用API���代码示例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{sdkExample}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(sdkExample, "SDK示例代码已复制")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  下载SDK
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  SDK文档
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  GitHub仓库
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API规范</CardTitle>
              <CardDescription>完整的API规范文档</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="openapi">
                <TabsList>
                  <TabsTrigger value="openapi">OpenAPI规范</TabsTrigger>
                  <TabsTrigger value="json">JSON格式</TabsTrigger>
                  <TabsTrigger value="yaml">YAML格式</TabsTrigger>
                </TabsList>
                <TabsContent value="openapi" className="mt-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <div className="p-4">
                      <pre className="text-sm font-mono">{JSON.stringify(apiSpecification, null, 2)}</pre>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="json" className="mt-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <div className="p-4">
                      <pre className="text-sm font-mono">{JSON.stringify(apiSpecification, null, 2)}</pre>
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="yaml" className="mt-4">
                  <ScrollArea className="h-[400px] w-full rounded-md border">
                    <div className="p-4">
                      <pre className="text-sm font-mono">
                        {/* YAML格式的API规范 */}
                        openapi: 3.0.0 info: title: Sample API version: 1.0.0 paths: /users: get: summary: Get users
                        responses: '200': description: Success
                      </pre>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <FileJson className="mr-2 h-4 w-4" />
                  下载OpenAPI规范
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  在Swagger UI中查看
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="playground" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API在线测试</CardTitle>
              <CardDescription>在浏览器中直接测试API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">请求</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium">端点</label>
                        <div className="flex mt-1">
                          <Button variant="outline" className="rounded-r-none">
                            GET
                          </Button>
                          <input
                            type="text"
                            className="flex-1 rounded-l-none rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value="/api/v1/users"
                            readOnly
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">请求头</label>
                        <textarea
                          className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          rows={3}
                          defaultValue={`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
Accept: application/json`}
                        ></textarea>
                      </div>
                      <div>
                        <label className="text-sm font-medium">请求体</label>
                        <textarea
                          className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          rows={5}
                          defaultValue={`{
  "name": "测试用户",
  "email": "test@example.com",
  "role": "user"
}`}
                        ></textarea>
                      </div>
                      <Button className="w-full">
                        <Terminal className="mr-2 h-4 w-4" />
                        发送请求
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">响应</h3>
                    <Separator className="my-2" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge className="mr-2">200 OK</Badge>
                          <span className="text-sm text-muted-foreground">100ms</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto max-h-[300px]">
                        <code className="text-sm font-mono">
                          {JSON.stringify(
                            {
                              id: 1,
                              name: "测试用户",
                              email: "test@example.com",
                              role: "user",
                              createdAt: "2023-05-15T08:40:51.620Z",
                            },
                            null,
                            2,
                          )}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
