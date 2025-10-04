"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Save, Share, ThumbsUp, MessageSquare, Send } from "lucide-react"
import { cn } from "@/lib/utils"

const platforms = [
  { id: "xiaohongshu", name: "小红书", icon: "🔴" },
  { id: "wechat", name: "朋友圈", icon: "💬" },
  { id: "douyin", name: "抖音", icon: "🎵" },
  { id: "weibo", name: "微博", icon: "🔍" },
  { id: "zhihu", name: "知乎", icon: "❓" },
  { id: "bilibili", name: "B站", icon: "📺" },
]

const tones = [
  { id: "professional", name: "专业正式" },
  { id: "casual", name: "轻松随意" },
  { id: "humorous", name: "幽默风趣" },
  { id: "emotional", name: "情感共鸣" },
  { id: "inspirational", name: "励志鼓舞" },
  { id: "storytelling", name: "故事叙述" },
]

export function ContentGenerator() {
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [platform, setPlatform] = useState("xiaohongshu")
  const [tone, setTone] = useState("casual")
  const [creativityLevel, setCreativityLevel] = useState([50])
  const [contentLength, setContentLength] = useState([2]) // 1-短, 2-中, 3-长
  const [includeEmoji, setIncludeEmoji] = useState(true)
  const [includeHashtags, setIncludeHashtags] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [selectedTab, setSelectedTab] = useState("preview")

  const handleGenerate = async () => {
    if (!topic) return

    setIsGenerating(true)
    setGeneratedContent("")

    // 模拟API调用
    setTimeout(() => {
      const lengthText = contentLength[0] === 1 ? "短" : contentLength[0] === 2 ? "中" : "长"
      const platformInfo = platforms.find((p) => p.id === platform)
      const toneInfo = tones.find((t) => t.id === tone)

      let content = ""

      if (platform === "xiaohongshu") {
        content = `✨ 这是一篇${platformInfo?.name}${lengthText}文案，主题是"${topic}"，关键词包含"${keywords || topic}"，风格是"${toneInfo?.name}"，创意程度为${creativityLevel[0]}%。\n\n`
        content += `🌟 今天给大家分享一个超实用的小技巧！\n\n`
        content += `${topic}真的太重要了，之前我一直不知道怎么做，走了很多弯路。直到发现了这个方法，效果简直惊艳！\n\n`
        content += `👉 首先，你需要准备的材料很简单\n`
        content += `👉 然后，按照这个步骤一步步来\n`
        content += `👉 最后，你会发现效果出乎意料的好\n\n`
        content += `💡 小贴士：${keywords || "注意细节，效果加倍"}\n\n`
        content += `🙋‍♀️ 有什么问题随时评论区交流哦～\n\n`

        if (includeHashtags) {
          content += `#${topic} #经验分享 #小技巧 #${keywords || "实用建议"} #生活提升`
        }
      } else if (platform === "wechat") {
        content = `这是一篇${platformInfo?.name}${lengthText}文案，主题是"${topic}"，关键词包含"${keywords || topic}"，风格是"${toneInfo?.name}"，创意程度为${creativityLevel[0]}%。\n\n`
        content += `分享一个关于${topic}的小心得\n\n`
        content += `最近研究了很多关于${topic}的内容，发现其实很多人都忽略了一些关键点。\n\n`
        content += `其实只要掌握了正确方法，${topic}并不难。\n\n`
        content += `今天天气真好，心情也不错，分享给大家，希望对你有帮助～`

        if (includeEmoji) {
          content = content.replace(/\n/g, "\n😊 ")
        }
      } else if (platform === "douyin") {
        content = `#${topic} ${keywords ? "#" + keywords : ""} \n\n`
        content += `这个${topic}技巧也太绝了吧！！！\n`
        content += `学会这一招，效率直接提升300%\n`
        content += `赶紧学起来！\n\n`
        content += `关注我，持续分享各种实用技巧！`

        if (includeEmoji) {
          content += `\n\n🔥🔥🔥`
        }
      }

      setGeneratedContent(content)
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
    // 这里可以添加复制成功的提示
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">内容主题</h3>

          <div className="space-y-2">
            <Label htmlFor="topic">主题/产品</Label>
            <Input
              id="topic"
              placeholder="输入文案主题或产品名称"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">关键词（可选）</Label>
            <Input
              id="keywords"
              placeholder="输入希望包含的关键词，用逗号分隔"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">平台与风格</h3>

          <div className="space-y-2">
            <Label htmlFor="platform">目标平台</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="选择平台" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">语调风格</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="选择语调" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">内容参数</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="creativity">创意程度</Label>
              <span className="text-sm text-muted-foreground">{creativityLevel}%</span>
            </div>
            <Slider
              id="creativity"
              min={0}
              max={100}
              step={10}
              value={creativityLevel}
              onValueChange={setCreativityLevel}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="length">内容长度</Label>
              <span className="text-sm text-muted-foreground">
                {contentLength[0] === 1 ? "短文案" : contentLength[0] === 2 ? "中等长度" : "长文案"}
              </span>
            </div>
            <Slider id="length" min={1} max={3} step={1} value={contentLength} onValueChange={setContentLength} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="emoji" className="cursor-pointer">
              包含表情符号
            </Label>
            <Switch id="emoji" checked={includeEmoji} onCheckedChange={setIncludeEmoji} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="hashtags" className="cursor-pointer">
              包含话题标签
            </Label>
            <Switch id="hashtags" checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleGenerate} disabled={!topic || isGenerating}>
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              生成爆款文案
            </>
          )}
        </Button>
      </div>

      <div className="md:col-span-2">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="edit">编辑</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="min-h-[500px]">
            {generatedContent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {platforms.find((p) => p.id === platform)?.icon}
                      {platforms.find((p) => p.id === platform)?.name}
                    </Badge>
                    <Badge variant="outline">{tones.find((t) => t.id === tone)?.name}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      复制
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      保存
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      分享
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-6 rounded-lg border bg-card text-card-foreground shadow",
                    platform === "xiaohongshu" && "bg-red-50 border-red-100",
                    platform === "wechat" && "bg-green-50 border-green-100",
                    platform === "douyin" && "bg-black text-white",
                  )}
                >
                  <div className="whitespace-pre-line">{generatedContent}</div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      喜欢
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      反馈
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Image className="h-4 w-4 mr-1" />
                      生成配图
                    </Button>
                    <Button size="sm">
                      <Send className="h-4 w-4 mr-1" />
                      发布
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mb-4 text-muted" />
                <h3 className="text-lg font-medium mb-2">等待生成文案</h3>
                <p>填写左侧表单并点击"生成爆款文案"按钮</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit" className="min-h-[500px]">
            <Textarea
              className="min-h-[500px] font-mono"
              placeholder="生成的文案将显示在这里，您可以进行编辑..."
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
