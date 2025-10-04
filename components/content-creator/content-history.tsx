"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Copy, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react"

// 模拟历史记录数据
const historyData = [
  {
    id: 1,
    title: "小红书种草文案 - 智能手表",
    platform: "xiaohongshu",
    createdAt: "2023-05-14T10:30:00Z",
    status: "published",
    engagement: {
      views: 1245,
      likes: 89,
      comments: 23,
    },
  },
  {
    id: 2,
    title: "抖音短视频脚本 - 烘焙技巧",
    platform: "douyin",
    createdAt: "2023-05-13T15:45:00Z",
    status: "draft",
    engagement: null,
  },
  {
    id: 3,
    title: "朋友圈文案 - 旅行分享",
    platform: "wechat",
    createdAt: "2023-05-12T09:15:00Z",
    status: "published",
    engagement: {
      views: 78,
      likes: 12,
      comments: 5,
    },
  },
  {
    id: 4,
    title: "知乎回答 - 职业发展",
    platform: "zhihu",
    createdAt: "2023-05-11T14:20:00Z",
    status: "published",
    engagement: {
      views: 3456,
      likes: 234,
      comments: 45,
    },
  },
  {
    id: 5,
    title: "微博热点评论 - 新政策",
    platform: "weibo",
    createdAt: "2023-05-10T11:10:00Z",
    status: "scheduled",
    engagement: null,
  },
  {
    id: 6,
    title: "B站视频简介 - 编程教程",
    platform: "bilibili",
    createdAt: "2023-05-09T16:30:00Z",
    status: "draft",
    engagement: null,
  },
]

// 平台图标映射
const platformIcons = {
  xiaohongshu: "🔴",
  wechat: "💬",
  douyin: "🎵",
  weibo: "🔍",
  zhihu: "❓",
  bilibili: "📺",
}

// 状态标签映射
const statusBadges = {
  published: { label: "已发布", variant: "success" },
  draft: { label: "草稿", variant: "default" },
  scheduled: { label: "已计划", variant: "warning" },
}

export function ContentHistory() {
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

  // 过滤和排序历史记录
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
      } else if (sortBy === "engagement" && a.engagement && b.engagement) {
        return sortOrder === "asc" ? a.engagement.views - b.engagement.views : b.engagement.views - a.engagement.views
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
            variant={statusFilter === "published" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("published")}
          >
            已发布
          </Button>
          <Button
            variant={statusFilter === "draft" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("draft")}
          >
            草稿
          </Button>
          <Button
            variant={statusFilter === "scheduled" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("scheduled")}
          >
            已计划
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">内容标题</th>
              <th className="text-left p-3 font-medium text-sm">平台</th>
              <th className="text-left p-3 font-medium text-sm">
                <button className="flex items-center" onClick={() => toggleSort("date")}>
                  创建时间
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </th>
              <th className="text-left p-3 font-medium text-sm">状态</th>
              <th className="text-left p-3 font-medium text-sm">
                <button className="flex items-center" onClick={() => toggleSort("engagement")}>
                  数据表现
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </button>
              </th>
              <th className="text-right p-3 font-medium text-sm">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredHistory.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="p-3">{item.title}</td>
                <td className="p-3">
                  <Badge variant="outline">
                    {platformIcons[item.platform as keyof typeof platformIcons]} {item.platform}
                  </Badge>
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
                      item.status === "published" ? "success" : item.status === "scheduled" ? "warning" : "default"
                    }
                  >
                    {item.status === "published" ? "已发布" : item.status === "scheduled" ? "已计划" : "草稿"}
                  </Badge>
                </td>
                <td className="p-3">
                  {item.engagement ? (
                    <div className="text-sm">
                      <span className="mr-2">👁️ {item.engagement.views}</span>
                      <span className="mr-2">❤️ {item.engagement.likes}</span>
                      <span>💬 {item.engagement.comments}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">暂无数据</span>
                  )}
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
                      <Copy className="h-4 w-4" />
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
