"use client"

import { useState } from "react"
import { TechButton } from "@/components/ui/tech-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, AlertTriangle, FileText, Code, BarChart2 } from "lucide-react"

interface InsightDetailProps {
  insightId?: string | number
}

export function InsightDetail({ insightId }: InsightDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // 如果没有选中的洞察，显示空状态
  if (!insightId) {
    return <EmptyState />
  }

  return (
    <div>
      <div className="mb-4">
        <Badge variant="destructive" className="mb-2">
          紧急
        </Badge>
        <h4 className="text-lg font-medium mb-1">API响应时间异常���长</h4>
        <p className="text-sm text-muted-foreground">发现时间: 2025-05-14 16:32</p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">
            概览
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1">
            分析
          </TabsTrigger>
          <TabsTrigger value="solution" className="flex-1">
            解决方案
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-4 py-2">
            <div>
              <h5 className="text-sm font-medium mb-1">问题描述</h5>
              <p className="text-sm text-muted-foreground">
                系统检测到过去24小时内API响应时间增长了47%，超出了正常阈值。这可能导致用户体验下降和系统超时。
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">影响范围</h5>
              <p className="text-sm text-muted-foreground">
                影响所有API调用，特别是高流量端点。约75%的用户请求受到影响。
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">严重程度</h5>
              <div className="flex items-center gap-2">
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[85%]"></div>
                </div>
                <span className="text-xs font-medium">高</span>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">检测方法</h5>
              <p className="text-sm text-muted-foreground">性能监控系统 + AI异常检测算法</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="space-y-4 py-2">
            <div>
              <h5 className="text-sm font-medium mb-1">根本原因分析</h5>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-sm">数据库连接池配置不当，导致连接耗尽</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-sm">缺少适当的API请求缓存策略</p>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <p className="text-sm">高峰期服务器资源不足</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">性能趋势</h5>
              <div className="h-32 bg-muted/30 rounded-md flex items-center justify-center">
                <BarChart2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">过去7天API响应时间趋势图</p>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">相关日志</h5>
              <div className="bg-muted/30 rounded-md p-2 text-xs font-mono overflow-x-auto max-h-32">
                <p className="text-red-500">[ERROR] 2025-05-14 15:42:31 - Database connection timeout</p>
                <p className="text-amber-500">[WARN] 2025-05-14 15:42:35 - Connection pool exhausted</p>
                <p className="text-amber-500">[WARN] 2025-05-14 15:43:12 - API response time exceeds threshold</p>
                <p className="text-red-500">[ERROR] 2025-05-14 15:45:22 - Request timeout for endpoint /api/data</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="solution">
          <div className="space-y-4 py-2">
            <div>
              <h5 className="text-sm font-medium mb-1">建议解决方案</h5>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">检查并优化数据库连接池配置</p>
                    <p className="text-xs text-muted-foreground">增加最大连接数并调整超时设置</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">实施API请求缓存策略</p>
                    <p className="text-xs text-muted-foreground">为频繁访问的只读数据添加Redis缓存</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">增加服务器资源或启用自动扩展</p>
                    <p className="text-xs text-muted-foreground">配置基于负载的自动扩展规则</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">代码示例</h5>
              <div className="bg-muted/30 rounded-md p-2 text-xs font-mono overflow-x-auto max-h-32">
                <pre>{`// 数据库连接池配置优化
const pool = new Pool({
  max: 20,               // 增加最大连接数
  min: 5,                // 保持最小连接数
  idleTimeoutMillis: 30000,  // 空闲连接超时
  connectionTimeoutMillis: 2000,  // 连接超时
});

// 实施Redis缓存
const getDataWithCache = async (key) => {
  const cachedData = await redisClient.get(key);
  if (cachedData) return JSON.parse(cachedData);
  
  const data = await fetchDataFromDB(key);
  await redisClient.set(key, JSON.stringify(data), 'EX', 300);
  return data;
};`}</pre>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">预期效果</h5>
              <p className="text-sm text-muted-foreground">
                实施上述解决方案后，预计API响应时间将减少60%，系统稳定性提高85%，用户体验显著改善。
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-2">
        <TechButton variant="primary" depth="3d" glow="soft" size="sm" className="flex-1">
          应用修复
        </TechButton>
        <TechButton variant="outline" depth="flat" size="sm">
          忽略
        </TechButton>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <TechButton variant="ghost" size="sm" icon={<FileText className="h-4 w-4" />}>
          导出报告
        </TechButton>
        <TechButton variant="ghost" size="sm" icon={<Code className="h-4 w-4" />}>
          查看修复代码
        </TechButton>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center">
      <div className="p-4 bg-muted/30 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h4 className="text-lg font-medium mb-2">选择一条洞察</h4>
      <p className="text-sm text-muted-foreground mb-4">点击左侧列表中的任意洞察项目查看详细信息</p>
      <TechButton variant="outline" depth="flat" size="sm">
        生成概览报告
      </TechButton>
    </div>
  )
}
