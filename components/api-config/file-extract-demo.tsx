"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, FileText, Search, List, Trash2 } from "lucide-react"
import { FileManagementClient } from "@/lib/api-binding/providers/zhipu/file-management-client"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function FileExtractDemo() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileId, setFileId] = useState("")
  const [question, setQuestion] = useState("")
  const [fileContent, setFileContent] = useState("")
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [fileList, setFileList] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    if (!file) {
      toast({
        title: "文件缺失",
        description: "请选择要上传的文件",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const client = new FileManagementClient(apiKey)
      const result = await client.uploadFile({
        file,
        purpose: "file-extract",
      })

      setFileId(result.data.id)
      toast({
        title: "文件上传成功",
        description: `文件ID: ${result.data.id}`,
      })

      // 自动获取文件内容
      await handleGetContent(result.data.id)
    } catch (error) {
      console.error("文件上传失败:", error)
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetContent = async (id?: string) => {
    const targetFileId = id || fileId

    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    if (!targetFileId) {
      toast({
        title: "文件ID缺失",
        description: "请输入文件ID或先上传文件",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const client = new FileManagementClient(apiKey)
      const result = await client.getFileContent(targetFileId)

      const content = JSON.parse(result.data.content).content
      setFileContent(content)

      toast({
        title: "内容获取成功",
        description: "文件内容已成功提取",
      })
    } catch (error) {
      console.error("内容获取失败:", error)
      toast({
        title: "获取失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAskQuestion = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    if (!fileId) {
      toast({
        title: "文件ID缺失",
        description: "请输入文件ID或先上传文件",
        variant: "destructive",
      })
      return
    }

    if (!question.trim()) {
      toast({
        title: "问题缺失",
        description: "请输入���的问题",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setAnswer("")

    try {
      const client = new FileManagementClient(apiKey)
      const result = await client.fileQA(fileId, question)

      if (result.data.choices && result.data.choices.length > 0) {
        setAnswer(result.data.choices[0].message.content)
      } else {
        setAnswer("模型未返回有效回答")
      }
    } catch (error) {
      console.error("问答失败:", error)
      toast({
        title: "问答失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
      setAnswer("问答失败: " + (error instanceof Error ? error.message : "未知错误"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleListFiles = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const client = new FileManagementClient(apiKey)
      const result = await client.listFiles({
        purpose: "file-extract",
      })

      setFileList(result.data.data)

      toast({
        title: "文件列表获取成功",
        description: `共获取到 ${result.data.data.length} 个文件`,
      })
    } catch (error) {
      console.error("获取文件列表失败:", error)
      toast({
        title: "获取失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFile = async (id: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API密钥缺失",
        description: "请输入您的智谱AI API密钥",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const client = new FileManagementClient(apiKey)
      await client.deleteFile(id)

      // 更新文件列表
      setFileList(fileList.filter((file) => file.id !== id))

      toast({
        title: "文件删除成功",
        description: `文件ID: ${id} 已被删除`,
      })
    } catch (error) {
      console.error("文件删除失败:", error)
      toast({
        title: "删除失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectFile = (id: string) => {
    setFileId(id)
    setActiveTab("extract")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>文档内容抽取与问答</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="api-key" className="block text-sm font-medium mb-1">
                智谱AI API密钥
              </label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="输入您的智谱AI API密钥"
                className="w-full"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="upload">
                  <Upload className="h-4 w-4 mr-2" />
                  上传文件
                </TabsTrigger>
                <TabsTrigger value="extract">
                  <FileText className="h-4 w-4 mr-2" />
                  内容抽取
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List className="h-4 w-4 mr-2" />
                  文件列表
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium mb-1">
                      选择文件
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-upload"
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        className="w-full"
                        accept=".pdf,.docx,.doc,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.csv"
                      />
                      <Button onClick={handleUpload} disabled={isLoading || !file}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            上传中...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            上传
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    支持的格式：pdf、docx、doc、xls、xlsx、ppt、pptx、png、jpg、jpeg、csv，单个文件大小限制为50M
                  </div>
                  {file && (
                    <div className="text-sm">
                      已选择文件: <span className="font-medium">{file.name}</span> (
                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="extract" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="file-id" className="block text-sm font-medium mb-1">
                      文件ID
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file-id"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        placeholder="输入文件ID"
                        className="w-full"
                      />
                      <Button onClick={() => handleGetContent()} disabled={isLoading || !fileId}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            获取中...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            获取内容
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {fileContent && (
                    <div>
                      <label className="block text-sm font-medium mb-1">文件内容</label>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <div className="whitespace-pre-wrap">{fileContent}</div>
                      </ScrollArea>
                    </div>
                  )}

                  <div>
                    <label htmlFor="question" className="block text-sm font-medium mb-1">
                      提问
                    </label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="输入您的问题，例如：'请总结这篇文档的主要内容'"
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button onClick={handleAskQuestion} disabled={isLoading || !fileId || !question.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        提问
                      </>
                    )}
                  </Button>

                  {answer && (
                    <div>
                      <label className="block text-sm font-medium mb-1">回答</label>
                      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        <div className="whitespace-pre-wrap">{answer}</div>
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-4">
                <div className="space-y-4">
                  <Button onClick={handleListFiles} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        获取中...
                      </>
                    ) : (
                      <>
                        <List className="mr-2 h-4 w-4" />
                        获取文件列表
                      </>
                    )}
                  </Button>

                  {fileList.length > 0 && (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-12 gap-2 p-2 font-medium bg-muted">
                        <div className="col-span-5">文件名</div>
                        <div className="col-span-3">ID</div>
                        <div className="col-span-2">大小</div>
                        <div className="col-span-2">操作</div>
                      </div>
                      <ScrollArea className="h-[300px]">
                        {fileList.map((file) => (
                          <div key={file.id} className="grid grid-cols-12 gap-2 p-2 border-t">
                            <div className="col-span-5 truncate" title={file.filename}>
                              {file.filename}
                            </div>
                            <div className="col-span-3 truncate" title={file.id}>
                              {file.id}
                            </div>
                            <div className="col-span-2">{(file.bytes / 1024 / 1024).toFixed(2)} MB</div>
                            <div className="col-span-2 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => selectFile(file.id)}
                                title="使用此文件"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteFile(file.id)}
                                title="删除文件"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
