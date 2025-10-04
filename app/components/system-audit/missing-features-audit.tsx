import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, CheckCircle } from "lucide-react"

type MissingFeaturesAuditProps = {
  results: {
    identified: number
    implemented: number
    total: number
  }
}

// 模拟缺失功能项目数据
const missingFeatureItems = [
  {
    id: 1,
    name: "用户偏好设置",
    status: "identified",
    description: "允许用户自定义界面和通知偏好",
    priority: "高",
    effort: "中",
  },
  {
    id: 2,
    name: "批量操作功能",
    status: "identified",
    description: "支持多选项目进行批量操作",
    priority: "中",
    effort: "低",
  },
  {
    id: 3,
    name: "数据导出功能",
    status: "identified",
    description: "支持将数据导出为Excel或CSV格式",
    priority: "高",
    effort: "低",
  },
  {
    id: 4,
    name: "高级搜索筛选",
    status: "identified",
    description: "提供多条件组合的高级搜索功能",
    priority: "中",
    effort: "中",
  },
  {
    id: 5,
    name: "操作日志记录",
    status: "identified",
    description: "记录用户关键操作的日志功能",
    priority: "高",
    effort: "中",
  },
]

export function MissingFeaturesAudit({ results }: MissingFeaturesAuditProps) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">缺失功能审查结果</h3>
        <p className="text-sm text-muted-foreground mb-4">识别系统中缺失的功能点，并提供实现建议，确保系统功能完整</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">状态</TableHead>
            <TableHead>功能名称</TableHead>
            <TableHead className="hidden md:table-cell">描述</TableHead>
            <TableHead className="w-[80px]">优先级</TableHead>
            <TableHead className="w-[80px]">工作量</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missingFeatureItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.status === "implemented" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Badge variant="outline">待实现</Badge>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="hidden md:table-cell">{item.description}</TableCell>
              <TableCell>
                <Badge variant={item.priority === "高" ? "default" : item.priority === "中" ? "outline" : "secondary"}>
                  {item.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.effort}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-1 h-4 w-4" /> 实现
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
