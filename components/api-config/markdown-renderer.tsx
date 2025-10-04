"use client"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // 简单的Markdown解析函数
  const parseMarkdown = (markdown: string) => {
    // 将Markdown转换为HTML
    let html = markdown
      // 处理标题
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      // 处理粗体
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      // 处理斜体
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      // 处理代码块
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>')
      // 处理行内代码
      .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      // 处理链接
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
      // 处理列表
      .replace(/^\s*\*\s(.*$)/gim, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^\s*\d+\.\s(.*$)/gim, '<li class="ml-6 list-decimal">$1</li>')
      // 处理段落
      .replace(/^(?!<[h|l|p|u])(.*$)/gim, '<p class="mb-2">$1</p>')

    // 将连续的列表项包装在ul或ol中
    html = html.replace(/<li class="ml-6 list-disc">([\s\S]*?)(?=<(?!\/li|li)|$)/gim, '<ul class="my-2">$&</ul>')
    html = html.replace(/<li class="ml-6 list-decimal">([\s\S]*?)(?=<(?!\/li|li)|$)/gim, '<ol class="my-2">$&</ol>')

    return html
  }

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  )
}
