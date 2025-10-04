"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Download,
  Save,
  Share,
  Layers,
  ImageIcon,
  Type,
  Palette,
  Move,
  Crop,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Minus,
  Wand2,
} from "lucide-react"

const posterTypes = [
  { id: "social", name: "社交媒体" },
  { id: "promotion", name: "促销活动" },
  { id: "event", name: "活动宣传" },
  { id: "product", name: "产品展示" },
  { id: "brand", name: "品牌宣传" },
  { id: "announcement", name: "公告通知" },
]

const posterSizes = [
  { id: "square", name: "方形 1:1", width: 1080, height: 1080 },
  { id: "portrait", name: "竖版 4:5", width: 1080, height: 1350 },
  { id: "story", name: "故事 9:16", width: 1080, height: 1920 },
  { id: "landscape", name: "横版 16:9", width: 1920, height: 1080 },
  { id: "banner", name: "横幅 2:1", width: 1200, height: 600 },
  { id: "custom", name: "自定义尺寸", width: 0, height: 0 },
]

const posterStyles = [
  { id: "modern", name: "现代简约" },
  { id: "vibrant", name: "活力多彩" },
  { id: "elegant", name: "优雅精致" },
  { id: "corporate", name: "企业商务" },
  { id: "retro", name: "复古风格" },
  { id: "minimalist", name: "极简主义" },
]

export function PosterGenerator() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [posterType, setPosterType] = useState("social")
  const [posterSize, setPosterSize] = useState("square")
  const [posterStyle, setPosterStyle] = useState("modern")
  const [customWidth, setCustomWidth] = useState(1080)
  const [customHeight, setCustomHeight] = useState(1080)
  const [includeLogo, setIncludeLogo] = useState(true)
  const [includeQRCode, setIncludeQRCode] = useState(false)
  const [colorScheme, setColorScheme] = useState("brand")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("design")
  const [zoom, setZoom] = useState(100)

  const canvasRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!title) return

    setIsGenerating(true)
    setGeneratedPoster(null)

    // 模拟API调用
    setTimeout(() => {
      // 根据选择的海报类型和尺寸生成不同的示例图片
      let posterUrl = ""

      if (posterType === "social") {
        posterUrl = "/placeholder.svg?key=8ehtq"
      } else if (posterType === "promotion") {
        posterUrl = "/placeholder.svg?key=dgag2"
      } else if (posterType === "product") {
        posterUrl = "/placeholder.svg?key=gvfrp"
      } else {
        posterUrl = "/placeholder.svg?key=6h06s"
      }

      setGeneratedPoster(posterUrl)
      setIsGenerating(false)
    }, 2000)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">海报内容</h3>

          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input id="title" placeholder="输入海报标题" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述/副标题（可选）</Label>
            <Textarea
              id="description"
              placeholder="输入海报描述或副标题"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">海报设置</h3>

          <div className="space-y-2">
            <Label htmlFor="posterType">海报类型</Label>
            <Select value={posterType} onValueChange={setPosterType}>
              <SelectTrigger>
                <SelectValue placeholder="选择海报类型" />
              </SelectTrigger>
              <SelectContent>
                {posterTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="posterSize">海报尺寸</Label>
            <Select value={posterSize} onValueChange={setPosterSize}>
              <SelectTrigger>
                <SelectValue placeholder="选择海报尺寸" />
              </SelectTrigger>
              <SelectContent>
                {posterSizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {posterSize === "custom" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="customWidth">宽度 (像素)</Label>
                <Input
                  id="customWidth"
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customHeight">高度 (像素)</Label>
                <Input
                  id="customHeight"
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="posterStyle">设计风格</Label>
            <Select value={posterStyle} onValueChange={setPosterStyle}>
              <SelectTrigger>
                <SelectValue placeholder="选择设计风格" />
              </SelectTrigger>
              <SelectContent>
                {posterStyles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">品牌元素</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeLogo" className="cursor-pointer">
              包含品牌Logo
            </Label>
            <Switch id="includeLogo" checked={includeLogo} onCheckedChange={setIncludeLogo} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="includeQRCode" className="cursor-pointer">
              包含二维码
            </Label>
            <Switch id="includeQRCode" checked={includeQRCode} onCheckedChange={setIncludeQRCode} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorScheme">配色方案</Label>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger>
                <SelectValue placeholder="选择配色方案" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">品牌色系</SelectItem>
                <SelectItem value="vibrant">活力色系</SelectItem>
                <SelectItem value="pastel">柔和色系</SelectItem>
                <SelectItem value="monochrome">单色系</SelectItem>
                <SelectItem value="custom">自定义色系</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleGenerate} disabled={!title || isGenerating}>
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              生成中...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              智能生成海报
            </>
          )}
        </Button>
      </div>

      <div className="md:col-span-2">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="design">设计</TabsTrigger>
            <TabsTrigger value="edit">编辑</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="min-h-[600px]">
            {generatedPoster ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {posterSizes.find((s) => s.id === posterSize)?.name}
                    </Badge>
                    <Badge variant="outline">{posterStyles.find((s) => s.id === posterStyle)?.name}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="flex items-center text-sm">{zoom}%</span>
                    <Button variant="outline" size="sm" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center border rounded-lg bg-muted/30 p-4 overflow-auto">
                  <div
                    ref={canvasRef}
                    className="relative bg-white shadow-lg"
                    style={{
                      width:
                        posterSize !== "custom" ? posterSizes.find((s) => s.id === posterSize)?.width : customWidth,
                      height:
                        posterSize !== "custom" ? posterSizes.find((s) => s.id === posterSize)?.height : customHeight,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <img
                      src={generatedPoster || "/placeholder.svg"}
                      alt="Generated Poster"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Undo className="h-4 w-4 mr-1" />
                      撤销
                    </Button>
                    <Button variant="outline" size="sm">
                      <Redo className="h-4 w-4 mr-1" />
                      重做
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      重置
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      保存
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="h-4 w-4 mr-1" />
                      分享
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      下载
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-center text-muted-foreground">
                <Palette className="h-12 w-12 mb-4 text-muted" />
                <h3 className="text-lg font-medium mb-2">等待生成海报</h3>
                <p>填写左侧表单并点击"智能生成海报"按钮</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit" className="min-h-[600px]">
            {generatedPoster ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Type className="h-4 w-4 mr-1" />
                      文字
                    </Button>
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      图片
                    </Button>
                    <Button variant="outline" size="sm">
                      <Layers className="h-4 w-4 mr-1" />
                      图层
                    </Button>
                    <Button variant="outline" size="sm">
                      <Palette className="h-4 w-4 mr-1" />
                      颜色
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Crop className="h-4 w-4 mr-1" />
                      裁剪
                    </Button>
                    <Button variant="outline" size="sm">
                      <Move className="h-4 w-4 mr-1" />
                      移动
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center border rounded-lg bg-muted/30 p-4 overflow-auto">
                  <div
                    className="relative bg-white shadow-lg"
                    style={{
                      width:
                        posterSize !== "custom" ? posterSizes.find((s) => s.id === posterSize)?.width : customWidth,
                      height:
                        posterSize !== "custom" ? posterSizes.find((s) => s.id === posterSize)?.height : customHeight,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <img
                      src={generatedPoster || "/placeholder.svg"}
                      alt="Generated Poster"
                      className="w-full h-full object-cover"
                    />
                    {/* 编辑模式下可以添加编辑控件 */}
                    <div className="absolute top-0 left-0 w-full h-full border-2 border-dashed border-blue-500 pointer-events-none"></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      添加元素
                    </Button>
                    <Button variant="outline" size="sm">
                      <Minus className="h-4 w-4 mr-1" />
                      删除元素
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-1" />
                      智能优化
                    </Button>
                    <Button size="sm">
                      <Save className="h-4 w-4 mr-1" />
                      应用更改
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[600px] text-center text-muted-foreground">
                <Palette className="h-12 w-12 mb-4 text-muted" />
                <h3 className="text-lg font-medium mb-2">请先生成海报</h3>
                <p>生成海报后可以在此进行编辑</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
