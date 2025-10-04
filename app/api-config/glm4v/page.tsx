import type { Metadata } from "next"
import GLM4VDemo from "@/components/api-config/glm4v-demo"

export const metadata: Metadata = {
  title: "GLM-4V API集成",
  description: "智谱AI GLM-4V模型API集成演示",
}

export default function GLM4VPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">GLM-4V API集成</h1>
        <p className="text-muted-foreground">
          智谱AI的GLM-4V系列模型支持视觉语言特征的深度融合，可用于视觉问答、图像字幕、视觉定位、复杂目标检测等各类图像/视频理解任务。
        </p>
      </div>

      <div className="grid gap-6">
        <GLM4VDemo />
      </div>
    </div>
  )
}
