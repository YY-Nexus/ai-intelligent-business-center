"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformConnector } from "@/components/ecommerce-engine/platform-integration/platform-connector"
import { ApiSettings } from "@/components/ecommerce-engine/platform-integration/api-settings"
import { DataSyncStatus } from "@/components/ecommerce-engine/platform-integration/data-sync-status"
import { IntegrationLogs } from "@/components/ecommerce-engine/platform-integration/integration-logs"

export default function PlatformIntegrationPage() {
  const [activeTab, setActiveTab] = useState("platform-connector")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">电商平台集成</h1>
        <p className="text-muted-foreground">连接并管理第三方电商平台API，实现数据同步、订单管理和自动化操作</p>
      </div>

      <Tabs defaultValue="platform-connector" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="platform-connector">平台连接</TabsTrigger>
          <TabsTrigger value="api-settings">API设置</TabsTrigger>
          <TabsTrigger value="data-sync">数据同步</TabsTrigger>
          <TabsTrigger value="integration-logs">集成日志</TabsTrigger>
        </TabsList>
        <TabsContent value="platform-connector" className="mt-6">
          <PlatformConnector />
        </TabsContent>
        <TabsContent value="api-settings" className="mt-6">
          <ApiSettings />
        </TabsContent>
        <TabsContent value="data-sync" className="mt-6">
          <DataSyncStatus />
        </TabsContent>
        <TabsContent value="integration-logs" className="mt-6">
          <IntegrationLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
