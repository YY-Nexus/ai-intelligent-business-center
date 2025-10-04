"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle, XCircle, RotateCcw, Calendar, Clock, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Problem, ProblemType } from "./auto-fix-engine"

// 修复历史记录类型
export interface RepairHistory {
  id: string
  timestamp: Date
  problems: Problem[]
  fixedCount: number
  failedCount: number
  totalCount: number
  systemHealthBefore: number
  systemHealthAfter: number
  duration: number // 修复持续时间（秒）
  rollbackAvailable: boolean
}

interface RepairHistoryProps {
  histories: RepairHistory[]
  onViewDetails: (history: RepairHistory) => void
  onRollback: (history: RepairHistory) => void
}

export function RepairHistoryList({ histories, onViewDetails, onRollback }: RepairHistoryProps) {
  const [filter, setFilter] = useState<"all" | "success" | "partial" | "failed">("all")
  const [sortBy, setSortBy] = useState<"date" | "problems" | "success">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // 过滤历史记录
  const filteredHistories = histories.filter((history) => {
    switch (filter) {
      case "success":
        return history.fixedCount === history.totalCount
      case "partial":
        return history.fixedCount > 0 && history.fixedCount < history.totalCount
      case "failed":
        return history.fixedCount === 0
      default:
        return true
    }
  })

  // 排序历史记录
  const sortedHistories = [...filteredHistories].sort((a, b) => {
    let comparison = 0
    switch (sortBy) {
      case "date":
        comparison = a.timestamp.getTime() - b.timestamp.getTime()
        break
      case "problems":
        comparison = a.totalCount - b.totalCount
        break
      case "success":
        comparison = a.fixedCount / a.totalCount - b.fixedCount / b.totalCount
        break
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  // 格式化日期
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  // 格式化时间
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // 格式化持续时间
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}秒`
    } else {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}分${remainingSeconds}秒`
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>修复历史记录</CardTitle>
            <CardDescription>查看系统修复历史和详细信息</CardDescription>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  筛选
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>按结果筛选</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    <span className={filter === "all" ? "font-bold" : ""}>全部记录</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("success")}>
                    <span className={filter === "success" ? "font-bold" : ""}>完全成功</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("partial")}>
                    <span className={filter === "partial" ? "font-bold" : ""}>部分成功</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("failed")}>
                    <span className={filter === "failed" ? "font-bold" : ""}>完全失败</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>排序方式</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortBy("date")}>
                    <span className={sortBy === "date" ? "font-bold" : ""}>按日期</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("problems")}>
                    <span className={sortBy === "problems" ? "font-bold" : ""}>按问题数量</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("success")}>
                    <span className={sortBy === "success" ? "font-bold" : ""}>按成功率</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    <span className={sortOrder === "desc" ? "font-bold" : ""}>降序</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    <span className={sortOrder === "asc" ? "font-bold" : ""}>升序</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">日期/时间</TableHead>
                <TableHead>修复结果</TableHead>
                <TableHead className="hidden md:table-cell">系统健康度</TableHead>
                <TableHead className="hidden md:table-cell">持续时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHistories.length > 0 ? (
                sortedHistories.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(history.timestamp)}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(history.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <Badge
                            variant={
                              history.fixedCount === history.totalCount
                                ? "default"
                                : history.fixedCount > 0
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {history.fixedCount === history.totalCount
                              ? "全部修复"
                              : history.fixedCount > 0
                                ? "部分修复"
                                : "修复失败"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          修复 {history.fixedCount}/{history.totalCount} 个问题
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{history.systemHealthBefore}%</span>
                        <span>→</span>
                        <span
                          className={
                            history.systemHealthAfter > history.systemHealthBefore
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {history.systemHealthAfter}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{formatDuration(history.duration)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onViewDetails(history)}>
                          详情
                        </Button>
                        {history.rollbackAvailable && (
                          <Button variant="outline" size="sm" onClick={() => onRollback(history)}>
                            <RotateCcw className="h-3 w-3 mr-1" />
                            回滚
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    暂无修复历史记录
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// 修复历史详情对话框
interface RepairHistoryDetailProps {
  history: RepairHistory | null
  isOpen: boolean
  onClose: () => void
  onRollback: (history: RepairHistory) => void
}

export function RepairHistoryDetail({ history, isOpen, onClose, onRollback }: RepairHistoryDetailProps) {
  if (!history) return null

  // 获取问题类型的中文名称
  const getProblemTypeName = (type: ProblemType): string => {
    switch (type) {
      case "framework":
        return "框架完整性"
      case "fileCompliance":
        return "文件合规性"
      case "interaction":
        return "交互流畅性"
      case "missingFeature":
        return "缺失功能"
      default:
        return "未知类型"
    }
  }

  // 格式化日期时间
  const formatDateTime = (date: Date) => {
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>修复历史详情</DialogTitle>
          <DialogDescription>
            {formatDateTime(history.timestamp)} · 修复 {history.fixedCount}/{history.totalCount} 个问题
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">系统健康度变化</div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{history.systemHealthBefore}%</span>
                <span>→</span>
                <span
                  className={
                    history.systemHealthAfter > history.systemHealthBefore
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {history.systemHealthAfter}%
                </span>
              </div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-sm font-medium mb-1">修复持续时间</div>
              <div>
                {Math.floor(history.duration / 60)}分{history.duration % 60}秒
              </div>
            </div>
          </div>

          <div className="text-sm font-medium mb-2">修复问题列表</div>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {history.problems.map((problem) => (
                <div
                  key={problem.id}
                  className={`p-3 rounded-md border ${
                    problem.status === "fixed"
                      ? "border-green-300 bg-green-50"
                      : problem.status === "failed"
                        ? "border-red-300 bg-red-50"
                        : ""
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-medium flex items-center">
                        {problem.name}
                        <Badge variant="outline" className="ml-2">
                          {getProblemTypeName(problem.type)}
                        </Badge>
                      </h4>
                      <p className="text-sm text-muted-foreground">{problem.description}</p>
                    </div>
                    <div>
                      {problem.status === "fixed" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          已修复
                        </Badge>
                      )}
                      {problem.status === "failed" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XCircle className="mr-1 h-3 w-3" />
                          失败
                        </Badge>
                      )}
                    </div>
                  </div>

                  {problem.status === "fixed" && problem.fixDescription && (
                    <div className="mt-2 text-sm bg-green-50 p-2 rounded border border-green-100">
                      <span className="font-medium">修复结果：</span> {problem.fixDescription}
                    </div>
                  )}

                  {problem.status === "failed" && problem.error && (
                    <div className="mt-2 text-sm bg-red-50 p-2 rounded border border-red-100">
                      <span className="font-medium">错误信息：</span> {problem.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            关闭
          </Button>
          {history.rollbackAvailable && (
            <Button variant="secondary" onClick={() => onRollback(history)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              回滚此次修复
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
