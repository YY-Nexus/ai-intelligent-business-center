"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { PaddleFlowClient } from "@/lib/api-binding/providers/paddleflow/paddleflow-client"
import { Download, Upload, Play, Pause, StepForward } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// 批量请求项
interface BatchRequestItem {
  id: string
  prompt: string
  status: "pending" | "processing" | "completed" | "failed"
  response?: string
  error?: string
  startTime?: number
  endTime?: number
  model: string
}

export default function BatchRequestProcessor() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState(process.env.NEXT_PUBLIC_API_KEY || "")
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_BASE_URL || "https://aistudio.baidu.com/llm/lmapi/v3")
  const [model, setModel] = useState(process.env.NEXT_PUBLIC_MODEL || "deepseek-r1")
  const [batchInput, setBatchInput] = useState("")
  const [delimiter, setDelimiter] = useState("\n\n")
  const [concurrentRequests, setConcurrentRequests] = useState(2)
  const [requestItems, setRequestItems] = useState<BatchRequestItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [includeSystemPrompt, setIncludeSystemPrompt] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState("你是一个有用的AI助手。")
  const processingQueue = useRef<NodeJS.Timeout | null>(null)

  // 准备批量请求
  const prepareBatchRequests = () => {
    if (!batchInput.trim()) {
      toast({
        title: "输入为空",
        description: "请输入要处理的提示",
        variant: "destructive",
      })
      return
    }

    if (!apiKey) {
      toast({
        title: "API密钥缺失",
        description: "请提供有效的API密钥",
        variant: "destructive",
      })
      return
    }

    // 使用分隔符拆分输入
    const prompts = batchInput.split(delimiter).filter((prompt) => prompt.trim() !== "")

    if (prompts.length === 0) {
      toast({
        title: "没有有效的提示",
        description: "请检查您的输入和分隔符设置",
        variant: "destructive",
      })
      return
    }

    // 创建请求项
    const items: BatchRequestItem[] = prompts.map((prompt, index) => ({
      id: `req-${Date.now()}-${index}`,
      prompt: prompt.trim(),
      status: "pending",
      model,
    }))

    setRequestItems(items)
    setProgress(0)

    toast({
      title: "批量请求已准备",
      description: `已准备 ${items.length} 个请求`,
    })
  }

  // 开始处理批量请求
  const startProcessing = () => {
    if (requestItems.length === 0) {
      toast({
        title: "没有请求",
        description: "请先准备批量请求",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setIsPaused(false)
    processNextBatch()
  }

  // 暂停处理
  const pauseProcessing = () => {
    setIsPaused(true)
    if (processingQueue.current) {
      clearTimeout(processingQueue.current)
      processingQueue.current = null
    }
  }

  // 处理下一批请求
  const processNextBatch = () => {
    if (isPaused) return

    // 获取待处理的请求
    const pendingItems = requestItems.filter((item) => item.status === "pending")

    if (pendingItems.length === 0) {
      // 所有请求已处理完成
      setIsProcessing(false)
      toast({
        title: "批量处理完成",
        description: `已完成 ${requestItems.length} 个请求`,
      })
      return
    }

    // 计算进度
    const completedCount = requestItems.filter((item) => item.status === "completed" || item.status === "failed").length
    const newProgress = Math.round((completedCount / requestItems.length) * 100)
    setProgress(newProgress)

    // 选择要处理的批次
    const batchToProcess = pendingItems.slice(0, concurrentRequests)

    // 更新状态为处理中
    setRequestItems((prev) =>
      prev.map((item) =>
        batchToProcess.some((batchItem) => batchItem.id === item.id)
          ? { ...item, status: "processing", startTime: Date.now() }
          : item,
      ),
    )

    // 处理每个请求
    Promise.all(
      batchToProcess.map(async (item) => {
        try {
          const client = new PaddleFlowClient({
            apiKey,
            baseUrl,
            model: item.model,
          })

          const messages = includeSystemPrompt
            ? [
                { role: "system", content: systemPrompt },
                { role: "user", content: item.prompt },
              ]
            : [{ role: "user", content: item.prompt }]

          const response = await client.chat({ messages })

          // 更新请求状态为已完成
          setRequestItems((prev) =>
            prev.map((prevItem) =>
              prevItem.id === item.id
                ? {
                    ...prevItem,
                    status: "completed",
                    response,
                    endTime: Date.now(),
                  }
                : prevItem,
            ),
          )
        } catch (error: any) {
          console.error(`请求 ${item.id} 失败:`, error)

          // 更新请求状态为失败
          setRequestItems((prev) =>
            prev.map((prevItem) =>
              prevItem.id === item.id
                ? {
                    ...prevItem,
                    status: "failed",
                    error: error.message,
                    endTime: Date.now(),
                  }
                : prevItem,
            ),
          )
        }
      }),
    ).finally(() => {
      // 延迟处理下一批，避免API限制
      processingQueue.current = setTimeout(() => {
        processNextBatch()
      }, 1000)
    })
  }

  // 处理单个请求
  const processSingleRequest = (itemId: string) => {
    const item = requestItems.find((item) => item.id === itemId)
    if (!item || item.status !== "pending") return

    // 更新状态为处理中
    setRequestItems((prev) =>
      prev.map((prevItem) =>
        prevItem.id === itemId ? { ...prevItem, status: "processing", startTime: Date.now() } : prevItem,
      ),
    )

    // 处理请求
    const client = new PaddleFlowClient({
      apiKey,
      baseUrl,
      model: item.model,
    })

    const messages = includeSystemPrompt
      ? [
          { role: "system", content: systemPrompt },
          { role: "user", content: item.prompt },
        ]
      : [{ role: "user", content: item.prompt }]

    client
      .chat({ messages })
      .then((response) => {
        // 更新请求状态为已完成
        setRequestItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === itemId
              ? {
                  ...prevItem,
                  status: "completed",
                  response,
                  endTime: Date.now(),
                }
              : prevItem,
          ),
        )
      })
      .catch((error: any) => {
        console.error(`请求 ${itemId} 失败:`, error)

        // 更新请求状态为失败
        setRequestItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === itemId
              ? {
                  ...prevItem,
                  status: "failed",
                  error: error.message,
                  endTime: Date.now(),
                }
              : prevItem,
          ),
        )
      })
  }

  // 导出结果
  const exportResults = () => {
    const completedItems = requestItems.filter((item) => item.status === "completed")
    if (completedItems.length === 0) {
      toast({
        title: "没有可导出的结果",
        description: "请先完成一些请求",
        variant: "destructive",
      })
      return
    }

    // 准备导出数据
    const exportData = completedItems.map((item) => ({
      prompt: item.prompt,
      response: item.response,
      model: item.model,
      processingTime: item.endTime && item.startTime ? item.endTime - item.startTime : null,
    }))

    // 创建JSON文件
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    // 创建下载链接
    const exportFileDefaultName = `batch-results-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // 导入提示
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setBatchInput(content)
    }
    reader.readAsText(file)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>批量请求处理器</CardTitle>
        <CardDescription>批量处理多个API请求，提高工作效率</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 配置区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">模型</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="选择模型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deepseek-r1">DeepSeek-R1</SelectItem>
                <SelectItem value="llama-3-8b">Llama-3-8B</SelectItem>
                <SelectItem value="qwen-max">Qwen-Max</SelectItem>
                <SelectItem value="qwen-plus">Qwen-Plus</SelectItem>
                <SelectItem value="ernie-bot-4">ERNIE-Bot-4</SelectItem>
                <SelectItem value="ernie-bot-8k">ERNIE-Bot-8K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="concurrent-requests">并发请求数</Label>
            <Select
              value={concurrentRequests.toString()}
              onValueChange={(value) => setConcurrentRequests(Number.parseInt(value))}
            >
              <SelectTrigger id="concurrent-requests">
                <SelectValue placeholder="选择并发数" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delimiter">分隔符</Label>
            <Select value={delimiter} onValueChange={setDelimiter}>
              <SelectTrigger id="delimiter">
                <SelectValue placeholder="选择分隔符" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="\n\n">空行 (两个换行)</SelectItem>
                <SelectItem value="\n---\n">分隔线 (---)</SelectItem>
                <SelectItem value="###">井号 (###)</SelectItem>
                <SelectItem value="\n">单行换行</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-prompt-toggle">包含系统提示</Label>
              <Switch
                id="system-prompt-toggle"
                checked={includeSystemPrompt}
                onCheckedChange={setIncludeSystemPrompt}
              />
            </div>
            {includeSystemPrompt && (
              <Input
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="系统提示"
              />
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="batch-input">批量提示</Label>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                <Upload className="h-4 w-4 mr-1" /> 导入
              </Button>
              <input id="file-upload" type="file" accept=".txt,.json" className="hidden" onChange={handleFileUpload} />
            </div>
          </div>
          <Textarea
            id="batch-input"
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            placeholder={`输入多个提示，使用${
              delimiter === "\n\n" ? "空行" : delimiter === "\n---\n" ? "分隔线" : delimiter === "###" ? "###" : "换行"
            }分隔`}
            className="min-h-[200px]"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={prepareBatchRequests} disabled={isProcessing || !batchInput.trim()}>
            准备批量请求
          </Button>
          {isProcessing ? (
            <Button variant="destructive" onClick={pauseProcessing} disabled={isPaused}>
              <Pause className="h-4 w-4 mr-1" /> 暂停处理
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={startProcessing}
              disabled={requestItems.length === 0 || requestItems.every((item) => item.status !== "pending")}
            >
              <Play className="h-4 w-4 mr-1" /> 开始处理
            </Button>
          )}
          <Button
            variant="outline"
            onClick={exportResults}
            disabled={!requestItems.some((item) => item.status === "completed")}
          >
            <Download className="h-4 w-4 mr-1" /> 导出结果
          </Button>
        </div>

        {/* 进度条 */}
        {requestItems.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>处理进度</span>
              <span>
                {requestItems.filter((item) => item.status === "completed" || item.status === "failed").length} /{" "}
                {requestItems.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* 请求列表 */}
        {requestItems.length > 0 && (
          <ScrollArea className="h-[400px] border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">状态</TableHead>
                  <TableHead>提示</TableHead>
                  <TableHead className="w-[100px]">模型</TableHead>
                  <TableHead className="w-[100px]">耗时</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestItems.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "success"
                            : item.status === "failed"
                              ? "destructive"
                              : item.status === "processing"
                                ? "default"
                                : "outline"
                        }
                      >
                        {item.status === "completed"
                          ? "完成"
                          : item.status === "failed"
                            ? "失败"
                            : item.status === "processing"
                              ? "处理中"
                              : "等待中"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[300px]" title={item.prompt}>
                      {item.prompt}
                    </TableCell>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>
                      {item.endTime && item.startTime
                        ? `${Math.round((item.endTime - item.startTime) / 100) / 10}s`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {item.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => processSingleRequest(item.id)}
                          title="处理此请求"
                        >
                          <StepForward className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        {/* 响应详情 */}
        {requestItems.some((item) => item.status === "completed" || item.status === "failed") && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">响应详情</h3>
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {requestItems
                .filter((item) => item.status === "completed" || item.status === "failed")
                .map((item) => (
                  <div key={item.id} className="mb-6 pb-6 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">提示:</h4>
                      <Badge variant={item.status === "completed" ? "success" : "destructive"} className="ml-2">
                        {item.status === "completed" ? "完成" : "失败"}
                      </Badge>
                    </div>
                    <p className="text-sm mb-4">{item.prompt}</p>
                    {item.status === "completed" && item.response ? (
                      <>
                        <h4 className="font-medium mb-2">响应:</h4>
                        <p className="text-sm whitespace-pre-wrap bg-muted/30 p-2 rounded-md">{item.response}</p>
                      </>
                    ) : (
                      item.error && (
                        <>
                          <h4 className="font-medium mb-2 text-destructive">错误:</h4>
                          <p className="text-sm text-destructive">{item.error}</p>
                        </>
                      )
                    )}
                  </div>
                ))}
            </ScrollArea>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>模型: {model}</div>
        <div>请求数: {requestItems.length}</div>
      </CardFooter>
    </Card>
  )
}
