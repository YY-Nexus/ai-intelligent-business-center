"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Clock, Calendar, Info, Download, BarChart4 } from "lucide-react"
import type { RepairHistoryItem, Problem } from "@/types/repair"

interface RepairHistoryProps {
  history: RepairHistoryItem[]
}

export function RepairHistory({ history }: RepairHistoryProps) {
  const [selectedHistory, setSelectedHistory] = useState<RepairHistoryItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // 查看详情
  const viewDetails = (item: RepairHistoryItem) => {
    setSelectedHistory(item)
    setIsDetailsOpen(true)
  }

  // 导出报告
  const exportReport = (item: RepairHistoryItem) => {
    // 实际应用中，这里应该实现导出功能
    console.log("导出报告:", item)
    alert(`正在导出 ${new Date(item.timestamp).toLocaleString("zh-CN")} 的修复报告`)
  }

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: string): string => {
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
        return type
    }
  }

  return (
    <div>
      {history.length === 0 ? (
        <div className="text-center py-12">
          <BarChart4 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <p className="text-muted-foreground">暂无修复历史记录</p>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:w-1/3 border-r">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{new Date(item.timestamp).toLocaleString("zh-CN")}</span>
                    </div>
                    <h3 className="font-medium mb-1">修复会话 #{item.id.substring(0, 8)}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.strategy.priorityOrder === "severity"
                          ? "按严重程度"
                          : item.strategy.priorityOrder === "fixSuccess"
                            ? "按成功率"
                            : "自定义优先级"}
                      </Badge>
                      {item.strategy.createBackupBeforeFix && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          已创建备份
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-muted/40 rounded-md">
                        <div className="text-lg font-bold">{item.totalProblems}</div>
                        <div className="text-xs text-muted-foreground">总问题</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded-md">
                        <div className="text-lg font-bold text-green-700">{item.fixedProblems}</div>
                        <div className="text-xs text-green-600">已修复</div>
                      </div>
                      <div className="p-2 bg-red-50 rounded-md">
                        <div className="text-lg font-bold text-red-700">{item.failedProblems}</div>
                        <div className="text-xs text-red-600">失败</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 md:w-2/3">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">修复摘要</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => viewDetails(item)}>
                          <Info className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportReport(item)}>
                          <Download className="h-4 w-4 mr-1" />
                          导出
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {item.problemSummary.map((summary, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-muted/40 rounded-md">
                          <div className="flex items-center">
                            <span className="text-sm">{getProblemTypeName(summary.type)}</span>
                            <Badge variant="outline" className="ml-2">
                              {summary.count}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            已修复: {summary.fixed} / {summary.count}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {item.duration ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          修复用时: {Math.round(item.duration / 1000)} 秒
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* 详情对话框 */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>修复详情</DialogTitle>
            <DialogDescription>
              {selectedHistory && new Date(selectedHistory.timestamp).toLocaleString("zh-CN")}
            </DialogDescription>
          </DialogHeader>

          {selectedHistory && (
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="problems">
                <TabsList className="mb-4">
                  <TabsTrigger value="problems">问题详情</TabsTrigger>
                  <TabsTrigger value="strategy">修复策略</TabsTrigger>
                  <TabsTrigger value="performance">性能分析</TabsTrigger>
                </TabsList>

                <TabsContent value="problems" className="h-full overflow-hidden">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>问题</TableHead>
                          <TableHead>类型</TableHead>
                          <TableHead>严重程度</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>详情</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedHistory.problems.map((problem: Problem) => (
                          <TableRow key={problem.id}>
                            <TableCell>{problem.name}</TableCell>
                            <TableCell>{getProblemTypeName(problem.type)}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  problem.severity === "critical"
                                    ? "bg-red-50 text-red-700"
                                    : problem.severity === "high"
                                      ? "bg-orange-50 text-orange-700"
                                      : problem.severity === "medium"
                                        ? "bg-yellow-50 text-yellow-700"
                                        : "bg-green-50 text-green-700"
                                }
                              >
                                {problem.severity === "critical"
                                  ? "严重"
                                  : problem.severity === "high"
                                    ? "高"
                                    : problem.severity === "medium"
                                      ? "中"
                                      : "低"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {problem.status === "fixed" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  已修复
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  失败
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {problem.status === "fixed" ? problem.fixDescription : problem.error}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="strategy">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">修复策略</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">优先级顺序</span>
                            <span className="text-sm font-medium">
                              {selectedHistory.strategy.priorityOrder === "severity"
                                ? "按严重程度"
                                : selectedHistory.strategy.priorityOrder === "fixSuccess"
                                  ? "按成功率"
                                  : "自定义优先级"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">创建备份</span>
                            <span className="text-sm font-medium">
                              {selectedHistory.strategy.createBackupBeforeFix ? "是" : "否"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">回滚阈值</span>
                            <span className="text-sm font-medium">
                              {selectedHistory.strategy.rollbackOnFailureThreshold}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">修复超时</span>
                            <span className="text-sm font-medium">{selectedHistory.strategy.fixTimeout} 秒</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">修复范围</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedHistory.strategy.fixApiConnectivityIssues}
                              readOnly
                              className="mr-2"
                            />
                            <span className="text-sm">修复API连接问题</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedHistory.strategy.fixConfigurationIssues}
                              readOnly
                              className="mr-2"
                            />
                            <span className="text-sm">修复配置问题</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedHistory.strategy.fixPerformanceIssues}
                              readOnly
                              className="mr-2"
                            />
                            <span className="text-sm">修复性能问题</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedHistory.strategy.fixSecurityIssues}
                              readOnly
                              className="mr-2"
                            />
                            <span className="text-sm">修复安全问题</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">修复性能</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-muted/40 rounded-md text-center">
                            <div className="text-2xl font-bold">{Math.round(selectedHistory.duration / 1000)}</div>
                            <div className="text-sm text-muted-foreground">总用时（秒）</div>
                          </div>
                          <div className="p-3 bg-muted/40 rounded-md text-center">
                            <div className="text-2xl font-bold">
                              {Math.round((selectedHistory.fixedProblems / selectedHistory.totalProblems) * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">成功率</div>
                          </div>
                          <div className="p-3 bg-muted/40 rounded-md text-center">
                            <div className="text-2xl font-bold">
                              {Math.round(selectedHistory.duration / selectedHistory.totalProblems / 1000)}
                            </div>
                            <div className="text-sm text-muted-foreground">平均修复时间（秒/问题）</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">系统健康改善</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center gap-8">
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">修复前</div>
                            <div
                              className={`text-3xl font-bold ${
                                selectedHistory.systemHealthBefore >= 80
                                  ? "text-green-500"
                                  : selectedHistory.systemHealthBefore >= 60
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }`}
                            >
                              {selectedHistory.systemHealthBefore}%
                            </div>
                          </div>

                          <div className="text-2xl">→</div>

                          <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-1">修复后</div>
                            <div
                              className={`text-3xl font-bold ${
                                selectedHistory.systemHealthAfter >= 80
                                  ? "text-green-500"
                                  : selectedHistory.systemHealthAfter >= 60
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }`}
                            >
                              {selectedHistory.systemHealthAfter}%
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
