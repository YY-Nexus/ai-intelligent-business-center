"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, AlertTriangle, FileWarning } from "lucide-react"

export interface FileComplianceAuditProps {
  projectPath?: string
}

export function FileComplianceAudit({ projectPath = "/app" }: FileComplianceAuditProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    completed: boolean
    scannedFiles: number
    issues: Array<{
      file: string
      type: "warning" | "error"
      message: string
    }>
  }>({
    completed: false,
    scannedFiles: 0,
    issues: [],
  })

  const startScan = async () => {
    setIsScanning(true)
    setProgress(0)
    setResults({
      completed: false,
      scannedFiles: 0,
      issues: [],
    })

    // 模拟扫描过程
    const totalSteps = 10
    const mockIssues = [
      { file: "/app/page.tsx", type: "warning" as const, message: "组件缺少适当的类型定义" },
      { file: "/app/api/users/route.ts", type: "error" as const, message: "API路由缺少错误处理" },
      { file: "/app/dashboard/layout.tsx", type: "warning" as const, message: "未使用的导入" },
      { file: "/app/components/form.tsx", type: "error" as const, message: "表单提交没有验证" },
      { file: "/app/lib/utils.ts", type: "warning" as const, message: "函数缺少返回类型" },
    ]

    for (let i = 1; i <= totalSteps; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setProgress(i * 10)
      setResults((prev) => ({
        ...prev,
        scannedFiles: Math.floor((i / totalSteps) * 120),
      }))

      // 在进度过半时添加一些问题
      if (i === 5) {
        setResults((prev) => ({
          ...prev,
          issues: mockIssues.slice(0, 2),
        }))
      }
    }

    setResults({
      completed: true,
      scannedFiles: 120,
      issues: mockIssues,
    })
    setIsScanning(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>文件合规审计</CardTitle>
        <CardDescription>扫描项目文件，检查代码质量和最佳实践</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">项目路径: {projectPath}</span>
            <Button onClick={startScan} disabled={isScanning} size="sm">
              {isScanning ? "扫描中..." : "开始扫描"}
            </Button>
          </div>

          {(isScanning || results.completed) && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>扫描进度</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-sm text-muted-foreground">已扫描 {results.scannedFiles} 个文件</div>
              </div>

              {results.issues.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <FileWarning className="h-4 w-4 mr-1" />
                    发现问题 ({results.issues.length})
                  </h4>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <div className="space-y-2">
                      {results.issues.map((issue, i) => (
                        <div
                          key={i}
                          className="text-sm border-l-2 pl-3 py-1"
                          style={{
                            borderColor: issue.type === "error" ? "var(--destructive)" : "var(--warning)",
                          }}
                        >
                          <div className="font-medium flex items-center">
                            {issue.type === "error" ? (
                              <AlertTriangle className="h-3 w-3 mr-1 text-destructive" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3 mr-1 text-yellow-500" />
                            )}
                            {issue.file}
                          </div>
                          <div className="text-muted-foreground">{issue.message}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {results.completed && results.issues.length === 0 && (
                <div className="flex items-center justify-center p-4 text-green-500">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>没有发现问题</span>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
