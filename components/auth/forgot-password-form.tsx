"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

const forgotPasswordSchema = z.object({
  email: z.string().email("请输入有效的电子邮箱地址"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)

    try {
      // 这里添加实际的密码重置逻辑
      console.log("重置密码邮箱:", data.email)

      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "重置链接已发送",
        description: "请检查您的邮箱以重置密码。",
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("发送重置链接失败:", error)
      toast({
        title: "发送失败",
        description: "发送重置链接时出现错误，请重试。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertDescription>
            我们已向 <strong>{form.getValues().email}</strong>{" "}
            发送了一封包含密码重置链接的电子邮件。请检查您的收件箱，并点击邮件中的链接重置密码。
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            没有收到邮件？请检查您的垃圾邮件文件夹，或
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => {
                setIsSubmitted(false)
                form.reset()
              }}
            >
              重新发送
            </Button>
          </p>
          <Link href="/auth/login">
            <Button variant="outline" className="mt-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回登录
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>电子邮箱</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="请输入您的电子邮箱"
                  {...field}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          发送重置链接
        </Button>

        <div className="text-center">
          <Link href="/auth/login" className="text-sm text-primary hover:underline">
            返回登录
          </Link>
        </div>
      </form>
    </Form>
  )
}
