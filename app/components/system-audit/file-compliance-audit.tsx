import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, XCircle, ArrowRight } from "lucide-react"

type FileComplianceAuditProps = {
  results: {
    passed: number
    warnings: number
    failed: number
    total: number
  }
}

// 模拟文件合规性审查项目数据
const fileComplianceItems = [
  { id: 1, name: "组件命名规范", status: "passed", description: "组件命名符合项目规范" },
  { id: 2, name: "文件组织结构", status: "passed", description: "文件组织结构符合规范" },
  { id: 3, name: "代码格式化", status: "passed", description: "代码格式符合项目规范" },
  { id: 4, name: "ESLint规则遵循", status: "warning", description: "存在少量ESLint警告" },
  { id: 5, name: "TypeScript类型定义", status: "warning", description: "部分类型定义不完整" },
  { id: 6, name: "导入导出规范", status: "passed", description: "导入导出语句符合规范" },
  { id: 7, name: "注释完整性", status: "warning", description: "部分复杂函数缺少注释" },
  { id: 8, name: "环境变量配置", status: "failed", description: "缺少必要的环境变量定义" },
  // 更多项目...
]

export function FileComplianceAudit({ results }: FileComplianceAuditProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">文件合规性审查结果</h3>
        <p className="text-sm text-muted-foreground mb-4">
          审核代码是否符合项目规范和最佳实践，检查文件命名、组织结构是否一致
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
          {fileComplianceItems.map((item) => (
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
