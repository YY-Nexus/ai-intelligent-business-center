"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, FileText, Info, Code } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export function ChineseLlmServices() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("paddle")

  // 智谱AI API调用示例
  const zhipuPythonExample = `from zhipuai import ZhipuAI

# 初始化客户端
client = ZhipuAI(api_key="您的API Key")  # 替换为您的API Key

# 调用智谱AI模型
response = client.chat.completions.create(
    model="glm-4",  # 可选模型：glm-4, glm-3-turbo
    messages=[
        {"role": "system", "content": "你是一个有用的AI助手。"},
        {"role": "user", "content": "请介绍一下智谱AI。"}
    ],
    temperature=0.7,
    max_tokens=800
)

# 输出结果
print(response.choices[0].message.content)
`

  const zhipuJsExample = `import { ChatGLM } from 'chatglm.js';

// 初始化客户端
const chatGLM = new ChatGLM({
  apiKey: '您的API Key',  // 替换为您的API Key
});

// 调用智谱AI模型
async function callZhipuAI() {
  try {
    const response = await chatGLM.chat({
      model: 'glm-4',  // 可选模型：glm-4, glm-3-turbo
      messages: [
        { role: 'system', content: '你是一个有用的AI助手。' },
        { role: 'user', content: '请介绍一下智谱AI。' }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('API调用失败:', error);
  }
}

callZhipuAI();
`

  const zhipuCurlExample = `curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 您的API Key" \\
  -d '{
    "model": "glm-4",
    "messages": [
      {"role": "system", "content": "你是一个有用的AI助手。"},
      {"role": "user", "content": "请介绍一下智谱AI。"}
    ],
    "temperature": 0.7,
    "max_tokens": 800
  }'`

  // MiniMax API调用示例
  const minimaxPythonExample = `import requests
import json

# API配置
api_key = "您的API Key"  # 替换为您的API Key
group_id = "您的群组ID"   # 替换为您的群组ID
url = "https://api.minimax.chat/v1/text/chatcompletion_pro"

# 请求头
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

# 请求体
payload = {
    "model": "abab5.5-chat",  # 可选模型：abab5.5-chat, abab6-chat
    "messages": [
        {"sender_type": "USER", "text": "请介绍一下MiniMax。"}
    ],
    "reply_constraints": {
        "sender_type": "BOT"
    },
    "stream": False,
    "temperature": 0.7,
    "max_tokens": 800
}

# 发送请求
response = requests.post(
    f"{url}?GroupId={group_id}",
    headers=headers,
    data=json.dumps(payload)
)

# 输出结果
result = response.json()
print(result["reply"])
`

  const minimaxJsExample = `// 使用fetch API调用MiniMax
async function callMiniMax() {
  const API_KEY = "您的API Key";  // 替换为您的API Key
  const GROUP_ID = "您的群组ID";   // 替换为您的群组ID
  const url = \`https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=\${GROUP_ID}\`;
  
  const payload = {
    model: "abab5.5-chat",  // 可选模型：abab5.5-chat, abab6-chat
    messages: [
      {sender_type: "USER", text: "请介绍一下MiniMax。"}
    ],
    reply_constraints: {
      sender_type: "BOT"
    },
    stream: false,
    temperature: 0.7,
    max_tokens: 800
  };
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${API_KEY}\`
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    console.log(result.reply);
  } catch (error) {
    console.error("API调用失败:", error);
  }
}

callMiniMax();
`

  const minimaxCurlExample = `curl -X POST "https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=您的群组ID" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 您的API Key" \\
  -d '{
    "model": "abab5.5-chat",
    "messages": [
      {"sender_type": "USER", "text": "请介绍一下MiniMax。"}
    ],
    "reply_constraints": {
      "sender_type": "BOT"
    },
    "stream": false,
    "temperature": 0.7,
    "max_tokens": 800
  }'`

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制到剪贴板",
      description: message,
    })
  }

  // 飞桨星河社区API调用示例
  const paddlePythonExample = `from openai import OpenAI

# 初始化客户端
client = OpenAI(
    base_url="https://aistudio.baidu.com/llm/lmapi/v3",
    api_key="您的星河社区令牌(Access Token)"  # 替换为您的Access Token
)

# 调用大模型API
response = client.chat.completions.create(
    model="deepseek-r1",  # 指定使用deepseek-r1模型
    messages=[
        {"role": "system", "content": "你是一个有用的AI助手。"},
        {"role": "user", "content": "请介绍一下飞桨星河社区。"}
    ],
    temperature=0.7,
    max_tokens=800
)

# 输出结果
print(response.choices[0].message.content)
`

  const paddleJsExample = `import OpenAI from 'openai';

// 初始化客户端
const openai = new OpenAI({
  baseURL: 'https://aistudio.baidu.com/llm/lmapi/v3',
  apiKey: '您的星河社区令牌(Access Token)',  // 替换为您的Access Token
});

// 调用大模型API
async function callStarRiverAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-r1',  // 指定使用deepseek-r1模型
      messages: [
        { role: 'system', content: '你是一个有用的AI助手。' },
        { role: 'user', content: '请介绍一下飞桨星河社区。' }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('API调用失败:', error);
  }
}

callStarRiverAPI();
`

  const paddleNodeExample = `const { OpenAI } = require('openai');

// 初始化客户端
const openai = new OpenAI({
  baseURL: 'https://aistudio.baidu.com/llm/lmapi/v3',
  apiKey: '您的星河社区令牌(Access Token)',  // 替换为您的Access Token
});

// 调用大模型API
async function callStarRiverAPI() {
  try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-r1',  // 指定使用deepseek-r1模型
      messages: [
        { role: 'system', content: '你是一个有用的AI助手。' },
        { role: 'user', content: '请介绍一下飞桨星河社区。' }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('API调用失败:', error);
  }
}

callStarRiverAPI();
`

  const paddleJavaExample = `import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class StarRiverApiExample {
    public static void main(String[] args) {
        // 配置API服务
        String token = "您的星河社区令牌(Access Token)"; // 替换为您的Access Token
        
        // 创建OpenAI服务客户端，需要自定义baseUrl
        OpenAiService service = new OpenAiService(token);
        // 注意：Java SDK可能需要自定义实现来支持不同的baseUrl
        
        // 准备消息
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system", "你是一个有用的AI助手。"));
        messages.add(new ChatMessage("user", "请介绍一下飞桨星河社区。"));
        
        // 创建请求
        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model("deepseek-r1")
                .messages(messages)
                .temperature(0.7)
                .maxTokens(800)
                .build();
        
        // 发送请求并获取响应
        try {
            // 调用API
            // 注意：需要修改SDK或使用HTTP客户端直接调用
            System.out.println("响应内容: " + "API响应内容");
        } catch (Exception e) {
            System.err.println("API调用失败: " + e.getMessage());
        }
    }
}`

  const paddleCurlExample = `curl -X POST "https://aistudio.baidu.com/llm/lmapi/v3/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer 您的星河社区令牌(Access Token)" \\
  -d '{
    "model": "deepseek-r1",
    "messages": [
      {"role": "system", "content": "你是一个有用的AI助手。"},
      {"role": "user", "content": "请介绍一下飞桨星河社区。"}
    ],
    "temperature": 0.7,
    "max_tokens": 800
  }'`

  // 文心一言API调用示例
  const wxyPythonExample = `from wenxin_api import WenxinAPI

# 初始化客户端
wenxin = WenxinAPI(
    api_key="您的API Key",
    secret_key="您的Secret Key"
)

# 调用文心一言API
response = wenxin.chat_completion(
    messages=[
        {"role": "system", "content": "你是一个有用的AI助手。"},
        {"role": "user", "content": "请介绍一下文心一言。"}
    ],
    temperature=0.7,
    top_p=0.8,
    penalty_score=1.0
)

# 输出结果
print(response["result"])
`

  // 通义千问API调用示例
  const tyqwPythonExample = `from dashscope import Generation

# 调用通义千问API
response = Generation.call(
    model="qwen-max",
    prompt=[
        {"role": "system", "content": "你是一个有用的AI助手。"},
        {"role": "user", "content": "请介绍一下通义千问。"}
    ],
    api_key="您的API Key"  # 替换为您的API Key
)

# 输出结果
print(response.output.text)
`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">国内大模型API服务</h2>
        <p className="text-muted-foreground mt-2">
          针对地区限制问题，提供国内主流大模型API服务的调用方法，支持OpenAI兼容接口
        </p>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-md">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300">地区限制解决方案</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              由于地区限制，我们推荐使用飞桨星河社区提供的OpenAI兼容API服务。您可以直接使用原生的OpenAI
              SDK调用大模型服务，只需简单修改几个参数。
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="paddle">飞桨星河</TabsTrigger>
          <TabsTrigger value="zhipu">智谱AI</TabsTrigger>
          <TabsTrigger value="codegeex">CodeGeeX-4</TabsTrigger>
          <TabsTrigger value="minimax">MiniMax</TabsTrigger>
          <TabsTrigger value="wenxin">文心一言</TabsTrigger>
          <TabsTrigger value="tongyi">通义千问</TabsTrigger>
        </TabsList>

        <TabsContent value="paddle" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>飞桨星河社区 API</CardTitle>
                  <CardDescription>OpenAI兼容的API服务，支持直接使用OpenAI SDK</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  OpenAI兼容
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
                          copyToClipboard("https://aistudio.baidu.com/llm/lmapi/v3", "基础URL已复制到剪贴板")
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">
                      https://aistudio.baidu.com/llm/lmapi/v3
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard("deepseek-r1", "模型名称已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">deepseek-r1</code>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">认证方式</span>
                  </div>
                  <p className="text-sm mt-1">
                    使用星河社区的令牌(Access Token)作为API密钥，在API请求中设置为<code>api_key</code>参数
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <Tabs defaultValue="python" className="w-full">
                  <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                    <TabsTrigger value="java">Java</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{paddlePythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(paddlePythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{paddleJsExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(paddleJsExample, "JavaScript代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="nodejs" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{paddleNodeExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(paddleNodeExample, "Node.js代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="java" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{paddleJavaExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(paddleJavaExample, "Java代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{paddleCurlExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(paddleCurlExample, "cURL命令已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">支持的第三方工具集成</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Cursor</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">支持在Cursor中配置自定义API端点</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Dify</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">支持在Dify中配置为OpenAI兼容模型</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">LangChain</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">支持在LangChain中作为OpenAI兼容模型使用</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://aistudio.baidu.com/index" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问飞桨星河社区
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://aistudio.baidu.com/docs" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="wenxin" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>文心一言 API</CardTitle>
                  <CardDescription>百度文心大模型API服务</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  官方SDK
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">配置参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">API Key</span>
                    </div>
                    <p className="text-sm">需要在百度智能云平台申请API Key</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Secret Key</span>
                    </div>
                    <p className="text-sm">需要在百度智能云平台申请Secret Key</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <div className="relative">
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <pre className="p-4 text-sm">
                      <code>{wxyPythonExample}</code>
                    </pre>
                  </ScrollArea>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(wxyPythonExample, "Python代码已复制")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://cloud.baidu.com/product/wenxinworkshop" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问文心一言官网
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tongyi" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>通义千问 API</CardTitle>
                  <CardDescription>阿里云通义千问大模型API服务</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  官方SDK
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">配置参数</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">API Key</span>
                    </div>
                    <p className="text-sm">需要在阿里云灵积平台申请API Key</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">qwen-max</code>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <div className="relative">
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <pre className="p-4 text-sm">
                      <code>{tyqwPythonExample}</code>
                    </pre>
                  </ScrollArea>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(tyqwPythonExample, "Python代码已复制")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://tongyi.aliyun.com/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问通义千问官网
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://help.aliyun.com/document_detail/2400395.html" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="codegeex" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>CodeGeeX-4 API</CardTitle>
                  <CardDescription>智谱AI提供的专业代码生成和补全大模型</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  代码专精
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

              <div className="space-y-2">
                <h3 className="text-lg font-medium">主要特点</h3>
                <ul className="space-y-1 list-disc pl-5">
                  <li>专注于代码生成和补全的大模型</li>
                  <li>支持100多种编程语言</li>
                  <li>提供代码问答和智能代码补全功能</li>
                  <li>能够理解代码上下文，生成高质量可执行代码</li>
                  <li>支持同步、异步和流式调用方式</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/api-documentation/codegeex">
                  <Code className="mr-2 h-4 w-4" />
                  查看详细文档
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://open.bigmodel.cn/dev/api#codegeex-4" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="zhipu" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>智谱AI API</CardTitle>
                  <CardDescription>智谱AI提供的大语言模型API服务，包括GLM-4和GLM-3-Turbo等模型</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  官方SDK
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
                        onClick={() => copyToClipboard("https://open.bigmodel.cn/api/paas/v4", "基础URL已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">
                      https://open.bigmodel.cn/api/paas/v4
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard("glm-4, glm-3-turbo", "模型名称已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">glm-4, glm-3-turbo</code>
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
                <Tabs defaultValue="python" className="w-full">
                  <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{zhipuPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(zhipuPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{zhipuJsExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(zhipuJsExample, "JavaScript代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{zhipuCurlExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(zhipuCurlExample, "cURL命令已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">模型特点</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">GLM-4</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">
                        智谱AI最新的旗舰大模型，具有强大的理解能力、推理能力和创作能力，支持32K上下文窗口
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">GLM-3-Turbo</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">高性能、低成本的大模型，适合日常对话和创作任务，支持8K上下文窗口</p>
                    </CardContent>
                  </Card>
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
                <Link href="https://open.bigmodel.cn/dev/api" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="minimax" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>MiniMax API</CardTitle>
                  <CardDescription>MiniMax提供的大语言模型API服务，包括ABAB系列模型</CardDescription>
                </div>
                <Badge variant="outline" className="ml-2">
                  REST API
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
                        onClick={() => copyToClipboard("https://api.minimax.chat/v1/text", "基础URL已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">https://api.minimax.chat/v1/text</code>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">模型名称</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => copyToClipboard("abab5.5-chat, abab6-chat", "模型名称已复制到剪贴板")}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </Button>
                    </div>
                    <code className="bg-muted px-2 py-1 rounded text-sm block">abab5.5-chat, abab6-chat</code>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">认证方式</span>
                  </div>
                  <p className="text-sm mt-1">使用MiniMax开放平台的API Key和群组ID(GroupId)进行认证</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">代码示例</h3>
                <Tabs defaultValue="python" className="w-full">
                  <TabsList>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="python" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{minimaxPythonExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(minimaxPythonExample, "Python代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="javascript" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{minimaxJsExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(minimaxJsExample, "JavaScript代码已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="curl" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] w-full rounded-md border">
                        <pre className="p-4 text-sm">
                          <code>{minimaxCurlExample}</code>
                        </pre>
                      </ScrollArea>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(minimaxCurlExample, "cURL命令已复制")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">模型特点</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">ABAB6</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">
                        MiniMax最新的旗舰大模型，具有强大的多轮对话能力和创作能力，支持32K上下文窗口
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">ABAB5.5</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm">平衡性能和成本的大模型，适合日常对话和创作任务，支持16K上下文窗口</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="https://api.minimax.chat/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  访问MiniMax开放平台
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://api.minimax.chat/document/guides/chat-pro" target="_blank">
                  <FileText className="mr-2 h-4 w-4" />
                  查看官方文档
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
