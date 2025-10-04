"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, FileText, Terminal, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function CodeGeexService() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("question")

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制到剪贴板",
      description: message,
    })
  }

  // 代码问答示例
  const questionPythonExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 调用CodeGeeX-4模型
response = client.chat.completions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[
        {
            "role": "system",
            "content": "你是一位智能编程助手，你叫CodeGeeX。你会为用户回答关于编程、代码、计算机方面的任何问题，并提供格式规范、可以执行、准确安全的代码，并在必要时提供详细的解释。"
        },
        {
            "role": "user",
            "content": "写一个快速排序函数"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 输出结果
print(response.choices[0].message.content)
`

  const questionStreamPythonExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 调用CodeGeeX-4模型（流式输出）
response = client.chat.completions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[
        {
            "role": "system",
            "content": "你是一位智能编程助手，你叫CodeGeeX。你会为用户回答关于编程、代码、计算机方面的任何问题，并提供格式规范、可以执行、准确安全的代码，并在必要时提供详细的解释。"
        },
        {
            "role": "user",
            "content": "写一个快速排序函数"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stream=True,  # 启用流式输出
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 处理流式输出
for chunk in response:
    print(chunk.choices[0].delta.content, end="")
`

  const questionAsyncPythonExample = `import time
from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 异步调用CodeGeeX-4模型
response = client.chat.asyncCompletions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[
        {
            "role": "system",
            "content": "你是一位智能编程助手，你叫CodeGeeX。你会为用户回答关于编程、代码、计算机方面的任何问题，并提供格式规范、可以执行、准确安全的代码，并在必要时提供详细的解释。"
        },
        {
            "role": "user",
            "content": "写一个快速排序函数"
        }
    ],
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 获取任务ID
task_id = response.id
print(f"任务ID: {task_id}")
print(f"任务状态: {response.task_status}")

# 轮询获取结果
task_status = response.task_status
get_cnt = 0
while task_status != 'SUCCESS' and task_status != 'FAILED' and get_cnt <= 40:
    # 查询任务结果
    result_response = client.chat.asyncCompletions.retrieve_completion_result(id=task_id)
    task_status = result_response.task_status
    print(f"当前状态: {task_status}")
    
    # 如果任务完成，打印结果
    if task_status == 'SUCCESS':
        print("任务完成，结果:")
        print(result_response.choices[0].message.content)
        break
    
    # 等待2秒后再次查询
    time.sleep(2)
    get_cnt += 1
`

  // 代码补全示例
  const completionPythonExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 调用CodeGeeX-4模型进行代码补全
response = client.chat.completions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[],  # 代码补全不需要消息历史
    extra={
        "target": {
            "path": "quick_sort.py",  # 文件路径
            "language": "Python",     # 编程语言
            "code_prefix": "def quick_sort(arr):\\n    ",  # 补全位置前的代码
            "code_suffix": ""         # 补全位置后的代码
        },
        "contexts": []  # 可以添加其他文件作为上下文
    },
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 输出补全结果
print(response.choices[0].message.content)
`

  const completionStreamPythonExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 调用CodeGeeX-4模型进行代码补全（流式输出）
response = client.chat.completions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[],  # 代码补全不需要消息历史
    extra={
        "target": {
            "path": "quick_sort.py",  # 文件路径
            "language": "Python",     # 编程语言
            "code_prefix": "def quick_sort(arr):\\n    ",  # 补全位置前的代码
            "code_suffix": ""         # 补全位置后的代码
        },
        "contexts": []  # 可以添加其他文件作为上下文
    },
    top_p=0.7,
    temperature=0.9,
    stream=True,  # 启用流式输出
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 处理流式输出
for chunk in response:
    if hasattr(chunk.choices[0].delta, 'content') and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
`

  const completionWithContextExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="YOUR_API_KEY")  # 替换为您的API Key

# 调用CodeGeeX-4模型进行代码补全（带上下文）
response = client.chat.completions.create(
    model="codegeex-4",  # 指定使用CodeGeeX-4模型
    messages=[],  # 代码补全不需要消息历史
    extra={
        "target": {
            "path": "sort_utils.py",  # 文件路径
            "language": "Python",     # 编程语言
            "code_prefix": "def quick_sort(arr):\\n    ",  # 补全位置前的代码
            "code_suffix": ""         # 补全位置后的代码
        },
        "contexts": [
            {
                "path": "utils.py",  # 上下文文件路径
                "code": "def swap(arr, i, j):\\n    arr[i], arr[j] = arr[j], arr[i]\\n\\ndef is_sorted(arr):\\n    return all(arr[i] <= arr[i+1] for i in range(len(arr)-1))"  # 上下文文件内容
            }
        ]
    },
    top_p=0.7,
    temperature=0.9,
    max_tokens=1024,
    stop=["<|endoftext|>", "<|user|>", "<|assistant|>", "<|observation|>"]
)

# 输出补全结果
print(response.choices[0].message.content)
`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">CodeGeeX-4 API服务</h2>
        <p className="text-muted-foreground mt-2">
          智谱AI提供的专业代码生成和补全大模型，支持代码问答和智能代码补全功能
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-md">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">CodeGeeX-4特点</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              CodeGeeX-4是一款专业的代码大模型，支持100多种编程语言，提供智能代码问答和精准代码补全功能，能够理解代码上下文，生成高质量、可执行的代码。
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="question">代码问答</TabsTrigger>
          <TabsTrigger value="completion">代码补全</TabsTrigger>
        </TabsList>

        <TabsContent value="question" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>代码问答 API</CardTitle>
                  <CardDescription>向CodeGeeX-4提问并获取代码解决方案</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  智谱AI
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">配置参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">基础URL</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() =>
                          copyToClipboard(
                            "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                            "基础URL已复制到剪贴板",
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">
                      https://open.bigmodel.cn/api/paas/v4/chat/completions
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard("codegeex-4", "模型名称已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">codegeex-4</code>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">认证方式</span>
                  </div>
                  <p className="text-sm mt-1">
                    使用智谱AI开放平台的API Key进行认证，在API请求中设置为<code>api_key</code>参数
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <Tabs defaultValue="sync" className="w-full">
                  <TabsList>
                    <TabsTrigger value="sync">同步调用</TabsTrigger>
                    <TabsTrigger value="stream">流式调用</TabsTrigger>
                    <TabsTrigger value="async">异步调用</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sync" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{questionPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(questionPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="stream" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{questionStreamPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(questionStreamPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="async" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{questionAsyncPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(questionAsyncPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">主要参数说明</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">messages</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          对话历史消息列表，包含system、user和assistant角色的消息，按照对话顺序排列
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">temperature</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          采样温度，控制输出的随机性，取值范围(0.0, 1.0)，值越大输出越随机创造性，值越小输出越稳定
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">top_p</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">核采样参数，取值范围(0.0, 1.0)，控制模型从概率分布的前top_p部分中采样</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">max_tokens</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">模型输出的最大token数量，最大值为32k，默认值为1024</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">stream</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          是否启用流式输出，设为true时模型将通过标准Event Stream逐块返回生成内容
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">stop</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">停止生成的标记列表，模型在生成这些标记时会停止生成</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://open.bigmodel.cn/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问智谱AI开放平台
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://open.bigmodel.cn/dev/api#codegeex-4" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="completion" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>代码补全 API</CardTitle>
                  <CardDescription>根据上下文自动补全代码片段</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  智谱AI
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">配置参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">基础URL</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() =>
                          copyToClipboard(
                            "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                            "基础URL已复制到剪贴板",
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">
                      https://open.bigmodel.cn/api/paas/v4/chat/completions
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard("codegeex-4", "模型名称已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">codegeex-4</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList>
                    <TabsTrigger value="basic">基本补全</TabsTrigger>
                    <TabsTrigger value="stream">流式补全</TabsTrigger>
                    <TabsTrigger value="context">带上下文补全</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{completionPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(completionPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="stream" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{completionStreamPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(completionStreamPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="context" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[400px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{completionWithContextExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(completionWithContextExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">补全参数说明</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">extra.target</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          补全目标配置，包含path（文件路径）、language（编程语言）、code_prefix（补全位置前的代码）和code_suffix（补全位置后的代码）
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">extra.contexts</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm">
                          附加代码文件上下文，可以提供多个相关文件作为上下文，每个文件包含path（文件路径）和code（代码内容）
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">支持的编程语言</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {[
                    "Python",
                    "JavaScript",
                    "TypeScript",
                    "Java",
                    "C",
                    "C++",
                    "C#",
                    "Go",
                    "Rust",
                    "PHP",
                    "Ruby",
                    "Swift",
                    "Kotlin",
                    "Scala",
                    "R",
                    "Shell",
                    "SQL",
                    "HTML",
                    "CSS",
                    "Markdown",
                    "JSON",
                    "YAML",
                    "XML",
                  ].map((lang) => (
                    <div key={lang} className="bg-muted/50 p-2 rounded-md text-center text-sm">
                      {lang}
                    </div>
                  ))}
                  <div className="bg-muted/50 p-2 rounded-md text-center text-sm">以及更多...</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://open.bigmodel.cn/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问智谱AI开放平台
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://open.bigmodel.cn/dev/api#codegeex-4" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-md">
        <div className="flex items-start">
          <Terminal className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300">代码补全最佳实践</h3>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">
              为了获得最佳的代码补全效果，建议提供足够的上下文信息，包括函数签名、相关导入和依赖文件。对于复杂项目，可以通过contexts参数提供相关文件作为上下文，帮助模型更好地理解代码结构和依赖关系。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
