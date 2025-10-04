"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import type { Change } from "@/lib/models/impact-analysis-types"
import { useChangeOperations } from "@/lib/hooks/use-impact-analysis"
import { X, Plus } from "lucide-react"

// 表单验证模式
const formSchema = z.object({
  type: z.enum(["add", "modify", "remove"], {
    required_error: "请选择变更类型",
  }),
  path: z.string().min(1, "API路径不能为空"),
  description: z.string().min(1, "描述不能为空"),
  impactLevel: z.enum(["high", "medium", "low"], {
    required_error: "请选择影响级别",
  }),
  dependencies: z.array(z.string()).min(1, "至少需要一个依赖服务"),
  author: z.string().min(1, "作者不能为空"),
  date: z.string().min(1, "日期不能为空"),
})

type FormValues = z.infer<typeof formSchema>

interface ChangeFormProps {
  change?: Change
  onSuccess?: (change: Change) => void
  onCancel?: () => void
}

export function ChangeForm({ change, onSuccess, onCancel }: ChangeFormProps) {
  const [dependencies, setDependencies] = useState<string[]>(change?.dependencies || [])
  const [newDependency, setNewDependency] = useState("")
  const { create, update } = useChangeOperations()

  // 默认值
  const defaultValues: Partial<FormValues> = {
    type: change?.type || "add",
    path: change?.path || "",
    description: change?.description || "",
    impactLevel: change?.impactLevel || "medium",
    dependencies: change?.dependencies || [],
    author: change?.author || "",
    date: change?.date || new Date().toISOString().split("T")[0],
  }

  // 初始化表单
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // 添加依赖
  const addDependency = () => {
    if (newDependency.trim() === "") return

    if (!dependencies.includes(newDependency)) {
      const newDependencies = [...dependencies, newDependency]
      setDependencies(newDependencies)
      form.setValue("dependencies", newDependencies)
    }

    setNewDependency("")
  }

  // 移除依赖
  const removeDependency = (index: number) => {
    const newDependencies = dependencies.filter((_, i) => i !== index)
    setDependencies(newDependencies)
    form.setValue("dependencies", newDependencies)
  }

  // 提交表单
  const onSubmit = async (values: FormValues) => {
    try {
      let result: Change

      if (change) {
        // 更新现有变更
        result = await update(change.id, values)
        toast({
          title: "变更已更新",
          description: "变更信息已成功更新",
        })
      } else {
        // 创建新变更
        result = await create(values)
        toast({
          title: "变更已创建",
          description: "新的变更已成功创建",
        })
      }

      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error("保存变更失败:", error)
      toast({
        title: "保存失败",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>变更类型</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择变更类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="add">新增</SelectItem>
                    <SelectItem value="modify">修改</SelectItem>
                    <SelectItem value="remove">移除</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>API的变更类型</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="impactLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>影响级别</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择影响级别" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>变更的影响程度</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="path"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API路径</FormLabel>
                <FormControl>
                  <Input placeholder="/api/example" {...field} />
                </FormControl>
                <FormDescription>API的完整路径</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作者</FormLabel>
                <FormControl>
                  <Input placeholder="张三" {...field} />
                </FormControl>
                <FormDescription>变更的提交者</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>日期</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>变更的提交日期</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea placeholder="详细描述此次变更的内容和目的..." {...field} />
              </FormControl>
              <FormDescription>变更的详细描述</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dependencies"
          render={() => (
            <FormItem>
              <FormLabel>依赖服务</FormLabel>
              <div className="flex space-x-2">
                <FormControl>
                  <Input
                    placeholder="添加依赖服务..."
                    value={newDependency}
                    onChange={(e) => setNewDependency(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addDependency()
                      }
                    }}
                  />
                </FormControl>
                <Button type="button" onClick={addDependency} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {dependencies.map((dep, index) => (
                  <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-md text-sm">
                    <span>{dep}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 ml-1"
                      onClick={() => removeDependency(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <FormDescription>受此变更影响的服务</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
          )}
          <Button type="submit">{change ? "更新变更" : "创建变更"}</Button>
        </div>
      </form>
    </Form>
  )
}
