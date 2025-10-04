"use client"

import { useState } from "react"
import { getAllCategories, getTemplatesByCategory } from "@/lib/api-binding/templates/api-templates"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { ExternalLink, Plus } from "lucide-react"

interface ApiTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void
}

export default function ApiTemplateSelector({ onSelectTemplate }: ApiTemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("ai")
  const { toast } = useToast()
  const categories = getAllCategories()

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId)
    setOpen(false)
    toast({
      title: "模板已应用",
      description: "API配置模板已成功应用，请填写必要的凭证信息。",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          使用API模板
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>选择API模板</DialogTitle>
          <DialogDescription>从预设模板中选择，快速配置常用API服务</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getTemplatesByCategory(category.id as any).map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.logoUrl && (
                          <div className="w-8 h-8 relative">
                            <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                              {template.id}
                            </div>
                          </div>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2 h-10">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="font-medium">基础URL:</span>
                          <span className="truncate">{template.config.config.baseUrl}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">认证类型:</span>
                          <span>
                            {template.config.auth.type === "bearer" && "Bearer令牌"}
                            {template.config.auth.type === "api-key" && "API密钥"}
                            {template.config.auth.type === "basic" && "基本认证"}
                            {template.config.auth.type === "oauth2" && "OAuth 2.0"}
                            {template.config.auth.type === "none" && "无认证"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      {template.documentationUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={template.documentationUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            文档
                          </a>
                        </Button>
                      )}
                      <Button size="sm" onClick={() => handleSelectTemplate(template.id)}>
                        使用此模板
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {getTemplatesByCategory(category.id as any).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">此类别暂无可用模板</div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
