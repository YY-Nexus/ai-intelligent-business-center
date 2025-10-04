"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useApiConfig } from "./api-config-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowDownUp, BarChart, ChevronDown, Clock, Copy, Download, Edit, FileText, LineChart, Loader2, Play, Plus, RefreshCw, Search, Settings, Trash2, TrendingUp, X } from 'lucide-react'
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// 测试配置类型
interface TestConfig {
  id: string
  name: string
  endpoint: string
  method: string
  concurrentUsers: number
  rampUpTime: number
  duration: number
  thinkTime: number
  headers: { key: string; value: string }[]
  body: string
  assertions: boolean
  loadProfile: "constant" | "rampUp" | "step" | "spike"
  createdAt: string
  lastRun?: string
}

// 测试结果类型
interface TestResult {
  id: string
  configId: string
  testId: string
  timestamp: string
  summary: {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    averageResponseTime: number
    minResponseTime: number
    maxResponseTime: number
    requestsPerSecond: number
    throughput: number
  }
  percentiles: {
    p50: number
    p90: number
    p95: number
    p99: number
  }
  errorTypes: {
    type: string
    count: number
  }[]
  timeSeriesData: {
    timestamp: number
    responseTime: number
    concurrentUsers: number
    requestsPerSecond: number
    errorRate: number
  }[]
}

// 测试比较类型
interface TestComparison {
  baselineId: string
  comparisonId: string
  baselineName: string
  comparisonName: string
  timestamp: string
  metrics: {
    name: string
    baselineValue: number
    comparisonValue: number
    difference: number
    percentChange: number
    improved: boolean
  }[]
}

export function EnhancedPerformanceTest() {
  const { toast } = useToast()
  const { configs } = useApiConfig()
  const [activeTab, setActiveTab] = useState("test")
  const [testConfigs, setTestConfigs] = useState<TestConfig[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testComparisons, setTestComparisons] = useState<TestComparison[]>([])
  const [selectedConfig, setSelectedConfig] = useState<TestConfig | null>(null)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isCreatingConfig, setIsCreatingConfig] = useState(false)
  const [isEditingConfig, setIsEditingConfig] = useState(false)
  const [isComparing, setIsComparing] = useState(false)
  const [compareResults, setCompareResults] = useState<{baseline: TestResult | null, comparison: TestResult | null}>({
    baseline: null,
    comparison: null
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortField, setSortField] = useState("lastRun")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // 新建/编辑测试配置的表单状态
  const [formConfig, setFormConfig] = useState<Partial<TestConfig>>({
    name: "",
    endpoint: "/api/users/profile",
    method: "GET",
    concurrentUsers: 10,
    rampUpTime: 5,
    duration: 30,
    thinkTime: 1000,
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: "{}",
    assertions: true,
    loadProfile: "constant"
  })

  // 加载测试配置和结果
  useEffect(() => {
    // 模拟从服务器加载数据
    const mockTestConfigs: TestConfig[] = [
      {
        id: "test-1",
        name: "用户资料API性能测试",
        endpoint: "/api/users/profile",
        method: "GET",
        concurrentUsers: 50,
        rampUpTime: 10,
        duration: 60,
        thinkTime: 1000,
        headers: [{ key: "Content-Type", value: "application/json" }],
        body: "{}",
        assertions: true,
        loadProfile: "rampUp",
        createdAt: "2023-05-10T08:30:00Z",
        lastRun: "2023-05-14T15:30:00Z"
      },
      {
        id: "test-2",
        name: "产品搜索API负载测试",
        endpoint: "/api/products/search",
        method: "POST",
        concurrentUsers: 100,
        rampUpTime: 20,
        duration: 120,
        thinkTime: 500,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Accept", value: "application/json" }
        ],
        body: '{"query": "smartphone", "limit": 20}',
        assertions: true,
        loadProfile: "step",
        createdAt: "2023-05-11T10:15:00Z",
        lastRun: "2023-05-13T14:45:00Z"
      },
      {
        id: "test-3",
        name: "订单创建API压力测试",
        endpoint: "/api/orders/create",
        method: "POST",
        concurrentUsers: 200,
        rampUpTime: 30,
        duration: 300,
        thinkTime: 200,
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Authorization", value: "Bearer {token}" }
        ],
        body: '{"productId": "prod-123", "quantity": 1, "address": "测试地址"}',
        assertions: true,
        loadProfile: "spike",
        createdAt: "2023-05-12T09:20:00Z",
        lastRun: "2023-05-12T16:30:00Z"
      }
    ]

    const mockTestResults: TestResult[] = [
      {
        id: "result-1",
        configId: "test-1",
        testId: "run-1",
        timestamp: "2023-05-14T15:30:00Z",
        summary: {
          totalRequests: 12500,
          successfulRequests: 12350,
          failedRequests: 150,
          averageResponseTime: 187,
          minResponseTime: 45,
          maxResponseTime: 890,
          requestsPerSecond: 208,
          throughput: 3.5
        },
        percentiles: {
          p50: 165,
          p90: 320,
          p95: 450,
          p99: 780
        },
        errorTypes: [
          { type: "超时", count: 85 },
          { type: "服务器错误", count: 45 },
          { type: "连接失败", count: 20 }
        ],
        timeSeriesData: Array.from({ length: 60 }, (_, i) => ({
          timestamp: Date.now() - (60 - i) * 1000,
          responseTime: Math.floor(Math.random() * 200) + 100,
          concurrentUsers: Math.min(50, Math.floor(i * (50 / 10))),
          requestsPerSecond: Math.floor(Math.random() * 50) + 180,
          errorRate: Math.random() * 2
        }))
      },
      {
        id: "result-2",
        configId: "test-2",
        testId: "run-1",
        timestamp: "2023-05-13T14:45:00Z",
        summary: {
          totalRequests: 24800,
          successfulRequests: 24200,
          failedRequests: 600,
          averageResponseTime: 245,
          minResponseTime: 78,
          maxResponseTime: 1250,
          requestsPerSecond: 206,
          throughput: 8.2
        },
        percentiles: {
          p50: 220,
          p90: 480,
          p95: 650,
          p99: 1100
        },
        errorTypes: [
          { type: "超时", count: 320 },
          { type: "服务器错误", count: 180 },
          { type: "连接失败", count: 100 }
        ],
        timeSeriesData: Array.from({ length: 120 }, (_, i) => ({
          timestamp: Date.now() - (120 - i) * 1000,
          responseTime: Math.floor(Math.random() * 300) + 150,
          concurrentUsers: Math.min(100, Math.floor(i * (100 / 20))),
          requestsPerSecond: Math.floor(Math.random() * 50) + 180,
          errorRate: Math.random() * 3
        }))
      },
      {
        id: "result-3",
        configId: "test-3",
        testId: "run-1",
        timestamp: "2023-05-12T16:30:00Z",
        summary: {
          totalRequests: 58500,
          successfulRequests: 56200,
          failedRequests: 2300,
          averageResponseTime: 320,
          minResponseTime: 95,
          maxResponseTime: 2100,
          requestsPerSecond: 195,
          throughput: 12.5
        },
        percentiles: {
          p50: 280,
          p90: 650,
          p95: 950,
          p99: 1800
        },
        errorTypes: [
          { type: "超时", count: 1200 },
          { type: "服务器错误", count: 850 },
          { type: "连接失败", count: 250 }
        ],
        timeSeriesData: Array.from({ length: 300 }, (_, i) => ({
          timestamp: Date.now() - (300 - i) * 1000,
          responseTime: Math.floor(Math.random() * 400) + 200,
          concurrentUsers: i < 30 ? Math.floor(i * (200 / 30)) : i > 270 ? Math.floor((300 - i) * (200 / 30)) : 200,
          requestsPerSecond: Math.floor(Math.random() * 50) + 170,
          errorRate: Math.random() * 5
        }))
      },
      {
        id: "result-4",
        configId: "test-1",
        testId: "run-2",
        timestamp: "2023-05-10T11:20:00Z",
        summary: {
          totalRequests: 11800,
          successfulRequests: 11500,
          failedRequests: 300,
          averageResponseTime: 210,
          minResponseTime: 50,
          maxResponseTime: 950,
          requestsPerSecond: 196,
          throughput: 3.2
        },
        percentiles: {
          p50: 180,
          p90: 350,
          p95: 480,
          p99: 820
        },
        errorTypes: [
          { type: "超时", count: 180 },
          { type: "服务器错误", count: 90 },
          { type: "连接失败", count: 30 }
        ],
        timeSeriesData: Array.from({ length: 60 }, (_, i) => ({
          timestamp: Date.now() - (60 - i) * 1000,
          responseTime: Math.floor(Math.random() * 250) + 120,
          concurrentUsers: Math.min(50, Math.floor(i * (50 / 10))),
          requestsPerSecond: Math.floor(Math.random() * 40) + 175,
          errorRate: Math.random() * 3
        }))
      }
    ]

    const mockTestComparisons: TestComparison[] = [
      {
        baselineId: "result-4",
        comparisonId: "result-1",
        baselineName: "用户资料API性能测试 (旧版)",
        comparisonName: "用户资料API性能测试 (新版)",
        timestamp: "2023-05-14T16:00:00Z",
        metrics: [
          {
            name: "平均响应时间",
            baselineValue: 210,
            comparisonValue: 187,
            difference: -23,
            percentChange: -10.95,
            improved: true
          },
          {
            name: "每秒请求数",
            baselineValue: 196,
            comparisonValue: 208,
            difference: 12,
            percentChange: 6.12,
            improved: true
          },
          {
            name: "错误率",
            baselineValue: 2.54,
            comparisonValue: 1.2,
            difference: -1.34,
            percentChange: -52.76,
            improved: true
          },
          {
            name: "P95响应时间",
            baselineValue: 480,
            comparisonValue: 450,
            difference: -30,
            percentChange: -6.25,
            improved: true
          },
          {
            name: "吞吐量",
            baselineValue: 3.2,
            comparisonValue: 3.5,
            difference: 0.3,
            percentChange: 9.38,
            improved: true
          }
        ]
      }
    ]

    setTestConfigs(mockTestConfigs)
    setTestResults(mockTestResults)
    setTestComparisons(mockTestComparisons)
  }, [])

  // 过滤和排序测试配置
  const filteredConfigs = testConfigs.filter(config => {
    const matchesSearch = config.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          config.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterType === "all") return matchesSearch
    if (filterType === "get" && config.method === "GET") return matchesSearch
    if (filterType === "post" && config.method === "POST") return matchesSearch
    if (filterType === "put" && config.method === "PUT") return matchesSearch
    if (filterType === "delete" && config.method === "DELETE") return matchesSearch
    
    return false
  }).sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    
    if (sortField === "method") {
      return sortDirection === "asc"
        ? a.method.localeCompare(b.method)
        : b.method.localeCompare(a.method)
    }
    
    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    
    if (sortField === "lastRun") {
      const aTime = a.lastRun ? new Date(a.lastRun).getTime() : 0
      const bTime = b.lastRun ? new Date(b.lastRun).getTime() : 0
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime
    }
    
    return 0
  })

  // 获取测试配置的最新结果
  const getLatestResult = (configId: string) => {
    return testResults
      .filter(result => result.configId === configId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
  }

  // 获取测试配置的所有结果
  const getConfigResults = (configId: string) => {
    return testResults
      .filter(result => result.configId === configId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // 创建新的测试配置
  const createTestConfig = () => {
    const newConfig: TestConfig = {
      ...formConfig as TestConfig,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    setTestConfigs([...testConfigs, newConfig])
    setIsCreatingConfig(false)
    setFormConfig({
      name: "",
      endpoint: "/api/users/profile",
      method: "GET",
      concurrentUsers: 10,
      rampUpTime: 5,
      duration: 30,
      thinkTime: 1000,
      headers: [{ key: "Content-Type", value: "application/json" }],
      body: "{}",
      assertions: true,
      loadProfile: "constant"
    })
    
    toast({
      title: "测试配置已创建",
      description: `已成功创建测试配置 "${newConfig.name}"`,
    })
  }

  // 更新测试配置
  const updateTestConfig = () => {
    if (!selectedConfig) return
    
    const updatedConfig: TestConfig = {
      ...selectedConfig,
      ...formConfig as Partial<TestConfig>
    }
    
    setTestConfigs(testConfigs.map(config => 
      config.id === selectedConfig.id ? updatedConfig : config
    ))
    
    setIsEditingConfig(false)
    setSelectedConfig(updatedConfig)
    
    toast({
      title: "测试配置已更新",
      description: `已成功更新测试配置 "${updatedConfig.name}"`,
    })
  }

  // 删除测试配置
  const deleteTestConfig = (configId: string) => {
    setTestConfigs(testConfigs.filter(config => config.id !== configId))
    
    if (selectedConfig?.id === configId) {
      setSelectedConfig(null)
    }
    
    toast({
      title: "测试配置已删除",
      description: "已成功删除测试配置",
    })
  }

  // 运行测试
  const runTest = (config: TestConfig) => {
    setSelectedConfig(config)
    setIsRunning(true)
    setProgress(0)
    
    // 模拟测试进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          completeTest(config)
          return 100
        }
        return prev + (100 / (config.duration * 2))
      })
    }, 500)
  }

  // 完成测试
  const completeTest = (config: TestConfig) => {
    // 生成模拟测试结果
    const newResult: TestResult = {
      id: `result-${Date.now()}`,
      configId: config.id,
      testId: `run-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      summary: {
        totalRequests: Math.floor(Math.random() * 20000) + 10000,
        successfulRequests: Math.floor(Math.random() * 18000) + 9000,
        failedRequests: Math.floor(Math.random() * 1000) + 100,
        averageResponseTime: Math.floor(Math.random() * 200) + 100,
        minResponseTime: Math.floor(Math.random() * 50) + 20,
        maxResponseTime: Math.floor(Math.random() * 1000) + 500,
        requestsPerSecond: Math.floor(Math.random() * 50) + 150,
        throughput: Math.random() * 5 + 2
      },
      percentiles: {
        p50: Math.floor(Math.random() * 150) + 100,
        p90: Math.floor(Math.random() * 300) + 200,
        p95: Math.floor(Math.random() * 400) + 300,
        p99: Math.floor(Math.random() * 800) + 600
      },
      errorTypes: [
        { type: "超时", count: Math.floor(Math.random() * 500) + 50 },
        { type: "服务器错误", count: Math.floor(Math.random() * 300) + 30 },
        { type: "连接失败", count: Math.floor(Math.random() * 200) + 20 }
      ],
      timeSeriesData: Array.from({ length: config.duration }, (_, i) => ({
        timestamp: Date.now() - (config.duration - i) * 1000,
        responseTime: Math.floor(Math.random() * 300) + 100,
        concurrentUsers: Math.min(
          config.concurrentUsers, 
          config.loadProfile === "rampUp" 
            ? Math.floor(i * (config.concurrentUsers / config.rampUpTime))
            : config.loadProfile === "step"
            ? Math.floor(i / 10) % 2 === 0 
              ? config.concurrentUsers / 2 
              : config.concurrentUsers
            : config.loadProfile === "spike"
            ? i < config.duration / 3 || i > config.duration * 2 / 3
              ? config.concurrentUsers / 4
              : config.concurrentUsers
            : config.concurrentUsers
        ),
        requestsPerSecond: Math.floor(Math.random() * 50) + 150,
        errorRate: Math.random() * 3
      }))
    }
    
    // 更新测试结果和配置
    setTestResults([...testResults, newResult])
    setTestConfigs(testConfigs.map(c => 
      c.id === config.id 
        ? { ...c, lastRun: new Date().toISOString() } 
        : c
    ))
    
    setIsRunning(false)
    setSelectedResult(newResult)
    setActiveTab("results")
    
    toast({
      title: "测试完成",
      description: `"${config.name}" 测试已成功完成`,
    })
  }

  // 比较测试结果
  const compareTestResults = () => {
    if (!compareResults.baseline || !compareResults.comparison) return
    
    const baselineResult = compareResults.baseline
    const comparisonResult = compareResults.comparison
    
    const baselineConfig = testConfigs.find(config => config.id === baselineResult.configId)
    const comparisonConfig = testConfigs.find(config => config.id === comparisonResult.configId)
    
    if (!baselineConfig || !comparisonConfig) return
    
    // 创建比较结果
    const newComparison: TestComparison = {
      baselineId: baselineResult.id,
      comparisonId: comparisonResult.id,
      baselineName: `${baselineConfig.name} (${format(new Date(baselineResult.timestamp), "yyyy年MM月dd日 HH:mm", { locale: zhCN })})`,
      comparisonName: `${comparisonConfig.name} (${format(new Date(comparisonResult.timestamp), "yyyy年MM月dd日 HH:mm", { locale: zhCN })})`,
      timestamp: new Date().toISOString(),
      metrics: [
        {
          name: "平均响应时间",
          baselineValue: baselineResult.summary.averageResponseTime,
          comparisonValue: comparisonResult.summary.averageResponseTime,
          difference: comparisonResult.summary.averageResponseTime - baselineResult.summary.averageResponseTime,
          percentChange: ((comparisonResult.summary.averageResponseTime - baselineResult.summary.averageResponseTime) / baselineResult.summary.averageResponseTime) * 100,
          improved: comparisonResult.summary.averageResponseTime < baselineResult.summary.averageResponseTime
        },
        {
          name: "每秒请求数",
          baselineValue: baselineResult.summary.requestsPerSecond,
          comparisonValue: comparisonResult.summary.requestsPerSecond,
          difference: comparisonResult.summary.requestsPerSecond - baselineResult.summary.requestsPerSecond,
          percentChange: ((comparisonResult.summary.requestsPerSecond - baselineResult.summary.requestsPerSecond) / baselineResult.summary.requestsPerSecond) * 100,
          improved: comparisonResult.summary.requestsPerSecond > baselineResult.summary.requestsPerSecond
        },
        {
          name: "错误率",
          baselineValue: (baselineResult.summary.failedRequests / baselineResult.summary.totalRequests) * 100,
          comparisonValue: (comparisonResult.summary.failedRequests / comparisonResult.summary.totalRequests) * 100,
          difference: ((comparisonResult.summary.failedRequests / comparisonResult.summary.totalRequests) - (baselineResult.summary.failedRequests / baselineResult.summary.totalRequests)) * 100,
          percentChange: (((comparisonResult.summary.failedRequests / comparisonResult.summary.totalRequests) - (baselineResult.summary.failedRequests / baselineResult.summary.totalRequests)) / (baselineResult.summary.failedRequests / baselineResult.summary.totalRequests)) * 100,
          improved: (comparisonResult.summary.failedRequests / comparisonResult.summary.totalRequests) < (baselineResult.summary.failedRequests / baselineResult.summary.totalRequests)
        },
        {
          name: "P95响应时间",
          baselineValue: baselineResult.percentiles.p95,
          comparisonValue: comparisonResult.percentiles.p95,
          difference: comparisonResult.percentiles.p95 - baselineResult.percentiles.p95,
          percentChange: ((comparisonResult.percentiles.p95 - baselineResult.percentiles.p95) / baselineResult.percentiles.p95) * 100,
          improved: comparisonResult.percentiles.p95 < baselineResult.percentiles.p95
        },
        {
          name: "吞吐量",
          baselineValue: baselineResult.summary.throughput,
          comparisonValue: comparisonResult.summary.throughput,
          difference: comparisonResult.summary.throughput - baselineResult.summary.throughput,
          percentChange: ((comparisonResult.summary.throughput - baselineResult.summary.throughput) / baselineResult.summary.throughput) * 100,
          improved: comparisonResult.summary.throughput > baselineResult.summary.throughput
        }
      ]
    }
    
    setTestComparisons([...testComparisons, newComparison])
    setIsComparing(false)
    setCompareResults({ baseline: null, comparison: null })
    
    toast({
      title: "比较完成",
      description: "测试结果比较已完成",
    })
  }

  // 格式化日期时间
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "yyyy年MM月dd日 HH:mm", { locale: zhCN })
  }

  // 格式化持续时间
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}分${remainingSeconds}秒`
  }

  // 获取负载类型名称
  const getLoadProfileName = (profile: string) => {
    switch (profile) {
      case "constant": return "恒定负载"
      case "rampUp": return "递增负载"
      case "step": return "阶梯负载"
      case "spike": return "尖峰负载"
      default: return "未知"
    }
  }

  // 获取方法标签颜色
  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-blue-100 text-blue-800"
      case "POST": return "bg-green-100 text-green-800"
      case "PUT": return "bg-yellow-100 text-yellow-800"
      case "DELETE": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // 渲染测试配置列表
  const renderTestConfigList = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="搜索测试配置..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="筛选方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部方法</SelectItem>
                <SelectItem value="get">GET</SelectItem>
                <SelectItem value="post">POST</SelectItem>
                <SelectItem value="put">PUT</SelectItem>
                <SelectItem value="delete">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsCreatingConfig(true)}>
            <Plus className="h-4 w-4 mr-2" />
            新建测试
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <Button 
                    variant="ghost" 
                    className="flex items-center p-0 hover:bg-transparent"
                    onClick={() => {
                      if (sortField === "name") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("name")
                        setSortDirection("asc")
                      }
                    }}
                  >
                    测试名称
                    {sortField === "name" && (
                      <ArrowDownUp className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="flex items-center p-0 hover:bg-transparent"
                    onClick={() => {
                      if (sortField === "method") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("method")
                        setSortDirection("asc")
                      }
                    }}
                  >
                    方法
                    {sortField === "method" && (
                      <ArrowDownUp className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>端点</TableHead>
                <TableHead>负载类型</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="flex items-center p-0 hover:bg-transparent"
                    onClick={() => {
                      if (sortField === "lastRun") {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                      } else {
                        setSortField("lastRun")
                        setSortDirection("desc")
                      }
                    }}
                  >
                    最近运行
                    {sortField === "lastRun" && (
                      <ArrowDownUp className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConfigs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    未找到测试配置
                  </TableCell>
                </TableRow>
              ) : (
                filteredConfigs.map((config) => (
                  <TableRow 
                    key={config.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedConfig(config)}
                  >
                    <TableCell className="font-medium">{config.name}</TableCell>
                    <TableCell>
                      <Badge className={getMethodBadgeColor(config.method)}>
                        {config.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{config.endpoint}</TableCell>
                    <TableCell>{getLoadProfileName(config.loadProfile)}</TableCell>
                    <TableCell>
                      {config.lastRun ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                          {formatDateTime(config.lastRun)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">从未运行</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setFormConfig({...config})
                            setIsEditingConfig(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => runTest(config)}
                          disabled={isRunning}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteTestConfig(config.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // 渲染测试配置详情
  const renderTestConfigDetail = () => {
    if (!selectedConfig) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">未选择测试配置</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              请从左侧列表选择一个测试配置查看详情
            </p>
          </div>
        </div>
      )
    }

    const latestResult = getLatestResult(selectedConfig.id)
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedConfig.name}</h2>
            <p className="text-muted-foreground">
              创建于 {formatDateTime(selectedConfig.createdAt)}
              {selectedConfig.lastRun && ` • 最近运行于 ${formatDateTime(selectedConfig.lastRun)}`}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                setFormConfig({...selectedConfig})
                setIsEditingConfig(true)
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
            <Button 
              onClick={() => runTest(selectedConfig)}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  运行中...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  运行测试
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isRunning && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>测试进行中...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>测试配置</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">API端点</dt>
                  <dd className="font-mono">{selectedConfig.endpoint}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">请求方法</dt>
                  <dd>
                    <Badge className={getMethodBadgeColor(selectedConfig.method)}>
                      {selectedConfig.method}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">并发用户数</dt>
                  <dd>{selectedConfig.concurrentUsers}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">负载类型</dt>
                  <dd>{getLoadProfileName(selectedConfig.loadProfile)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">爬升时间</dt>
                  <dd>{formatDuration(selectedConfig.rampUpTime)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">测试持续时间</dt>
                  <dd>{formatDuration(selectedConfig.duration)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium text-muted-foreground">思考时间</dt>
                  <dd>{selectedConfig.thinkTime} 毫秒</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>请求详情</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">请求头</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>键</TableHead>
                        <TableHead>值</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedConfig.headers.map((header, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{header.key}</TableCell>
                          <TableCell className="font-mono text-sm">{header.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedConfig.method !== "GET" && (
                <div>
                  <h4 className="font-medium mb-2">请求体</h4>
                  <div className="rounded-md bg-muted p-4">
                    <pre className="font-mono text-sm whitespace-pre-wrap">
                      {selectedConfig.body}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch id="assertions" checked={selectedConfig.assertions} disabled />
                <Label htmlFor="assertions">启用断言</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {latestResult && (
          <Card>
            <CardHeader>
              <CardTitle>最新测试结果</CardTitle>
              <CardDescription>
                运行于 {formatDateTime(latestResult.timestamp)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">平均响应时间</p>
                  <p className="text-2xl font-bold">{latestResult.summary.averageResponseTime} ms</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">每秒请求数</p>
                  <p className="text-2xl font-bold">{latestResult.summary.requestsPerSecond}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">成功率</p>
                  <p className="text-2xl font-bold">
                    {((latestResult.summary.successfulRequests / latestResult.summary.totalRequests) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">总请求数</p>
                  <p className="text-2xl font-bold">{latestResult.summary.totalRequests.toLocaleString()}</p>
                </div>
              </div>
              
              <Button 
                variant="link" 
                className="mt-4 p-0"
                onClick={() => {
                  setSelectedResult(latestResult)
                  setActiveTab("results")
                }}
              >
                查看完整结果
              </Button>
            </CardContent>
          </Card>
        )}
        
        {getConfigResults(selectedConfig.id).length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>历史测试结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>运行时间</TableHead>
                      <TableHead>平均响应时间</TableHead>
                      <TableHead>每秒请求数</TableHead>
                      <TableHead>成功率</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getConfigResults(selectedConfig.id).map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{formatDateTime(result.timestamp)}</TableCell>
                        <TableCell>{result.summary.averageResponseTime} ms</TableCell>
                        <TableCell>{result.summary.requestsPerSecond}</TableCell>
                        <TableCell>
                          {((result.summary.successfulRequests / result.summary.totalRequests) * 100).toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedResult(result)
                              setActiveTab("results")
                            }}
                          >
                            查看
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // 渲染测试结果详情
  const renderTestResultDetail = () => {
    if (!selectedResult) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <BarChart className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">未选择测试结果</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              请运行测试或从历史记录中选择一个测试结果查看详情
            </p>
          </div>
        </div>
      )
    }

    const config = testConfigs.find(config => config.id === selectedResult.configId)
    if (!config) return null

    // 准备图表数据
    const timeLabels = selectedResult.timeSeriesData.map((data, index) => 
      `${index}s`
    )
    
    const responseTimeData = {
      labels: timeLabels,
      datasets: [
        {
          label: '响应时间 (ms)',
          data: selectedResult.timeSeriesData.map(data => data.responseTime),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3
        }
      ]
    }
    
    const concurrentUsersData = {
      labels: timeLabels,
      datasets: [
        {
          label: '并发用户数',
          data: selectedResult.timeSeriesData.map(data => data.concurrentUsers),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3
        }
      ]
    }
    
    const requestsPerSecondData = {
      labels: timeLabels,
      datasets: [
        {
          label: '每秒请求数',
          data: selectedResult.timeSeriesData.map(data => data.requestsPerSecond),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.3
        }
      ]
    }
    
    const errorRateData = {
      labels: timeLabels,
      datasets: [
        {
          label: '错误率 (%)',
          data: selectedResult.timeSeriesData.map(data => data.errorRate),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.3,
          fill: true
        }
      ]
    }
    
    const percentileData = {
      labels: ['P50', 'P90', 'P95', 'P99'],
      datasets: [
        {
          label: '响应时间百分位 (ms)',
          data: [
            selectedResult.percentiles.p50,
            selectedResult.percentiles.p90,
            selectedResult.percentiles.p95,
            selectedResult.percentiles.p99
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
    
    const errorTypesData = {
      labels: selectedResult.errorTypes.map(error => error.type),
      datasets: [
        {
          label: '错误数量',
          data: selectedResult.errorTypes.map(error => error.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 205, 86, 0.6)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)'
          ],
          borderWidth: 1
        }
      ]
    }
    
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{config.name} - 测试结果</h2>
            <p className="text-muted-foreground">
              运行于 {formatDateTime(selectedResult.timestamp)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                setIsComparing(true)
                setCompareResults({
                  ...compareResults,
                  baseline: selectedResult
                })
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              比较
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // 导出测试结果为JSON
                const dataStr = JSON.stringify(selectedResult, null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `test-result-${selectedResult.id}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                
                toast({
                  title: "导出成功",
                  description: "测试结果已导出为JSON文件",
                })
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">平均响应时间</p>
                <p className="text-2xl font-bold">{selectedResult.summary.averageResponseTime} ms</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">每秒请求数</p>
                <p className="text-2xl font-bold">{selectedResult.summary.requestsPerSecond}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">成功率</p>
                <p className="text-2xl font-bold">
                  {((selectedResult.summary.successfulRequests / selectedResult.summary.totalRequests) * 100).toFixed(2)}%
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">吞吐量</p>
                <p className="text-2xl font-bold">{selectedResult.summary.throughput.toFixed(2)} MB/s</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>响应时间</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={responseTimeData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>并发用户数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={concurrentUsersData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>每秒请求数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={requestsPerSecondData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>错误率</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={errorRateData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>响应时间百分位</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={percentileData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>错误类型分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={errorTypesData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>测试摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">请求统计</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">总请求数</dt>
                    <dd className="font-medium">{selectedResult.summary.totalRequests.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">成功请求数</dt>
                    <dd className="font-medium">{selectedResult.summary.successfulRequests.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">失败请求数</dt>
                    <dd className="font-medium">{selectedResult.summary.failedRequests.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">错误率</dt>
                    <dd className="font-medium">
                      {((selectedResult.summary.failedRequests / selectedResult.summary.totalRequests) * 100).toFixed(2)}%
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="font-medium mb-4">响应时间</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">最小响应时间</dt>
                    <dd className="font-medium">{selectedResult.summary.minResponseTime} ms</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">平均响应时间</dt>
                    <dd className="font-medium">{selectedResult.summary.averageResponseTime} ms</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">最大响应时间</dt>
                    <dd className="font-medium">{selectedResult.summary.maxResponseTime} ms</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">P95响应时间</dt>
                    <dd className="font-medium">{selectedResult.percentiles.p95} ms</dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染测试比较
  const renderTestComparisons = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">测试结果比较</h2>
          <Button onClick={() => setIsComparing(true)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            新建比较
          </Button>
        </div>
        
        {testComparisons.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">暂无比较结果</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                创建一个新的测试结果比较，分析不同测试之间的性能差异
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsComparing(true)}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                新建比较
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {testComparisons.map((comparison) => (
              <Card key={comparison.timestamp} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {comparison.baselineName} vs {comparison.comparisonName}
                    </span>
                    <Badge className="ml-2">
                      {formatDateTime(comparison.timestamp)}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    性能指标比较结果
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>指标</TableHead>
                          <TableHead>基准值</TableHead>
                          <TableHead>比较值</TableHead>
                          <TableHead>差异</TableHead>
                          <TableHead>变化百分比</TableHead>
                          <TableHead>结果</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {comparison.metrics.map((metric, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{metric.name}</TableCell>
                            <TableCell>{metric.baselineValue.toFixed(2)}</TableCell>
                            <TableCell>{metric.comparisonValue.toFixed(2)}</TableCell>
                            <TableCell>{metric.difference.toFixed(2)}</TableCell>
                            <TableCell>
                              {metric.percentChange > 0 ? "+" : ""}
                              {metric.percentChange.toFixed(2)}%
                            </TableCell>
                            <TableCell>
                              <Badge variant={metric.improved ? "default" : "destructive"}>
                                {metric.improved ? "改善" : "恶化"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // 渲染创建/编辑测试配置对话框
  const renderConfigDialog = () => {
    const isEditing = isEditingConfig
    
    return (
      <Dialog 
        open={isCreatingConfig || isEditingConfig} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreatingConfig(false)
            setIsEditingConfig(false)
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "编辑测试配置" : "创建新测试配置"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "修改现有测试配置的参数和设置" 
                : "配置新的API性能测试参数和设置"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">测试名称</Label>
                <Input 
                  id="name" 
                  value={formConfig.name} 
                  onChange={(e) => setFormConfig({...formConfig, name: e.target.value})}
                  placeholder="输入测试名称"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpoint">API端点</Label>
                <Input 
                  id="endpoint" 
                  value={formConfig.endpoint} 
                  onChange={(e) => setFormConfig({...formConfig, endpoint: e.target.value})}
                  placeholder="/api/resource"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="method">请求方法</Label>
                <Select 
                  value={formConfig.method} 
                  onValueChange={(value) => setFormConfig({...formConfig, method: value})}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="选择请求方法" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loadProfile">负载类型</Label>
                <Select 
                  value={formConfig.loadProfile} 
                  onValueChange={(value: "constant" | "rampUp" | "step" | "spike") => 
                    setFormConfig({...formConfig, loadProfile: value})
                  }
                >
                  <SelectTrigger id="loadProfile">
                    <SelectValue placeholder="选择负载类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="constant">恒定负载</SelectItem>
                    <SelectItem value="rampUp">递增负载</SelectItem>
                    <SelectItem value="step">阶梯负载</SelectItem>
                    <SelectItem value="spike">尖峰负载</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {formConfig.method !== "GET" && (
                <div className="space-y-2">
                  <Label htmlFor="body">请求体 (JSON)</Label>
                  <Textarea 
                    id="body" 
                    value={formConfig.body} 
                    onChange={(e) => setFormConfig({...formConfig, body: e.target.value})}
                    placeholder='{"key": "value"}'
                    rows={5}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="concurrentUsers">并发用户数</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="concurrentUsers"
                    min={1}
                    max={500}
                    step={1}
                    value={[formConfig.concurrentUsers || 10]}
                    onValueChange={(value) => setFormConfig({...formConfig, concurrentUsers: value[0]})}
                  />
                  <span className="w-12 text-center">{formConfig.concurrentUsers}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rampUpTime">爬升时间 (秒)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="rampUpTime"
                    min={0}
                    max={60}
                    step={1}
                    value={[formConfig.rampUpTime || 5]}
                    onValueChange={(value) => setFormConfig({...formConfig, rampUpTime: value[0]})}
                  />
                  <span className="w-12 text-center">{formConfig.rampUpTime}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">测试持续时间 (秒)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="duration"
                    min={10}
                    max={600}
                    step={10}
                    value={[formConfig.duration || 30]}
                    onValueChange={(value) => setFormConfig({...formConfig, duration: value[0]})}
                  />
                  <span className="w-12 text-center">{formConfig.duration}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thinkTime">思考时间 (毫秒)</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="thinkTime"
                    min={0}
                    max={5000}
                    step={100}
                    value={[formConfig.thinkTime || 1000]}
                    onValueChange={(value) => setFormConfig({...formConfig, thinkTime: value[0]})}
                  />
                  <span className="w-12 text-center">{formConfig.thinkTime}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>请求头</Label>
                <div className="space-y-2">
                  {formConfig.headers?.map((header, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={header.key}
                        onChange={(e) => {
                          const newHeaders = [...(formConfig.headers || [])]
                          newHeaders[index].key = e.target.value
                          setFormConfig({...formConfig, headers: newHeaders})
                        }}
                        placeholder="键"
                        className="flex-1"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => {
                          const newHeaders = [...(formConfig.headers || [])]
                          newHeaders[index].value = e.target.value
                          setFormConfig({...formConfig, headers: newHeaders})
                        }}
                        placeholder="值"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newHeaders = [...(formConfig.headers || [])]
                          newHeaders.splice(index, 1)
                          setFormConfig({...formConfig, headers: newHeaders})
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newHeaders = [...(formConfig.headers || [])]
                      newHeaders.push({ key: "", value: "" })
                      setFormConfig({...formConfig, headers: newHeaders})
                    }}
                  >
                    添加请求头
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="assertions"
                  checked={formConfig.assertions}
                  onCheckedChange={(checked) => setFormConfig({...formConfig, assertions: checked})}
                />
                <Label htmlFor="assertions">启用断言</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreatingConfig(false)
                setIsEditingConfig(false)
              }}
            >
              取消
            </Button>
            <Button
              onClick={isEditing ? updateTestConfig : createTestConfig}
              disabled={!formConfig.name || !formConfig.endpoint}
            >
              {isEditing ? "保存更改" : "创建测试"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // 渲染比较对话框
  const renderCompareDialog = () => {
    return (
      <Dialog 
        open={isComparing} 
        onOpenChange={(open) => {
          if (!open) {
            setIsComparing(false)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>比较测试结果</DialogTitle>
            <DialogDescription>
              选择两个测试结果进行比较分析
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseline">基准测试结果</Label>
              <Select 
                value={compareResults.baseline?.id || ""} 
                onValueChange={(value) => {
                  const result = testResults.find(r => r.id === value)
                  setCompareResults({...compareResults, baseline: result || null})
                }}
              >
                <SelectTrigger id="baseline">
                  <SelectValue placeholder="选择基准测试结果" />
                </SelectTrigger>
                <SelectContent>
                  {testResults.map((result) => {
                    const config = testConfigs.find(c => c.id === result.configId)
                    return (
                      <SelectItem key={result.id} value={result.id}>
                        {config?.name} ({formatDateTime(result.timestamp)})
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comparison">比较测试结果</Label>
              <Select 
                value={compareResults.comparison?.id || ""} 
                onValueChange={(value) => {
                  const result = testResults.find(r => r.id === value)
                  setCompareResults({...compareResults, comparison: result || null})
                }}
              >
                <SelectTrigger id="comparison">
                  <SelectValue placeholder="选择比较测试结果" />
                </SelectTrigger>
                <SelectContent>
                  {testResults
                    .filter(r => r.id !== compareResults.baseline?.id)
                    .map((result) => {
                      const config = testConfigs.find(c => c.id === result.configId)
                      return (
                        <SelectItem key={result.id} value={result.id}>
                          {config?.name} ({formatDateTime(result.timestamp)})
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsComparing(false)}
            >
              取消
            </Button>
            <Button
              onClick={compareTestResults}
              disabled={!compareResults.baseline || !compareResults.comparison}
            >
              比较结果
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API性能测试</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("test")}>
            <Settings className="h-4 w-4 mr-2" />
            测试配置
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("results")}>
            <BarChart className="h-4 w-4 mr-2" />
            测试结果
          </Button>
          <Button variant="outline" onClick={() => setActiveTab("compare")}>
            <TrendingUp className="h-4 w-4 mr-2" />
            结果比较
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test">
            <Settings className="h-4 w-4 mr-2" />
            测试配置
          </TabsTrigger>
          <TabsTrigger value="results">
            <BarChart className="h-4 w-4 mr-2" />
            测试结果
          </TabsTrigger>
          <TabsTrigger value="compare">
            <TrendingUp className="h-4 w-4 mr-2" />
            结果比较
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="test" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              {renderTestConfigList()}
            </div>
            <div className="md:col-span-2">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                {renderTestConfigDetail()}
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="results">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {renderTestResultDetail()}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="compare">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {renderTestComparisons()}
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {renderConfigDialog()}
      {renderCompareDialog()}
    </div>
  )
}
