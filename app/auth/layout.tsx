import type { ReactNode } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-1 items-center justify-center">
        <main className="w-full max-w-md p-6 sm:p-8 md:p-10">
          <div className="flex flex-col items-center space-y-2 text-center mb-8">
            <div className="relative h-16 w-16 mb-2">
              <Image src="/images/yanyu-cloud-logo.png" alt="首语云标志" fill className="object-contain" priority />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">首语云 API-OS</h1>
            <p className="text-sm text-muted-foreground">API管理与集成平台</p>
          </div>
          <div className={cn("overflow-hidden rounded-lg border bg-background shadow-xl")}>{children}</div>
        </main>
      </div>
    </div>
  )
}
