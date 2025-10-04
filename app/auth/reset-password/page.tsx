import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "重置密码 | 首语云 API-OS",
  description: "重置您的账户密码",
}

interface ResetPasswordPageProps {
  searchParams: {
    token?: string
    email?: string
  }
}

export default function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token, email } = searchParams

  // 如果没有提供token或email，返回404页面
  if (!token || !email) {
    notFound()
  }

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">重置密码</h1>
        <p className="text-sm text-muted-foreground mt-1">
          为账号 <span className="font-medium">{email}</span> 设置新密码
        </p>
      </div>
      <ResetPasswordForm token={token} email={email} />
    </div>
  )
}
