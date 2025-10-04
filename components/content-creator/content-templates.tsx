"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Star, StarOff, Copy, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟模板数据
const templateData = [
  {
    id: 1,
    title: "小红书爆款种草模板",
    description: "适用于产品推荐和种草内容",
    platform: "xiaohongshu",
    category: "产品推荐",
    isFavorite: true,
    content:
      "🌟 今天给大家种草一个超级好用的「{产品}」！\n\n之前一直被{痛点}困扰，直到用了这个{产品}，简直是救星！✨\n\n💡 它的优点有：\n· {优点1}\n· {优点2}\n· {优点3}\n\n🔍 我的真实使用感受：\n{使用体验}\n\n💰 价格：{价格}\n🛒 购买渠道：{购买链接}\n\n🙋‍♀️ 有什么问题随时评论区交流哦～\n\n#{产品} #{品类} #好物推荐 #种草",
  },
  {
    id: 2,
    title: "抖音短视频脚本模板",
    description: "适用于教程和技巧分享",
    platform: "douyin",
    category: "教程",
    isFavorite: false,
    content:
      "大家好，今天教大家{技巧名称}！\n\n很多人都不知道，其实{技巧名称}超简单！\n\n只需要这3步：\n1. {步骤1}\n2. {步骤2}\n3. {步骤3}\n\n学会了吗？记得点赞关注，每天分享更多实用技巧！\n\n#学习 #{领域} #{技巧名称}",
  },
  {
    id: 3,
    title: "朋友圈日常分享模板",
    description: "适用于生活日常和心情分享",
    platform: "wechat",
    category: "生活分享",
    isFavorite: true,
    content: "分享今天的{主题}时光 ☀️\n\n{描述内容}\n\n有时候生活就是需要这样的{感受}，让人{情绪}。\n\n{结束语或金句}",
  },
  {
    id: 4,
    title: "知乎专业回答模板",
    description: "适用于专业知识分享和问题解答",
    platform: "zhihu",
    category: "知识分享",
    isFavorite: false,
    content:
      "关于{问题}，我来从专业角度分析一下：\n\n首先，我们需要理解{核心概念}的基本原理。{概念解释}\n\n其次，{问题}通常涉及以下几个方面：\n1. {方面1}：{解释1}\n2. {方面2}：{解释2}\n3. {方面3}：{解释3}\n\n基于我{相关经验}的经验，建议可以这样处理：\n- {建议1}\n- {建议2}\n- {建议3}\n\n希望对你有所帮助。",
  },
  {
    id: 5,
    title: "微博热点评论模板",
    description: "适用于热点话题和时事评论",
    platform: "weibo",
    category: "热点评论",
    isFavorite: false,
    content:
      "##{话题}## {观点表达}\n\n看到{事件}的新闻，不禁让人思考{思考点}。\n\n{个人看法}\n\n你们怎么看这件事？ //@{相关博主}",
  },
  {
    id: 6,
    title: "B站视频简介模板",
    description: "适用于教育和娱乐内容",
    platform: "bilibili",
    category: "视频内容",
    isFavorite: true,
    content:
      "【{视频标题}】{视频简短描述}\n\n这期视频为大家带来{内容概述}，希望能对你有所帮助！\n\n🔍 内容导航：\n00:00 开场白\n{时间点1} {内容1}\n{时间点2} {内容2}\n{时间点3} {内容3}\n\n💬 欢迎在评论区留言讨论！\n\n##{分区}## #{标签1}# #{标签2}#",
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

export function ContentTemplates() {
  const [templates, setTemplates] = useState(templateData)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // 获取所有类别
  const categories = ["all", ...new Set(templates.map((t) => t.category))]

  // 过滤模板
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  // 切换收藏状态
  const toggleFavorite = (id: number) => {
    setTemplates(
      templates.map((template) => (template.id === id ? { ...template, isFavorite: !template.isFavorite } : template)),
    )
  }

  // 复制模板内容
  const copyTemplate = (content: string) => {
    navigator.clipboard.writeText(content)
    // 这里可以添加复制成功的提示
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
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
            >
              {category === "all" ? "全部" : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg p-4 transition-all hover:shadow-md",
              template.isFavorite && "border-yellow-200 bg-yellow-50",
            )}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toggleFavorite(template.id)}>
                {template.isFavorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex gap-2 mb-3">
              <Badge variant="outline">
                {platformIcons[template.platform as keyof typeof platformIcons]} {template.platform}
              </Badge>
              <Badge variant="outline">{template.category}</Badge>
            </div>

            <div className="bg-muted/50 rounded p-3 text-sm font-mono h-32 overflow-y-auto mb-3">
              {template.content}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => copyTemplate(template.content)}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
              <Button size="sm">使用模板</Button>
            </div>
          </div>
        ))}

        {/* 添加新模板卡片 */}
        <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-[250px] text-center">
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <h3 className="font-medium mb-1">创建新模板</h3>
          <p className="text-sm text-muted-foreground mb-4">自定义您的专属内容模板</p>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            添加模板
          </Button>
        </div>
      </div>
    </div>
  )
}
