"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Edit } from "lucide-react"

interface DiffViewerProps {
  oldValue: any
  newValue: any
  type: "endpoints" | "config" | "json"
}

export function VersionDiffViewer({ oldValue, newValue, type }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<"split" | "unified">("split")

  if (type === "endpoints") {
    return <EndpointsDiffViewer oldEndpoints={oldValue} newEndpoints={newValue} />
  }

  if (type === "config") {
    return <ConfigDiffViewer oldConfig={oldValue} newConfig={newValue} />
  }

  // 默认JSON比较
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            className={`px-3 py-1 text-xs rounded-l-md border ${
              viewMode === "split" ? "bg-primary text-primary-foreground" : "bg-background"
            }`}
            onClick={() => setViewMode("split")}
          >
            拆分视图
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-r-md border ${
              viewMode === "unified" ? "bg-primary text-primary-foreground" : "bg-background"
            }`}
            onClick={() => setViewMode("unified")}
          >
            统一视图
          </button>
        </div>
      </div>

      {viewMode === "split" ? (
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 overflow-auto max-h-[500px]">
            <pre className="text-xs">{JSON.stringify(oldValue, null, 2)}</pre>
          </Card>
          <Card className="p-4 overflow-auto max-h-[500px]">
            <pre className="text-xs">{JSON.stringify(newValue, null, 2)}</pre>
          </Card>
        </div>
      ) : (
        <Card className="p-4 overflow-auto max-h-[500px]">
          <pre className="text-xs">{JSON.stringify(newValue, null, 2)}</pre>
        </Card>
      )}
    </div>
  )
}

interface Endpoint {
  path: string
  method: string
  [key: string]: any
}

function EndpointsDiffViewer({ oldEndpoints, newEndpoints }: { oldEndpoints: Endpoint[]; newEndpoints: Endpoint[] }) {
  // 找出添加的端点
  const addedEndpoints = newEndpoints.filter(
    (newEp) => !oldEndpoints.some((oldEp) => oldEp.path === newEp.path && oldEp.method === newEp.method),
  )

  // 找出删除的端点
  const removedEndpoints = oldEndpoints.filter(
    (oldEp) => !newEndpoints.some((newEp) => newEp.path === oldEp.path && newEp.method === oldEp.method),
  )

  // 找出修改的端点
  const modifiedEndpoints = newEndpoints.filter((newEp) =>
    oldEndpoints.some(
      (oldEp) =>
        oldEp.path === newEp.path && oldEp.method === newEp.method && JSON.stringify(oldEp) !== JSON.stringify(newEp),
    ),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-green-200 dark:border-green-900">
          <div className="flex items-center mb-3">
            <Plus className="h-4 w-4 text-green-500 mr-2" />
            <h3 className="font-medium">新增端点 ({addedEndpoints.length})</h3>
          </div>
          <div className="space-y-2">
            {addedEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800"
              >
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-green-100 text-green-700 border-green-200">
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
              </div>
            ))}
            {addedEndpoints.length === 0 && <div className="text-sm text-muted-foreground">无新增端点</div>}
          </div>
        </Card>

        <Card className="p-4 border-red-200 dark:border-red-900">
          <div className="flex items-center mb-3">
            <Minus className="h-4 w-4 text-red-500 mr-2" />
            <h3 className="font-medium">删除端点 ({removedEndpoints.length})</h3>
          </div>
          <div className="space-y-2">
            {removedEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800"
              >
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-red-100 text-red-700 border-red-200">
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
              </div>
            ))}
            {removedEndpoints.length === 0 && <div className="text-sm text-muted-foreground">无删除端点</div>}
          </div>
        </Card>

        <Card className="p-4 border-blue-200 dark:border-blue-900">
          <div className="flex items-center mb-3">
            <Edit className="h-4 w-4 text-blue-500 mr-2" />
            <h3 className="font-medium">修改端点 ({modifiedEndpoints.length})</h3>
          </div>
          <div className="space-y-2">
            {modifiedEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800"
              >
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2 bg-blue-100 text-blue-700 border-blue-200">
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm">{endpoint.path}</code>
                </div>
              </div>
            ))}
            {modifiedEndpoints.length === 0 && <div className="text-sm text-muted-foreground">无修改端点</div>}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="font-medium mb-3">端点变更详情</h3>
        <div className="space-y-4">
          {[...addedEndpoints, ...modifiedEndpoints].length > 0 ? (
            [...addedEndpoints, ...modifiedEndpoints].map((endpoint, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <div className="bg-muted p-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm">{endpoint.path}</code>
                  </div>
                  {addedEndpoints.includes(endpoint) ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">新增</Badge>
                  ) : (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">修改</Badge>
                  )}
                </div>
                <div className="p-3">
                  <pre className="text-xs overflow-auto">{JSON.stringify(endpoint, null, 2)}</pre>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">无详细变更</div>
          )}
        </div>
      </Card>
    </div>
  )
}

function ConfigDiffViewer({ oldConfig, newConfig }: { oldConfig: any; newConfig: any }) {
  // 提取主要配置项进行比较
  const configKeys = Array.from(new Set([...Object.keys(oldConfig), ...Object.keys(newConfig)])).filter(
    (key) => key !== "endpoints",
  )

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3">配置变更摘要</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">配置项</th>
                <th className="p-2 text-left">旧值</th>
                <th className="p-2 text-left">新值</th>
                <th className="p-2 text-left">状态</th>
              </tr>
            </thead>
            <tbody>
              {configKeys.map((key) => {
                const oldValue = oldConfig[key]
                const newValue = newConfig[key]
                const isAdded = oldValue === undefined && newValue !== undefined
                const isRemoved = oldValue !== undefined && newValue === undefined
                const isModified = !isAdded && !isRemoved && JSON.stringify(oldValue) !== JSON.stringify(newValue)
                const isUnchanged = !isAdded && !isRemoved && !isModified

                return (
                  <tr key={key} className="border-b">
                    <td className="p-2 font-medium">{key}</td>
                    <td className="p-2">
                      {isRemoved || isModified ? (
                        typeof oldValue === "object" ? (
                          <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-1 rounded">
                            {JSON.stringify(oldValue, null, 2)}
                          </pre>
                        ) : (
                          <span className="bg-red-50 dark:bg-red-900/20 px-1 py-0.5 rounded text-sm">
                            {String(oldValue)}
                          </span>
                        )
                      ) : isUnchanged ? (
                        typeof oldValue === "object" ? (
                          <pre className="text-xs bg-muted p-1 rounded">{JSON.stringify(oldValue, null, 2)}</pre>
                        ) : (
                          <span className="text-sm">{String(oldValue)}</span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      {isAdded || isModified ? (
                        typeof newValue === "object" ? (
                          <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-1 rounded">
                            {JSON.stringify(newValue, null, 2)}
                          </pre>
                        ) : (
                          <span className="bg-green-50 dark:bg-green-900/20 px-1 py-0.5 rounded text-sm">
                            {String(newValue)}
                          </span>
                        )
                      ) : isUnchanged ? (
                        typeof newValue === "object" ? (
                          <pre className="text-xs bg-muted p-1 rounded">{JSON.stringify(newValue, null, 2)}</pre>
                        ) : (
                          <span className="text-sm">{String(newValue)}</span>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      {isAdded ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">新增</Badge>
                      ) : isRemoved ? (
                        <Badge className="bg-red-100 text-red-700 border-red-200">删除</Badge>
                      ) : isModified ? (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">修改</Badge>
                      ) : (
                        <Badge variant="outline">未变更</Badge>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-3">旧配置</h3>
          <pre className="text-xs overflow-auto max-h-[300px]">{JSON.stringify(oldConfig, null, 2)}</pre>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-3">新配置</h3>
          <pre className="text-xs overflow-auto max-h-[300px]">{JSON.stringify(newConfig, null, 2)}</pre>
        </Card>
      </div>
    </div>
  )
}
