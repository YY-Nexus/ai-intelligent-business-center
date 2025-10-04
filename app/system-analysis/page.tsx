import { CompletionAnalysis } from "@/app/components/system-audit/completion-analysis"

export default function SystemAnalysisPage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">系统审查应用完成度分析</h1>
        <p className="text-muted-foreground">全面评估系统各模块的实现状态、功能完整性和潜在改进点</p>
      </div>

      <CompletionAnalysis />
    </div>
  )
}
