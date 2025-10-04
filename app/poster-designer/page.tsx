"use client"

import { useState } from "react"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PosterGenerator } from "@/components/poster-designer/poster-generator"
import { PosterTemplates } from "@/components/poster-designer/poster-templates"
import { PosterHistory } from "@/components/poster-designer/poster-history"
import { PosterSettings } from "@/components/poster-designer/poster-settings"
import { Palette, Grid3X3, History, Settings } from "lucide-react"

export default function PosterDesignerPage() {
  const [activeTab, setActiveTab] = useState("generator")

  return (
    <TechLayout backgroundVariant="vortex" backgroundIntensity="light">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">商业海报智能设计</h1>
        <p className="text-center text-muted-foreground mb-8">智能生成专业商业海报，支持多种模板和品牌元素自定义</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>海报设计</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              <span>模板库</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>历史记录</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>品牌设置</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <TechCard variant="panel" className="mb-6">
              <PosterGenerator />
            </TechCard>
          </TabsContent>

          <TabsContent value="templates">
            <TechCard variant="panel" className="mb-6">
              <PosterTemplates />
            </TechCard>
          </TabsContent>

          <TabsContent value="history">
            <TechCard variant="panel" className="mb-6">
              <PosterHistory />
            </TechCard>
          </TabsContent>

          <TabsContent value="settings">
            <TechCard variant="panel" className="mb-6">
              <PosterSettings />
            </TechCard>
          </TabsContent>
        </Tabs>
      </div>
    </TechLayout>
  )
}
