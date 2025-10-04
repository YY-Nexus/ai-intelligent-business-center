"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ZhipuConfig } from "@/components/api-config/zhipu-config"
import { ZhipuChatTest } from "@/components/api-config/zhipu-chat-test"
import { ZhipuFunctionTest } from "@/components/api-config/zhipu-function-test"

export default function ZhipuPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">智谱AI大模型</h1>
          <p className="text-muted-foreground mt-1">配置和测试智谱AI大模型，包括GLM-4、GLM-3-Turbo等模型</p>
        </div>

        <Tabs defaultValue="config">
          <TabsList className="mb-4">
            <TabsTrigger value="config">配置</TabsTrigger>
            <TabsTrigger value="chat">聊天测试</TabsTrigger>
            <TabsTrigger value="function">函数调用</TabsTrigger>
          </TabsList>
          <TabsContent value="config">
            <ZhipuConfig />
          </TabsContent>
          <TabsContent value="chat">
            <ZhipuChatTest />
          </TabsContent>
          <TabsContent value="function">
            <ZhipuFunctionTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
