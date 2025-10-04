import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Truck, CreditCard, BarChart, Store, Package, Users, Search } from "lucide-react"

// 商业平台类型
interface BusinessPlatform {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  apis: string[]
  color: string
  popular: boolean
}

export default function BusinessPlatformsPage() {
  // 商业平台数据
  const businessPlatforms: BusinessPlatform[] = [
    {
      id: "taobao",
      name: "淘宝开放平台",
      description: "淘宝开放平台API，支持商品管理、订单处理、物流跟踪等功能。",
      category: "电商平台",
      icon: <ShoppingCart className="h-6 w-6" />,
      apis: ["商品管理", "订单处理", "物流跟踪", "店铺管理"],
      color: "bg-orange-50 text-orange-700 border-orange-200",
      popular: true,
    },
    {
      id: "jd",
      name: "京东开放平台",
      description: "京东开放平台API，支持商品管理、订单处理、售后服务等功能。",
      category: "电商平台",
      icon: <ShoppingCart className="h-6 w-6" />,
      apis: ["商品管理", "订单处理", "售后服务", "库存管理"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: true,
    },
    {
      id: "pinduoduo",
      name: "拼多多开放平台",
      description: "拼多多开放平台API，支持商品管理、订单处理、营销活动等功能。",
      category: "电商平台",
      icon: <ShoppingCart className="h-6 w-6" />,
      apis: ["商品管理", "订单处理", "营销活动", "数据分析"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: true,
    },
    {
      id: "meituan",
      name: "美团开放平台",
      description: "美团开放平台API，支持商户管理、订单处理、配送服务等功能。",
      category: "本地生活",
      icon: <Store className="h-6 w-6" />,
      apis: ["商户管理", "订单处理", "配送服务", "评价管理"],
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      popular: true,
    },
    {
      id: "eleme",
      name: "饿了么开放平台",
      description: "饿了么开放平台API，支持商户管理、订单处理、配送服务等功能。",
      category: "本地生活",
      icon: <Store className="h-6 w-6" />,
      apis: ["商户管理", "订单处理", "配送服务", "菜品管理"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: true,
    },
    {
      id: "alipay",
      name: "支付宝开放平台",
      description: "支付宝开放平台API，支持支付处理、资金管理、会员服务等功能。",
      category: "支付服务",
      icon: <CreditCard className="h-6 w-6" />,
      apis: ["支付处理", "资金管理", "会员服务", "营销工具"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: true,
    },
    {
      id: "wechatpay",
      name: "微信支付",
      description: "微信支付API，支持支付处理、退款管理、账单查询等功能。",
      category: "支付服务",
      icon: <CreditCard className="h-6 w-6" />,
      apis: ["支付处理", "退款管理", "账单查询", "分账功能"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: false,
    },
    {
      id: "ctrip",
      name: "携程开放平台",
      description: "携程开放平台API，支持酒店预订、机票预订、旅游产品等功能。",
      category: "旅游服务",
      icon: <Package className="h-6 w-6" />,
      apis: ["酒店预订", "机票预订", "旅游产品", "订单管理"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: false,
    },
    {
      id: "didi",
      name: "滴滴开放平台",
      description: "滴滴开放平台API，支持出行服务、订单管理、司机管理等功能。",
      category: "出行服务",
      icon: <Truck className="h-6 w-6" />,
      apis: ["出行服务", "订单管理", "司机管理", "支付服务"],
      color: "bg-orange-50 text-orange-700 border-orange-200",
      popular: false,
    },
    {
      id: "baidu",
      name: "百度开放平台",
      description: "百度开放平台API，支持搜索服务、地图服务、AI能力等功能。",
      category: "互联网服务",
      icon: <Search className="h-6 w-6" />,
      apis: ["搜索服务", "地图服务", "AI能力", "数据分析"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: false,
    },
    {
      id: "tencent",
      name: "腾讯开放平台",
      description: "腾讯开放平台API，支持社交服务、游戏服务、云服务等功能。",
      category: "互联网服务",
      icon: <Users className="h-6 w-6" />,
      apis: ["社交服务", "游戏服务", "云服务", "支付服务"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: false,
    },
    {
      id: "alibaba",
      name: "阿里巴巴开放平台",
      description: "阿里巴巴开放平台API，支持批发采购、供应链管理、跨境贸易等功能。",
      category: "B2B服务",
      icon: <BarChart className="h-6 w-6" />,
      apis: ["批发采购", "供应链管理", "跨境贸易", "金融服务"],
      color: "bg-orange-50 text-orange-700 border-orange-200",
      popular: false,
    },
  ]

  // 获取所有类别
  const categories = Array.from(new Set(businessPlatforms.map((platform) => platform.category)))

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">商业平台</h1>
        <p className="text-muted-foreground">
          浏览各种商业平台的API，包括电商平台、支付服务、本地生活等，了解它们的功能和使用方法。
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">热门平台</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessPlatforms
            .filter((platform) => platform.popular)
            .map((platform) => (
              <Card key={platform.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-md ${platform.color.split(" ")[0]}`}
                    >
                      {platform.icon}
                    </div>
                    <div>
                      <CardTitle className="flex items-center">
                        {platform.name}
                        <Badge className="ml-2" variant="outline">
                          {platform.category}
                        </Badge>
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">支持的API:</h4>
                    <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                      {platform.apis.map((api, index) => (
                        <li key={index} className="flex items-center">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          {api}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/api-documentation/business-platforms/${platform.id}`}>
                      查看详情
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessPlatforms
              .filter((platform) => platform.category === category)
              .map((platform) => (
                <Card key={platform.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-md ${platform.color.split(" ")[0]}`}
                      >
                        {platform.icon}
                      </div>
                      <div>
                        <CardTitle>{platform.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{platform.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">支持的API:</h4>
                      <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                        {platform.apis.map((api, index) => (
                          <li key={index} className="flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {api}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/api-documentation/business-platforms/${platform.id}`}>
                        查看详情
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
