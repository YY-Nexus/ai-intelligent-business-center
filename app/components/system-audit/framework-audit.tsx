"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type FrameworkAuditProps = {
  results: {
    passed: number
    warnings: number
    failed: number
    total: number
  }
}

// 自定义您应用的框架审查项目
const frameworkItems = [
  { id: 1, name: "用户认证模块", status: "passed", description: "用户登录和认证功能正常" },
  { id: 2, name: "商品管理模块", status: "passed", description: "商品CRUD功能完整" },
  { id: 3, name: "订单处理流程", status: "warning", description: "订单取消功能存在潜在问题" },
  { id: 4, name: "支付集成", status: "passed", description: "支付网关集成正确" },
  { id: 5, name: "库存管理", status: "failed", description: "库存锁定机制缺失" },
  // 添加更多适合您应用的审查项
]

export function FrameworkAudit({ results }: FrameworkAuditProps) {
  const [items, setItems] = useState(frameworkItems)
  const [fixingItem, setFixingItem] = useState<(typeof frameworkItems)[0] | null>(null)
  const [isFixing, setIsFixing] = useState(false)

  // 修复问题的实际逻辑
  const fixIssue = async (item: (typeof frameworkItems)[0]) => {
    setIsFixing(true)

    try {
      // 这里实现实际的修复逻辑
      // 例如：调用API修复问题，更新配置等

      // 模拟修复过程
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 更新项目状态
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, status: "passed", description: `${i.name}问题已修复` } : i,
      )

      setItems(updatedItems)
      setFixingItem(null)
    } catch (error) {
      console.error("修复问题时出错:", error)
      // 处理错误情况
    } finally {
      setIsFixing(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">框架完整性审查结果</h3>
        <p className="text-sm text-muted-foreground mb-4">检查系统核心功能模块是否完整，各模块间衔接是否正常</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">状态</TableHead>
            <TableHead>审查项</TableHead>
            <TableHead className="hidden md:table-cell">描述</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.status === "passed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {item.status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                {item.status === "failed" && <XCircle className="h-5 w-5 text-red-500" />}
              </TableCell>
              <TableCell className="font-medium">
                {item.name}
                {item.status !== "passed" && (
                  <Badge variant={item.status === "warning" ? "outline" : "destructive"} className="ml-2">
                    {item.status === "warning" ? "警告" : "失败"}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">{item.description}</TableCell>
              <TableCell>
                {item.status !== "passed" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setFixingItem(item)}>
                        修复 <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>修复问题: {fixingItem?.name}</DialogTitle>
                        <DialogDescription>{fixingItem?.description}</DialogDescription>
                      </DialogHeader>

                      <div className="py-4">
                        <h4 className="font-medium mb-2">修复建议</h4>
                        {fixingItem?.status === "warning" && (
                          <p>检查订单取消流程中的状态转换逻辑，确保所有边缘情况都得到处理。</p>
                        )}
                        {fixingItem?.status === "failed" && (
                          <p>实现库存锁定机制，确保在下单过程中锁定相应库存，防止超卖情况。</p>
                        )}
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setFixingItem(null)}>
                          取消
                        </Button>
                        <Button onClick={() => fixingItem && fixIssue(fixingItem)} disabled={isFixing}>
                          {isFixing ? "修复中..." : "确认修复"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
