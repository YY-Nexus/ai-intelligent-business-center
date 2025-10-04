"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiConfigProvider } from "@/components/api-config/api-config-manager"
import ApiBatchOperations from "@/components/api-config/api-batch-operations"
import { Database, Server, Settings } from "lucide-react"

export default function ApiBatchPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">API批量操作</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>批量操作工具</CardTitle>
            <CardDescription>高效管理多个API配置，支持批量导入、导出和管理功能</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiConfigProvider>
              <ApiBatchOperations />
            </ApiConfigProvider>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-blue-500" />
                <CardTitle>批量导入</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                从JSON文件或文本一次性导入多个API配置，快速设置您的API环境。支持导入认证信息、头部和参数设置。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-green-500" />
                <CardTitle>批量导出</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                将选定的API配置导出为JSON文件，方便备份或在不同环境之间迁移。可以按环境或认证类型筛选要导出的配置。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-500" />
                <CardTitle>批量管理</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                同时管理多个API配置，支持批量删除、复制和更改环境。通过强大的筛选功能，轻松找到并操作目标API配置。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
