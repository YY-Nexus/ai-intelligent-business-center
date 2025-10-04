"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarUpload } from "@/components/settings/avatar-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "姓名至少需要2个字符" }),
  username: z
    .string()
    .min(3, { message: "用户名至少需要3个字符" })
    .max(20, { message: "用户名最多20个字符" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "用户名只能包含字母、数字、下划线和连字符" }),
  email: z.string().email({ message: "请输入有效的电子邮箱地址" }),
  bio: z.string().max(500, { message: "个人简介不能超过500个字符" }).optional(),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" })
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url({ message: "请输入有效的网址" }).optional().or(z.literal("")),
  timezone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // 模拟用户数据
  const defaultValues: Partial<ProfileFormValues> = {
    name: "张三",
    username: "zhangsan",
    email: "zhangsan@example.com",
    bio: "这是我的个人简介，我是一名软件开发工程师。",
    phone: "13800138000",
    company: "科技有限公司",
    jobTitle: "高级开发工程师",
    location: "北京",
    website: "https://example.com",
    timezone: "Asia/Shanghai",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    try {
      // 模拟API请求
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("提交的个人资料数据:", data)

      toast({
        title: "个人资料已更新",
        description: "您的个人资料信息已成功保存。",
      })
    } catch (error) {
      console.error("更新个人资料失败:", error)
      toast({
        title: "更新失败",
        description: "无法更新个人资料，请稍后再试。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>个人头像</CardTitle>
          <CardDescription>上传您的个人头像，建议使用正方形图片以获得最佳效果</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarUpload />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>个人资料信息</CardTitle>
          <CardDescription>更新您的个人资料信息，这些信息可能会显示给其他用户</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的姓名" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您的真实姓名或昵称</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入用户名" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您的唯一用户名，用于登录和@提及</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>电子邮箱</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入电子邮箱" type="email" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您的主要联系邮箱</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机号码</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入手机号码" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>用于接收安全通知和验证码</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>公司</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入公司名称" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您所在的公司或组织</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>职位</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的职位" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您在公司或组织中的职位</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>所在地</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入您的所在地" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您的城市或地区</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>个人网站</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormDescription>您的个人网站或博客</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>时区</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择时区" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                          <SelectItem value="Asia/Hong_Kong">香港时间 (UTC+8)</SelectItem>
                          <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                          <SelectItem value="America/New_York">美国东部时间 (UTC-5/4)</SelectItem>
                          <SelectItem value="Europe/London">英国标准时间 (UTC+0/1)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>用于显示时间和日期</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>个人简介</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="请输入您的个人简介"
                        className="min-h-[120px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>简短介绍一下您自己（最多500个字符）</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  保存更改
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
