import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Database, Globe, MessageSquare, RefreshCw, Server, ShoppingBag } from "lucide-react"

// API类型定义
interface ApiType {
  id: string
  name: string
  description: string
  count: number
  icon: React.ReactNode
  examples: string[]
  color: string
}

export default function ApiTypesPage() {
  // API类型数据
  const apiTypes: ApiType[] = [
    {
      id: "rest",
      name: "REST API",
      description: "基于HTTP协议的表述性状态传递API，使用标准HTTP方法进行资源操作。",
      count: 42,
      icon: <Globe className="h-6 w-6" />,
      examples: ["用户管理API", "内容管理API", "支付处理API"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "graphql",
      name: "GraphQL API",
      description: "查询语言和运行时，允许客户端精确指定所需数据，减少过度获取和请求次数。",
      count: 15,
      icon: <Database className="h-6 w-6" />,
      examples: ["数据聚合API", "内容查询API", "用户关系API"],
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "websocket",
      name: "WebSocket API",
      description: "提供全双工通信通道的API，适用于实时数据传输和通知。",
      count: 8,
      icon: <RefreshCw className="h-6 w-6" />,
      examples: ["实时聊天API", "市场数据流API", "通知服务API"],
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      id: "rpc",
      name: "RPC API",
      description: "远程过程调用API，允许客户端调用服务器上的函数或过程。",
      count: 12,
      icon: <Server className="h-6 w-6" />,
      examples: ["微服务通信API", "函数调用API", "批处理API"],
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      id: "webhook",
      name: "Webhook API",
      description: "基于HTTP回调的API，当特定事件发生时向预定义的URL发送通知。",
      count: 10,
      icon: <MessageSquare className="h-6 w-6" />,
      examples: ["支付通知API", "事件订阅API", "状态变��API"],
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      id: "ecommerce",
      name: "电商API",
      description: "专为电子商务应用设计的API，提供产品、订单、支付和物流等功能。",
      count: 18,
      icon: <ShoppingBag className="h-6 w-6" />,
      examples: ["产品目录API", "订单管理API", "库存管理API"],
      color: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">API类型</h1>
        <p className="text-muted-foreground">浏览不同类型的API，了解它们的特点、用例和最佳实践。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apiTypes.map((type) => (
          <Card key={type.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-md ${type.color.split(" ")[0]}`}>
                  {type.icon}
                </div>
                <div>
                  <CardTitle className="flex items-center">
                    {type.name}
                    <Badge className="ml-2" variant="outline">
                      {type.count}
                    </Badge>
                  </CardTitle>
                </div>
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">示例API:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {type.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/api-documentation/${type.id}`}>
                  查看详情
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
