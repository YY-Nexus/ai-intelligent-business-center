"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, StarOff, Plus, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟模板数据
const templateData = [
  {
    id: 1,
    title: "现代简约社交媒体海报",
    description: "适用于社交媒体分享的简约风格海报",
    type: "social",
    style: "modern",
    size: "square",
    isFavorite: true,
    imageUrl: "/placeholder.svg?key=zkw0c",
  },
  {
    id: 2,
    title: "活力促销海报",
    description: "适用于产品促销和限时优惠",
    type: "promotion",
    style: "vibrant",
    size: "portrait",
    isFavorite: false,
    imageUrl: "/placeholder.svg?key=mbfmv",
  },
  {
    id: 3,
    title: "企业活动邀请函",
    description: "适用于企业活动和会议邀请",
    type: "event",
    style: "corporate",
    size: "landscape",
    isFavorite: true,
    imageUrl: "/placeholder.svg?key=ejvf5",
  },
  {
    id: 4,
    title: "产品展示海报",
    description: "突出产品特性和优势的展示海报",
    type: "product",
    style: "elegant",
    size: "square",
    isFavorite: false,
    imageUrl: "/placeholder.svg?height=400&width=400&query=elegant product showcase poster",
  },
  {
    id: 5,
    title: "品牌故事海报",
    description: "讲述品牌故事和价值观的海报",
    type: "brand",
    style: "retro",
    size: "story",
    isFavorite: false,
    imageUrl: "/placeholder.svg?height=600&width=400&query=retro brand story poster",
  },
  {
    id: 6,
    title: "极简公告海报",
    description: "简洁明了的公告和通知海报",
    type: "announcement",
    style: "minimalist",
    size: "banner",
    isFavorite: true,
    imageUrl: "/placeholder.svg?height=300&width=600&query=minimalist announcement poster",
  },
]

// 类型和风格映射
const typeLabels = {
  social: "社交媒体",
  promotion: "促销活动",
  event: "活动宣传",
  product: "产品展示",
  brand: "品牌宣传",
  announcement: "公告通知",
}

const styleLabels = {
  modern: "现代简约",
  vibrant: "活力多彩",
  elegant: "优雅精致",
  corporate: "企业商务",
  retro: "复古风格",
  minimalist: "极简主义",
}

const sizeLabels = {
  square: "方形 1:1",
  portrait: "竖版 4:5",
  story: "故事 9:16",
  landscape: "横版 16:9",
  banner: "横幅 2:1",
  custom: "自定义尺寸",
}

export function PosterTemplates() {
  const [templates, setTemplates] = useState(templateData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeType, setActiveType] = useState("all")
  const [activeStyle, setActiveStyle] = useState("all")

  // 获取所有类型和风格
  const types = ["all", ...Object.keys(typeLabels)]
  const styles = ["all", ...Object.keys(styleLabels)]

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = activeType === "all" || template.type === activeType
    const matchesStyle = activeStyle === "all" || template.style === activeStyle
    return matchesSearch && matchesType && matchesStyle
  })

  // 切换收藏状态
  const toggleFavorite = (id: number) => {
    setTemplates(
      templates.map((template) => (template.id === id ? { ...template, isFavorite: !template.isFavorite } : template)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索模板..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <div className="flex gap-2 mr-4">
            {types.map((type) => (
              <Button
                key={type}
                variant={activeType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveType(type)}
              >
                {type === "all" ? "全部类型" : typeLabels[type as keyof typeof typeLabels]}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            {styles.map((style) => (
              <Button
                key={style}
                variant={activeStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveStyle(style)}
              >
                {style === "all" ? "全部风格" : styleLabels[style as keyof typeof styleLabels]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg overflow-hidden transition-all hover:shadow-md",
              template.isFavorite && "border-yellow-200",
            )}
          >
            <div className="relative aspect-square bg-muted">
              <img
                src={template.imageUrl || "/placeholder.svg"}
                alt={template.title}
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(template.id)}
              >
                {template.isFavorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="p-4">
              <h3 className="font-medium mb-1">{template.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{typeLabels[template.type as keyof typeof typeLabels]}</Badge>
                <Badge variant="outline">{styleLabels[template.style as keyof typeof styleLabels]}</Badge>
                <Badge variant="outline">{sizeLabels[template.size as keyof typeof sizeLabels]}</Badge>
              </div>

              <div className="flex justify-between gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  预览
                </Button>
                <Button size="sm" className="flex-1">
                  使用模板
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* 添加新模板卡片 */}
        <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-[400px] text-center">
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <h3 className="font-medium mb-1">上传自定义模板</h3>
          <p className="text-sm text-muted-foreground mb-4">上传您的设计作为模板</p>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            添加模板
          </Button>
        </div>
      </div>
    </div>
  )
}
