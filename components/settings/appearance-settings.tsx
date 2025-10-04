"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth/auth-context"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "请选择主题模式",
  }),
  avatarColor: z.string().optional(),
  language: z.string({
    required_error: "请选择语言",
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export function AppearanceSettings() {
  const { toast } = useToast()
  const { user, updateUserSettings } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // 默认值
  const defaultValues: Partial<AppearanceFormValues> = {
    theme: user?.settings?.theme || "system",
    avatarColor: user?.settings?.avatarColor,
    language: user?.settings?.language || "zh-CN",
  }

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AppearanceFormValues) {
    setIsLoading(true)

    try {
      const success = await updateUserSettings(data)

      if (success) {
        toast({
          title: "外观设置已更新",
          description: "您的外观偏好设置已成功保存。",
        })
      } else {
        toast({
          title: "更新失败",
          description: "无法更新外观设置，请稍后再试。",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("更新外观设置失败:", error)
      toast({
        title: "更新失败",
        description: "发生错误，请稍后再试。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>外观设置</CardTitle>
        <CardDescription>自定义应用的外观和显示偏好</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>主题模式</FormLabel>
                  <FormDescription>选择您偏好的主题模式</FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <div className="border-2 rounded-md p-4 cursor-pointer hover:border-primary">
                            <div className="w-full h-10 rounded bg-[#f8fafc] mb-2"></div>
                            <span className="block w-full text-center">浅色</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <div className="border-2 rounded-md p-4 cursor-pointer hover:border-primary">
                            <div className="w-full h-10 rounded bg-[#1e293b] mb-2"></div>
                            <span className="block w-full text-center">深色</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="system" className="sr-only" />
                        </FormControl>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <div className="border-2 rounded-md p-4 cursor-pointer hover:border-primary">
                            <div className="w-full h-10 rounded bg-gradient-to-r from-[#f8fafc] to-[#1e293b] mb-2"></div>
                            <span className="block w-full text-center">跟随系统</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像颜色</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择头像背景颜色" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bg-red-500">红色</SelectItem>
                      <SelectItem value="bg-blue-500">蓝色</SelectItem>
                      <SelectItem value="bg-green-500">绿色</SelectItem>
                      <SelectItem value="bg-yellow-500">黄色</SelectItem>
                      <SelectItem value="bg-purple-500">紫色</SelectItem>
                      <SelectItem value="bg-pink-500">粉色</SelectItem>
                      <SelectItem value="bg-indigo-500">靛蓝</SelectItem>
                      <SelectItem value="bg-cyan-500">青色</SelectItem>
                      <SelectItem value="default">随机（默认）</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>选择您的头像背景颜色，或保留为随机</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>语言</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择语言" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="zh-CN">简体中文</SelectItem>
                      <SelectItem value="zh-TW">繁体中文</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="ja-JP">日本語</SelectItem>
                      <SelectItem value="ko-KR">한국어</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>选择应用界面语言</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              保存设置
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
