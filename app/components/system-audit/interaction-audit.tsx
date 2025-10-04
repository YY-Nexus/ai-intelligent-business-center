import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react"

type InteractionAuditProps = {
  results: {
    passed: number
    warnings: number
    failed: number
    total: number
  }
}

// 模拟交互流畅性审查项目数据
const interactionItems = [
  { id: 1, name: "页面导航流程", status: "passed", description: "页面间导航流畅无断点" },
  { id: 2, name: "表单提交流程", status: "passed", description: "表单提交流程完整" },
  { id: 3, name: "错误处理反馈", status: "passed", description: "错误处理和用户反馈完善" },
  { id: 4, name: "加载状态提示", status: "passed", description: "加载状态提示清晰" },
  { id: 5, name: "数据刷新机制", status: "warning", description: "部分页面数据刷新存在延迟" },
  { id: 6, name: "交互动画流畅度", status: "passed", description: "交互动画流畅自然" },
  { id: 7, name: "响应式交互适配", status: "passed", description: "响应式交互适配良好" },
  { id: 8, name: "状态保持一致性", status: "warning", description: "某些场景下状态保持不一致" },
  { id: 9, name: "用户操作撤销", status: "failed", description: "缺少关键操作的撤销功能" },
  // 更多项目...
]

export function InteractionAudit({ results }: InteractionAuditProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">交互流畅性审查结果</h3>
        <p className="text-sm text-muted-foreground mb-4">
          验证用户主要路径是否流畅，无断点或死角，检查页面间跳转是否正常
        </p>
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
          {interactionItems.map((item) => (
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
                  <Button variant="ghost" size="sm">
                    修复 <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
