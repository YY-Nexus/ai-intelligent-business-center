import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Database, Cloud, Zap, Search } from "lucide-react"

// 数据存储类型
interface DatabasePlatform {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  features: string[]
  color: string
  popular: boolean
}

export default function DatabasesPage() {
  // 数据存储平台数据
  const databasePlatforms: DatabasePlatform[] = [
    {
      id: "mysql",
      name: "MySQL",
      description: "最流行的开源关系型数据库管理系统，适用于各种规模的应用。",
      category: "关系型数据库",
      icon: <Database className="h-6 w-6" />,
      features: ["事务支持", "复制功能", "分区表", "存储过程"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: true,
    },
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "功能强大的开源对象关系型数据库系统，支持高级数据类型和性能优化。",
      category: "关系型数据库",
      icon: <Database className="h-6 w-6" />,
      features: ["JSON支持", "地理数据", "全文搜索", "并发控制"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: true,
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "流行的文档型NoSQL数据库，适用于大规模数据存储和高并发场景。",
      category: "NoSQL数据库",
      icon: <Database className="h-6 w-6" />,
      features: ["文档存储", "高可用性", "水平扩展", "聚合框架"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: true,
    },
    {
      id: "redis",
      name: "Redis",
      description: "高性能的内存键值数据库，支持多种数据结构和持久化选项。",
      category: "键值数据库",
      icon: <Zap className="h-6 w-6" />,
      features: ["高性能", "数据结构", "发布订阅", "Lua脚本"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: true,
    },
    {
      id: "elasticsearch",
      name: "Elasticsearch",
      description: "分布式搜索和分析引擎，适用于全文搜索、日志分析和实时数据分析。",
      category: "搜索引擎",
      icon: <Search className="h-6 w-6" />,
      features: ["全文搜索", "分析引擎", "分布式", "RESTful API"],
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      popular: true,
    },
    {
      id: "aliyun-rds",
      name: "阿里云RDS",
      description: "阿里云关系型数据库服务，提供MySQL、SQL Server、PostgreSQL等多种数据库类型。",
      category: "云数据库",
      icon: <Cloud className="h-6 w-6" />,
      features: ["高可用", "备份恢复", "监控告警", "弹性扩展"],
      color: "bg-orange-50 text-orange-700 border-orange-200",
      popular: true,
    },
    {
      id: "tencent-cloud-db",
      name: "腾讯云数据库",
      description: "腾讯云提供的数据库服务，包括MySQL、PostgreSQL、MongoDB等多种类型。",
      category: "云数据库",
      icon: <Cloud className="h-6 w-6" />,
      features: ["高可用", "安全防护", "自动备份", "监控管理"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: false,
    },
    {
      id: "huawei-cloud-db",
      name: "华为云数据库",
      description: "华为云提供的数据库服务，支持多种数据库引擎和部署模式。",
      category: "云数据库",
      icon: <Cloud className="h-6 w-6" />,
      features: ["高可靠", "弹性扩展", "安全加密", "智能运维"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: false,
    },
    {
      id: "oracle",
      name: "Oracle Database",
      description: "企业级关系型数据库管理系统，提供高性能、高可用性。",
      category: "关系型数据库",
      icon: <Database className="h-6 w-6" />,
      features: ["高性能", "高可用", "安全性", "可扩展性"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: false,
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">数据库</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {databasePlatforms.map((platform) => (
          <Card key={platform.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {platform.icon}
                <span>{platform.name}</span>
                {platform.popular && <Badge className="ml-2">热门</Badge>}
              </CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                {platform.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-500">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link href={`/api-documentation/databases/${platform.id}`} passHref>
                <Button variant="outline" asChild>
                  <span>了解更多</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Badge className={platform.color}>{platform.category}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
