"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Plus, Trash2, Palette } from "lucide-react"

export function PosterSettings() {
  const [activeTab, setActiveTab] = useState("brand")

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="brand">品牌设置</TabsTrigger>
          <TabsTrigger value="assets">素材库</TabsTrigger>
          <TabsTrigger value="export">导出设置</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <BrandTab />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTab />
        </TabsContent>

        <TabsContent value="export">
          <ExportTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BrandTab() {
  const [brandName, setBrandName] = useState("我的品牌")
  const [brandSlogan, setBrandSlogan] = useState("品牌口号或标语")
  const [brandDescription, setBrandDescription] = useState("品牌简介和描述")
  const [primaryColor, setPrimaryColor] = useState("#3b82f6")
  const [secondaryColor, setSecondaryColor] = useState("#10b981")
  const [accentColor, setAccentColor] = useState("#f59e0b")
  const [logoUrl, setLogoUrl] = useState("/placeholder.svg?height=200&width=200&query=brand logo")
  const [qrCodeUrl, setQrCodeUrl] = useState("/placeholder.svg?height=200&width=200&query=QR code")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">品牌信息</h3>

          <div className="space-y-2">
            <Label htmlFor="brandName">品牌名称</Label>
            <Input
              id="brandName"
              placeholder="输入品牌名称"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandSlogan">品牌口号</Label>
            <Input
              id="brandSlogan"
              placeholder="输入品牌口号或标语"
              value={brandSlogan}
              onChange={(e) => setBrandSlogan(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandDescription">品牌描述</Label>
            <Textarea
              id="brandDescription"
              placeholder="输入品牌简介和描述"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">品牌视觉元素</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>品牌Logo</Label>
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-2">
                  <img src={logoUrl || "/placeholder.svg"} alt="Brand Logo" className="w-full h-full object-contain" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  上传Logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>品牌二维码</Label>
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <div className="w-32 h-32 bg-muted rounded-lg overflow-hidden mb-2">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-full h-full object-contain" />
                </div>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  上传二维码
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>品牌配色</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: primaryColor }}></div>
                  <Label htmlFor="primaryColor">主色</Label>
                </div>
                <div className="flex">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: secondaryColor }}></div>
                  <Label htmlFor="secondaryColor">辅助色</Label>
                </div>
                <div className="flex">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 ml-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: accentColor }}></div>
                  <Label htmlFor="accentColor">强调色</Label>
                </div>
                <div className="flex">
                  <Input
                    id="accentColor"
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex-1 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存品牌设置
        </Button>
      </div>
    </div>
  )
}

function AssetsTab() {
  const [assets, setAssets] = useState([
    { id: 1, name: "产品图片1", type: "image", url: "/placeholder.svg?height=100&width=100&query=product image 1" },
    { id: 2, name: "产品图片2", type: "image", url: "/placeholder.svg?height=100&width=100&query=product image 2" },
    {
      id: 3,
      name: "背景图案1",
      type: "background",
      url: "/placeholder.svg?height=100&width=100&query=background pattern 1",
    },
    {
      id: 4,
      name: "背景图案2",
      type: "background",
      url: "/placeholder.svg?height=100&width=100&query=background pattern 2",
    },
    { id: 5, name: "图标集1", type: "icon", url: "/placeholder.svg?height=100&width=100&query=icon set 1" },
    { id: 6, name: "图标集2", type: "icon", url: "/placeholder.svg?height=100&width=100&query=icon set 2" },
  ])

  // 删除素材
  const deleteAsset = (id: number) => {
    setAssets(assets.filter((asset) => asset.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">素材库</h3>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          上传新素材
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted">
              <img src={asset.url || "/placeholder.svg"} alt={asset.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium truncate">{asset.name}</p>
                <Button variant="ghost" size="icon" onClick={() => deleteAsset(asset.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground capitalize">{asset.type}</p>
            </div>
          </div>
        ))}

        {/* 添加新素材卡片 */}
        <div className="border border-dashed rounded-lg flex flex-col items-center justify-center p-4 aspect-square">
          <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-sm text-center text-muted-foreground">上传新素材</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Palette className="mr-2 h-4 w-4" />
          管理素材分类
        </Button>
      </div>
    </div>
  )
}

function ExportTab() {
  const [defaultFormat, setDefaultFormat] = useState("png")
  const [defaultQuality, setDefaultQuality] = useState("90")
  const [defaultResolution, setDefaultResolution] = useState("300")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">导出设置</h3>

          <div className="space-y-2">
            <Label htmlFor="defaultFormat">默认格式</Label>
            <select
              id="defaultFormat"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={defaultFormat}
              onChange={(e) => setDefaultFormat(e.target.value)}
            >
              <option value="png">PNG (透明背景)</option>
              <option value="jpg">JPG (高兼容性)</option>
              <option value="pdf">PDF (打印用途)</option>
              <option value="svg">SVG (矢量格式)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultQuality">默认质量</Label>
            <select
              id="defaultQuality"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={defaultQuality}
              onChange={(e) => setDefaultQuality(e.target.value)}
            >
              <option value="100">最高质量 (100%)</option>
              <option value="90">高质量 (90%)</option>
              <option value="80">中等质量 (80%)</option>
              <option value="70">低质量 (70%)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultResolution">默认分辨率 (DPI)</Label>
            <select
              id="defaultResolution"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={defaultResolution}
              onChange={(e) => setDefaultResolution(e.target.value)}
            >
              <option value="72">网页使用 (72 DPI)</option>
              <option value="150">屏幕显示 (150 DPI)</option>
              <option value="300">印刷质量 (300 DPI)</option>
              <option value="600">高质量印刷 (600 DPI)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">批量导出设置</h3>

          <div className="space-y-2">
            <Label>导出尺寸预设</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">社交媒体套装</p>
                  <p className="text-sm text-muted-foreground">包含各大社交平台所需尺寸</p>
                </div>
                <Button variant="outline" size="sm">
                  选择
                </Button>
              </div>

              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">广告套装</p>
                  <p className="text-sm text-muted-foreground">包含常见广告尺寸</p>
                </div>
                <Button variant="outline" size="sm">
                  选择
                </Button>
              </div>

              <div className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">打印套装</p>
                  <p className="text-sm text-muted-foreground">包含常见打印尺寸</p>
                </div>
                <Button variant="outline" size="sm">
                  选择
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              创建自定义导出预设
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          保存导出设置
        </Button>
      </div>
    </div>
  )
}
