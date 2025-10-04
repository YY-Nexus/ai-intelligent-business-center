"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Clock, Database, Lock, RefreshCw, Save, Settings, ShieldCheck } from "lucide-react"

export function ApiSettings() {
  const [syncInterval, setSyncInterval] = useState([30])
  const [isAutoSync, setIsAutoSync] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // 模拟保存
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API设置</CardTitle>
          <CardDescription>配置API连接参数、同步设置和安全选项</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>常规设置</span>
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                <span>同步设置</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                <span>安全设置</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API基本设置</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-version">API版本</Label>
                      <Select defaultValue="v2">
                        <SelectTrigger id="api-version">
                          <SelectValue placeholder="选择API版本" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">V1 (旧版)</SelectItem>
                          <SelectItem value="v2">V2 (推荐)</SelectItem>
                          <SelectItem value="v3-beta">V3 (测试版)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="request-timeout">请求超时 (秒)</Label>
                      <Input id="request-timeout" type="number" defaultValue="30" min="5" max="120" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-retries">最大重试次数</Label>
                      <Input id="max-retries" type="number" defaultValue="3" min="0" max="10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retry-delay">重试延迟 (秒)</Label>
                      <Input id="retry-delay" type="number" defaultValue="5" min="1" max="60" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">请求限制</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">API速率限制 (请求/分钟)</Label>
                      <Input id="rate-limit" type="number" defaultValue="60" min="10" max="1000" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="concurrent-requests">并发请求数</Label>
                      <Input id="concurrent-requests" type="number" defaultValue="5" min="1" max="20" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="throttling">启用请求节流</Label>
                      <p className="text-sm text-muted-foreground">自动调整请求速率以避免达到API限制</p>
                    </div>
                    <Switch id="throttling" checked={true} />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sync">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">数据同步设置</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">自动同步</Label>
                      <p className="text-sm text-muted-foreground">定期自动同步数据</p>
                    </div>
                    <Switch id="auto-sync" checked={isAutoSync} onCheckedChange={setIsAutoSync} />
                  </div>

                  {isAutoSync && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>同步间隔 (分钟)</Label>
                        <span className="text-sm text-muted-foreground">{syncInterval[0]} 分钟</span>
                      </div>
                      <Slider value={syncInterval} onValueChange={setSyncInterval} min={5} max={120} step={5} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>5分钟</span>
                        <span>1小时</span>
                        <span>2小时</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="sync-schedule">同步时间表</Label>
                    <Select defaultValue="always">
                      <SelectTrigger id="sync-schedule">
                        <SelectValue placeholder="选择同步时间表" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="always">全天候</SelectItem>
                        <SelectItem value="business-hours">营业时间 (9:00-18:00)</SelectItem>
                        <SelectItem value="custom">自定义时间段</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">同步内容</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-products">产品数据</Label>
                      <Switch id="sync-products" checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-orders">订单数据</Label>
                      <Switch id="sync-orders" checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-inventory">库存数据</Label>
                      <Switch id="sync-inventory" checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-customers">客户数据</Label>
                      <Switch id="sync-customers" checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="sync-reviews">评价数据</Label>
                      <Switch id="sync-reviews" checked={true} />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800 flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">同步注意事项</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      频繁的数据同步可能会导致API请求配额快速消耗。建议根据业务需求合理设置同步频率和内容。
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">安全设置</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="secure-connection">强制HTTPS连接</Label>
                      <p className="text-sm text-muted-foreground">确保所有API通信使用加密连接</p>
                    </div>
                    <Switch id="secure-connection" checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="api-logging">API请求日志记录</Label>
                      <p className="text-sm text-muted-foreground">记录所有API请求和响应</p>
                    </div>
                    <Switch id="api-logging" checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sensitive-data">敏感数据过滤</Label>
                      <p className="text-sm text-muted-foreground">在日志中过滤敏感信息</p>
                    </div>
                    <Switch id="sensitive-data" checked={true} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API密钥管理</h3>

                  <div className="space-y-2">
                    <Label htmlFor="key-rotation">密钥轮换策略</Label>
                    <Select defaultValue="90days">
                      <SelectTrigger id="key-rotation">
                        <SelectValue placeholder="选择密钥轮换策略" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30days">每30天</SelectItem>
                        <SelectItem value="90days">每90天</SelectItem>
                        <SelectItem value="180days">每180天</SelectItem>
                        <SelectItem value="manual">手动轮换</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">下次密钥轮换时间</p>
                        <p className="text-xs text-muted-foreground">2023年8月14日</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>立即轮换</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">数据安全</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-encryption">数据加密存储</Label>
                      <p className="text-sm text-muted-foreground">加密存储敏感数据</p>
                    </div>
                    <Switch id="data-encryption" checked={true} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">加密算法</p>
                        <p className="text-xs text-muted-foreground">AES-256-GCM</p>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">数据保留策略</p>
                        <p className="text-xs text-muted-foreground">90天</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>{isSaving ? "保存中..." : "保存设置"}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
