"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PluginMarketplace } from "@/app/components/system-audit/plugin-marketplace"
import { PluginVersionManager } from "@/app/components/system-audit/plugin-version-manager"
import { TwoFactorAuth } from "@/app/components/system-audit/two-factor-auth"
import { Package, History, Shield } from "lucide-react"

export default function PluginManagementPage() {
  const [activeTab, setActiveTab] = useState("marketplace")

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">插件管理与安全</h1>
        <p className="text-muted-foreground">管理系统插件、版本和安全设置</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>插件市场</span>
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>版本管理</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>安全设置</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace">
          <PluginMarketplace />
        </TabsContent>

        <TabsContent value="versions">
          <PluginVersionManager />
        </TabsContent>

        <TabsContent value="security">
          <TwoFactorAuth />
        </TabsContent>
      </Tabs>
    </div>
  )
}
