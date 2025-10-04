import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageSquare, Share2, Video, ImageIcon, Rss, Music, Newspaper } from "lucide-react"

// 媒体平台类型
interface MediaPlatform {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  apis: string[]
  color: string
  popular: boolean
}

export default function MediaChannelsPage() {
  // 媒体平台数据
  const mediaPlatforms: MediaPlatform[] = [
    {
      id: "weibo",
      name: "微博",
      description: "新浪微博API，支持发布微博、获取时间线、关注用户等功能。",
      category: "社交媒体",
      icon: <MessageSquare className="h-6 w-6" />,
      apis: ["发布微博", "获取时间线", "关注用户", "搜索微博"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: true,
    },
    {
      id: "wechat",
      name: "微信公众平台",
      description: "微信公众平台API，支持发送消息、创建菜单、素材管理等功能。",
      category: "社交媒体",
      icon: <MessageSquare className="h-6 w-6" />,
      apis: ["发送消息", "创建菜单", "素材管理", "用户管理"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: true,
    },
    {
      id: "douyin",
      name: "抖音开放平台",
      description: "抖音开放平台API，支持视频上传、数据分析、互动管理等功能。",
      category: "短视频",
      icon: <Video className="h-6 w-6" />,
      apis: ["视频上传", "数据分析", "互动管理", "直播功能"],
      color: "bg-black text-white border-gray-700",
      popular: true,
    },
    {
      id: "bilibili",
      name: "哔哩哔哩",
      description: "哔哩哔哩开放平台API，支持视频上传、弹幕获取、用户信息等功能。",
      category: "视频平台",
      icon: <Video className="h-6 w-6" />,
      apis: ["视频上传", "弹幕获取", "用户信息", "搜索功能"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: true,
    },
    {
      id: "xiaohongshu",
      name: "小红书",
      description: "小红书开放平台API，支持笔记发布、数据分析、用户互动等功能。",
      category: "社区平台",
      icon: <ImageIcon className="h-6 w-6" />,
      apis: ["笔记发布", "数据分析", "用户互动", "搜索功能"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: true,
    },
    {
      id: "zhihu",
      name: "知乎",
      description: "知乎开放平台API，支持问答发布、专栏文章、用户信息等功能。",
      category: "知识社区",
      icon: <Newspaper className="h-6 w-6" />,
      apis: ["问答发布", "专栏文章", "用户信息", "搜索功能"],
      color: "bg-blue-50 text-blue-700 border-blue-200",
      popular: false,
    },
    {
      id: "toutiao",
      name: "今日头条",
      description: "今日头条开放平台API，支持文章发布、数据分析、用户互动等功能。",
      category: "新闻资讯",
      icon: <Newspaper className="h-6 w-6" />,
      apis: ["文章发布", "数据分析", "用户互动", "搜索功能"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: false,
    },
    {
      id: "kuaishou",
      name: "快手",
      description: "快手开放平台API，支持视频上传、数据分析、互动管理等功能。",
      category: "短视频",
      icon: <Video className="h-6 w-6" />,
      apis: ["视频上传", "数据分析", "互动管理", "直播功能"],
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      popular: false,
    },
    {
      id: "qqmusic",
      name: "QQ音乐",
      description: "QQ音乐开放平台API，支持音乐播放、歌单管理、用户信息等功能。",
      category: "音乐平台",
      icon: <Music className="h-6 w-6" />,
      apis: ["音乐播放", "歌单管理", "用户信息", "搜索功能"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: false,
    },
    {
      id: "netease",
      name: "网易云音乐",
      description: "网易云音乐开放平台API，支持音乐播放、歌单管理、用户信息等功能。",
      category: "音乐平台",
      icon: <Music className="h-6 w-6" />,
      apis: ["音乐播放", "歌单管理", "用户信息", "搜索功能"],
      color: "bg-red-50 text-red-700 border-red-200",
      popular: false,
    },
    {
      id: "douban",
      name: "豆瓣",
      description: "豆瓣开放平台API，支持图书、电影、音乐等内容的获取和评论。",
      category: "社区平台",
      icon: <Rss className="h-6 w-6" />,
      apis: ["内容获取", "评论发布", "用户信息", "搜索功能"],
      color: "bg-green-50 text-green-700 border-green-200",
      popular: false,
    },
    {
      id: "mafengwo",
      name: "马蜂窝",
      description: "马蜂窝开放平台API，支持旅游攻略、景点信息、用户评论等功能。",
      category: "旅游平台",
      icon: <ImageIcon className="h-6 w-6" />,
      apis: ["攻略获取", "景点信息", "用户评论", "搜索功能"],
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      popular: false,
    },
  ]

  // 获取所有类别
  const categories = Array.from(new Set(mediaPlatforms.map((platform) => platform.category)))

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">媒体平台</h1>
        <p className="text-muted-foreground">
          浏览各种媒体平台的API，包括社交媒体、短视频、音乐平台等，了解它们的功能和使用方法。
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">热门平台</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaPlatforms
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
                          <Share2 className="h-3 w-3 mr-1" />
                          {api}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/api-documentation/media-channels/${platform.id}`}>
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
            {mediaPlatforms
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
                            <Share2 className="h-3 w-3 mr-1" />
                            {api}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/api-documentation/media-channels/${platform.id}`}>
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
