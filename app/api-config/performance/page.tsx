"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Gauge, BarChart, Clock, ArrowRight, Play, Pause } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ResponseTimeChart } from "@/components/api-config/charts/response-time-chart"

export default function PerformancePage() {
  const { toast } = useToast()
  const [testRunning, setTestRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [testResults, setTestResults] = useState<any>(null)
  const [testConfig, setTestConfig] = useState({
    endpoint: "/api/users/profile",
    method: "GET",
    concurrentUsers: 10,
    rampUpTime: 5,
    duration: 30,
    thinkTime: 1000,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: "{}",
    assertions: true,
  })

  // 模拟API端点列表
  const apiEndpoints = [
    { id: "/api/users/profile", name: "获取用户资料" },
    { id: "/api/users/update", name: "更新用户资料" },
    { id: "/api/products/list", name: "获取产品列表" },
    { id: "/api/products/search", name: "搜索产品" },
    { id: "/api/orders/create", name: "创建订单" },
    { id: "/api/orders/status", name: "获取订单状态" },
    { id: "/api/payments/process", name: "处理支付" },
    { id: "/api/auth/token", name: "获取认证令牌" },
  ]

  // 启动性能测试
  const startTest = () => {
    setTestRunning(true)
    setProgress(0)
    setTestResults(null)

    toast({
      title: "性能测试已启动",
      description: `正在测试 ${testConfig.endpoint}，持续时间 ${testConfig.duration} 秒`,
    })

    // 模拟测试进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / testConfig.duration) * 0.5
        if (newProgress >= 100) {
          clearInterval(interval)
          completeTest()
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  // 停止性能测试
  const stopTest = () => {
    setTestRunning(false)
    setProgress(0)

    toast({
      title: "性能测试已停止",
      description: "测试已被手动停止",
      variant: "destructive",
    })
  }

  // 完成性能测试
  const completeTest = () => {
    setTestRunning(false)

    // 模拟测试结果
    const results = {
      summary: {
        totalRequests: Math.floor(Math.random() * 5000) + 10000,
        successfulRequests: Math.floor(Math.random() * 4000) + 9500,
        failedRequests: Math.floor(Math.random() * 500),
        averageResponseTime: Math.floor(Math.random() * 100) + 150,
        minResponseTime: Math.floor(Math.random() * 50) + 50,
        maxResponseTime: Math.floor(Math.random() * 500) + 500,
        requestsPerSecond: Math.floor(Math.random() * 200) + 300,
        throughput: Math.floor(Math.random() * 5) + 5,
      },
      percentiles: {
        p50: Math.floor(Math.random() * 50) + 150,
        p90: Math.floor(Math.random() * 100) + 250,
        p95: Math.floor(Math.random() * 150) + 350,
        p99: Math.floor(Math.random() * 200) + 450,
      },
      errorTypes: [
        { type: "超时", count: Math.floor(Math.random() * 100) },
        { type: "服务器错误", count: Math.floor(Math.random() * 100) },
        { type: "连接失败", count: Math.floor(Math.random() * 100) },
      ],
    }

    setTestResults(results)

    toast({
      title: "性能测试完成",
      description: `平均响应时间: ${results.summary.averageResponseTime}ms, 每秒请求数: ${results.summary.requestsPerSecond}`,
    })
  }

  // 添加请求头
  const addHeader = () => {
    setTestConfig({
      ...testConfig,
      headers: [...testConfig.headers, { key: "", value: "" }],
    })
  }

  // 更新请求头
  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...testConfig.headers]
    newHeaders[index][field] = value
    setTestConfig({
      ...testConfig,
      headers: newHeaders,
    })
  }

  // 删除请求头
  const removeHeader = (index: number) => {
    const newHeaders = [...testConfig.headers]
    newHeaders.splice(index, 1)
    setTestConfig({
      ...testConfig,
      headers: newHeaders,
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">性能测试</h1>
        <p className="text-muted-foreground">
          测试API的性能和负载能力，分析响应时间、吞吐量和错误率，确保API在高负载下的稳定性。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>测试配置</CardTitle>
              <CardDescription>配置性能测试参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">API端点</Label>
                <Select
                  value={testConfig.endpoint}
                  onValueChange={(value) => setTestConfig({ ...testConfig, endpoint: value })}
                  disabled={testRunning}
                >
                  <SelectTrigger id="endpoint">
                    <SelectValue placeholder="选择API端点" />
                  </SelectTrigger>
                  <SelectContent>
                    {apiEndpoints.map((endpoint) => (
                      <SelectItem key={endpoint.id} value={endpoint.id}>
                        {endpoint.name} ({endpoint.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">请求方法</Label>
                <Select
                  value={testConfig.method}
                  onValueChange={(value) => setTestConfig({ ...testConfig, method: value })}
                  disabled={testRunning}
                >
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

              <div className="space-y-2">
                <Label htmlFor="concurrentUsers">并发用户数</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="concurrentUsers"
                    value={[testConfig.concurrentUsers]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setTestConfig({ ...testConfig, concurrentUsers: value[0] })}
                    disabled={testRunning}
                  />
                  <span className="w-12 text-center">{testConfig.concurrentUsers}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rampUpTime">爬升时间（秒）</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="rampUpTime"
                    value={[testConfig.rampUpTime]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(value) => setTestConfig({ ...testConfig, rampUpTime: value[0] })}
                    disabled={testRunning}
                  />
                  <span className="w-12 text-center">{testConfig.rampUpTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">测试持续时间（秒）</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="duration"
                    value={[testConfig.duration]}
                    min={5}
                    max={300}
                    step={5}
                    onValueChange={(value) => setTestConfig({ ...testConfig, duration: value[0] })}
                    disabled={testRunning}
                  />
                  <span className="w-12 text-center">{testConfig.duration}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thinkTime">思考时间（毫秒）</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="thinkTime"
                    value={[testConfig.thinkTime]}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={(value) => setTestConfig({ ...testConfig, thinkTime: value[0] })}
                    disabled={testRunning}
                  />
                  <span className="w-16 text-center">{testConfig.thinkTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="headers">请求头</Label>
                  <Button variant="outline" size="sm" onClick={addHeader} disabled={testRunning}>
                    添加
                  </Button>
                </div>
                <div className="space-y-2">
                  {testConfig.headers.map((header, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="名称"
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                        disabled={testRunning}
                      />
                      <Input
                        placeholder="值"
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        disabled={testRunning}
                      />
                      <Button variant="ghost" size="sm" onClick={() => removeHeader(index)} disabled={testRunning}>
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {testConfig.method !== "GET" && (
                <div className="space-y-2">
                  <Label htmlFor="body">请求体</Label>
                  <textarea
                    id="body"
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    value={testConfig.body}
                    onChange={(e) => setTestConfig({ ...testConfig, body: e.target.value })}
                    disabled={testRunning}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="assertions"
                  checked={testConfig.assertions}
                  onCheckedChange={(checked) => setTestConfig({ ...testConfig, assertions: checked })}
                  disabled={testRunning}
                />
                <Label htmlFor="assertions">启用断言</Label>
              </div>
            </CardContent>
            <CardFooter>
              {!testRunning ? (
                <Button onClick={startTest} className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  开始测试
                </Button>
              ) : (
                <Button onClick={stopTest} variant="destructive" className="w-full">
                  <Pause className="mr-2 h-4 w-4" />
                  停止测试
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {testRunning ? (
            <Card>
              <CardHeader>
                <CardTitle>测试进行中</CardTitle>
                <CardDescription>
                  正在测试 {testConfig.endpoint}，持续时间 {testConfig.duration} 秒
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>进度</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Gauge className="h-8 w-8 text-blue-500 mb-2" />
                      <div className="text-2xl font-bold">{Math.floor(Math.random() * 200) + 300}/秒</div>
                      <div className="text-sm text-muted-foreground">请求速率</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Clock className="h-8 w-8 text-purple-500 mb-2" />
                      <div className="text-2xl font-bold">{Math.floor(Math.random() * 100) + 150}ms</div>
                      <div className="text-sm text-muted-foreground">平均响应时间</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <BarChart className="h-8 w-8 text-green-500 mb-2" />
                      <div className="text-2xl font-bold">{(Math.random() * 0.5 + 0.1).toFixed(2)}%</div>
                      <div className="text-sm text-muted-foreground">错误率</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-60">
                  <ResponseTimeChart />
                </div>
              </CardContent>
            </Card>
          ) : testResults ? (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="summary">摘要</TabsTrigger>
                <TabsTrigger value="response-times">响应时间</TabsTrigger>
                <TabsTrigger value="throughput">吞吐量</TabsTrigger>
                <TabsTrigger value="errors">错误分析</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>测试摘要</CardTitle>
                    <CardDescription>{testConfig.endpoint} 的性能测试结果</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">{testResults.summary.totalRequests.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">总请求数</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">
                            {testResults.summary.requestsPerSecond.toLocaleString()}/秒
                          </div>
                          <div className="text-sm text-muted-foreground">请求速率</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">
                            {testResults.summary.throughput.toLocaleString()} MB/s
                          </div>
                          <div className="text-sm text-muted-foreground">吞吐量</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">响应时间</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>平均响应时间</span>
                              <span className="font-medium">{testResults.summary.averageResponseTime} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>最小响应时间</span>
                              <span className="font-medium">{testResults.summary.minResponseTime} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>最大响应时间</span>
                              <span className="font-medium">{testResults.summary.maxResponseTime} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>P50 (中位数)</span>
                              <span className="font-medium">{testResults.percentiles.p50} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>P90</span>
                              <span className="font-medium">{testResults.percentiles.p90} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>P95</span>
                              <span className="font-medium">{testResults.percentiles.p95} ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>P99</span>
                              <span className="font-medium">{testResults.percentiles.p99} ms</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">成功/失败</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>成功请求</span>
                              <div className="flex items-center">
                                <span className="font-medium mr-2">
                                  {testResults.summary.successfulRequests.toLocaleString()}
                                </span>
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  {(
                                    (testResults.summary.successfulRequests / testResults.summary.totalRequests) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>失败请求</span>
                              <div className="flex items-center">
                                <span className="font-medium mr-2">
                                  {testResults.summary.failedRequests.toLocaleString()}
                                </span>
                                <Badge className="bg-red-50 text-red-700 border-red-200">
                                  {(
                                    (testResults.summary.failedRequests / testResults.summary.totalRequests) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-4">
                              <div className="text-sm font-medium mb-1">错误类型</div>
                              <div className="space-y-2">
                                {testResults.errorTypes.map((error: any, index: number) => (
                                  <div key={index} className="flex justify-between">
                                    <span>{error.type}</span>
                                    <span className="font-medium">{error.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="response-times">
                <Card>
                  <CardHeader>
                    <CardTitle>响应时间分析</CardTitle>
                    <CardDescription>响应时间分布和趋势</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="h-80">
                      <ResponseTimeChart />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">响应时间百分位</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Object.entries(testResults.percentiles).map(([key, value]: [string, any]) => (
                              <div key={key} className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <span>{key.toUpperCase()}</span>
                                  <span className="font-medium">{value} ms</span>
                                </div>
                                <Progress value={(value / testResults.summary.maxResponseTime) * 100} className="h-1" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">响应时间分布</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-60">
                            {/* 这里可以放置响应时间分布图表 */}
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              响应时间分布图表
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="throughput">
                <Card>
                  <CardHeader>
                    <CardTitle>吞吐量分析</CardTitle>
                    <CardDescription>请求速率和数据吞吐量</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="h-80">
                      {/* 这里可以放置吞吐量图表 */}
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        吞吐量趋势图表
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">请求速率</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>平均请求速率</span>
                              <span className="font-medium">{testResults.summary.requestsPerSecond}/秒</span>
                            </div>
                            <div className="flex justify-between">
                              <span>峰值请求速率</span>
                              <span className="font-medium">
                                {Math.floor(testResults.summary.requestsPerSecond * 1.5)}/秒
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>最低请求速率</span>
                              <span className="font-medium">
                                {Math.floor(testResults.summary.requestsPerSecond * 0.7)}/秒
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">数据吞吐量</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>平均吞吐量</span>
                              <span className="font-medium">{testResults.summary.throughput} MB/s</span>
                            </div>
                            <div className="flex justify-between">
                              <span>峰值吞吐量</span>
                              <span className="font-medium">
                                {(testResults.summary.throughput * 1.4).toFixed(1)} MB/s
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>总传输数据</span>
                              <span className="font-medium">
                                {Math.floor(testResults.summary.throughput * testConfig.duration)} MB
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="errors">
                <Card>
                  <CardHeader>
                    <CardTitle>错误分析</CardTitle>
                    <CardDescription>错误类型和分布</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">
                            {testResults.summary.failedRequests.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">失败请求总数</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">
                            {((testResults.summary.failedRequests / testResults.summary.totalRequests) * 100).toFixed(
                              2,
                            )}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">错误率</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div className="text-2xl font-bold">{testResults.errorTypes.length}</div>
                          <div className="text-sm text-muted-foreground">错误类型数</div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">错误类型分布</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {testResults.errorTypes.map((error: any, index: number) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span>{error.type}</span>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">{error.count}</span>
                                  <Badge className="bg-red-50 text-red-700 border-red-200">
                                    {((error.count / testResults.summary.failedRequests) * 100).toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                              <Progress
                                value={(error.count / testResults.summary.failedRequests) * 100}
                                className="h-1"
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">错误趋势</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-60">
                          {/* 这里可以放置错误趋势图表 */}
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            错误趋势图表
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Play className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">准备开始测试</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  配置测试参数并点击"开始测试"��钮，开始对API进行性能测试。
                </p>
                <div className="flex flex-col space-y-2 w-full max-w-md">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span>测试API的响应时间和吞吐量</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span>模拟多用户并发访问</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span>分析性能瓶颈和错误率</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
