"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Edit } from "lucide-react"
import type { ApiVersion } from "./version-manager"

interface VersionChangeListProps {
  sourceVersion: ApiVersion | null
  targetVersion: ApiVersion
}

export function VersionChangeList({ sourceVersion, targetVersion }: VersionChangeListProps) {
  if (!sourceVersion) return <div>无法比较：源版本不存在</div>

  // 基本信息变更
  const basicChanges = [
    {
      name: "描述",
      oldValue: sourceVersion.description,
      newValue: targetVersion.description,
      isChanged: sourceVersion.description !== targetVersion.description,
    },
    {
      name: "状态",
      oldValue: sourceVersion.status,
      newValue: targetVersion.status,
      isChanged: sourceVersion.status !== targetVersion.status,
    },
  ]

  // 配置变更
  const configChanges = [
    {
      name: "基础URL",
      oldValue: sourceVersion.config.baseUrl,
      newValue: targetVersion.config.baseUrl,
      isChanged: sourceVersion.config.baseUrl !== targetVersion.config.baseUrl,
    },
    {
      name: "超时设置",
      oldValue: `${sourceVersion.config.timeout}ms`,
      newValue: `${targetVersion.config.timeout}ms`,
      isChanged: sourceVersion.config.timeout !== targetVersion.config.timeout,
    },
    {
      name: "请求头数量",
      oldValue: Object.keys(sourceVersion.config.headers || {}).length,
      newValue: Object.keys(targetVersion.config.headers || {}).length,
      isChanged:
        Object.keys(sourceVersion.config.headers || {}).length !==
        Object.keys(targetVersion.config.headers || {}).length,
    },
    {
      name: "端点数量",
      oldValue: (sourceVersion.config.endpoints || []).length,
      newValue: (targetVersion.config.endpoints || []).length,
      isChanged: (sourceVersion.config.endpoints || []).length !== (targetVersion.config.endpoints || []).length,
    },
  ]

  // 端点变更
  const oldEndpoints = sourceVersion.config.endpoints || []
  const newEndpoints = targetVersion.config.endpoints || []

  // 找出添加的端点
  const addedEndpoints = newEndpoints.filter(
    (newEp: any) => !oldEndpoints.some((oldEp: any) => oldEp.path === newEp.path && oldEp.method === newEp.method),
  )

  // 找出删除的端点
  const removedEndpoints = oldEndpoints.filter(
    (oldEp: any) => !newEndpoints.some((newEp: any) => newEp.path === oldEp.path && newEp.method === oldEp.method),
  )

  // 找出修改的端点
  const modifiedEndpoints = newEndpoints.filter((newEp: any) =>
    oldEndpoints.some(
      (oldEp: any) =>
        oldEp.path === newEp.path && oldEp.method === newEp.method && JSON.stringify(oldEp) !== JSON.stringify(newEp),
    ),
  )

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="font-medium mb-3">基本信息变更</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">属性</th>
                <th className="p-2 text-left">{sourceVersion.version}</th>
                <th className="p-2 text-left">{targetVersion.version}</th>
                <th className="p-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {basicChanges.map((change, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{change.name}</td>
                  <td className="p-2">{change.oldValue}</td>
                  <td className="p-2">{change.newValue}</td>
                  <td className="p-2">
                    {change.isChanged ? (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">已变更</Badge>
                    ) : (
                      <Badge variant="outline">未变更</Badge>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-b">
                <td className="p-2 font-medium">创建时间</td>
                <td className="p-2">{new Date(sourceVersion.createdAt).toLocaleString()}</td>
                <td className="p-2">{new Date(targetVersion.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <Badge variant="outline">信息</Badge>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">创建者</td>
                <td className="p-2">{sourceVersion.createdBy}</td>
                <td className="p-2">{targetVersion.createdBy}</td>
                <td className="p-2">
                  <Badge variant="outline">信息</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">配置变更</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">属性</th>
                <th className="p-2 text-left">{sourceVersion.version}</th>
                <th className="p-2 text-left">{targetVersion.version}</th>
                <th className="p-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {configChanges.map((change, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{change.name}</td>
                  <td className="p-2">{change.oldValue}</td>
                  <td className="p-2">{change.newValue}</td>
                  <td className="p-2">
                    {change.isChanged ? (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200">已变更</Badge>
                    ) : (
                      <Badge variant="outline">未变更</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">端点变更摘要</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-3">
            <div className="flex items-center mb-2">
              <Plus className="h-4 w-4 text-green-500 mr-2" />
              <h4 className="font-medium">新增端点</h4>
            </div>
            <div className="text-2xl font-bold">{addedEndpoints.length}</div>
          </div>

          <div className="border rounded-md p-3">
            <div className="flex items-center mb-2">
              <Minus className="h-4 w-4 text-red-500 mr-2" />
              <h4 className="font-medium">删除端点</h4>
            </div>
            <div className="text-2xl font-bold">{removedEndpoints.length}</div>
          </div>

          <div className="border rounded-md p-3">
            <div className="flex items-center mb-2">
              <Edit className="h-4 w-4 text-blue-500 mr-2" />
              <h4 className="font-medium">修改端点</h4>
            </div>
            <div className="text-2xl font-bold">{modifiedEndpoints.length}</div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-3">变更记录</h3>
        <div className="space-y-2">
          {targetVersion.changes.map((change, index) => (
            <div key={index} className="p-2 bg-muted rounded-md">
              {change}
            </div>
          ))}
          {targetVersion.changes.length === 0 && <div className="text-muted-foreground">无变更记录</div>}
        </div>
      </Card>
    </div>
  )
}
