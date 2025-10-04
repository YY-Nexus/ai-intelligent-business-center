"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import type { Problem, ProblemSeverity, ProblemType } from "@/types/repair"

interface SystemDiagnosticsProps {
  problems: Problem[]
  isProblemDetectionRunning: boolean
  detectionProgress: number
  runSystemDiagnostics: () => void
  diagnosticsResults: any
}

export function SystemDiagnostics({
  problems,
  isProblemDetectionRunning,
  detectionProgress,
  runSystemDiagnostics,
  diagnosticsResults,
}: SystemDiagnosticsProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: ProblemType): string => {
    switch (type) {
      case "apiConnectivity":
        return "API连接问题"
      case "configuration":
        return "配置问题"
      case "performance":
        return "性能问题"
      case "security":
        return "安全问题"
      default:
        return "未知类型"
    }
  }

  // 获取问题严重程度的中文名称和样式
  const getSeverityInfo = (severity?: ProblemSeverity) => {
    switch (severity) {
      case "critical":
        return { name: "严重", className: "bg-red-50 text-red-700 border-red-200" }
      case "high":
        return { name: "高", className: "bg-orange-50 text-orange-700 border-orange-200" }
      case "medium":
        return { name: "中", className: "bg-yellow-50 text-yellow-700 border-yellow-200" }
      case "low":
        return { name: "低", className: "bg-green-50 text-green-700 border-green-200" }
      default:
        return { name: "未知", className: "bg-gray-50 text-gray-700 border-gray-200" }
    }
  }

  // 按类型对问题进行分组
  const problemsByType = problems.reduce(
    (acc, problem) => {
      if (!acc[problem.type]) {
        acc[problem.type] = []
      }
      acc[problem.type].push(problem)
      return acc
    },
    {} as Record<string, Problem[]>,
  )

  return (
    <div>
      {isProblemDetectionRunning ? (
        <div className="space-y-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">诊断进度</span>
            <span className="text-sm font-medium">{detectionProgress}%</span>
          </div>
          <Progress value={detectionProgress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">正在诊断系统问题，请稍候...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {!diagnosticsResults ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">点击下方按钮开始系统诊断</p>
              <Button onClick={runSystemDiagnostics}>开始系统诊断</Button>
            </div>
          ) : (
            <>
              {problems.length === 0 ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-800">系统状态良好</h3>
                    <p className="text-green-700 text-sm">未发现需要修复的问题，系统运行正常</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">发现的问题 ({problems.length})</h3>

                  <Accordion type="single" collapsible value={expandedCategory} onValueChange={setExpandedCategory}>
                    {Object.entries(problemsByType).map(([type, typeProblems]) => (
                      <AccordionItem key={type} value={type}>
                        <AccordionTrigger className="hover:bg-muted/50 px-3 rounded-md">
                          <div className="flex items-center">
                            <span className="mr-2">{getProblemTypeName(type as ProblemType)}</span>
                            <Badge variant="outline">{typeProblems.length}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-3 p-1">
                              {typeProblems.map((problem) => (
                                <div key={problem.id} className="p-3 rounded-md border">
                                  <div className="flex justify-between items-start mb-1">
                                    <div>
                                      <h4 className="font-medium flex items-center flex-wrap gap-1">
                                        {problem.name}
                                        <Badge
                                          variant="outline"
                                          className={getSeverityInfo(problem.severity).className}
                                        >
                                          {getSeverityInfo(problem.severity).name}
                                        </Badge>
                                      </h4>
                                      <p className="text-sm text-muted-foreground">{problem.description}</p>
                                    </div>
                                  </div>

                                  {problem.fixDescription && (
                                    <div className="mt-2 text-sm bg-blue-50 p-2 rounded border border-blue-100">
                                      <span className="font-medium">修复建议：</span> {problem.fixDescription}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">API连接诊断</CardTitle>
                    <CardDescription>检查与各AI提供商的API连接状态</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {diagnosticsResults.apiConnectivity.details.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                          <span className="text-sm">{item.name}</span>
                          <div className="flex items-center">
                            {item.status === "ok" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                正常
                              </Badge>
                            ) : item.status === "warning" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                警告
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                错误
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">配置诊断</CardTitle>
                    <CardDescription>检查系统配置是否正确</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {diagnosticsResults.configurationIssues.details.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                          <span className="text-sm">{item.name}</span>
                          <div className="flex items-center">
                            {item.status === "ok" ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                正常
                              </Badge>
                            ) : item.status === "warning" ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                警告
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <XCircle className="mr-1 h-3 w-3" />
                                错误
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
