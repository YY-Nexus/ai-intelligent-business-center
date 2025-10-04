"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, GitCommit, GitMerge, Plus, Trash2 } from "lucide-react"

// 版本信息
interface Version {
  id: string
  name: string
  date: string
  author: string
  description: string
  changes: number
  status: "stable" | "beta" | "deprecated"
}

// 变更信息
interface VersionChange {
  id: string
  type: "add" | "modify" | "remove"
  path: string
  description: string
  before?: string
  after?: string
}

export default function VersionsPage() {
  const [selectedVersion1, setSelectedVersion1] = useState<string>("v2.0.0")
  const [selectedVersion2, setSelectedVersion2] = useState<string>("v1.5.0")
  const [showDiff, setShowDiff] = useState(false)

  // 模拟版本数据
  const versions: Version[] = [
    {
      id: "v2.0.0",
      name: "v2.0.0",
      date: "2023-12-15",
      author: "张三",
      description: "重大版本更新，引入新的认证机制和响应格式",
      changes: 42,
      status: "stable",
    },
    {
      id: "v1.5.0",
      name: "v1.5.0",
      date: "2023-10-20",
      author: "李四",
      description: "添加新的API端点和性能优化",
      changes: 28,
      status: "stable",
    },
    {
      id: "v1.4.2",
      name: "v1.4.2",
      date: "2023-09-05",
      author: "王五",
      description: "修复安全漏洞和错误处理",
      changes: 15,
      status: "stable",
    },
    {
      id: "v1.4.1",
      name: "v1.4.1",
      date: "2023-08-12",
      author: "赵六",
      description: "修复性能问题和错误",
      changes: 8,
      status: "deprecated",
    },
    {
      id: "v1.4.0",
      name: "v1.4.0",
      date: "2023-07-28",
      author: "钱七",
      description: "添加新的分析API和报告功能",
      changes: 22,
      status: "deprecated",
    },
    {
      id: "v1.3.0",
      name: "v1.3.0",
      date: "2023-06-15",
      author: "孙八",
      description: "添加批处理API和改进文档",
      changes: 18,
      status: "deprecated",
    },
  ]

  // 模拟版本变更数据
  const versionChanges: Record<string, VersionChange[]> = {
    "v2.0.0_v1.5.0": [
      {
        id: "change-1",
        type: "add",
        path: "/api/auth/oauth",
        description: "添加OAuth2.0认证端点",
        after: `{
  "grant_type": "authorization_code",
  "client_id": "client123",
  "client_secret": "secret456",
  "code": "auth_code",
  "redirect_uri": "https://example.com/callback"
}`,
      },
      {
        id: "change-2",
        type: "modify",
        path: "/api/users/profile",
        description: "更新用户资料API响应格式",
        before: `{
  "id": 123,
  "name": "张三",
  "email": "zhangsan@example.com",
  "role": "user"
}`,
        after: `{
  "id": "usr_123",
  "profile": {
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "roles": ["user"],
  "metadata": {
    "created_at": "2023-01-15T08:30:00Z",
    "updated_at": "2023-12-10T15:45:00Z"
  }
}`,
      },
      {
        id: "change-3",
        type: "remove",
        path: "/api/legacy/users",
        description: "移除旧版用户API",
        before: `{
  "user_id": 123,
  "user_name": "张三",
  "user_email": "zhangsan@example.com"
}`,
      },
      {
        id: "change-4",
        type: "add",
        path: "/api/products/search",
        description: "添加高级产品搜索API",
        after: `{
  "query": "手机",
  "filters": {
    "price": { "min": 1000, "max": 5000 },
    "brands": ["小米", "华为", "苹果"],
    "inStock": true
  },
  "sort": { "field": "price", "order": "asc" },
  "page": 1,
  "limit": 20
}`,
      },
      {
        id: "change-5",
        type: "modify",
        path: "/api/orders/create",
        description: "更新订单创建API，添加新的字段和验证",
        before: `{
  "user_id": 123,
  "products": [
    { "id": 456, "quantity": 2 }
  ],
  "shipping_address": "北京市海淀区",
  "payment_method": "credit_card"
}`,
        after: `{
  "user_id": "usr_123",
  "items": [
    { 
      "product_id": "prod_456", 
      "quantity": 2,
      "price_override": null
    }
  ],
  "shipping": {
    "address": {
      "line1": "北京市海淀区清华园",
      "line2": "3号楼5单元",
      "city": "北京市",
      "state": "北京",
      "postal_code": "100084",
      "country": "CN"
    },
    "method": "express",
    "estimated_delivery": "2-3 days"
  },
  "payment": {
    "method": "credit_card",
    "card_token": "tok_visa_123"
  },
  "metadata": {
    "source": "web",
    "promotion_code": "SUMMER2023"
  }
}`,
      },
    ],
    "v1.5.0_v1.4.2": [
      {
        id: "change-6",
        type: "add",
        path: "/api/analytics/dashboard",
        description: "添加分析仪表板API",
        after: `{
  "timeframe": "last_30_days",
  "metrics": ["page_views", "conversion_rate", "revenue"],
  "dimensions": ["date", "source", "device"],
  "filters": {
    "country": ["CN", "US", "JP"]
  }
}`,
      },
      {
        id: "change-7",
        type: "modify",
        path: "/api/products/list",
        description: "优化产品列表API性能",
        before: `{
  "page": 1,
  "limit": 20,
  "category": "electronics"
}`,
        after: `{
  "page": 1,
  "limit": 20,
  "category": "electronics",
  "fields": ["id", "name", "price", "thumbnail"],
  "cache": true,
  "cache_ttl": 300
}`,
      },
    ],
  }

  // 获取版本状态标签
  const getVersionStatusBadge = (status: string) => {
    switch (status) {
      case "stable":
        return <Badge className="bg-green-50 text-green-700 border-green-200">稳定版</Badge>
      case "beta":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">测试版</Badge>
      case "deprecated":
        return <Badge className="bg-red-50 text-red-700 border-red-200">已弃用</Badge>
      default:
        return null
    }
  }

  // 获取变更类型图标
  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "add":
        return <Plus className="h-5 w-5 text-green-500" />
      case "modify":
        return <GitCommit className="h-5 w-5 text-blue-500" />
      case "remove":
        return <Trash2 className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // 处理版本比较
  const handleCompare = () => {
    setShowDiff(true)
  }

  // 获取比较键
  const getCompareKey = () => {
    return `${selectedVersion1}_${selectedVersion2}`
  }

  // 交换版本
  const swapVersions = () => {
    const temp = selectedVersion1
    setSelectedVersion1(selectedVersion2)
    setSelectedVersion2(temp)
    if (showDiff) {
      setShowDiff(false)
      setTimeout(() => setShowDiff(true), 100)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">版本对比</h1>
        <p className="text-muted-foreground">比较不同API版本之间的变更，查看详细的差异和兼容性信息。</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>选择版本</CardTitle>
          <CardDescription>选择两个版本进行比较</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <Select value={selectedVersion1} onValueChange={setSelectedVersion1}>
                <SelectTrigger>
                  <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name} ({version.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="icon" onClick={swapVersions} className="hidden md:flex">
              <ArrowLeft className="h-4 w-4" />
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="w-full md:w-1/3">
              <Select value={selectedVersion2} onValueChange={setSelectedVersion2}>
                <SelectTrigger>
                  <SelectValue placeholder="选择版本" />
                </SelectTrigger>
                <SelectContent>
                  {versions.map((version) => (
                    <SelectItem key={version.id} value={version.id}>
                      {version.name} ({version.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleCompare} className="w-full md:w-auto">
              比较版本
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDiff && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 版本1信息 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedVersion1}</CardTitle>
                  {getVersionStatusBadge(versions.find((v) => v.id === selectedVersion1)?.status || "")}
                </div>
                <CardDescription>
                  {versions.find((v) => v.id === selectedVersion1)?.date} ·{" "}
                  {versions.find((v) => v.id === selectedVersion1)?.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{versions.find((v) => v.id === selectedVersion1)?.description}</p>
                <div className="text-sm text-muted-foreground">
                  {versions.find((v) => v.id === selectedVersion1)?.changes} 个变更
                </div>
              </CardContent>
            </Card>

            {/* 版本2信息 */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedVersion2}</CardTitle>
                  {getVersionStatusBadge(versions.find((v) => v.id === selectedVersion2)?.status || "")}
                </div>
                <CardDescription>
                  {versions.find((v) => v.id === selectedVersion2)?.date} ·{" "}
                  {versions.find((v) => v.id === selectedVersion2)?.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{versions.find((v) => v.id === selectedVersion2)?.description}</p>
                <div className="text-sm text-muted-foreground">
                  {versions.find((v) => v.id === selectedVersion2)?.changes} 个变更
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 变更列表 */}
          <Card>
            <CardHeader>
              <CardTitle>版本变更</CardTitle>
              <CardDescription>
                {selectedVersion1} 与 {selectedVersion2} 之间的差异
              </CardDescription>
            </CardHeader>
            <CardContent>
              {versionChanges[getCompareKey()] ? (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">全部变更</TabsTrigger>
                    <TabsTrigger value="add">新增</TabsTrigger>
                    <TabsTrigger value="modify">修改</TabsTrigger>
                    <TabsTrigger value="remove">移除</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    <div className="space-y-6">
                      {versionChanges[getCompareKey()].map((change) => (
                        <ChangeItem key={change.id} change={change} />
                      ))}
                    </div>
                  </TabsContent>

                  {["add", "modify", "remove"].map((type) => (
                    <TabsContent key={type} value={type}>
                      <div className="space-y-6">
                        {versionChanges[getCompareKey()]
                          .filter((change) => change.type === type)
                          .map((change) => (
                            <ChangeItem key={change.id} change={change} />
                          ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <GitMerge className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">无可用比较</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    没有找到这两个版本之间的变更记录。请选择其他版本进行比较。
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// 变更项组件
function ChangeItem({ change }: { change: VersionChange }) {
  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "add":
        return <Plus className="h-5 w-5 text-green-500" />
      case "modify":
        return <GitCommit className="h-5 w-5 text-blue-500" />
      case "remove":
        return <Trash2 className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case "add":
        return <Badge className="bg-green-50 text-green-700 border-green-200">新增</Badge>
      case "modify":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">修改</Badge>
      case "remove":
        return <Badge className="bg-red-50 text-red-700 border-red-200">移除</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getChangeTypeIcon(change.type)}
            <div>
              <div className="font-medium">{change.path}</div>
              <div className="text-sm text-muted-foreground">{change.description}</div>
            </div>
          </div>
          {getChangeTypeLabel(change.type)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {change.before && (
            <div>
              <div className="text-sm font-medium mb-2 text-muted-foreground">之前</div>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{change.before}</code>
              </pre>
            </div>
          )}
          {change.after && (
            <div>
              <div className="text-sm font-medium mb-2 text-muted-foreground">之后</div>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{change.after}</code>
              </pre>
            </div>
          )}
          {change.type === "remove" && !change.after && (
            <div className="md:col-span-2">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800/30 text-sm">
                此API端点已在新版本中移除。请参考文档了解替代方案。
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
