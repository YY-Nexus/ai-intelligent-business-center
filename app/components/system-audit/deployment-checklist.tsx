"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// 部署前检查项
const deploymentCheckItems = [
  { id: "framework", label: "框架完整性审查已通过", description: "所有核心功能模块完整可用" },
  { id: "files", label: "文件合规性审查已通过", description: "代码符合规范，文件结构合理" },
  { id: "interaction", label: "交互流畅性审查已通过", description: "用户操作流程流畅无断点" },
  { id: "features", label: "缺失功能已补充完善", description: "所有必要功能已实现" },
  { id: "performance", label: "性能测试已通过", description: "系统在预期负载下性能良好" },
  { id: "security", label: "安全审查已通过", description: "系统安全防护措施完善" },
  { id: "browser", label: "浏览器兼容性已验证", description: "支持目标浏览器" },
  { id: "mobile", label: "移动设备适配已验证", description: "在移动设备上显示和功能正常" },
  { id: "backup", label: "数据备份已准备", description: "部署前数据已备份" },
  { id: "rollback", label: "回滚方案已准备", description: "出现问题时可快速回滚" },
]

export function DeploymentChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const progress = Math.round((checkedItems.length / deploymentCheckItems.length) * 100)

  const handleDeploy = () => {
    if (progress === 100) {
      alert("系统已通过所有检查，可以部署！")
      // 这里可以触发实际的部署流程
    } else {
      alert("请先完成所有检查项！")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>部署前检查清单</CardTitle>
        <CardDescription>确保系统在部署后能被用户正常使用</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">完成进度</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-4">
          {deploymentCheckItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-2">
              <Checkbox
                id={item.id}
                checked={checkedItems.includes(item.id)}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={item.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.label}
                </label>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={progress !== 100} onClick={handleDeploy}>
          部署系统
        </Button>
      </CardFooter>
    </Card>
  )
}
