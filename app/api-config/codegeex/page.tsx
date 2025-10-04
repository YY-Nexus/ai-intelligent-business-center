import type { Metadata } from "next"
import CodeGeeXDemo from "@/components/api-config/codegeex-demo"

export const metadata: Metadata = {
  title: "CodeGeeX-4 代码生成",
  description: "智谱AI CodeGeeX-4模型代码生成演示",
}

export default function CodeGeeXPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">CodeGeeX-4 代码生成</h1>
        <p className="text-muted-foreground">
          智谱AI的CodeGeeX-4模型适用于代码生成任务，能够根据自然语言描述生成高质量的代码，支持多种编程语言。
        </p>
      </div>

      <div className="grid gap-6">
        <CodeGeeXDemo />
      </div>
    </div>
  )
}
