"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Puzzle, Plus, Settings, RefreshCw, Search, Package, Upload } from "lucide-react"
import type { AuditPlugin } from "@/lib/plugin-system"

interface PluginManagerProps {
  onPluginEnabled?: (plugin: AuditPlugin) => void
  onPluginDisabled?: (pluginId: string) => void
}

export function PluginManager({ onPluginEnabled, onPluginDisabled }: PluginManagerProps) {
  const [plugins, setPlugins] = useState<AuditPlugin[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlugin, setSelectedPlugin] = useState<AuditPlugin | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newPluginFile, setNewPluginFile] = useState<File | null>(null)

  // 获取插件列表
  const fetchPlugins = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/plugins")
      if (!response.ok) {
        throw new Error(`获取插件失败: ${response.status}`)
      }
      const data = await response.json()
      setPlugins(data.plugins)
    } catch (error) {
      console.error("获取插件错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchPlugins()
  }, [])

  // 切换插件启用状态
  const togglePluginEnabled = async (plugin: AuditPlugin, enabled: boolean) => {
    try {
      // 更新本地状态
      const updatedPlugins = plugins.map((p) => (p.id === plugin.id ? { ...p, enabled } : p))
      setPlugins(updatedPlugins)

      // 在实际应用中，这里应该调用API更新插件状态

      // 触发回调
      if (enabled && onPluginEnabled) {
        onPluginEnabled({ ...plugin, enabled })
      } else if (!enabled && onPluginDisabled) {
        onPluginDisabled(plugin.id)
      }
    } catch (error) {
      console.error("更新插件状态错误:", error)

      // 恢复原状态
      setPlugins(plugins)
    }
  }

  // 打开插件设置
  const openPluginSettings = (plugin: AuditPlugin) => {
    setSelectedPlugin(plugin)
    setIsSettingsOpen(true)
  }

  // 保存插件设置
  const savePluginSettings = async () => {
    if (!selectedPlugin) return

    try {
      // 在实际应用中，这里应该调用API保存插件设置
      console.log("保存插件设置:", selectedPlugin)

      // 更新本地状态
      const updatedPlugins = plugins.map((p) => (p.id === selectedPlugin.id ? selectedPlugin : p))
      setPlugins(updatedPlugins)

      // 关闭对话框
      setIsSettingsOpen(false)
    } catch (error) {
      console.error("保存插件设置错误:", error)
    }
  }

  // 上传新插件
  const uploadPlugin = async () => {
    if (!newPluginFile) return

    try {
      // 在实际应用中，这里应该调用API上传插件
      console.log("上传插件:", newPluginFile.name)

      // 模拟上传成功
      const newPlugin: AuditPlugin = {
        id: `plugin-${Date.now()}`,
        name: newPluginFile.name.replace(/\.\w+$/, ""),
        description: "用户上传的插件",
        version: "1.0.0",
        author: "当前用户",
        category: "custom",
        enabled: false,
      }

      // 更新本地状态
      setPlugins([...plugins, newPlugin])

      // 重置表单
      setNewPluginFile(null)

      // 关闭对话框
      setIsUploadOpen(false)
    } catch (error) {
      console.error("上传插件错误:", error)
    }
  }

  // 过滤插件
  const filteredPlugins = plugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Puzzle className="mr-2 h-5 w-5" />
              插件管理
            </CardTitle>
            <CardDescription>管理和配置系统审查插件</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  添加插件
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新插件</DialogTitle>
                  <DialogDescription>上传自定义插件或从市场安装</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="upload">
                  <TabsList className="mb-4">
                    <TabsTrigger value="upload">上传插件</TabsTrigger>
                    <TabsTrigger value="marketplace">插件市场</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload">
                    <div className="space-y-4 py-2">
                      <div className="grid gap-2">
                        <Label htmlFor="plugin-file">选择插件文件</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="plugin-file"
                            type="file"
                            accept=".js,.zip"
                            onChange={(e) => setNewPluginFile(e.target.files?.[0] || null)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">支持.js或.zip格式的插件文件</p>
                      </div>
                      {newPluginFile && (
                        <div className="bg-muted p-2 rounded-md">
                          <p className="text-sm font-medium">{newPluginFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(newPluginFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="marketplace">
                    <div className="space-y-4 py-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="搜索插件市场..." className="pl-8" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Package className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">安全扫描高级版</p>
                              <p className="text-xs text-muted-foreground">高级安全漏洞扫描和修复</p>
                            </div>
                          </div>
                          <Button size="sm">安装</Button>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Package className="h-8 w-8 text-primary" />
                            <div>
                              <p className="font-medium">代码质量分析</p>
                              <p className="text-xs text-muted-foreground">深入分析代码质量和复杂度</p>
                            </div>
                          </div>
                          <Button size="sm">安装</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={uploadPlugin} disabled={!newPluginFile}>
                    <Upload className="mr-2 h-4 w-4" />
                    上传插件
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索插件..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchPlugins} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <Puzzle className="mx-auto h-12 w-12 mb-4 animate-pulse" />
            <p>加载插件中...</p>
          </div>
        ) : filteredPlugins.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>插件名称</TableHead>
                <TableHead>版本</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlugins.map((plugin) => (
                <TableRow key={plugin.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plugin.name}</div>
                      <div className="text-xs text-muted-foreground">{plugin.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{plugin.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{plugin.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plugin.enabled}
                      onCheckedChange={(checked) => togglePluginEnabled(plugin, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openPluginSettings(plugin)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Puzzle className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>未找到插件</p>
            {searchQuery ? (
              <p className="text-sm">尝试使用不同的搜索词</p>
            ) : (
              <p className="text-sm">点击"添加插件"按钮添加新插件</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>插件可以扩展系统审查和自动修复功能</div>
        <div>
          已安装 {plugins.length} 个插件，{plugins.filter((p) => p.enabled).length} 个已启用
        </div>
      </CardFooter>

      {/* 插件设置对话框 */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>插件设置: {selectedPlugin?.name}</DialogTitle>
            <DialogDescription>{selectedPlugin?.description}</DialogDescription>
          </DialogHeader>
          {selectedPlugin && selectedPlugin.configSchema && (
            <div className="space-y-4 py-2">
              {Object.entries(selectedPlugin.configSchema).map(([key, schema]) => (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={`plugin-config-${key}`}>{schema.description || key}</Label>
                  {schema.type === "string" && schema.enum ? (
                    <select
                      id={`plugin-config-${key}`}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={(selectedPlugin as any)[key] || schema.default}
                      onChange={(e) =>
                        setSelectedPlugin({
                          ...selectedPlugin,
                          [key]: e.target.value,
                        })
                      }
                    >
                      {schema.enum.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : schema.type === "number" ? (
                    <Input
                      id={`plugin-config-${key}`}
                      type="number"
                      value={(selectedPlugin as any)[key] || schema.default}
                      onChange={(e) =>
                        setSelectedPlugin({
                          ...selectedPlugin,
                          [key]: Number(e.target.value),
                        })
                      }
                      min={schema.min}
                      max={schema.max}
                    />
                  ) : schema.type === "boolean" ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`plugin-config-${key}`}
                        checked={(selectedPlugin as any)[key] || schema.default}
                        onCheckedChange={(checked) =>
                          setSelectedPlugin({
                            ...selectedPlugin,
                            [key]: checked,
                          })
                        }
                      />
                      <Label htmlFor={`plugin-config-${key}`}>
                        {(selectedPlugin as any)[key] || schema.default ? "启用" : "禁用"}
                      </Label>
                    </div>
                  ) : (
                    <Input
                      id={`plugin-config-${key}`}
                      value={(selectedPlugin as any)[key] || schema.default}
                      onChange={(e) =>
                        setSelectedPlugin({
                          ...selectedPlugin,
                          [key]: e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              取消
            </Button>
            <Button onClick={savePluginSettings}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
