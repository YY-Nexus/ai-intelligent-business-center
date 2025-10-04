"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Check, Edit, ImageIcon, Lightbulb, Search, Star, Tag, Wand2 } from "lucide-react"
import { ProductPerformanceChart } from "./charts/product-performance-chart"

export function ProductOptimizer() {
  const [productUrl, setProductUrl] = useState("")
  const [productTitle, setProductTitle] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [activeTab, setActiveTab] = useState("title")
  const [creativityLevel, setCreativityLevel] = useState([50])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    // 模拟API调用
    setTimeout(() => {
      setIsAnalyzing(false)
      setProductTitle("【2023新款】超轻薄便携式笔记本电脑 15.6英寸 16GB内存 512GB固态硬盘 高清屏幕")
      setProductDescription(
        "这款超轻薄笔记本电脑采用最新处理器，提供卓越性能和长达12小时的电池续航时间。15.6英寸高清屏幕呈现鲜艳色彩和清晰图像，适合工作和娱乐。16GB内存和512GB固态硬盘确保快速启动和流畅多任务处理。轻巧设计使其便于携带，随时随地工作或学习。",
      )
      setHasResults(true)
    }, 1500)
  }

  const handleOptimize = () => {
    setIsOptimizing(true)
    // 模拟API调用
    setTimeout(() => {
      setIsOptimizing(false)
      if (activeTab === "title") {
        setProductTitle("【2023旗舰新品】超薄商务笔记本 | 15.6英寸高清屏 | 16GB+512GB大内存 | 12小时续航")
      } else if (activeTab === "description") {
        setProductDescription(
          "【强劲性能】搭载最新一代处理器，16GB大内存轻松应对多任务，512GB高速固态硬盘瞬间启动，办公娱乐两不误。\n\n【轻薄便携】机身厚度仅15.6mm，重量不足1.5kg，出差旅行随身携带毫无负担。\n\n【震撼视觉】15.6英寸全高清IPS屏幕，窄边框设计，色彩鲜艳，画面细腻，给您沉浸式观影体验。\n\n【持久续航】创新电池管理技术，单次充电可持续使用长达12小时，告别频繁充电烦恼。\n\n【品质保障】通过严格质量测试，赠送24个月质保服务，购买即送高级笔记本内胆包和无线鼠标。",
        )
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>产品优化</CardTitle>
          <CardDescription>优化您的产品标题、描述和图片，提高搜索排名和转化率</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-url">产品链接或ID</Label>
              <div className="flex gap-2">
                <Input
                  id="product-url"
                  placeholder="输入产品链接或ID"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                />
                <Button onClick={handleAnalyze} disabled={isAnalyzing || !productUrl}>
                  {isAnalyzing ? "分析中..." : "分析产品"}
                </Button>
              </div>
            </div>

            {hasResults && (
              <div className="space-y-6 mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="title" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>标题优化</span>
                    </TabsTrigger>
                    <TabsTrigger value="description" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      <span>描述优化</span>
                    </TabsTrigger>
                    <TabsTrigger value="images" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>图片优化</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="title">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">标题优化</CardTitle>
                        <CardDescription>优化产品标题以提高搜索排名和点击率</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">当前标题</Label>
                            <div className="p-3 bg-muted rounded-md mt-1">{productTitle}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>创意程度</Label>
                              <span className="text-sm text-muted-foreground">{creativityLevel}%</span>
                            </div>
                            <Slider value={creativityLevel} onValueChange={setCreativityLevel} max={100} step={1} />
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Search className="h-3 w-3" />
                                <span>SEO优化</span>
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>高转化</span>
                              </Badge>
                            </div>
                            <Button onClick={handleOptimize} disabled={isOptimizing}>
                              {isOptimizing ? "优化中..." : "生成优化标题"}
                              <Wand2 className="ml-2 h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-6">
                            <Label className="text-sm text-muted-foreground">优化建议</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">添加产品关键特性（如"商务"、"高清屏"）以提高相关性</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">使用分隔符（如"|"）使标题更易读</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">突出产品最吸引人的卖点（如"12小时续航"）</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="description">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">描述优化</CardTitle>
                        <CardDescription>优化产品描述以提高转化率和用户体验</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-muted-foreground">当前描述</Label>
                            <Textarea
                              className="mt-1 min-h-[120px]"
                              value={productDescription}
                              onChange={(e) => setProductDescription(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>创意程度</Label>
                              <span className="text-sm text-muted-foreground">{creativityLevel}%</span>
                            </div>
                            <Slider value={creativityLevel} onValueChange={setCreativityLevel} max={100} step={1} />
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Lightbulb className="h-3 w-3" />
                                <span>突出卖点</span>
                              </Badge>
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                <span>情感化</span>
                              </Badge>
                            </div>
                            <Button onClick={handleOptimize} disabled={isOptimizing}>
                              {isOptimizing ? "优化中..." : "生成优化描述"}
                              <Wand2 className="ml-2 h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-6">
                            <Label className="text-sm text-muted-foreground">优化建议</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">使用段落和分点列出产品特性，提高可读性</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">添加产品使用场景，帮助用户想象产品价值</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                <p className="text-sm">强调产品优势和独特卖点，如"��薄便携"和"持久续航"</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="images">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">图片优化</CardTitle>
                        <CardDescription>优化产品图片以提高视觉吸引力和转化率</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">图片优化功能即将推出，敬请期待！</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Card>
                  <CardHeader>
                    <CardTitle>产品表现分析</CardTitle>
                    <CardDescription>查看产品在不同维度的表现数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProductPerformanceChart />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
