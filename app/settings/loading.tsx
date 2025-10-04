import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RefreshCw className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-lg text-muted-foreground">加载系统设置...</p>
    </div>
  )
}
