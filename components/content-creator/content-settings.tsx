"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, Trash2 } from "lucide-react"

export function ContentSettings() {
  const [activeTab, setActiveTab] = useState("preferences")

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="preferences">偏好设置</TabsTrigger>
          <TabsTrigger value="keywords">关键词库</TabsTrigger>
          <TabsTrigger value="accounts">平台账号</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>

        <TabsContent value="keywords">
          <KeywordsTab />
        </TabsContent>

        <TabsContent value="accounts">
          <AccountsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PreferencesTab() {
  const [defaultPlatform, setDefaultPlatform] = useState("xiaohongshu")
  const [defaultTone, setDefaultTone] = useState("casual")
  const [autoSave, setAutoSave] = useState(true)
  const [autoHashtags, setAutoHashtags] = useState(true)
  const [emojiSuggestions, setEmojiSuggestions] = useState(true)
  const [aiLevel, setAiLevel] = useState("balanced")
  const [signature, setSignature] = useState("——来自AI文案助手")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">默认设置</h3>

          <div className="space-y-2">
            <Label htmlFor="defaultPlatform">默认平台</Label>
            <Select value={defaultPlatform} onValueChange={setDefaultPlatform}>
              <SelectTrigger id="defaultPlatform">
                <SelectValue placeholder="选择默认平台" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xiaohongshu">小红书</SelectItem>
                <SelectItem value="wechat">朋友圈</SelectItem>
                <SelectItem value="douyin">抖音</SelectItem>
                <SelectItem value="weibo">微博</SelectItem>
                <SelectItem value="zhihu">知乎</SelectItem>
                <SelectItem value="bilibili">B站</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTone">默认语调</Label>
            <Select value={defaultTone} onValueChange={setDefaultTone}>
              <SelectTrigger id="defaultTone">
                <SelectValue placeholder="选择默认语调" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">专业正式</SelectItem>
                <SelectItem value="casual">轻松随意</SelectItem>
                <SelectItem value="humorous">幽默风趣</SelectItem>
                <SelectItem value="emotional">情感共鸣</SelectItem>
                <SelectItem value="inspirational">励志鼓舞</SelectItem>
                <SelectItem value="storytelling">故事叙述</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aiLevel">AI创意程度</Label>
            <Select value={aiLevel} onValueChange={setAiLevel}>
              <SelectTrigger id="aiLevel">
                <SelectValue placeholder="选择AI创意程度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">保守（更符合常规）</SelectItem>
                <SelectItem value="balanced">平衡（推荐）</SelectItem>
                <SelectItem value="creative">创意（更有创意）</SelectItem>
                <SelectItem value="experimental">实验性（非常创新）</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">自动化选项</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave" className="cursor-pointer">
              自动保存草稿
            </Label>
            <Switch id="autoSave" checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoHashtags" className="cursor-pointer">
              自动生成话题标签
            </Label>
            <Switch id="autoHashtags" checked={autoHashtags} onCheckedChange={setAutoHashtags} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emojiSuggestions" className="cursor-pointer">
              表情符号建议
            </Label>
            <Switch id="emojiSuggestions" checked={emojiSuggestions} onCheckedChange={setEmojiSuggestions} />
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="signature">默认签名（可选）</Label>
            <Input
              id="signature"
              placeholder="输入默认签名"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">将自动添加到生成内容的末尾</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存设置
        </Button>
      </div>
    </div>
  )
}

function KeywordsTab() {
  const [keywords, setKeywords] = useState([
    { id: 1, keyword: "高效", category: "通用" },
    { id: 2, keyword: "实用技巧", category: "通用" },
    { id: 3, keyword: "必备神器", category: "产品" },
    { id: 4, keyword: "解决痛点", category: "产品" },
    { id: 5, keyword: "提升效率", category: "职场" },
    { id: 6, keyword: "职场必备", category: "职场" },
    { id: 7, keyword: "生活妙招", category: "生活" },
    { id: 8, keyword: "好物推荐", category: "产品" },
  ])
  const [newKeyword, setNewKeyword] = useState("")
  const [newCategory, setNewCategory] = useState("通用")

  const addKeyword = () => {
    if (!newKeyword.trim()) return

    const newId = Math.max(0, ...keywords.map((k) => k.id)) + 1
    setKeywords([...keywords, { id: newId, keyword: newKeyword, category: newCategory }])
    setNewKeyword("")
  }

  const deleteKeyword = (id: number) => {
    setKeywords(keywords.filter((k) => k.id !== id))
  }

  // 获取所有类别
  const categories = [...new Set(keywords.map((k) => k.category))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="newKeyword" className="mb-2 block">
            添加关键词
          </Label>
          <div className="flex gap-2">
            <Input
              id="newKeyword"
              placeholder="输入关键词"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="flex-1"
            />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择类别" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                <SelectItem value="新类别">+ 新类别</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addKeyword}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">关键词库</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-medium mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {keywords
                  .filter((k) => k.category === category)
                  .map((keyword) => (
                    <Badge key={keyword.id} variant="secondary" className="flex items-center gap-1">
                      {keyword.keyword}
                      <button
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => deleteKeyword(keyword.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存关键词库
        </Button>
      </div>
    </div>
  )
}

function AccountsTab() {
  const [accounts, setAccounts] = useState([
    { id: 1, platform: "xiaohongshu", username: "创意生活家", connected: true },
    { id: 2, platform: "wechat", username: "微信公众号", connected: true },
    { id: 3, platform: "douyin", username: "抖音账号", connected: false },
    { id: 4, platform: "weibo", username: "微博账号", connected: false },
  ])

  // 平台图标映射
  const platformIcons = {
    xiaohongshu: "🔴",
    wechat: "💬",
    douyin: "🎵",
    weibo: "🔍",
    zhihu: "❓",
    bilibili: "📺",
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">已连接账号</h3>

        <div className="border rounded-lg divide-y">
          {accounts.map((account) => (
            <div key={account.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{platformIcons[account.platform as keyof typeof platformIcons]}</div>
                <div>
                  <h4 className="font-medium">{account.platform}</h4>
                  <p className="text-sm text-muted-foreground">{account.username}</p>
                </div>
              </div>

              <div>
                {account.connected ? (
                  <Badge variant="success">已连接</Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    连接
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">添加新账号</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(platformIcons)
            .filter(([platform]) => !accounts.some((a) => a.platform === platform))
            .map(([platform, icon]) => (
              <div key={platform} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{icon}</div>
                  <div>
                    <h4 className="font-medium">{platform}</h4>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  添加
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
