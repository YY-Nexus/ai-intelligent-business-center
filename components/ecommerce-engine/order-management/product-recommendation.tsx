"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Plus, Star, Search, Filter, Settings, RefreshCw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductCardProps {
  name: string
  image: string
  price: string
  rating: number
  category: string
  tags: string[]
  confidence: number
  isHot?: boolean
  isNew?: boolean
  onAdd: () => void
}

function ProductCard({
  name,
  image,
  price,
  rating,
  category,
  tags,
  confidence,
  isHot = false,
  isNew = false,
  onAdd,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-medium">{name}</h3>
              <p className="text-xs text-muted-foreground">{category}</p>
            </div>
            <div className="flex items-center gap-1">
              {isHot && <Badge className="bg-red-500">热门</Badge>}
              {isNew && <Badge className="bg-blue-500">新品</Badge>}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{rating.toFixed(1)}</span>
            </div>
            <span className="font-medium">{price}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>推荐置信度</span>
              <span>{confidence}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  confidence >= 90
                    ? "bg-green-500"
                    : confidence >= 70
                      ? "bg-blue-500"
                      : confidence >= 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-3.5 w-3.5 mr-1" />
              <span>查看</span>
            </Button>
            <Button size="sm" className="flex-1" onClick={onAdd}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>添加</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductRecommendation() {
  const [activeTab, setActiveTab] = useState("ai-recommendations")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [confidenceLevel, setConfidenceLevel] = useState([70])
  const [isAiEnabled, setIsAiEnabled] = useState(true)
  const [isAutoAdd, setIsAutoAdd] = useState(false)

  const handleAddProduct = () => {
    // 处理添加产品逻辑
    console.log("Product added")
  }

  // 模拟推荐产品数据
  const recommendedProducts = [
    {
      id: "1",
      name: "超薄笔记本电脑",
      image: "/placeholder.svg?height=200&width=300&query=laptop",
      price: "¥6,999",
      rating: 4.7,
      category: "电子产品",
      tags: ["轻薄", "高性能", "长续航"],
      confidence: 95,
      isHot: true,
      isNew: false,
    },
    {
      id: "2",
      name: "无线降噪耳机",
      image: "/placeholder.svg?height=200&width=300&query=headphones",
      price: "¥1,299",
      rating: 4.5,
      category: "音频设备",
      tags: ["降噪", "无线", "长续航"],
      confidence: 88,
      isHot: false,
      isNew: true,
    },
    {
      id: "3",
      name: "智能手表",
      image: "/placeholder.svg?height=200&width=300&query=smartwatch",
      price: "¥2,199",
      rating: 4.3,
      category: "可穿戴设备",
      tags: ["健康监测", "运动", "防水"],
      confidence: 82,
      isHot: true,
      isNew: true,
    },
    {
      id: "4",
      name: "4K高清投影仪",
      image: "/placeholder.svg?height=200&width=300&query=projector",
      price: "¥4,599",
      rating: 4.1,
      category: "家用电器",
      tags: ["4K", "智能", "便携"],
      confidence: 75,
      isHot: false,
      isNew: false,
    },
    {
      id: "5",
      name: "智能音箱",
      image: "/placeholder.svg?height=200&width=300&query=smart speaker",
      price: "¥899",
      rating: 4.0,
      category: "智能家居",
      tags: ["语音控制", "音质好", "智能助手"],
      confidence: 68,
      isHot: false,
      isNew: false,
    },
    {
      id: "6",
      name: "游戏手柄",
      image: "/placeholder.svg?height=200&width=300&query=game controller",
      price: "¥399",
      rating: 4.4,
      category: "游戏配件",
      tags: ["人体工学", "无线", "震动反馈"],
      confidence: 62,
      isHot: false,
      isNew: false,
    },
  ]

  // 过滤产品
  const filteredProducts = recommendedProducts.filter((product) => {
    // 根据搜索查询过滤
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    // 根据分类过滤
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    
    // 根据置信度过滤
    const matchesConfidence = product.confidence >= confidenceLevel[0]
    
    return matchesSearch && matchesCategory && matchesConfidence
  })

  // 获取所有分类
  const categories = ["all", ...new Set(recommendedProducts.map(product => product.category))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">产品推荐系统</h2>
        <p className="text-muted-foreground">
          基于AI的智能产品推荐，帮助您发现最适合的产品
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai-recommendations">AI推荐</TabsTrigger>
          <TabsTrigger value="manual-selection">手动选择</TabsTrigger>
        </TabsList>
        <TabsContent value="ai-recommendations" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="ai-enabled">AI推荐</Label>
              <Switch
                id="ai-enabled"
                checked={isAiEnabled}
                onCheckedChange={setIsAiEnabled}
              />
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新推荐
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label>推荐置信度 ({confidenceLevel[0]}%)</Label>
              <Slider
                value={confidenceLevel}
                onValueChange={setConfidenceLevel}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="auto-add">自动添加高置信度产品</Label>
              <Switch
                id="auto-add"
                checked={isAutoAdd}
                onCheckedChange={setIsAutoAdd}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="manual-selection" className="space-y-4 pt-4">
          <div className="flex flex-col gap-2">
            <Label>手动选择产品</Label>
            <p className="text-sm text-muted-foreground">
              浏览并手动选择您想要添加的产品
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索产品..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有分类</SelectItem>
              {categories.filter(cat => cat !== "all").map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              rating={product.rating}
              category={product.category}
              tags={product.tags}
              confidence={product.confidence}
              isHot={product.isHot}
              isNew={product.isNew}
              onAdd={handleAddProduct}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-medium">没有找到匹配的产品</p>
            <p className="text-muted-foreground">
              尝试调整搜索条件或过滤器
            </p>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline">
            加载更多
          </Button>
        </div>
      )}
    </div>
  )
}
