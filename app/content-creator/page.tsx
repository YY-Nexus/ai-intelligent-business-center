"use client"

import { useState } from "react"
import { TechLayout } from "@/components/layout/tech-layout"
import { TechCard } from "@/components/ui/tech-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentGenerator } from "@/components/content-creator/content-generator"
import { ContentTemplates } from "@/components/content-creator/content-templates"
import { ContentHistory } from "@/components/content-creator/content-history"
import { ContentSettings } from "@/components/content-creator/content-settings"
import { Sparkles, History, Settings, FileText } from "lucide-react"

export default function ContentCreatorPage() {
  const [activeTab, setActiveTab] = useState("generator")

  return (
    <TechLayout backgroundVariant="vortex" backgroundIntensity="light">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">爆款文案AI生成</h1>
        <p className="text-center text-muted-foreground mb-8">智能生成多平台爆款文案，提升内容创作效率和传播效果</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>文案生成</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>模板库</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>历史记录</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>偏好设置</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator">
            <TechCard variant="panel" className="mb-6">
              <ContentGenerator />
            </TechCard>
          </TabsContent>

          <TabsContent value="templates">
            <TechCard variant="panel" className="mb-6">
              <ContentTemplates />
            </TechCard>
          </TabsContent>

          <TabsContent value="history">
            <TechCard variant="panel" className="mb-6">
              <ContentHistory />
            </TechCard>
          </TabsContent>

          <TabsContent value="settings">
            <TechCard variant="panel" className="mb-6">
              <ContentSettings />
            </TechCard>
          </TabsContent>
        </Tabs>
      </div>
    </TechLayout>
  )
}
