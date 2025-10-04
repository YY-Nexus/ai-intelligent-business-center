"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Download, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react"

// 模拟历史记录数据
const historyData = [
  {
    id: 1,
    title: "夏季促销活动海报",
    type: "promotion",
    style: "vibrant",
    size: "square",
    createdAt: "2023-05-14T10:30:00Z",
    status: "completed",
    imageUrl: "/placeholder.svg?height=100&width=100&query=summer promotion poster",
  },
  {
    id: 2,
    title: "新品发布会邀请函",
    type: "event",
    style: "elegant",
    size: "landscape",
    createdAt: "2023-05-13T15:45:00Z",
    status: "draft",
    imageUrl: "/placeholder.svg?height=100&width=100&query=product launch invitation",
  },
  {
    id: 3,
    title: "企业年会宣传海报",
    type: "event",
    style: "corporate",
    size: "portrait",
    createdAt: "2023-05-12T09:15:00Z",
    status: "completed",
    imageUrl: "/placeholder.svg?height=100&width=100&query=corporate annual meeting poster",
  },
  {
    id: 4,
    title: "品牌故事系列海报",
    type: "brand",
    style: "retro",
    size: "story",
    createdAt: "2023-05-11T14:20:00Z",
    status: "completed",
    imageUrl: "/placeholder.svg?height=100&width=100&query=brand story poster series",
  },
  {
    id: 5,
    title: "限时折扣活动海报",
    type: "promotion",
    style: "vibrant",
    size: "square",
    createdAt: "2023-05-10T11:10:00Z",
    status: "draft",
    imageUrl: "/placeholder.svg?height=100&width=100&query=limited time discount poster",
  },
  {
    id: 6,
    title: "产品功能介绍海报",
    type: "product",
    style: "modern",
    size: "square",
    createdAt: "2023-05-09T16:30:00Z",
    status: "completed",
    imageUrl: "/placeholder.svg?height=100&width=100&query=product feature introduction poster",
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

// 状态标签映射
const statusBadges = {
  completed: { label: "已完成", variant: "success" },
  draft: { label: "草稿", variant: "default" },
  processing: { label: "处理中", variant: "warning" },
}

export function PosterHistory() {
  const [history, setHistory] = useState(historyData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [statusFilter, setStatusFilter] = useState("all")

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 过滤和排��历史记录
  const filteredHistory = history
    .filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      return 0
    })

  // 切换排序方式
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  // 删除历史记录
  const deleteHistoryItem = (id: number) => {
    setHistory(history.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索历史记录..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            全部
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
          >
            已完成
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("draft")}
          >
            草稿
          </Button>
          <Button
            variant={statusFilter === "processing" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("processing")}
          >
            处理中
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">预览</th>
              <th className="text-left p-3 font-medium text-sm">海报标题</th>
              <th className="text-left p-3 font-medium text-sm">类型/风格</th>
              <th className="text-left p-3 font-medium text-sm">
                <button className="flex items-center" onClick={() => toggleSort("date")}>
                  创建时间
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-3 font-medium text-sm">状态</th>
              <th className="text-right p-3 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="p-3">
                  <div className="w-16 h-16 rounded overflow-hidden bg-muted">
                    <img
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3">{item.title}</td>
                <td className="p-3">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline">{typeLabels[item.type as keyof typeof typeLabels]}</Badge>
                    <Badge variant="outline">{styleLabels[item.style as keyof typeof styleLabels]}</Badge>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(item.createdAt)}
                  </div>
                </td>
                <td className="p-3">
                  <Badge
                    variant={
                      item.status === "completed" ? "success" : item.status === "processing" ? "warning" : "default"
                    }
                  >
                    {item.status === "completed" ? "已完成" : item.status === "processing" ? "处理中" : "草稿"}
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteHistoryItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p>没有找到匹配的历史记录</p>
          </div>
        )}
      </div>
    </div>
  )
}
