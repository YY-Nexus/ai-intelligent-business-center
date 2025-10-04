"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { BarChart, LineChart, PieChart, ArrowUp, ArrowDown, Activity, TrendingUp, AlertTriangle, Download, RefreshCw, Filter, Clock, Users, Zap, Server } from 'lucide-react'
import { ApiUsageChart } from "./charts/api-usage-chart"
import { ErrorRateChart } from "./charts/error-rate-chart"
import { ResponseTimeChart } from "./charts/response-time-chart"
import { EndpointUsageChart } from "./charts/endpoint-usage-chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { addDays, format, subDays } from "date-fns"
import { zhCN } from "date-fns/locale"

// 定义API分析数据类型
interface ApiAnalyticsData {
  overview: {
    totalRequests: number
    totalUsers: number
    averageResponseTime: number
    errorRate: number
    changeRates: {
      requests: number
      users: number
      responseTime: number
      errorRate: number
    }
  }
  topEndpoints: {
    endpoint: string
    method: string
    requests: number
    averageResponseTime: number
    errorRate: number
  }[]
  recentErrors: {
    timestamp: string
    endpoint: string
    method: string
    statusCode: number
    errorMessage: string
    userId?: string
  }[]
  timeSeriesData: {
    timestamp: string
    requests: number
    users: number
    responseTime: number
    errorRate: number
  }[]
  endpointBreakdown: {
    endpoint: string
    method: string
    requests: number
    percentage: number
  }[]
  statusCodeDistribution: {
    statusCode: number
    count: number
    percentage: number
  }[]
}

export default function ApiAnalyticsDashboard() {
  // 状态管理
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [apiFilter, setApiFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  
  // 模拟API分析数据
  const analyticsData: ApiAnalyticsData = {
    overview: {
      totalRequests: 1258943,
      totalUsers: 28465,
      averageResponseTime: 187,
      errorRate: 1.8,
      changeRates: {
        requests: 12.5,
        users: 8.3,
        responseTime: -5.2,
        errorRate: -15.7
      }
    },
    topEndpoints: [
      {
        endpoint: "/api/users/profile",
        method: "GET",
        requests: 245678,
        averageResponseTime: 125,
        errorRate: 0.5
      },
      {
        endpoint: "/api/products/search",
        method: "POST",
        requests: 198432,
        averageResponseTime: 210,
        errorRate: 1.2
      },
      {
        endpoint: "/api/orders/create",
        method: "POST",
        requests: 156789,
        averageResponseTime: 320,
        errorRate: 2.8
      },
      {
        endpoint: "/api/auth/login",
        method: "POST",
        requests: 145632,
        averageResponseTime: 180,
        errorRate: 3.5
      },
      {
        endpoint: "/api/products/{id}",
        method: "GET",
        requests: 132456,
        averageResponseTime: 95,
        errorRate: 0.8
      }
    ],
    recentErrors: [
      {
        timestamp: "2023-05-15T08:45:23Z",
        endpoint: "/api/orders/create",
        method: "POST",
        statusCode: 500,
        errorMessage: "数据库连接超时",
        userId: "user_12345"
      },
      {
        timestamp: "2023-05-15T07:32:18Z",
        endpoint: "/api/auth/login",
        method: "POST",
        statusCode: 401,
        errorMessage: "无效的凭据",
        userId: "user_67890"
      },
      {
        timestamp: "2023-05-15T06:58:42Z",
        endpoint: "/api/products/search",
        method: "POST",
        statusCode: 400,
        errorMessage: "无效的查询参数",
        userId: "user_54321"
      },
      {
        timestamp: "2023-05-15T05:23:11Z",
        endpoint: "/api/users/update",
        method: "PUT",
        statusCode: 403,
        errorMessage: "权限不足",
        userId: "user_98765"
      },
      {
        timestamp: "2023-05-15T04:15:37Z",
        endpoint: "/api/payments/process",
        method: "POST",
        statusCode: 502,
        errorMessage: "支付网关错误",
        userId: "user_24680"
      }
    ],
    timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
      timestamp: format(subDays(new Date(), 29 - i), "yyyy-MM-dd"),
      requests: Math.floor(Math.random() * 50000) + 30000,
      users: Math.floor(Math.random() * 2000) + 8000,
      responseTime: Math.floor(Math.random() * 100) + 150,
      errorRate: Math.random() * 3 + 0.5
    })),
    endpointBreakdown: [
      { endpoint: "/api/users/profile", method: "GET", requests: 245678, percentage: 19.5 },
      { endpoint: "/api/products/search", method: "POST", requests: 198432, percentage: 15.8 },
      { endpoint: "/api/orders/create", method: "POST", requests: 156789, percentage: 12.5 },
      { endpoint: "/api/auth/login", method: "POST", requests: 145632, percentage: 11.6 },
      { endpoint: "/api/products/{id}", method: "GET", requests: 132456, percentage: 10.5 },
      { endpoint: "/api/cart/update", method: "PUT", requests: 98765, percentage: 7.8 },
      { endpoint: "/api/payments/process", method: "POST", requests: 87654, percentage: 7.0 },
      { endpoint: "其他", method: "", requests: 193537, percentage: 15.3 }
    ],
    statusCodeDistribution: [
      { statusCode: 200, count: 1132048, percentage: 89.9 },
      { statusCode: 400, count: 45322, percentage: 3.6 },
      { statusCode: 401, count: 25178, percentage: 2.0 },
      { statusCode: 403, count: 12589, percentage: 1.0 },
      { statusCode: 404, count: 18884, percentage: 1.5 },
      { statusCode: 500, count: 22661, percentage: 1.8 },
      { statusCode: 502, count: 2261, percentage: 0.2 }
    ]
  }
  
  // 刷新数据
  const refreshData = () => {
    setIsLoading(true)
    // 模拟API请求延迟
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }
  
  // 导出数据
  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  // 根据时间范围更新日期
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    const today = new Date()
    
    switch (range) {
      case "24h":
        setDateRange({
          from: subDays(today, 1),
          to: today
        })
        break
      case "7d":
        setDateRange({
          from: subDays(today, 7),
          to: today
        })
        break
      case "30d":
        setDateRange({
          from: subDays(today, 30),
          to: today
        })
        break
      case "90d":
        setDateRange({
          from: subDays(today, 90),
          to: today
        })
        break
    }
  }
  
  // 格式化数字
  const formatNumber = (num: number) => {
    return num >= 1000000
      ? `${(num / 1000000).toFixed(1)}M`
      : num >= 1000
      ? `${(num / 1000).toFixed(1)}K`
      : num.toString()
  }
  
  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy年MM月dd日 HH:mm", { locale: zhCN })
  }
  
  // 获取状态码类型
  const getStatusCodeType = (code: number) => {
    if (code >= 200 && code < 300) return "成功"
    if (code >= 300 && code < 400) return "重定向"
    if (code >= 400 && code < 500) return "客户端错误"
    if (code >= 500) return "服务器错误"
    return "未知"
  }
  
  // 获取状态码颜色
  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return "bg-green-100 text-green-800"
    if (code >= 300 && code < 400) return "bg-blue-100 text-blue-800"
    if (code >= 400 && code < 500) return "bg-yellow-100 text-yellow-800"
    if (code >= 500) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }
  
  // 获取HTTP方法颜色
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-blue-100 text-blue-800"
      case "POST": return "bg-green-100 text-green-800"
      case "PUT": return "bg-yellow-100 text-yellow-800"
      case "DELETE": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  // 获取变化指示器
  const getChangeIndicator = (value: number) => {
    if (value > 0) {
      return (
        <div className="flex items-center text-green-600">
          <ArrowUp className="h-4 w-4 mr-1" />
          {value.toFixed(1)}%
        </div>
      )
    } else if (value < 0) {
      return (
        <div className="flex items-center text-red-600">
          <ArrowDown className="h-4 w-4 mr-1" />
          {Math.abs(value).toFixed(1)}%
        </div>
      )
    } else {
      return (
        <div className="text-gray-500">0%</div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API分析仪表板</h1>
          <p className="text-muted-foreground">监控API使用情况、性能和错误率</p>
        </div>
        <div className="flex items-center space-x-2">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24小时</SelectItem>
              <SelectItem value="7d">7天</SelectItem>
              <SelectItem value="30d">30天</SelectItem>
              <SelectItem value="90d">90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            概览
          </TabsTrigger>
          <TabsTrigger value="usage">
            <BarChart className="h-4 w-4 mr-2" />
            使用情况
          </TabsTrigger>
          <TabsTrigger value="performance">
            <TrendingUp className="h-4 w-4 mr-2" />
            性能
          </TabsTrigger>
          <TabsTrigger value="errors">
            <AlertTriangle className="h-4 w-4 mr-2" />
            错误
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Server className="h-4 w-4 mr-2" />
            端点分析
          </TabsTrigger>
        </TabsList>
        
        {/* 概览标签页 */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">总请求数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatNumber(analyticsData.overview.totalRequests)}
                  </div>
                  {getChangeIndicator(analyticsData.overview.changeRates.requests)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">活跃用户数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {formatNumber(analyticsData.overview.totalUsers)}
                  </div>
                  {getChangeIndicator(analyticsData.overview.changeRates.users)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">平均响应时间</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {analyticsData.overview.averageResponseTime} ms
                  </div>
                  {getChangeIndicator(analyticsData.overview.changeRates.responseTime)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">错误率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">
                    {analyticsData.overview.errorRate}%
                  </div>
                  {getChangeIndicator(analyticsData.overview.changeRates.errorRate)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>API请求趋势</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的API请求量
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart data={analyticsData.timeSeriesData} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>错误率趋势</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的API错误率
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ErrorRateChart data={analyticsData.timeSeriesData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>热门API端点</CardTitle>
                <CardDescription>按请求量排序的前5个API端点</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>端点</TableHead>
                      <TableHead>方法</TableHead>
                      <TableHead className="text-right">请求数</TableHead>
                      <TableHead className="text-right">平均响应时间</TableHead>
                      <TableHead className="text-right">错误率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyticsData.topEndpoints.map((endpoint, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                        <TableCell>
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(endpoint.requests)}</TableCell>
                        <TableCell className="text-right">{endpoint.averageResponseTime} ms</TableCell>
                        <TableCell className="text-right">{endpoint.errorRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>状态码分布</CardTitle>
                <CardDescription>API响应状态码分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <EndpointUsageChart data={analyticsData.statusCodeDistribution.map(item => ({
                    name: `${item.statusCode} (${getStatusCodeType(item.statusCode)})`,
                    value: item.count
                  }))} />
                </div>
                <div className="space-y-2 mt-4">
                  {analyticsData.statusCodeDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Badge className={getStatusCodeColor(item.statusCode)}>
                          {item.statusCode}
                        </Badge>
                        <span className="ml-2 text-muted-foreground">{getStatusCodeType(item.statusCode)}</span>
                      </div>
                      <div>{item.percentage.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>最近错误</CardTitle>
              <CardDescription>最近发生的API错误</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>端点</TableHead>
                    <TableHead>方法</TableHead>
                    <TableHead>状态码</TableHead>
                    <TableHead>错误信息</TableHead>
                    <TableHead>用户ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.recentErrors.map((error, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDateTime(error.timestamp)}</TableCell>
                      <TableCell className="font-medium">{error.endpoint}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(error.method)}>
                          {error.method}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(error.statusCode)}>
                          {error.statusCode}
                        </Badge>
                      </TableCell>
                      <TableCell>{error.errorMessage}</TableCell>
                      <TableCell>{error.userId || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 使用情况标签页 */}
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>每日请求量</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的每日API请求量
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart data={analyticsData.timeSeriesData} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>活跃用户数</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的每日活跃用户数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={analyticsData.timeSeriesData} 
                    dataKey="users"
                    color="#8884d8"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>端点使用分布</CardTitle>
                <CardDescription>
                  API端点使用百分比
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <EndpointUsageChart data={analyticsData.endpointBreakdown.map(item => ({
                    name: item.endpoint,
                    value: item.requests
                  }))} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>端点使用详情</CardTitle>
              <CardDescription>所有API端点的使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>端点</TableHead>
                    <TableHead>方法</TableHead>
                    <TableHead className="text-right">请求数</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.endpointBreakdown.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                      <TableCell>
                        {endpoint.method ? (
                          <Badge className={getMethodColor(endpoint.method)}>
                            {endpoint.method}
                          </Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(endpoint.requests)}</TableCell>
                      <TableCell className="text-right">{endpoint.percentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>每小时使用模式</CardTitle>
                <CardDescription>24小时内的API使用模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={Array.from({ length: 24 }, (_, i) => ({
                      timestamp: `${i}:00`,
                      requests: Math.floor(Math.random() * 30000) + 10000,
                      users: 0,
                      responseTime: 0,
                      errorRate: 0
                    }))} 
                    dataKey="requests"
                    xAxisDataKey="timestamp"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>每周使用模式</CardTitle>
                <CardDescription>一周内的API使用模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={[
                      { timestamp: "周一", requests: Math.floor(Math.random() * 50000) + 150000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周二", requests: Math.floor(Math.random() * 50000) + 160000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周三", requests: Math.floor(Math.random() * 50000) + 170000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周四", requests: Math.floor(Math.random() * 50000) + 180000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周五", requests: Math.floor(Math.random() * 50000) + 190000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周六", requests: Math.floor(Math.random() * 50000) + 120000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "周日", requests: Math.floor(Math.random() * 50000) + 100000, users: 0, responseTime: 0, errorRate: 0 }
                    ]} 
                    dataKey="requests"
                    xAxisDataKey="timestamp"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* 性能标签页 */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>响应时间趋势</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的平均响应时间
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponseTimeChart data={analyticsData.timeSeriesData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>端点响应时间</CardTitle>
                <CardDescription>各API端点的平均响应时间</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={analyticsData.topEndpoints.map(endpoint => ({
                      timestamp: endpoint.endpoint,
                      responseTime: endpoint.averageResponseTime,
                      requests: 0,
                      users: 0,
                      errorRate: 0
                    }))} 
                    dataKey="responseTime"
                    xAxisDataKey="timestamp"
                    color="#82ca9d"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>端点性能详情</CardTitle>
              <CardDescription>所有API端点的性能指标</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>端点</TableHead>
                    <TableHead>方法</TableHead>
                    <TableHead className="text-right">平均响应时间</TableHead>
                    <TableHead className="text-right">最���响应时间</TableHead>
                    <TableHead className="text-right">P95响应时间</TableHead>
                    <TableHead className="text-right">请求数</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.topEndpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{endpoint.averageResponseTime} ms</TableCell>
                      <TableCell className="text-right">{Math.floor(endpoint.averageResponseTime * 2.5)} ms</TableCell>
                      <TableCell className="text-right">{Math.floor(endpoint.averageResponseTime * 1.8)} ms</TableCell>
                      <TableCell className="text-right">{formatNumber(endpoint.requests)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>响应时间分布</CardTitle>
                <CardDescription>API响应时间分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={[
                      { timestamp: "< 100ms", requests: Math.floor(Math.random() * 200000) + 300000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "100-200ms", requests: Math.floor(Math.random() * 200000) + 400000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "200-300ms", requests: Math.floor(Math.random() * 150000) + 250000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "300-500ms", requests: Math.floor(Math.random() * 100000) + 150000, users: 0, responseTime: 0, errorRate: 0 },
                      { timestamp: "500ms+", requests: Math.floor(Math.random() * 50000) + 50000, users: 0, responseTime: 0, errorRate: 0 }
                    ]} 
                    dataKey="requests"
                    xAxisDataKey="timestamp"
                    color="#8884d8"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>性能指标</CardTitle>
                <CardDescription>关键性能指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">平均响应时间</p>
                    <p className="text-2xl font-bold">{analyticsData.overview.averageResponseTime} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">P95响应时间</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData.overview.averageResponseTime * 1.8)} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">P99响应时间</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData.overview.averageResponseTime * 2.2)} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">最大响应时间</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData.overview.averageResponseTime * 3)} ms</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">每秒请求数</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData.overview.totalRequests / (30 * 24 * 60 * 60))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">峰值请求数</p>
                    <p className="text-2xl font-bold">{Math.floor(analyticsData.overview.totalRequests / (30 * 24 * 60 * 60) * 5)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">超时率</p>
                    <p className="text-2xl font-bold">0.8%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CPU使用率</p>
                    <p className="text-2xl font-bold">42%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* 错误标签页 */}
        <TabsContent value="errors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>错误率趋势</CardTitle>
                <CardDescription>
                  过去{timeRange === "24h" ? "24小时" : timeRange === "7d" ? "7天" : timeRange === "30d" ? "30天" : "90天"}的API错误率
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ErrorRateChart data={analyticsData.timeSeriesData} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>错误类型分布</CardTitle>
                <CardDescription>API错误类型分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <EndpointUsageChart data={[
                    { name: "客户端错误 (4xx)", value: 101973 },
                    { name: "服务器错误 (5xx)", value: 24922 },
                    { name: "网络错误", value: 12500 },
                    { name: "超时", value: 8750 },
                    { name: "其他", value: 2798 }
                  ]} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>端点错误率</CardTitle>
              <CardDescription>各API端点的错误率</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ApiUsageChart 
                  data={analyticsData.topEndpoints.map(endpoint => ({
                    timestamp: endpoint.endpoint,
                    errorRate: endpoint.errorRate,
                    requests: 0,
                    users: 0,
                    responseTime: 0
                  }))} 
                  dataKey="errorRate"
                  xAxisDataKey="timestamp"
                  color="#ff8042"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>错误日志</CardTitle>
              <CardDescription>最近的API错误详情</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>时间</TableHead>
                      <TableHead>端点</TableHead>
                      <TableHead>方法</TableHead>
                      <TableHead>状态码</TableHead>
                      <TableHead>错误信息</TableHead>
                      <TableHead>用户ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...analyticsData.recentErrors, ...analyticsData.recentErrors, ...analyticsData.recentErrors].map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDateTime(error.timestamp)}</TableCell>
                        <TableCell className="font-medium">{error.endpoint}</TableCell>
                        <TableCell>
                          <Badge className={getMethodColor(error.method)}>
                            {error.method}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusCodeColor(error.statusCode)}>
                            {error.statusCode}
                          </Badge>
                        </TableCell>
                        <TableCell>{error.errorMessage}</TableCell>
                        <TableCell>{error.userId || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>常见错误</CardTitle>
                <CardDescription>最常见的API错误</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>错误类型</TableHead>
                      <TableHead>状态码</TableHead>
                      <TableHead className="text-right">出现次数</TableHead>
                      <TableHead className="text-right">占比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">无效的凭据</TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(401)}>401</Badge>
                      </TableCell>
                      <TableCell className="text-right">25,178</TableCell>
                      <TableCell className="text-right">16.8%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">无效的查询参数</TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(400)}>400</Badge>
                      </TableCell>
                      <TableCell className="text-right">45,322</TableCell>
                      <TableCell className="text-right">30.2%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">资源不存在</TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(404)}>404</Badge>
                      </TableCell>
                      <TableCell className="text-right">18,884</TableCell>
                      <TableCell className="text-right">12.6%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">数据库连接超时</TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(500)}>500</Badge>
                      </TableCell>
                      <TableCell className="text-right">22,661</TableCell>
                      <TableCell className="text-right">15.1%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">权限不足</TableCell>
                      <TableCell>
                        <Badge className={getStatusCodeColor(403)}>403</Badge>
                      </TableCell>
                      <TableCell className="text-right">12,589</TableCell>
                      <TableCell className="text-right">8.4%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>错误趋势分析</CardTitle>
                <CardDescription>主要错误类型的趋势</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={Array.from({ length: 7 }, (_, i) => ({
                      timestamp: format(subDays(new Date(), 6 - i), "MM-dd"),
                      requests: Math.floor(Math.random() * 1000) + 3000,
                      users: Math.floor(Math.random() * 800) + 2000,
                      responseTime: 0,
                      errorRate: 0
                    }))} 
                    multipleLines={true}
                    dataKeys={["requests", "users"]}
                    dataKeyNames={["4xx错误", "5xx错误"]}
                    colors={["#8884d8", "#82ca9d"]}
                    xAxisDataKey="timestamp"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* 端点分析标签页 */}
        <TabsContent value="endpoints" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">API端点分析</h2>
              <p className="text-muted-foreground">分析各API端点的使用情况和性能</p>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={apiFilter} onValueChange={setApiFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择API端点" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有端点</SelectItem>
                  <SelectItem value="/api/users/profile">用户资料</SelectItem>
                  <SelectItem value="/api/products/search">产品搜索</SelectItem>
                  <SelectItem value="/api/orders/create">订单创建</SelectItem>
                  <SelectItem value="/api/auth/login">用户登录</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                筛选
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">总端点数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">最常用端点</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">/api/users/profile</div>
                <div className="text-sm text-muted-foreground">占总请求的19.5%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">最慢端点</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">/api/orders/create</div>
                <div className="text-sm text-muted-foreground">平均320ms</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">错误率最高端点</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">/api/auth/login</div>
                <div className="text-sm text-muted-foreground">错误率3.5%</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>端点使用分布</CardTitle>
                <CardDescription>各API端点的使用百分比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <EndpointUsageChart data={analyticsData.endpointBreakdown.map(item => ({
                    name: item.endpoint,
                    value: item.requests
                  }))} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>HTTP方法分布</CardTitle>
                <CardDescription>各HTTP方法的使用百分比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <EndpointUsageChart data={[
                    { name: "GET", value: 589700 },
                    { name: "POST", value: 442630 },
                    { name: "PUT", value: 176252 },
                    { name: "DELETE", value: 50361 }
                  ]} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>端点详细分析</CardTitle>
              <CardDescription>所有API端点的详细指标</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>端点</TableHead>
                    <TableHead>方法</TableHead>
                    <TableHead className="text-right">请求数</TableHead>
                    <TableHead className="text-right">占比</TableHead>
                    <TableHead className="text-right">平均响应时间</TableHead>
                    <TableHead className="text-right">错误率</TableHead>
                    <TableHead className="text-right">缓存命中率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.topEndpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{endpoint.endpoint}</TableCell>
                      <TableCell>
                        <Badge className={getMethodColor(endpoint.method)}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(endpoint.requests)}</TableCell>
                      <TableCell className="text-right">
                        {(endpoint.requests / analyticsData.overview.totalRequests * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">{endpoint.averageResponseTime} ms</TableCell>
                      <TableCell className="text-right">{endpoint.errorRate}%</TableCell>
                      <TableCell className="text-right">
                        {endpoint.method === "GET" ? `${Math.floor(Math.random() * 30) + 60}%` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>端点响应时间比较</CardTitle>
                <CardDescription>各API端点的平均响应时间</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={analyticsData.topEndpoints.map(endpoint => ({
                      timestamp: endpoint.endpoint,
                      responseTime: endpoint.averageResponseTime,
                      requests: 0,
                      users: 0,
                      errorRate: 0
                    }))} 
                    dataKey="responseTime"
                    xAxisDataKey="timestamp"
                    color="#82ca9d"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>端点错误率比较</CardTitle>
                <CardDescription>各API端点的错误率</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ApiUsageChart 
                    data={analyticsData.topEndpoints.map(endpoint => ({
                      timestamp: endpoint.endpoint,
                      errorRate: endpoint.errorRate,
                      requests: 0,
                      users: 0,
                      responseTime: 0
                    }))} 
                    dataKey="errorRate"
                    xAxisDataKey="timestamp"
                    color="#ff8042"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
