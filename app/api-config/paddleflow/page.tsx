import PaddleFlowDemo from "@/components/api-config/paddleflow-demo"

export const metadata = {
  title: "飞桨星河API演示 | API OS",
  description: "使用飞桨星河社区提供的OpenAI兼容API服务进行对话",
}

export default function PaddleFlowPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">飞桨星河API演示</h1>
      <p className="text-muted-foreground mb-8">
        飞桨星河社区提供OpenAI兼容的API服务，开发者可以直接使用原生的OpenAI SDK来调用大模型服务，
        同时���持将大模型服务集成到任意第三方工具。
      </p>

      <PaddleFlowDemo />
    </div>
  )
}
