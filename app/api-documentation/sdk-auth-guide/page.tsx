"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Copy, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function SDKAuthGuidePage() {
  const { toast } = useToast()
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied({ ...copied, [key]: true })
    toast({
      title: "已复制到剪贴板",
      description: "代码已成功复制到剪贴板",
    })
    setTimeout(() => {
      setCopied({ ...copied, [key]: false })
    }, 2000)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">ZhiPu AI SDK与HTTP接口集成指南</h1>
      <p className="text-lg text-muted-foreground">了解如何通过SDK和HTTP请求调用智谱AI接口</p>

      <Card>
        <CardHeader>
          <CardTitle>API 鉴权概述</CardTitle>
          <CardDescription>我们的所有 API 使用 API Key 进行身份验证</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            您可以访问智谱AI开放平台的 API Keys 页面查找您将在请求中使用的 API Key。
            本版本对鉴权方式进行了升级，历史已接入平台的用户可继续沿用老版本的鉴权方式。
            新版本的鉴权方法可参考以下详细描述。
          </p>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>安全提示</AlertTitle>
            <AlertDescription>
              请注意保护您的密钥信息！不要与他人共享或在任何客户端代码（浏览器、应用程序）中公开您的 API Key。 如您的
              API Key 存在泄露风险，您可以通过删除该密钥来保护您的账户安全。
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>调用方式概览</CardTitle>
          <CardDescription>平台提供了同步、异步、SSE三种调用方式</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">同步调用</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">调用后即可一次性获得最终结果，适合处理较短的请求。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">异步调用</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">调用后立即返回任务ID，需要用任务ID查询调用结果，适合长时间运行的任务。</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">流式调用</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">调用后可以流式实时获取结果直到结束，适合需要即时反馈的场景。</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="sdk">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sdk">SDK调用</TabsTrigger>
          <TabsTrigger value="http">HTTP调用</TabsTrigger>
        </TabsList>

        <TabsContent value="sdk" className="space-y-6">
          <Tabs defaultValue="python">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="python">Python SDK</TabsTrigger>
              <TabsTrigger value="java">Java SDK</TabsTrigger>
            </TabsList>

            <TabsContent value="python" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Python SDK 创建 Client</CardTitle>
                  <CardDescription>
                    我们已经将接口鉴权封装到 SDK，您只需按照 SDK 调用示例填写 API Key 即可
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`from zhipuai import ZhipuAI

client = ZhipuAI(api_key="")  # 请填写您自己的API Key`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'from zhipuai import ZhipuAI\n\nclient = ZhipuAI(api_key="")  # 请填写您自己的API Key',
                          "py-client",
                        )
                      }
                    >
                      {copied["py-client"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>同步调用</CardTitle>
                  <CardDescription>调用后即可一次性获得最终结果</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # 填写您自己的APIKey
response = client.chat.completions.create(
    model="glm-4-0520",  # 填写需要调用的模型编码
    messages=[
        {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的slogan"},
        {"role": "assistant", "content": "当然，为了创作一个吸引人的slogan，请告诉我一些关于您产品的信息"},
        {"role": "user", "content": "智谱AI开放平台"},
        {"role": "assistant", "content": "智启未来，谱绘无限一智谱AI，让创新触手可及!"},
        {"role": "user", "content": "创造一个更精准、吸引人的slogan"}
    ],
)
print(response.choices[0].message)`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'from zhipuai import ZhipuAI\nclient = ZhipuAI(api_key="") # 填写您自己的APIKey\nresponse = client.chat.completions.create(\n    model="glm-4-0520",  # 填写需要调用的模型编码\n    messages=[\n        {"role": "user", "content": "作为一名营销专家，请为我的产品创作一个吸引人的slogan"},\n        {"role": "assistant", "content": "当然，为了创作一个吸引人的slogan，请告诉我一些关于您产品的信息"},\n        {"role": "user", "content": "智谱AI开放平台"},\n        {"role": "assistant", "content": "智启未来，谱绘无限一智谱AI，让创新触手可及!"},\n        {"role": "user", "content": "创造一个更精准、吸引人的slogan"}\n    ],\n)\nprint(response.choices[0].message)',
                          "py-sync",
                        )
                      }
                    >
                      {copied["py-sync"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>异步调用</CardTitle>
                  <CardDescription>调用后会立即返回一个任务ID，然后用任务ID查询调用结果</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`from zhipuai import ZhipuAI
 
client = ZhipuAI(api_key="") # 请填写您自己的APIKey
response = client.chat.asyncCompletions.create(
    model="glm-4-0520",  # 填写需要调用的模型编码
    messages=[
        {
            "role": "user",
            "content": "请你作为童话故事大王，写一篇短篇童话故事，故事的主题是要永远保持一颗善良的心，要能够激发儿童的学习兴趣和想象力，同时也能够帮助儿童更好地理解和接受故事中所蕴含的道理和价值观。"
        }
    ],
)
print(response)`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'from zhipuai import ZhipuAI\n \nclient = ZhipuAI(api_key="") # 请填写您自己的APIKey\nresponse = client.chat.asyncCompletions.create(\n    model="glm-4-0520",  # 填写需要调用的模型编码\n    messages=[\n        {\n            "role": "user",\n            "content": "请你作为童话故事大王，写一篇短篇童话故事，故事的主题是要永远保持一颗善良的心，要能够激发儿童的学习兴趣和想象力，同时也能够帮助儿童更好地理解和接受故事中所蕴含的道理和价值观。"\n        }\n    ],\n)\nprint(response)',
                          "py-async",
                        )
                      }
                    >
                      {copied["py-async"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>流式调用</CardTitle>
                  <CardDescription>调用后可以流式的实时获取到结果直到结束</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`from zhipuai import ZhipuAI
client = ZhipuAI(api_key="") # 请填写您自己的APIKey
response = client.chat.completions.create(
    model="glm-4-0520",  # 填写需要调用的模型编码
    messages=[
        {"role": "system", "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。"},
        {"role": "user", "content": "我对太阳系的行星非常感兴趣，特别是土星。请提供关于土星的基本信息，包括其大小、组成、环系统和任何独特的天文现象。"},
    ],
    stream=True,
)
for chunk in response:
    print(chunk.choices[0].delta)`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'from zhipuai import ZhipuAI\nclient = ZhipuAI(api_key="") # 请填写您自己的APIKey\nresponse = client.chat.completions.create(\n    model="glm-4-0520",  # 填写需要调用的模型编码\n    messages=[\n        {"role": "system", "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。"},\n        {"role": "user", "content": "我对太阳系的行星非常感兴趣，特别是土星。请提供关于土星的基本信息，包括其大小、组成、环系统和任何独特的天文现象。"},\n    ],\n    stream=True,\n)\nfor chunk in response:\n    print(chunk.choices[0].delta)',
                          "py-stream",
                        )
                      }
                    >
                      {copied["py-stream"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="java" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Java SDK 创建 Client</CardTitle>
                  <CardDescription>使用 Java SDK 您替换自己的 ApiSecretKey 即可</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`ClientV4 client = new ClientV4.Builder("{Your ApiSecretKey}").build();`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'ClientV4 client = new ClientV4.Builder("{Your ApiSecretKey}").build();',
                          "java-client",
                        )
                      }
                    >
                      {copied["java-client"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    传输层默认使用 okhttpclient，如果需要修改为其他 http client，可以如下指定（注意 apache 不支持 sse
                    调用）：
                  </p>
                  <div className="relative mt-2">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`ClientV4 client = new ClientV4.Builder("{Your ApiSecretKey}")
                  .httpTransport(new ApacheHttpClientTransport())
                  .build();`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          'ClientV4 client = new ClientV4.Builder("{Your ApiSecretKey}")\n                  .httpTransport(new ApacheHttpClientTransport())\n                  .build();',
                          "java-client-config",
                        )
                      }
                    >
                      {copied["java-client-config"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>同步调用</CardTitle>
                  <CardDescription>Java 同步调用示例</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`/**
* 同步调用
*/
private static void testInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.FALSE)
           .invokeMethod(Constants.invokeMethod)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
   try {
       System.out.println("model output:" + mapper.writeValueAsString(invokeModelApiResp));
   } catch (JsonProcessingException e) {
       e.printStackTrace();
   }
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          '/**\n* 同步调用\n*/\nprivate static void testInvoke() {\n   List<ChatMessage> messages = new ArrayList<>();\n   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");\n   messages.add(chatMessage);\n   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());\n   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()\n           .model(Constants.ModelChatGLM4)\n           .stream(Boolean.FALSE)\n           .invokeMethod(Constants.invokeMethod)\n           .messages(messages)\n           .requestId(requestId)\n           .build();\n   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);\n   try {\n       System.out.println("model output:" + mapper.writeValueAsString(invokeModelApiResp));\n   } catch (JsonProcessingException e) {\n       e.printStackTrace();\n   }\n}',
                          "java-sync",
                        )
                      }
                    >
                      {copied["java-sync"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>异步调用</CardTitle>
                  <CardDescription>Java 异步调用示例</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`/**
* 异步调用
*/
private static String testAsyncInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
   
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.FALSE)
           .invokeMethod(Constants.invokeMethodAsync)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
   System.out.println("model output:" + JSON.toJSONString(invokeModelApiResp));
   return invokeModelApiResp.getData().getTaskId();
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          '/**\n* 异步调用\n*/\nprivate static String testAsyncInvoke() {\n   List<ChatMessage> messages = new ArrayList<>();\n   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");\n   messages.add(chatMessage);\n   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());\n   \n   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()\n           .model(Constants.ModelChatGLM4)\n           .stream(Boolean.FALSE)\n           .invokeMethod(Constants.invokeMethodAsync)\n           .messages(messages)\n           .requestId(requestId)\n           .build();\n   ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);\n   System.out.println("model output:" + JSON.toJSONString(invokeModelApiResp));\n   return invokeModelApiResp.getData().getTaskId();\n}',
                          "java-async",
                        )
                      }
                    >
                      {copied["java-async"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>流式调用</CardTitle>
                  <CardDescription>Java 流式调用示例</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code className="text-sm">{`/**
* sse调用
*/
private static void testSseInvoke() {
   List<ChatMessage> messages = new ArrayList<>();
   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");
   messages.add(chatMessage);
   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());
 
   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
           .model(Constants.ModelChatGLM4)
           .stream(Boolean.TRUE)
           .messages(messages)
           .requestId(requestId)
           .build();
   ModelApiResponse sseModelApiResp = client.invokeModelApi(chatCompletionRequest);
   if (sseModelApiResp.isSuccess()) {
       AtomicBoolean isFirst = new AtomicBoolean(true);
       ChatMessageAccumulator chatMessageAccumulator = mapStreamToAccumulator(sseModelApiResp.getFlowable())
               .doOnNext(accumulator -> {
                   {
                       if (isFirst.getAndSet(false)) {
                           System.out.print("Response: ");
                       }
                       if (accumulator.getDelta() != null && accumulator.getDelta().getTool_calls() != null) {
                           String jsonString = mapper.writeValueAsString(accumulator.getDelta().getTool_calls());
                           System.out.println("tool_calls: " + jsonString);
                       }
                       if (accumulator.getDelta() != null && accumulator.getDelta().getContent() != null) {
                           System.out.print(accumulator.getDelta().getContent());
                       }
                   }
               })
               .doOnComplete(System.out::println)
               .lastElement()
               .blockingGet();
 
       Choice choice = new Choice(chatMessageAccumulator.getChoice().getFinishReason(), 0L, chatMessageAccumulator.getDelta());
       List<Choice> choices = new ArrayList<>();
       choices.add(choice);
       ModelData data = new ModelData();
       data.setChoices(choices);
       data.setUsage(chatMessageAccumulator.getUsage());
       data.setId(chatMessageAccumulator.getId());
       data.setCreated(chatMessageAccumulator.getCreated());
       data.setRequestId(chatCompletionRequest.getRequestId());
       sseModelApiResp.setFlowable(null);
       sseModelApiResp.setData(data);
   }
   System.out.println("model output:" + JSON.toJSONString(sseModelApiResp));
}`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        copyToClipboard(
                          '/**\n* sse调用\n*/\nprivate static void testSseInvoke() {\n   List<ChatMessage> messages = new ArrayList<>();\n   ChatMessage chatMessage = new ChatMessage(ChatMessageRole.USER.value(), "作为一名营销专家，请为智谱开放平台创作一个吸引人的slogan");\n   messages.add(chatMessage);\n   String requestId = String.format("YourRequestId-d%", System.currentTimeMillis());\n \n   ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()\n           .model(Constants.ModelChatGLM4)\n           .stream(Boolean.TRUE)\n           .messages(messages)\n           .requestId(requestId)\n           .build();\n   ModelApiResponse sseModelApiResp = client.invokeModelApi(chatCompletionRequest);\n   if (sseModelApiResp.isSuccess()) {\n       AtomicBoolean isFirst = new AtomicBoolean(true);\n       ChatMessageAccumulator chatMessageAccumulator = mapStreamToAccumulator(sseModelApiResp.getFlowable())\n               .doOnNext(accumulator -> {\n                   {\n                       if (isFirst.getAndSet(false)) {\n                           System.out.print("Response: ");\n                       }\n                       if (accumulator.getDelta() != null && accumulator.getDelta().getTool_calls() != null) {\n                           String jsonString = mapper.writeValueAsString(accumulator.getDelta().getTool_calls());\n                           System.out.println("tool_calls: " + jsonString);\n                       }\n                       if (accumulator.getDelta() != null && accumulator.getDelta().getContent() != null) {\n                           System.out.print(accumulator.getDelta().getContent());\n                       }\n                   }\n               })\n               .doOnComplete(System.out::println)\n               .lastElement()\n               .blockingGet();\n \n       Choice choice = new Choice(chatMessageAccumulator.getChoice().getFinishReason(), 0L, chatMessageAccumulator.getDelta());\n       List<Choice> choices = new ArrayList<>();\n       choices.add(choice);\n       ModelData data = new ModelData();\n       data.setChoices(choices);\n       data.setUsage(chatMessageAccumulator.getUsage());\n       data.setId(chatMessageAccumulator.getId());\n       data.setCreated(chatMessageAccumulator.getCreated());\n       data.setRequestId(chatCompletionRequest.getRequestId());\n       sseModelApiResp.setFlowable(null);\n       sseModelApiResp.setData(data);\n   }\n   System.out.println("model output:" + JSON.toJSONString(sseModelApiResp));\n}',
                          "java-stream",
                        )
                      }
                    >
                      {copied["java-stream"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="http" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HTTP 用户鉴权</CardTitle>
              <CardDescription>在调用模型接口时，支持两种鉴权方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>传 API Key 进行认证</li>
                <li>传鉴权 token 进行认证</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                说明：当前平台鉴权 token 由用户端生成，鉴权 token 生成采用标准 JWT 中提供的创建方法生成（详细参考：
                <a
                  href="https://jwt.io/introduction"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                  rel="noreferrer"
                >
                  https://jwt.io/introduction
                </a>
                ）。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>获取您的 API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <p>登录到智谱AI开放平台 API Keys 页面获取最新版生成的用户 API Key。</p>
              <p className="mt-2">
                新版机制中平台颁发的 API Key 同时包含 "用户标识 id" 和 "签名密钥 secret"，即格式为 {"{id}.{secret}"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用 API Key 进行请求</CardTitle>
              <CardDescription>用户需要将 API Key 放入 HTTP 的 Authorization header 头中</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">curl请求中的apikey参数示例：</p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">{`curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \\
--header 'Authorization: Bearer <你的apikey>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "glm-4",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
}'`}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    copyToClipboard(
                      `curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \\
--header 'Authorization: Bearer <你的apikey>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "glm-4",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
}'`,
                      "curl-apikey",
                    )
                  }
                >
                  {copied["curl-apikey"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>使用 JWT 组装 Token 后进行请求</CardTitle>
              <CardDescription>
                用户端需引入对应 JWT 相关工具类，并按以下方式组装 JWT 中 header、payload 部分
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1、header 具体示例</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">{`{"alg":"HS256","sign_type":"SIGN"}`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard('{"alg":"HS256","sign_type":"SIGN"}', "jwt-header")}
                  >
                    {copied["jwt-header"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>alg : 属性表示签名使用的算法，默认为 HMAC SHA256（写为HS256）</li>
                  <li>sign_type : 属性表示令牌的类型，JWT 令牌统一写为 SIGN</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">2、payload 具体示例</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">{`{"api_key":{ApiKey.id},"exp":1682503829130, "timestamp":1682503820130}`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        '{"api_key":{ApiKey.id},"exp":1682503829130, "timestamp":1682503820130}',
                        "jwt-payload",
                      )
                    }
                  >
                    {copied["jwt-payload"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>api_key : 属性表示用户标识 id，即用户API Key的{"{id}"}部分</li>
                  <li>exp : 属性表示生成的JWT的过期时间，客户端控制，单位为毫秒</li>
                  <li>timestamp : 属性表示当前时间戳，单位为毫秒</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Python 语言中的鉴权 token 组装过程</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">{`import time
import jwt
 
def generate_token(apikey: str, exp_seconds: int):
    try:
        id, secret = apikey.split(".")
    except Exception as e:
        raise Exception("invalid apikey", e)
 
    payload = {
        "api_key": id,
        "exp": int(round(time.time() * 1000)) + exp_seconds * 1000,
        "timestamp": int(round(time.time() * 1000)),
    }
 
    return jwt.encode(
        payload,
        secret,
        algorithm="HS256",
        headers={"alg": "HS256", "sign_type": "SIGN"},
    )`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `import time
import jwt
 
def generate_token(apikey: str, exp_seconds: int):
    try:
        id, secret = apikey.split(".")
    except Exception as e:
        raise Exception("invalid apikey", e)
 
    payload = {
        "api_key": id,
        "exp": int(round(time.time() * 1000)) + exp_seconds * 1000,
        "timestamp": int(round(time.time() * 1000)),
    }
 
    return jwt.encode(
        payload,
        secret,
        algorithm="HS256",
        headers={"alg": "HS256", "sign_type": "SIGN"},
    )`,
                        "python-jwt",
                      )
                    }
                  >
                    {copied["python-jwt"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">3、将鉴权 token 放入 HTTP 请求的 header 中</h3>
                <p className="mb-2">用户需要将生成的鉴权 token 放入 HTTP 的 Authorization header 头中：</p>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm">Authorization: 鉴权token</code>
                </pre>
                <p className="mt-4 mb-2">Curl请求中的token参数示例：</p>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code className="text-sm">{`curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \\
--header 'Authorization: Bearer <你的token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "glm-4",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
}'`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `curl --location 'https://open.bigmodel.cn/api/paas/v4/chat/completions' \\
--header 'Authorization: Bearer <你的token>' \\
--header 'Content-Type: application/json' \\
--data '{
    "model": "glm-4",
    "messages": [
        {
            "role": "user",
            "content": "你好"
        }
    ]
}'`,
                        "curl-token",
                      )
                    }
                  >
                    {copied["curl-token"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Node.js SDK 示例</CardTitle>
          <CardDescription>使用 Node.js 调用智谱AI接口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="text-sm">{`import { ZhipuAI } from 'zhipuai';

// 创建客户端实例
const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY,
});

// 同步调用示例
async function chatCompletion() {
  try {
    const completion = await client.chat.completions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '你好，请介绍一下智谱AI' }
      ],
    });
    
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('请求出错:', error);
  }
}

// 流式调用示例
async function streamCompletion() {
  try {
    const stream = await client.chat.completions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '写一首关于人工智能的诗' }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  } catch (error) {
    console.error('流式请求出错:', error);
  }
}

// 异步调用示例
async function asyncCompletion() {
  try {
    const response = await client.chat.asyncCompletions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '请详细分析中国AI产业的发展趋势' }
      ],
    });
    
    console.log('任务ID:', response.id);
    
    // 查询异步任务结果
    // const result = await client.chat.asyncCompletions.retrieve(response.id);
    // console.log(result);
  } catch (error) {
    console.error('异步请求出错:', error);
  }
}

// 运行示例
chatCompletion();`}</code>
            </pre>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2"
              onClick={() =>
                copyToClipboard(
                  `import { ZhipuAI } from 'zhipuai';

// 创建客户端实例
const client = new ZhipuAI({
  apiKey: process.env.ZHIPU_API_KEY,
});

// 同步调用示例
async function chatCompletion() {
  try {
    const completion = await client.chat.completions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '你好，请介绍一下智谱AI' }
      ],
    });
    
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error('请求出错:', error);
  }
}

// 流式调用示例
async function streamCompletion() {
  try {
    const stream = await client.chat.completions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '写一首关于人工智能的诗' }
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
    }
  } catch (error) {
    console.error('流式请求出错:', error);
  }
}

// 异步调用示例
async function asyncCompletion() {
  try {
    const response = await client.chat.asyncCompletions.create({
      model: 'glm-4-0520',
      messages: [
        { role: 'user', content: '请详细分析中国AI产业的发展趋势' }
      ],
    });
    
    console.log('任务ID:', response.id);
    
    // 查询异步任务结果
    // const result = await client.chat.asyncCompletions.retrieve(response.id);
    // console.log(result);
  } catch (error) {
    console.error('异步请求出错:', error);
  }
}

// 运行示例
chatCompletion();`,
                  "node-examples",
                )
              }
            >
              {copied["node-examples"] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>最佳实践</CardTitle>
          <CardDescription>API密钥管理和使用的最佳实践</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">安全存储</h3>
            <p>
              永远不要在客户端代码中硬编码API密钥。在服务器端应用程序中，使用环境变量或安全的密钥管理服务存储API密钥。
            </p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">权限控制</h3>
            <p>为不同的应用场景创建不同的API密钥，并根据最小权限原则分配权限。</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">密钥轮换</h3>
            <p>定期轮换API密钥，特别是在员工离职或怀疑密钥可能已泄露的情况下。</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">监控使用情况</h3>
            <p>定期检查API使用日志，监控异常活动，如突然增加的请求量或来自异常位置的请求。</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">异常处理</h3>
            <p>在使用API时实现适当的错误处理和重试逻辑，以应对临时性的API故障或网络问题。使用指数退避策略进行重试。</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-lg font-medium">模型使用优化</h3>
            <p>
              根据场景选择合适的调用方式：简短请求使用同步调用，长时间任务使用异步调用，需要实时反馈的场景使用流式调用。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
