"use client"

import { useState } from "react"
import { useApiConfig, type ApiConfigWithMeta } from "./api-config-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Download, Upload, Copy, Check } from "lucide-react"

export default function ApiConfigImportExport() {
  const { configs, importConfigs, exportConfigs } = useApiConfig()
  const { toast } = useToast()
  const [importData, setImportData] = useState("")
  const [copied, setCopied] = useState(false)

  // 导出配置
  const handleExport = () => {
    try {
      const configsData = exportConfigs()
      const jsonData = JSON.stringify(configsData, null, 2)

      // 创建下载链接
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `api-configs-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()

      // 清理
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)

      toast({
        title: "导出成功",
        description: `已导出 ${configsData.length} 个API配置。`,
      })
    } catch (error) {
      console.error("导出API配置失败:", error)
      toast({
        title: "导出失败",
        description: "无法导出API配置。",
        variant: "destructive",
      })
    }
  }

  // 复制到剪贴板
  const handleCopyToClipboard = () => {
    try {
      const configsData = exportConfigs()
      const jsonData = JSON.stringify(configsData, null, 2)

      navigator.clipboard.writeText(jsonData).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)

        toast({
          title: "复制成功",
          description: "API配置已复制到剪贴板。",
        })
      })
    } catch (error) {
      console.error("复制API配置失败:", error)
      toast({
        title: "复制失败",
        description: "无法复制API配置到剪贴板。",
        variant: "destructive",
      })
    }
  }

  // 导入配置
  const handleImport = () => {
    try {
      if (!importData.trim()) {
        toast({
          title: "导入失败",
          description: "请输入要导入的API配置数据。",
          variant: "destructive",
        })
        return
      }

      const parsedData = JSON.parse(importData) as ApiConfigWithMeta[]

      if (!Array.isArray(parsedData)) {
        toast({
          title: "导入失败",
          description: "导入的数据格式无效，应为API配置数组。",
          variant: "destructive",
        })
        return
      }

      const result = importConfigs(parsedData)

      if (result) {
        setImportData("")
      }
    } catch (error) {
      console.error("导入API配置失败:", error)
      toast({
        title: "导入失败",
        description: "导入的数据格式无效，请检查JSON格式。",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>导出API配置</CardTitle>
          <CardDescription>导出当前的API配置为JSON文件</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="mb-4">
            当前有 <strong>{configs.length}</strong> 个API配置可以导出。
          </p>

          <div className="flex flex-col space-y-2">
            <Button onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              下载配置文件
            </Button>

            <Button onClick={handleCopyToClipboard} variant="outline" className="w-full">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制到剪贴板
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>导入API配置</CardTitle>
          <CardDescription>从JSON文件或文本导入API配置</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="粘贴API配置JSON数据..."
              className="font-mono"
              rows={10}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleImport} className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            导入配置
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
