import type { Metadata } from "next"
import CogViewDemo from "@/components/api-config/cogview-demo"

export const metadata: Metadata = {
  title: "CogView-3 图像生成",
  description: "智谱AI CogView-3模型图像生成演示",
}

export default function CogViewPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">CogView-3 图像生成</h1>
        <p className="text-muted-foreground">
          智谱AI的CogView-3模型适用于图像生成任务，通过对用户文字描述快速、精准的理解，让AI的图像表达更加精确和个性化。
        </p>
      </div>

      <div className="grid gap-6">
        <CogViewDemo />
      </div>
    </div>
  )
}
