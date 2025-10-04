"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useApiConfig } from "./api-config-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ApiClient, type HttpMethod } from "@/lib/api-binding"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function ApiConfigTest() {
  const searchParams = useSearchParams()
  const configId = searchParams.get("id")
  const { configs, getConfigById } = useApiConfig()
  const { toast } = useToast()

  // 选中的配置
  const [selectedConfigId, setSelectedConfigId] = useState(configId || "")

  // 请求参数
  const [method, setMethod] = useState<HttpMethod>("GET")
  const [path, setPath] = useState("")
  const [queryParams, setQueryParams] = useState("")
  const [headers, setHeaders] = useState("")
  const [body, setBody] = useState("")

  // 响应数据
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [responseTime, setResponseTime] = useState<number | null>(null)

  // 当URL参数中的配置ID变化时更新选中的配置
  useEffect(() => {
    if (configId) {
      setSelectedConfigId(configId)
    }
  }, [configId])

  // 发送请求
  const handleSendRequest = async () => {
    setLoading(true)
    setResponse(null)
    setError(null)
    setResponseTime(null)

    try {
      const config = getConfigById(selectedConfigId)
      if (!config) {
        throw new Error("未找到API配置")
      }

      // 创建API客户端
      const apiClient = new ApiClient({
        config: config.config,
        auth: config.auth,
      })

      // 解析查询参数
      let parsedQueryParams: Record<string, string> = {}
      if (queryParams.trim()) {
        try {
          parsedQueryParams = JSON.parse(queryParams)
        } catch (error) {
          // 尝试解析URL查询字符串格式
          const params = new URLSearchParams(queryParams)
          params.forEach((value, key) => {
            parsedQueryParams[key] = value
          })
        }
      }

      // 解析头部
      let parsedHeaders: Record<string, string> = {}
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers)
        } catch (error) {
          toast({
            title: "头部格式错误",
            description: "请确保头部是有效的JSON格式。",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      // 解析请求体
      let parsedBody: any = null
      if (body.trim()) {
        try {
          parsedBody = JSON.parse(body)
        } catch (error) {
          // 如果不是JSON，使用原始文本
          parsedBody = body
        }
      }

      // 记录开始时间
      const startTime = Date.now()

      // 发送请求
      const response = await apiClient.request({
        method,
        path,
        queryParams: parsedQueryParams,
        headers: parsedHeaders,
        body: parsedBody,
      })

      // 计算响应时间
      const endTime = Date.now()
      setResponseTime(endTime - startTime)

      // 设置响应
      setResponse(response)
    } catch (error) {
      console.error("API请求失败:", error)
      setError(error instanceof Error ? error.message : "未知错误")
    } finally {
      setLoading(false)
    }
  }

  // 格式化JSON
  const formatJson = (json: any): string => {
    try {
      return JSON.stringify(json, null, 2)
    } catch (error) {
      return String(json)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API测试工具</CardTitle>
          <CardDescription>测试API配置并查看响应结果</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
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

          {selectedConfigId && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="method-select">请求方法</Label>
                  <Select value={method} onValueChange={(value) => setMethod(value as HttpMethod)}>
                    <SelectTrigger id="method-select">
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

                <div className="md:col-span-3">
                  <Label htmlFor="path-input">路径</Label>
                  <Input id="path-input" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/users" />
                </div>
              </div>

              <Tabs defaultValue="params" className="w-full">
                <TabsList>
                  <TabsTrigger value="params">查询参数</TabsTrigger>
                  <TabsTrigger value="headers">请求头</TabsTrigger>
                  <TabsTrigger value="body">请求体</TabsTrigger>
                </TabsList>

                <TabsContent value="params" className="space-y-2">
                  <Label htmlFor="query-params">查询参数 (JSON或URL查询字符串)</Label>
                  <Textarea
                    id="query-params"
                    value={queryParams}
                    onChange={(e) => setQueryParams(e.target.value)}
                    placeholder={`{\n  "page": 1,\n  "limit": 10\n}\n\n或\n\npage=1&limit=10`}
                    className="font-mono"
                    rows={5}
                  />
                </TabsContent>

                <TabsContent value="headers" className="space-y-2">
                  <Label htmlFor="headers-input">请求头 (JSON)</Label>
                  <Textarea
                    id="headers-input"
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder={`{\n  "Content-Type": "application/json",\n  "Accept": "application/json"\n}`}
                    className="font-mono"
                    rows={5}
                  />
                </TabsContent>

                <TabsContent value="body" className="space-y-2">
                  <Label htmlFor="body-input">请求体 (JSON或文本)</Label>
                  <Textarea
                    id="body-input"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder={`{\n  "name": "示例",\n  "email": "example@example.com"\n}`}
                    className="font-mono"
                    rows={8}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button onClick={handleSendRequest} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      发送中...
                    </>
                  ) : (
                    "发送请求"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {(response || error) && (
        <Card>
          <CardHeader>
            <CardTitle>响应结果</CardTitle>
            {responseTime !== null && <CardDescription>响应时间: {responseTime} 毫秒</CardDescription>}
          </CardHeader>

          <CardContent>
            {error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
                <h3 className="font-semibold mb-2">错误</h3>
                <p>{error}</p>
              </div>
            ) : response ? (
              <Tabs defaultValue="response" className="w-full">
                <TabsList>
                  <TabsTrigger value="response">响应数据</TabsTrigger>
                  <TabsTrigger value="headers">响应头</TabsTrigger>
                  <TabsTrigger value="info">响应信息</TabsTrigger>
                </TabsList>

                <TabsContent value="response">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{formatJson(response.data)}</pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="headers">
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{formatJson(response.headers)}</pre>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="info">
                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="font-semibold mb-1">状态码</h3>
                      <p>
                        {response.status} {response.statusText}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">请求URL</h3>
                      <p className="break-all">{response.request?.url || "未知"}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">请求方法</h3>
                      <p>{response.request?.method || "未知"}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
