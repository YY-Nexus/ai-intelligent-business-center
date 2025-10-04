"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Play, Save, Clock, Download, Copy, XCircle } from "lucide-react"
import { apiClientPool } from "@/lib/api-binding/core/api-client-factory"
import { apiConfigStorage } from "@/lib/api-binding/config/config-storage"
import { useToast } from "@/components/ui/use-toast"
import type { ApiConfig } from "@/lib/api-binding/config/config-types"

interface ApiTestRunnerProps {
  configId?: string
  initialConfig?: ApiConfig
}

export function ApiTestRunner({ configId, initialConfig }: ApiTestRunnerProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("request")
  const [config, setConfig] = useState<ApiConfig>(
    initialConfig || {
      name: "",
      baseUrl: "",
      method: "GET",
      headers: {},
      params: {},
      auth: { type: "none" },
    },
  )

  const [testResult, setTestResult] = useState<{
    status?: number
    statusText?: string
    headers?: Record<string, string>
    data?: any
    error?: string
    duration?: number
  } | null>(null)

  // 运行API测试
  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // 获取或创建API客户端
      const client = apiClientPool.getOrCreate(configId || "temp_test_client", config)

      const startTime = performance.now()

      // 执行请求
      const response = await client.request({
        method: config.method,
        path: config.endpoint || "",
        params: config.params,
        data: config.requestBody ? JSON.parse(config.requestBody) : undefined,
      })

      const endTime = performance.now()

      // 设置测试结果
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data,
        duration: Math.round(endTime - startTime),
      })

      // 自动切换到响应标签页
      setActiveTab("response")
    } catch (error: any) {
      setTestResult({
        error: error.message || "请求失败",
        status: error.status,
        data: error.response?.data,
      })
      setActiveTab("response")
    } finally {
      setIsLoading(false)
    }
  }

  // 保存配置
  const saveConfig = async () => {
    try {
      if (!config.name) {
        toast({
          title: "保存失败",
          description: "请输入API配置名称",
          variant: "destructive",
        })
        return
      }

      const savedId = await apiConfigStorage.saveConfig(config)

      toast({
        title: "保存成功",
        description: `API配置 "${config.name}" 已保存`,
      })

      return savedId
    } catch (error) {
      toast({
        title: "保存失败",
        description: "保存API配置时出错",
        variant: "destructive",
      })
    }
  }

  // 复制响应数据
  const copyResponseData = () => {
    if (testResult?.data) {
      navigator.clipboard.writeText(
        typeof testResult.data === "object" ? JSON.stringify(testResult.data, null, 2) : String(testResult.data),
      )
      toast({
        title: "已复制",
        description: "响应数据已复制到剪贴板",
      })
    }
  }

  // 下载响应数据
  const downloadResponseData = () => {
    if (testResult?.data) {
      const data =
        typeof testResult.data === "object" ? JSON.stringify(testResult.data, null, 2) : String(testResult.data)

      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `api-response-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API测试</CardTitle>
        <CardDescription>测试API配置并查看响应结果</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">API名称</Label>
              <Input
                id="api-name"
                value={config.name || ""}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="输入API名称"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base-url">基础URL</Label>
              <Input
                id="base-url"
                value={config.baseUrl || ""}
                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                placeholder="https://api.example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="method">请求方法</Label>
              <Select value={config.method || "GET"} onValueChange={(value) => setConfig({ ...config, method: value })}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="选择请求方法" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endpoint">端点路径</Label>
              <Input
                id="endpoint"
                value={config.endpoint || ""}
                onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                placeholder="/users"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="request">请求</TabsTrigger>
              <TabsTrigger value="response">响应</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="request-body">请求体 (JSON)</Label>
                <Textarea
                  id="request-body"
                  value={config.requestBody || ""}
                  onChange={(e) => setConfig({ ...config, requestBody: e.target.value })}
                  placeholder='{
  "name": "示例",
  "value": 123
}'
                  className="font-mono h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="headers">请求头</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const headers = { ...config.headers } || {}
                      headers["Content-Type"] = "application/json"
                      setConfig({ ...config, headers })
                    }}
                  >
                    添加Content-Type
                  </Button>
                </div>

                <div className="space-y-2">
                  {Object.entries(config.headers || {}).map(([key, value], index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const headers = { ...config.headers }
                          delete headers[key]
                          headers[e.target.value] = value
                          setConfig({ ...config, headers })
                        }}
                        placeholder="Header名称"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          const headers = { ...config.headers }
                          headers[key] = e.target.value
                          setConfig({ ...config, headers })
                        }}
                        placeholder="Header值"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const headers = { ...config.headers }
                          delete headers[key]
                          setConfig({ ...config, headers })
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const headers = { ...config.headers } || {}
                      headers[""] = ""
                      setConfig({ ...config, headers })
                    }}
                  >
                    添加请求头
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="pt-4">
              {testResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={testResult.status && testResult.status < 400 ? "outline" : "destructive"}
                        className={
                          testResult.status && testResult.status < 400
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : ""
                        }
                      >
                        {testResult.status || "错误"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {testResult.statusText || (testResult.error ? "请求失败" : "")}
                      </span>
                    </div>

                    {testResult.duration && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{testResult.duration} ms</span>
                      </div>
                    )}
                  </div>

                  {testResult.error ? (
                    <div className="p-4 border rounded-md bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-400">
                      <p className="font-medium">错误</p>
                      <p className="text-sm">{testResult.error}</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>响应头</Label>
                        <ScrollArea className="h-[100px] rounded-md border p-2">
                          <div className="space-y-1">
                            {testResult.headers &&
                              Object.entries(testResult.headers).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-3 text-sm">
                                  <span className="font-medium">{key}:</span>
                                  <span className="col-span-2 text-muted-foreground">{value}</span>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>响应数据</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={copyResponseData}>
                              <Copy className="h-3 w-3 mr-1" />
                              复制
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadResponseData}>
                              <Download className="h-3 w-3 mr-1" />
                              下载
                            </Button>
                          </div>
                        </div>

                        <ScrollArea className="h-[300px] rounded-md border p-2">
                          <pre className="text-sm font-mono whitespace-pre-wrap">
                            {typeof testResult.data === "object"
                              ? JSON.stringify(testResult.data, null, 2)
                              : testResult.data}
                          </pre>
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <div className="mb-4">
                    <Play className="h-12 w-12 opacity-20" />
                  </div>
                  <p>点击"运行测试"按钮发送请求并查看响应</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={saveConfig}>
          <Save className="mr-2 h-4 w-4" />
          保存配置
        </Button>
        <Button onClick={runTest} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              测试中...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              运行测试
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
