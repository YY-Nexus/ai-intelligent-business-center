"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function BestPracticesPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">智谱AI API 最佳实践</h1>
      <p className="text-lg text-muted-foreground">
        本指南提供了使用智谱AI API的最佳实践，包括错误处理、性能优化和服务监控。
      </p>

      <Tabs defaultValue="error-handling">
        <TabsList>
          <TabsTrigger value="error-handling">错误处理</TabsTrigger>
          <TabsTrigger value="performance">性能优化</TabsTrigger>
          <TabsTrigger value="monitoring">服务监控</TabsTrigger>
          <TabsTrigger value="security">安全最佳实践</TabsTrigger>
        </TabsList>

        <TabsContent value="error-handling" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>错误处理最佳实践</CardTitle>
              <CardDescription>有效的错误处理可以提高应用程序的稳定性和用户体验</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">常见错误类型</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <CardTitle className="text-base">认证错误 (401)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">API密钥无效或已过期</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>处理方法:</strong> 检查API密钥是否正确，必要时重新生成
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <CardTitle className="text-base">速率限制 (429)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">超过API调用频率限制</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>处理方法:</strong> 实现指数退避重试策略，减少请求频率
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <CardTitle className="text-base">配额超限 (402)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">超过API使用配额</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>处理方法:</strong> 监控配额使用情况，必要时升级套餐
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        <CardTitle className="text-base">服务器错误 (5xx)</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">服务器内部错误</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>处理方法:</strong> 实现重试机制，避免在高峰期发送大量请求
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">重试策略</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">指数退避</h4>
                      <p className="text-sm text-muted-foreground">
                        每次重试增加等待时间，避免对服务造成额外负担。例如：1秒、2秒、4秒、8秒...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">添加随机抖动</h4>
                      <p className="text-sm text-muted-foreground">
                        在重试间隔中添加随机时间，避免多个客户端同时重试导致的"惊群效应"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">设置最大重试次数</h4>
                      <p className="text-sm text-muted-foreground">
                        限制重试次数，避免无限重试消耗资源。通常3-5次重试足够
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">区分可重试和不可重试错误</h4>
                      <p className="text-sm text-muted-foreground">
                        只对临时性错误（如429、500、503）进行重试，对永久性错误（如400、401、403）不重试
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>提示</AlertTitle>
                  <AlertDescription>
                    使用我们提供的 <code>retry-handler.ts</code> 工具类可以轻松实现上述重试策略
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">错误处理代码示例</h3>

                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`// 使用错误处理工具类
import { withRetry } from '@/lib/api-binding/providers/zhipu/retry-handler';
import { createZhipuError } from '@/lib/api-binding/providers/zhipu/error-handler';

// 包装API调用函数
async function callZhipuAPI(prompt) {
  try {
    // 使用重试包装器
    const result = await withRetry(async () => {
      const response = await fetch('/api/zhipu/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }
      
      return await response.json();
    });
    
    return result;
  } catch (error) {
    // 转换为标准错误格式
    const zhipuError = createZhipuError(error);
    
    // 根据错误类型处理
    switch (zhipuError.type) {
      case 'authentication':
        console.error('认证错误，请检查API密钥');
        // 可能需要重新获取API密钥
        break;
      case 'rate_limit':
        console.error('请求频率超限，请稍后再试');
        // 可能需要实现节流
        break;
      case 'quota_exceeded':
        console.error('配额已用尽，请升级套餐');
        // 显示升级提示
        break;
      default:
        console.error(\`请求错误: \${zhipuError.message}\`);
    }
    
    throw zhipuError;
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>性能优化最佳实践</CardTitle>
              <CardDescription>优化API调用性能，提高响应速度，降低成本</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">缓存策略</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">结果缓存</h4>
                      <p className="text-sm text-muted-foreground">
                        对于相同或相似的请求，缓存API响应结果，避免重复调用。使用LRU缓存控制内存使用
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">设置合理的TTL</h4>
                      <p className="text-sm text-muted-foreground">
                        根据数据更新频率设置缓存过期时间。对于不经常变化的数据，可以设置较长的TTL
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">分布式缓存</h4>
                      <p className="text-sm text-muted-foreground">
                        在多服务器环境中，使用Redis等分布式缓存系统共享缓存数据
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    使用我们提供的 <code>performance-optimizer.ts</code> 中的缓存工具可以轻松实现缓存策略
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">请求优化</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">批处理请求</h4>
                      <p className="text-sm text-muted-foreground">
                        将多个小请求合并为一个批处理请求，减少网络往返次数
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">请求压缩</h4>
                      <p className="text-sm text-muted-foreground">对大型请求使用gzip压缩，减少传输数据量</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">请求节流</h4>
                      <p className="text-sm text-muted-foreground">
                        控制API调用频率，避免触发速率限制。使用令牌桶或漏桶算法实现
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">连接复用</h4>
                      <p className="text-sm text-muted-foreground">使用HTTP Keep-Alive和连接池，避免频繁建立连接</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">模型和参数优化</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">选择合适的模型</h4>
                      <p className="text-sm text-muted-foreground">
                        根据任务复杂度选择合适的模型。简单任务使用GLM-3-Turbo，复杂任务使用GLM-4
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">优化提示词</h4>
                      <p className="text-sm text-muted-foreground">
                        使用清晰、简洁的提示词，避免冗余信息，减少token消耗
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">限制输出长度</h4>
                      <p className="text-sm text-muted-foreground">
                        使用max_tokens参数限制输出长度，避免生成不必要的内容
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">使用流式响应</h4>
                      <p className="text-sm text-muted-foreground">
                        对于长文本生成，使用流式响应提高用户体验，同时允许提前终止不需要的生成
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">性能优化代码示例</h3>

                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`// 使用性能优化工具类
import { RequestOptimizer } from '@/lib/api-binding/providers/zhipu/performance-optimizer';

// 创建API调用函数
async function generateText(prompt) {
  const response = await fetch('/api/zhipu/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    throw new Error('请求失败');
  }
  
  return await response.json();
}

// 创建缓存键生成器
const cacheKeyGenerator = (params) => {
  return \`chat:\${params.prompt}\`;
};

// 创建优化器
const textGenerator = new RequestOptimizer(
  generateText,
  cacheKeyGenerator,
  { maxSize: 100, ttl: 5 * 60 * 1000 }, // 5分钟缓存
  60 // 每分钟最大请求数
);

// 使用优化后的函数
async function getOptimizedResponse(prompt) {
  try {
    return await textGenerator.execute({ prompt });
  } catch (error) {
    console.error('生成文本失败:', error);
    throw error;
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>服务监控最佳实践</CardTitle>
              <CardDescription>监控API使用情况，及时发现问题，优化资源使用</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">关键监控指标</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">API可用性</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">监控API服务的可用性和响应状态</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>监控方法:</strong> 定期发送心跳请求，检查响应状态码
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">响应时间</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">监控API响应时间的变化趋势</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>监控方法:</strong> 记录每次请求的响应时间，计算平均值和百分位数
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">错误率</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">监控API请求的失败率</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>监控方法:</strong> 统计不同类型错误的发生频率，设置告警阈值
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">配额使用</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">监控API配额的使用情况</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>监控方法:</strong> 跟踪token使用量，预测配额耗尽时间
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">告警策略</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">设置合理的告警阈值</h4>
                      <p className="text-sm text-muted-foreground">根据业务需求设置告警阈值，避免过多的误报或漏报</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">分级告警</h4>
                      <p className="text-sm text-muted-foreground">
                        根据问题严重程度设置不同级别的告警，如信息、警告、严重
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">多渠道通知</h4>
                      <p className="text-sm text-muted-foreground">通过邮件、短信、企业微信等多种渠道发送告警通知</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">告警聚合</h4>
                      <p className="text-sm text-muted-foreground">避免告警风暴，将短时间内的相似告警聚合处理</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">日志记录</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">结构化日志</h4>
                      <p className="text-sm text-muted-foreground">使用JSON格式记录日志，便于后续分析和处理</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">记录关键信息</h4>
                      <p className="text-sm text-muted-foreground">
                        记录请求ID、时间戳、请求参数、响应结果、错误信息等关键数据
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">日志轮转</h4>
                      <p className="text-sm text-muted-foreground">设置日志轮转策略，避免日志文件过大</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">日志分析</h4>
                      <p className="text-sm text-muted-foreground">使用ELK等工具分析日志，发现潜在问题</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    注意保护用户隐私，不要在日志中记录敏感信息，如API密钥、用户个人信息等
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">监控代码示例</h3>

                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`// 简单的API监控实现
class ApiMonitor {
  private static instance: ApiMonitor;
  private metrics: {
    requests: number;
    successful: number;
    failed: number;
    totalLatency: number;
    errors: Record<string, number>;
    tokenUsage: number;
  };
  
  private constructor() {
    this.metrics = {
      requests: 0,
      successful: 0,
      failed: 0,
      totalLatency: 0,
      errors: {},
      tokenUsage: 0,
    };
    
    // 定期发送监控数据
    setInterval(() => this.reportMetrics(), 60000);
  }
  
  public static getInstance(): ApiMonitor {
    if (!ApiMonitor.instance) {
      ApiMonitor.instance = new ApiMonitor();
    }
    return ApiMonitor.instance;
  }
  
  // 记录API请求
  public recordRequest(startTime: number, success: boolean, errorType?: string, tokenUsage?: number) {
    const latency = Date.now() - startTime;
    
    this.metrics.requests++;
    if (success) {
      this.metrics.successful++;
    } else {
      this.metrics.failed++;
      if (errorType) {
        this.metrics.errors[errorType] = (this.metrics.errors[errorType] || 0) + 1;
      }
    }
    
    this.metrics.totalLatency += latency;
    
    if (tokenUsage) {
      this.metrics.tokenUsage += tokenUsage;
    }
    
    // 检查是否需要告警
    this.checkAlerts(success, latency, errorType);
  }
  
  // 检查是否需要告警
  private checkAlerts(success: boolean, latency: number, errorType?: string) {
    // 错误率告警
    const errorRate = this.metrics.failed / this.metrics.requests;
    if (errorRate > 0.1 && this.metrics.requests > 10) {
      console.error(\`[告警] 错误率过高: \${(errorRate * 100).toFixed(2)}%\`);
    }
    
    // 延迟告警
    if (latency > 2000) {
      console.warn(\`[告警] 响应延迟过高: \${latency}ms\`);
    }
    
    // 特定错误告警
    if (errorType === 'quota_exceeded') {
      console.error('[告警] 配额已用尽，请升级套餐');
    }
  }
  
  // 报告监控指标
  private reportMetrics() {
    const avgLatency = this.metrics.requests > 0 ? this.metrics.totalLatency / this.metrics.requests : 0;
    const successRate = this.metrics.requests > 0 ? (this.metrics.successful / this.metrics.requests) * 100 : 0;
    
    console.log(\`
[监控报告]
请求总数: \${this.metrics.requests}
成功率: \${successRate.toFixed(2)}%
平均延迟: \${avgLatency.toFixed(2)}ms
Token使用量: \${this.metrics.tokenUsage}
错误分布: \${JSON.stringify(this.metrics.errors)}
\`);
    
    // 可以将数据发送到监控系统
    // sendToMonitoringSystem(this.metrics);
    
    // 重置计数器
    this.resetMetrics();
  }
  
  // 重置指标
  private resetMetrics() {
    this.metrics = {
      requests: 0,
      successful: 0,
      failed: 0,
      totalLatency: 0,
      errors: {},
      tokenUsage: 0,
    };
  }
}

// 使用示例
async function callApiWithMonitoring(prompt) {
  const monitor = ApiMonitor.getInstance();
  const startTime = Date.now();
  let success = false;
  let errorType = undefined;
  let tokenUsage = 0;
  
  try {
    const response = await fetch('/api/zhipu/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      errorType = errorData.type || 'unknown';
      throw new Error(errorData.error || '请求失败');
    }
    
    const result = await response.json();
    success = true;
    tokenUsage = result.usage?.total_tokens || 0;
    
    return result;
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  } finally {
    // 记录请求结果
    monitor.recordRequest(startTime, success, errorType, tokenUsage);
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>安全最佳实践</CardTitle>
              <CardDescription>保护API密钥和用户数据安全</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API密钥管理</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">安全存储</h4>
                      <p className="text-sm text-muted-foreground">使用环境变量或密钥管理服务存储API密钥，避免硬编码</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">避免客户端存储</h4>
                      <p className="text-sm text-muted-foreground">永远不要在前端代码中存储API密钥，应该使用后端代理</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">定期轮换</h4>
                      <p className="text-sm text-muted-foreground">定期更换API密钥，特别是在员工离职或怀疑密钥泄露时</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">最小权限原则</h4>
                      <p className="text-sm text-muted-foreground">
                        为不同的应用场景创建不同的API密钥，并分配最小必要权限
                      </p>
                    </div>
                  </div>
                </div>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>警告</AlertTitle>
                  <AlertDescription>
                    API密钥泄露可能导致未授权使用和额外费用。发现密钥泄露时，应立即禁用并重新生成
                  </AlertDescription>
                </Alert>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">数据安全</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">数据最小化</h4>
                      <p className="text-sm text-muted-foreground">只发送必要的数据给API，避免包含敏感信息</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">传输加密</h4>
                      <p className="text-sm text-muted-foreground">使用HTTPS加密传输数据，防止中间人攻击</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">数据脱敏</h4>
                      <p className="text-sm text-muted-foreground">对敏感数据进行脱敏处理，如替换个人身份信息</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">输入验证</h4>
                      <p className="text-sm text-muted-foreground">验证用户输入，防止注入攻击和提示词注入</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">安全架构</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">后端代理</h4>
                      <p className="text-sm text-muted-foreground">使用后端代理调用API，避免在客户端暴露API密钥</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">请求验证</h4>
                      <p className="text-sm text-muted-foreground">验证API请求的来源和合法性，防止未授权访问</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">速率限制</h4>
                      <p className="text-sm text-muted-foreground">实施速率限制，防止滥用和DoS攻击</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">审计日志</h4>
                      <p className="text-sm text-muted-foreground">记录API调用日志，便于安全审计和问题排查</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">安全架构示例</h4>
                  <pre className="text-xs">
                    {`客户端 -> API网关 -> 后端服务 -> 智谱AI API
           |           |
           |           |
        速率限制     密钥管理
        请求验证     数据处理
        审计日志     错误处理`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">安全代码示例</h3>

                <div className="bg-muted p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`// 安全的API调用示例
import { NextResponse } from 'next/server';

// 后端API路由
export async function POST(request: Request) {
  try {
    // 1. 验证请求
    const session = await getServerSession(); // 使用你的认证库
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }
    
    // 2. 验证输入
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: '无效的请求参数' }, { status: 400 });
    }
    
    // 3. 数据脱敏（示例）
    const sanitizedPrompt = sanitizePrompt(prompt);
    
    // 4. 使用环境变量中的API密钥
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      console.error('缺少API密钥配置');
      return NextResponse.json({ error: '服务配置错误' }, { status: 500 });
    }
    
    // 5. 调用API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [{ role: 'user', content: sanitizedPrompt }],
      }),
    });
    
    // 6. 处理响应
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API调用失败:', errorData);
      return NextResponse.json({ error: '处理请求时出错' }, { status: response.status });
    }
    
    const data = await response.json();
    
    // 7. 记录审计日志（示例）
    logApiCall({
      userId: session.user.id,
      action: 'chat_completion',
      timestamp: new Date().toISOString(),
      success: true,
    });
    
    return NextResponse.json({
      message: data.choices[0].message.content,
    });
  } catch (error) {
    console.error('处理请求时出错:', error);
    
    // 记录错误日志
    logApiCall({
      userId: 'unknown',
      action: 'chat_completion',
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    });
    
    return NextResponse.json({ error: '处理请求时出错' }, { status: 500 });
  }
}

// 数据脱敏函数（示例）
function sanitizePrompt(prompt: string): string {
  // 移除可能的敏感信息，如电话号码、邮箱、身份证号等
  return prompt
    .replace(/\\d{11}/g, '[电话号码]')
    .replace(/\\w+@\\w+\\.\\w+/g, '[邮箱]')
    .replace(/\\d{17}[\\dXx]/g, '[身份证号]');
}

// 审计日志函数（示例）
function logApiCall(logData: any) {
  // 在实际应用中，应该将日志写入数据库或日志系统
  console.log('[审计日志]', JSON.stringify(logData));
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
