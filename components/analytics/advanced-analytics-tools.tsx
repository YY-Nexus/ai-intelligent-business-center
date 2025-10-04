"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { HelpTooltip } from "@/components/feedback/interactive-feedback"
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  Download,
  RefreshCw,
  Zap,
  Cpu,
  Database,
  Network,
  Search,
  BarChart2,
  PieChartIcon,
  LineChartIcon,
  ArrowRight,
  Layers,
  Code,
  FileText,
} from "lucide-react"

// 高级分析工具组件
export function AdvancedAnalyticsTools() {
  const [activeTab, setActiveTab] = useState("pattern-detection")
  const [isLoading, setIsLoading] = useState(false)

  // 模拟分析操作
  const runAnalysis = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">高级分析工具</h1>
          <p className="text-muted-foreground">深入分析API使用模式和性能特征</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => runAnalysis()} disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            运行分析
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pattern-detection">
            <Activity className="h-4 w-4 mr-2" />
            使用模式检测
          </TabsTrigger>
          <TabsTrigger value="anomaly-detection">
            <AlertTriangle className="h-4 w-4 mr-2" />
            异常检测
          </TabsTrigger>
          <TabsTrigger value="correlation-analysis">
            <Network className="h-4 w-4 mr-2" />
            关联分析
          </TabsTrigger>
          <TabsTrigger value="predictive-analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            预测分析
          </TabsTrigger>
        </TabsList>

        {/* 使用模式检测 */}
        <TabsContent value="pattern-detection" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                  使用模式配置
                </CardTitle>
                <CardDescription>配置使用模式检测参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="time-window">时间窗口</Label>
                    <HelpTooltip content="分析的时间范围，较大的窗口可以发现长期模式" />
                  </div>
                  <Select defaultValue="7d">
                    <SelectTrigger id="time-window">
                      <SelectValue placeholder="选择时间窗口" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24小时</SelectItem>
                      <SelectItem value="7d">7天</SelectItem>
                      <SelectItem value="30d">30天</SelectItem>
                      <SelectItem value="90d">90天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pattern-sensitivity">模式敏感度</Label>
                    <HelpTooltip content="较高的敏感度可以检测到更细微的模式，但可能增加误报" />
                  </div>
                  <Slider id="pattern-sensitivity" defaultValue={[60]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>低</span>
                    <span>中</span>
                    <span>高</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="min-occurrence">最小出现次数</Label>
                    <HelpTooltip content="模式被识别所需的最小出现次数" />
                  </div>
                  <Input id="min-occurrence" type="number" defaultValue="5" min="1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-endpoints">包含的端点</Label>
                    <HelpTooltip content="选择要包含在分析中的API端点" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger id="include-endpoints">
                      <SelectValue placeholder="选择端点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有端点</SelectItem>
                      <SelectItem value="auth">认证相关</SelectItem>
                      <SelectItem value="data">数据相关</SelectItem>
                      <SelectItem value="user">用户相关</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="advanced-mode" />
                  <Label htmlFor="advanced-mode">高级模式</Label>
                  <HelpTooltip content="启用更复杂的模式检测算法，可能需要更长的处理时间" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
                  检测到的使用模式
                </CardTitle>
                <CardDescription>系统识别出的API使用模式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">每日早晨登录峰值</h3>
                      <Badge>高置信度</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      在工作日上午9:00-10:00之间，登录API调用量显著增加，比其他时段高出约300%。
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-4">
                        相关端点: <Badge variant="outline">/api/auth/login</Badge>
                      </span>
                      <span>出现频率: 工作日 (95%)</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">搜索-查看-购买序列</h3>
                      <Badge>中置信度</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      用户通常按照搜索产品 → 查看详情 → 添加购物车 → 结账的顺序操作，平均完成时间为8分钟。
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-4">相关端点: 多个</span>
                      <span>转化率: 23%</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">周末使用量下降</h3>
                      <Badge>高置信度</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      周末API总调用量比工作日平均低约40%，但某些娱乐相关API的使用量增加了60%。
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-4">相关端点: 全局</span>
                      <span>一致性: 92%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    查看更多模式
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                使用模式可视化
              </CardTitle>
              <CardDescription>主要使用模式的图形表示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">使用模式图表将在此处显示</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-500" />
                  模式分类
                </CardTitle>
                <CardDescription>按类型分类的使用模式</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>时间相关模式</span>
                    </div>
                    <span className="font-medium">42%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>行为序列模式</span>
                    </div>
                    <span className="font-medium">28%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>用户分组模式</span>
                    </div>
                    <span className="font-medium">18%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>资源使用模式</span>
                    </div>
                    <span className="font-medium">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  推荐优化
                </CardTitle>
                <CardDescription>基于检测到的模式的优化建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="font-medium mb-1">缓存优化</h3>
                    <p className="text-sm text-muted-foreground">
                      针对早晨登录峰值，建议在8:30-10:30增加缓存容量，可减轻服务器负载约25%。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-1">用户体验优化</h3>
                    <p className="text-sm text-muted-foreground">
                      基于搜索-查看-购买序列，建议优化产品详情页加载速度，预计可提高转化率5-8%。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                    <h3 className="font-medium mb-1">资源调度优化</h3>
                    <p className="text-sm text-muted-foreground">
                      周末可减少业务API的资源分配，增加娱乐API的资源，预计可节省15%的运行成本。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 异常检测 */}
        <TabsContent value="anomaly-detection" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  异常检测配置
                </CardTitle>
                <CardDescription>配置异常检测参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="detection-method">检测方法</Label>
                    <HelpTooltip content="选择用于检测异常的算法" />
                  </div>
                  <Select defaultValue="statistical">
                    <SelectTrigger id="detection-method">
                      <SelectValue placeholder="选择检测方法" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">统计方法</SelectItem>
                      <SelectItem value="ml">机器学习</SelectItem>
                      <SelectItem value="hybrid">混合方法</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anomaly-sensitivity">异常敏感度</Label>
                    <HelpTooltip content="较高的敏感度可以检测到更多异常，但可能增加误报" />
                  </div>
                  <Slider id="anomaly-sensitivity" defaultValue={[70]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>低</span>
                    <span>中</span>
                    <span>高</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="baseline-period">基准期</Label>
                    <HelpTooltip content="用于建立正常行为基准的时间段" />
                  </div>
                  <Select defaultValue="30d">
                    <SelectTrigger id="baseline-period">
                      <SelectValue placeholder="选择基准期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7天</SelectItem>
                      <SelectItem value="30d">30天</SelectItem>
                      <SelectItem value="90d">90天</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>监控指标</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="monitor-requests" defaultChecked />
                      <Label htmlFor="monitor-requests">请求量</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="monitor-errors" defaultChecked />
                      <Label htmlFor="monitor-errors">错误率</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="monitor-latency" defaultChecked />
                      <Label htmlFor="monitor-latency">响应时间</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="monitor-patterns" defaultChecked />
                      <Label htmlFor="monitor-patterns">使用模式</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-alert" defaultChecked />
                  <Label htmlFor="auto-alert">自动告警</Label>
                  <HelpTooltip content="检测到异常时自动发送告警" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                  检测到的异常
                </CardTitle>
                <CardDescription>系统识别出的异常行为</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-red-700 dark:text-red-400">异常请求量增加</h3>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">严重</Badge>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-2">
                      在过去24小时内，API请求量突然增加了350%，远超历史平均水平。
                    </p>
                    <div className="flex items-center text-sm text-red-600 dark:text-red-300">
                      <span className="mr-4">检测时间: 2023-05-15 03:42</span>
                      <span>
                        影响端点:{" "}
                        <Badge variant="outline" className="text-red-700 dark:text-red-400">
                          /api/users/profile
                        </Badge>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-yellow-700 dark:text-yellow-400">异常错误率</h3>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        中等
                      </Badge>
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mb-2">
                      认证API的错误率从平均2%上升到12%，可能表明存在凭证问题或攻击尝试。
                    </p>
                    <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-300">
                      <span className="mr-4">检测时间: 2023-05-14 22:15</span>
                      <span>
                        影响端点:{" "}
                        <Badge variant="outline" className="text-yellow-700 dark:text-yellow-400">
                          /api/auth/login
                        </Badge>
                      </span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-blue-700 dark:text-blue-400">异常响应时间</h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">低</Badge>
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                      产品搜索API的平均响应时间增加了85%，从120ms上升到220ms。
                    </p>
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-300">
                      <span className="mr-4">检测时间: 2023-05-15 09:30</span>
                      <span>
                        影响端点:{" "}
                        <Badge variant="outline" className="text-blue-700 dark:text-blue-400">
                          /api/products/search
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    查看更多异常
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-orange-500" />
                异常可视化
              </CardTitle>
              <CardDescription>主要异常的图形表示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">异常图表将在此处显示</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-orange-500" />
                  异常根因分析
                </CardTitle>
                <CardDescription>异常的可能原因</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium mb-1">请求量增加</h3>
                    <p className="text-sm text-muted-foreground mb-2">可能原因:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>DDoS攻击 (可能性: 高)</li>
                      <li>营销活动导致流量激增 (可能性: 中)</li>
                      <li>爬虫活动 (可能性: 中)</li>
                      <li>系统错误导致的重复请求 (可能性: 低)</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h3 className="font-medium mb-1">错误率增加</h3>
                    <p className="text-sm text-muted-foreground mb-2">可能原因:</p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>凭证暴力破解尝试 (可能性: 高)</li>
                      <li>认证服务故障 (可能性: 中)</li>
                      <li>客户端SDK版本不兼容 (可能性: 中)</li>
                      <li>数据库连接问题 (可能性: 低)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-500" />
                  建议操作
                </CardTitle>
                <CardDescription>针对检测到的异常的建议操作</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-red-50 dark:bg-red-900/20">
                    <h3 className="font-medium mb-1">紧急操作</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>启用API请求限流，限制每IP每分钟请求数</li>
                      <li>检查日志中的可疑IP地址并临时封禁</li>
                      <li>增加服务器资源以应对流量增加</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                    <h3 className="font-medium mb-1">调查操作</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>分析认证失败日志，识别攻击模式</li>
                      <li>检查认证服务的健康状态和连接</li>
                      <li>验证最近的代码部署是否影响了认证流程</li>
                    </ul>
                  </div>

                  <div className="p-3 border rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <h3 className="font-medium mb-1">长期改进</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>实施更高级的DDoS防护</li>
                      <li>优化数据库查询以提高搜索性能</li>
                      <li>增强异常检测系统的实时性</li>
                      <li>建立自动扩展机制以应对流量波动</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 关联分析 */}
        <TabsContent value="correlation-analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-purple-500" />
                  关联分析配置
                </CardTitle>
                <CardDescription>配置关联分析参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="correlation-type">关联类型</Label>
                    <HelpTooltip content="选择要分析的关联类型" />
                  </div>
                  <Select defaultValue="api-api">
                    <SelectTrigger id="correlation-type">
                      <SelectValue placeholder="选择关联类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api-api">API间关联</SelectItem>
                      <SelectItem value="api-error">API与错误关联</SelectItem>
                      <SelectItem value="api-user">API与用户关联</SelectItem>
                      <SelectItem value="api-performance">API与性能关联</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="correlation-strength">最小关联强度</Label>
                    <HelpTooltip content="只显示强度大于此值的关联" />
                  </div>
                  <Slider id="correlation-strength" defaultValue={[50]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>弱</span>
                    <span>中</span>
                    <span>强</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="time-window-correlation">时间窗口</Label>
                    <HelpTooltip content="分析的时间范围" />
                  </div>
                  <Select defaultValue="30d">
                    <SelectTrigger id="time-window-correlation">
                      <SelectValue placeholder="选择时间窗口" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7天</SelectItem>
                      <SelectItem value="30d">30天</SelectItem>
                      <SelectItem value="90d">90天</SelectItem>
                      <SelectItem value="365d">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="max-correlations">最大关联数</Label>
                    <HelpTooltip content="显示的最大关联数量" />
                  </div>
                  <Input id="max-correlations" type="number" defaultValue="20" min="5" max="100" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="show-indirect" defaultChecked />
                  <Label htmlFor="show-indirect">显示间接关联</Label>
                  <HelpTooltip content="显示通过中间节点连接的间接关联" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-purple-500" />
                  关联分析结果
                </CardTitle>
                <CardDescription>发现的API关联</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">关联网络图将在此处显示</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-purple-500" />
                关联强度分布
              </CardTitle>
              <CardDescription>API关联强度的分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">关联强度分布图将在此处显示</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-purple-500" />
                  强关联API对
                </CardTitle>
                <CardDescription>具有强关联的API对</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">登录 → 获取用户资料</h3>
                      <Badge>关联度: 92%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      用户登录后，92%的情况下会立即请求用户资料API。平均时间间隔: 1.2秒。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">产品搜索 → 产品详情</h3>
                      <Badge>关联度: 87%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      产品搜索后，87%的情况下用户会查看至少一个产品详情。平均时间间隔: 5.8秒。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">添加购物车 → 结账</h3>
                      <Badge>关联度: 64%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      添加商品到购物车后，64%的情况下用户会进行结账。平均时间间隔: 12.5分钟。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">支付失败 → 客服联系</h3>
                      <Badge>关联度: 58%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      支付失败后，58%的情况下用户会联系客服。平均时间间隔: 3.2分钟。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-500" />
                  关联分析洞察
                </CardTitle>
                <CardDescription>基于关联分析的洞察和建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-medium mb-1">用户流程优化</h3>
                    <p className="text-sm text-muted-foreground">
                      登录后立即预加载用户资料数据，可减少用户等待时间，提升体验。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-medium mb-1">缓存策略优化</h3>
                    <p className="text-sm text-muted-foreground">
                      产品搜索结果中包含的产品详情应优先缓存，可提高后续访问速度。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-medium mb-1">转化率提升机会</h3>
                    <p className="text-sm text-muted-foreground">
                      购物车到结账的转化率有提升空间，建议简化结账流程或添加购物车优惠提醒。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-purple-50 dark:bg-purple-900/20">
                    <h3 className="font-medium mb-1">错误处理优化</h3>
                    <p className="text-sm text-muted-foreground">
                      支付失败后主动提供帮助信息，减少客服负担，提高用户满意度。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 预测分析 */}
        <TabsContent value="predictive-analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  预测分析配置
                </CardTitle>
                <CardDescription>配置预测分析参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prediction-target">预测目标</Label>
                    <HelpTooltip content="选择要预测的指标" />
                  </div>
                  <Select defaultValue="api-usage">
                    <SelectTrigger id="prediction-target">
                      <SelectValue placeholder="选择预测目标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api-usage">API使用量</SelectItem>
                      <SelectItem value="error-rate">错误率</SelectItem>
                      <SelectItem value="response-time">响应时间</SelectItem>
                      <SelectItem value="user-growth">用户增长</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prediction-model">预测模型</Label>
                    <HelpTooltip content="选择用于预测的算法模型" />
                  </div>
                  <Select defaultValue="arima">
                    <SelectTrigger id="prediction-model">
                      <SelectValue placeholder="选择预测模型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arima">ARIMA</SelectItem>
                      <SelectItem value="prophet">Prophet</SelectItem>
                      <SelectItem value="lstm">LSTM</SelectItem>
                      <SelectItem value="ensemble">集成模型</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prediction-horizon">预测周期</Label>
                    <HelpTooltip content="预测未来多长时间的数据" />
                  </div>
                  <Select defaultValue="30d">
                    <SelectTrigger id="prediction-horizon">
                      <SelectValue placeholder="选择预测周期" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7天</SelectItem>
                      <SelectItem value="30d">30天</SelectItem>
                      <SelectItem value="90d">90天</SelectItem>
                      <SelectItem value="365d">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidence-interval">置信区间</Label>
                    <HelpTooltip content="预测结果的置信区间" />
                  </div>
                  <Select defaultValue="95">
                    <SelectTrigger id="confidence-interval">
                      <SelectValue placeholder="选择置信区间" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="include-seasonality" defaultChecked />
                  <Label htmlFor="include-seasonality">包含季节性</Label>
                  <HelpTooltip content="在预测中考虑季节性因素" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="include-events" defaultChecked />
                  <Label htmlFor="include-events">包含特殊事件</Label>
                  <HelpTooltip content="在预测中考虑节假日等特殊事件" />
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  预测结果
                </CardTitle>
                <CardDescription>API使用量预测</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">预测图表将在此处显示</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-green-500" />
                  预测指标
                </CardTitle>
                <CardDescription>关键预测指标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">30天后预计日请求量</h3>
                      <p className="text-sm text-muted-foreground">与当前相比增长12%</p>
                    </div>
                    <div className="text-xl font-bold">1.42M</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">30天后预计峰值请求量</h3>
                      <p className="text-sm text-muted-foreground">与当前相比增长18%</p>
                    </div>
                    <div className="text-xl font-bold">2.35M</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">30天后预计平均响应时间</h3>
                      <p className="text-sm text-muted-foreground">与当前相比增长5%</p>
                    </div>
                    <div className="text-xl font-bold">196ms</div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <h3 className="font-medium">30天后预计错误率</h3>
                      <p className="text-sm text-muted-foreground">与当前相比减少10%</p>
                    </div>
                    <div className="text-xl font-bold">1.62%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  预测洞察与建议
                </CardTitle>
                <CardDescription>基于预测的洞察和建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-1">容量规划</h3>
                    <p className="text-sm text-muted-foreground">
                      基于预测的请求量增长，建议在未来2周内将API服务器容量提升20%，以应对预期的流量增长。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-1">性能优化</h3>
                    <p className="text-sm text-muted-foreground">
                      预计响应时间将略有增加，建议优化数据库查询和缓存策略，特别是针对产品搜索API。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-1">错误率改进</h3>
                    <p className="text-sm text-muted-foreground">
                      错误率预计将下降，这表明最近的错误处理改进正在发挥作用，建议继续监控并巩固这些改进。
                    </p>
                  </div>

                  <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20">
                    <h3 className="font-medium mb-1">成本预估</h3>
                    <p className="text-sm text-muted-foreground">
                      基于预测的使用增长，API相关的基础设施成本预计将增加15%，建议审查资源利用率以优化成本。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LineChartIcon className="h-5 w-5 mr-2 text-green-500" />
                预测准确性历史
              </CardTitle>
              <CardDescription>过去预测的准确性评估</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-60 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">预测准确性图表将在此处显示</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-muted-foreground">平均预测误差</h3>
                    <p className="text-xl font-bold">8.2%</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-muted-foreground">最大预测误差</h3>
                    <p className="text-xl font-bold">22.5%</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-muted-foreground">预测准确率趋势</h3>
                    <p className="text-xl font-bold text-green-600">↑ 改善</p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <h3 className="text-sm text-muted-foreground">最佳预测模型</h3>
                    <p className="text-xl font-bold">集成模型</p>
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
