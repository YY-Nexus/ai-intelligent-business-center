import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "登录 | 首语云 API-OS",
  description: "登录到首语云API管理与集成平台",
}

interface LoginPageProps {
  searchParams: {
    reset?: string
  }
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const resetSuccess = searchParams.reset === "success"

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">登录</h1>
        <p className="text-sm text-muted-foreground mt-1">输入您的账号信息以登录系统</p>
      </div>
      <LoginForm resetSuccess={resetSuccess} />
    </div>
  )
}
