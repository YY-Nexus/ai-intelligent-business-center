import type { Metadata } from "next"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "忘记密码 | 首语云 API-OS",
  description: "重置您的首语云API管理与集成平台账号密码",
}

export default function ForgotPasswordPage() {
  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">忘记密码</h1>
        <p className="text-sm text-muted-foreground mt-1">输入您的电子邮箱，我们将发送密码重置链接</p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
