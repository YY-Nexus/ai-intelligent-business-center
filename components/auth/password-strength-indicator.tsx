"use client"

import { cn } from "@/lib/utils"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  // 计算密码强度
  const getPasswordStrength = (password: string): number => {
    if (!password) return 0

    let strength = 0

    // 长度检查
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // 复杂性检查
    if (/[A-Z]/.test(password)) strength += 1 // 大写字母
    if (/[a-z]/.test(password)) strength += 1 // 小写字母
    if (/[0-9]/.test(password)) strength += 1 // 数字
    if (/[^A-Za-z0-9]/.test(password)) strength += 1 // 特殊字符

    // 最大强度为4
    return Math.min(4, strength)
  }

  const strength = getPasswordStrength(password)

  // 根据强度级别返回描述和颜色
  const getStrengthInfo = (strength: number) => {
    switch (strength) {
      case 0:
        return { text: "非常弱", color: "bg-destructive/70" }
      case 1:
        return { text: "弱", color: "bg-destructive" }
      case 2:
        return { text: "中等", color: "bg-yellow-500" }
      case 3:
        return { text: "强", color: "bg-green-500" }
      case 4:
        return { text: "非常强", color: "bg-green-600" }
      default:
        return { text: "", color: "bg-muted" }
    }
  }

  const { text, color } = getStrengthInfo(strength)

  // 如果没有密码，不显示指示器
  if (!password) {
    return null
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex h-2 w-full gap-1 rounded-full bg-muted">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={cn(
              "h-full w-1/4 rounded-full transition-all duration-300",
              level <= strength ? color : "bg-muted-foreground/20",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        密码强度: <span className="font-medium">{text}</span>
      </p>
    </div>
  )
}
