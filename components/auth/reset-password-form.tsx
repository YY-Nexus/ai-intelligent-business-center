"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PasswordStrengthIndicator } from "@/components/auth/password-strength-indicator"

interface ResetPasswordFormProps {
  token: string
  email: string
}

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "密码至少需要8个字符")
      .regex(/[A-Z]/, "密码需要包含至少一个大写字母")
      .regex(/[a-z]/, "密码需要包含至少一个小写字母")
      .regex(/[0-9]/, "密码需要包含至少一个数字")
      .regex(/[^A-Za-z0-9]/, "密码需要包含至少一个特殊字符"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // 验证令牌有效性
  useEffect(() => {
    const verifyToken = async () => {
      try {
        // 这里应该是实际的API调用来验证令牌
        // const response = await fetch(`/api/auth/verify-reset-token?token=${token}&email=${email}`);
        // const data = await response.json();

        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const isValid = true // 假设令牌有效

        if (isValid) {
          setIsTokenValid(true)
        } else {
          setError("密码重置链接无效或已过期，请重新申请")
        }
      } catch (err) {
        console.error("验证令牌失败:", err)
        setError("验证重置链接时出错，请稍后重试")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [token, email])

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // 这里应该是实际的API调用来重置密码
      // const response = await fetch("/api/auth/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ token, email, password: data.password }),
      // });
      // const result = await response.json();

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "密码已重置",
        description: "您的密码已成功重置，请使用新密码登录",
      })

      // 重定向到登录页面，并带上成功参数
      router.push("/auth/login?reset=success")
    } catch (err) {
      console.error("重置密码失败:", err)
      setError("重置密码失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">正在验证重置链接...</p>
      </div>
    )
  }

  if (!isTokenValid) {
    return (
      <Alert variant="destructive">
        <AlertTitle>链接无效</AlertTitle>
        <AlertDescription>
          {error || "密码重置链接无效或已过期"}
          <div className="mt-4">
            <Button variant="outline" onClick={() => router.push("/auth/forgot-password")}>
              重新申请密码重置
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>新密码</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入新密码"
                    {...field}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "隐藏密码" : "显示密码"}</span>
                  </Button>
                </div>
              </FormControl>
              <PasswordStrengthIndicator password={field.value} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>确认新密码</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入新密码"
                    {...field}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showConfirmPassword ? "隐藏密码" : "显示密码"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          重置密码
        </Button>
      </form>
    </Form>
  )
}
