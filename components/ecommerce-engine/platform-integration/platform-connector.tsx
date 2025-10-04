"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, ExternalLink, RefreshCw, ShoppingBag } from "lucide-react"
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

interface PlatformCardProps {
  name: string
  logo: string
  description: string
  isConnected: boolean
  lastSync?: string
  onConnect: () => void
  onDisconnect: () => void
  onSync: () => void
}

function PlatformCard({
  name,
  logo,
  description,
  isConnected,
  lastSync,
  onConnect,
  onDisconnect,
  onSync,
}: PlatformCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [secretKey, setSecretKey] = useState("")
  const [shopId, setShopId] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    // 模拟API连接
    setTimeout(() => {
      setIsConnecting(false)
      setIsDialogOpen(false)
      onConnect()
    }, 1500)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md overflow-hidden">
              <img src={logo || "/placeholder.svg"} alt={name} className="h-full w-full object-cover" />
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="text-xs">{description}</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? "success" : "outline"}>{isConnected ? "已连接" : "未连接"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {isConnected && (
          <div className="text-sm text-muted-foreground">
            <div className="flex justify-between mb-2">
              <span>上次同步时间:</span>
              <span>{lastSync || "从未"}</span>
            </div>
            <div className="flex justify-between">
              <span>自动同步:</span>
              <Switch checked={true} />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {isConnected ? (
          <>
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              断开连接
            </Button>
            <Button variant="outline" size="sm" onClick={onSync} className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>同步数据</span>
            </Button>
          </>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">连接平台</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>连接到 {name}</DialogTitle>
                <DialogDescription>
                  请输入您的API凭据以连接到{name}平台。您可以在{name}商家后台找到这些信息。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API密钥</Label>
                  <Input
                    id="api-key"
                    placeholder="输入API密钥"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret-key">密钥</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    placeholder="输入密钥"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shop-id">店铺ID</Label>
                  <Input
                    id="shop-id"
                    placeholder="输入店铺ID"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <ExternalLink className="h-4 w-4" />
                  <a href="#" className="hover:underline">
                    如何获取API凭据?
                  </a>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleConnect} disabled={!apiKey || !secretKey || isConnecting}>
                  {isConnecting ? "连接中..." : "连接平台"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}

export function PlatformConnector() {
  const [platforms, setPlatforms] = useState([
    {
      id: "taobao",
      name: "淘宝/天猫",
      logo: "/placeholder.svg?key=y5nji",
      description: "阿里巴巴旗下电商平台",
      isConnected: true,
      lastSync: "2023-05-14 14:30:22",
    },
    {
      id: "jd",
      name: "京东",
      logo: "/placeholder.svg?key=ueebw",
      description: "中国领先的自营式电商平台",
      isConnected: false,
    },
    {
      id: "pdd",
      name: "拼多多",
      logo: "/pindoduo-logo.png",
      description: "社交电商平台",
      isConnected: false,
    },
    {
      id: "douyin",
      name: "抖音小店",
      logo: "/placeholder.svg?key=chuop",
      description: "短视频平台电商",
      isConnected: true,
      lastSync: "2023-05-14 10:15:36",
    },
    {
      id: "wechat",
      name: "微信小商店",
      logo: "/placeholder.svg?key=krj65",
      description: "微信生态内的电商平台",
      isConnected: false,
    },
    {
      id: "kuaishou",
      name: "快手小店",
      logo: "/placeholder.svg?key=i08rr",
      description: "短视频平台电商",
      isConnected: false,
    },
  ])

  const handleConnect = (platformId: string) => {
    setPlatforms(
      platforms.map((platform) =>
        platform.id === platformId
          ? { ...platform, isConnected: true, lastSync: new Date().toLocaleString() }
          : platform,
      ),
    )
  }

  const handleDisconnect = (platformId: string) => {
    setPlatforms(
      platforms.map((platform) =>
        platform.id === platformId ? { ...platform, isConnected: false, lastSync: undefined } : platform,
      ),
    )
  }

  const handleSync = (platformId: string) => {
    setPlatforms(
      platforms.map((platform) =>
        platform.id === platformId ? { ...platform, lastSync: new Date().toLocaleString() } : platform,
      ),
    )
  }

  const connectedCount = platforms.filter((p) => p.isConnected).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>平台连接</CardTitle>
          <CardDescription>连接您的电商平台账户，实现数据同步和自动化操作</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mb-6">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-800 dark:text-blue-300">平台连接状态</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                已连接 {connectedCount} 个平台，{platforms.length - connectedCount} 个平台待连接
              </p>
            </div>
            {connectedCount > 0 ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">已激活</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">未连接</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                name={platform.name}
                logo={platform.logo}
                description={platform.description}
                isConnected={platform.isConnected}
                lastSync={platform.lastSync}
                onConnect={() => handleConnect(platform.id)}
                onDisconnect={() => handleDisconnect(platform.id)}
                onSync={() => handleSync(platform.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
