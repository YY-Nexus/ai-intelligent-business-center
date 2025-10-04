import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "注册 | 首语云 API-OS",
  description: "注册首语云API管理与集成平台账号",
}

export default function RegisterPage() {
  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">注册账号</h1>
        <p className="text-sm text-muted-foreground mt-1">创建您的账号以开始使用系统</p>
      </div>
      <RegisterForm />
    </div>
  )
}
