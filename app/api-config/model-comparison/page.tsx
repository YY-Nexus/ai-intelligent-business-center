import ModelPerformanceComparison from "@/components/api-config/model-performance-comparison"

export const metadata = {
  title: "模型性能对比 | API OS",
  description: "比较不同飞桨星河模型在各种任务上的性能表现",
}

export default function ModelComparisonPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">模型性能对比</h1>
      <p className="text-muted-foreground mb-8">
        本工具可以帮助您比较不同飞桨星河模型在各种任务上的性能表现，包括响应时间、令牌使用量和输出质量。
        通过这些数据，您可以为不同的应用场景选择最合适的模型。
      </p>

      <ModelPerformanceComparison />
    </div>
  )
}
