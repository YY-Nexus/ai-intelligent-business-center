import BatchRequestProcessor from "@/components/api-config/batch-request-processor"

export const metadata = {
  title: "批量请求处理器 | API OS",
  description: "批量处理多个API请求，提高工作效率",
}

export default function BatchProcessorPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">批量请求处理器</h1>
      <p className="text-muted-foreground mb-8">
        批量请求处理器允许您同时处理多个API请求，大大提高工作效率。您可以导入提示列表，
        设置并发请求数，并导出所有结果。这对于需要处理大量相似请求的场景非常有用。
      </p>

      <BatchRequestProcessor />
    </div>
  )
}
