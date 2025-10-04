"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Code, FileText, Layers, Lightbulb, Workflow } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SmartFixSuggestions() {
  const { toast } = useToast()
  const [fixingId, setFixingId] = useState<number | null>(null)
  const [fixedIds, setFixedIds] = useState<number[]>([])

  // 模拟智能修复建议数据
  const fixSuggestions = [
    {
      id: 1,
      issue: "CSRF防护缺失",
      category: "安全",
      icon: <Layers className="h-5 w-5" />,
      fixDescription: "添加CSRF令牌验证机制",
      codeSnippet: `// 在表单中添加CSRF令牌
<form>
  <input type="hidden" name="csrfToken" value={csrfToken} />
  {/* 其他表单字段 */}
</form>

// 在API路由中验证CSRF令牌
import { csrf } from 'lib/csrf';

export default csrf(async function handler(req, res) {
  // 处理请求
});`,
      difficulty: "简单",
      timeEstimate: "30分钟",
    },
    {
      id: 2,
      issue: "环境变量配置不完整",
      category: "配置",
      icon: <FileText className="h-5 w-5" />,
      fixDescription: "创建完整的环境变量模板和验证机制",
      codeSnippet: `// 创建环境变量验证函数
function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_API_URL',
    'JWT_SECRET',
    // 其他必要的环境变量
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      \`缺少必要的环境变量: \${missingEnvVars.join(', ')}\`
    );
  }
}

// 在应用启动时调用
validateEnv();`,
      difficulty: "中等",
      timeEstimate: "1小时",
    },
    {
      id: 3,
      issue: "错误处理不完善",
      category: "用户体验",
      icon: <Workflow className="h-5 w-5" />,
      fixDescription: "实现统一的错误处理机制",
      codeSnippet: `// 创建全局错误处理组件
export function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div className="error-container">
        <h2>出错了</h2>
        <p>很抱歉，发生了一个错误。请稍后再试。</p>
        <button onClick={() => setError(null)}>
          重试
        </button>
      </div>
    );
  }
  
  return (
    <ErrorContext.Provider value={{ setError }}>
      {children}
    </ErrorContext.Provider>
  );
}

// 在API请求中使用
try {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('请求失败');
  return await response.json();
} catch (error) {
  setError(error);
  // 显示友好的错误消息
}`,
      difficulty: "中等",
      timeEstimate: "2小时",
    },
    {
      id: 4,
      issue: "数据导出功能缺失",
      category: "功能",
      icon: <Code className="h-5 w-5" />,
      fixDescription: "添加数据导出功能",
      codeSnippet: `// 创建数据导出函数
function exportToCSV(data, filename) {
  const csvContent = 
    "data:text/csv;charset=utf-8," + 
    data.map(row => Object.values(row).join(",")).join("\\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", \`\${filename}.csv\`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 在组件中使用
<Button onClick={() => exportToCSV(data, "导出数据")}>
  导出为CSV
</Button>`,
      difficulty: "简单",
      timeEstimate: "1小时",
    },
  ]

  const handleFix = (id: number) => {
    setFixingId(id)

    // 模拟修复过程
    setTimeout(() => {
      setFixingId(null)
      setFixedIds([...fixedIds, id])

      toast({
        title: "修复成功",
        description: `已成功修复问题：${fixSuggestions.find((item) => item.id === id)?.issue}`,
      })
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>智能修复建议</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {fixSuggestions.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">{item.icon}</div>
                  <h3 className="text-lg font-semibold">{item.issue}</h3>
                </div>
                <Badge variant="outline">{item.category}</Badge>
              </div>

              <p className="mb-3">{item.fixDescription}</p>

              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md mb-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{item.codeSnippet}</code>
                </pre>
              </div>

              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    <span className="font-medium">难度：</span>
                    {item.difficulty}
                  </span>
                  <span className="text-sm">
                    <span className="font-medium">预计时间：</span>
                    {item.timeEstimate}
                  </span>
                </div>

                {fixedIds.includes(item.id) ? (
                  <Button variant="outline" className="bg-green-50" disabled>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    已修复
                  </Button>
                ) : (
                  <Button onClick={() => handleFix(item.id)} disabled={fixingId === item.id} variant="default">
                    {fixingId === item.id ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        修复中...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="mr-2 h-4 w-4" />
                        智能修复
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
