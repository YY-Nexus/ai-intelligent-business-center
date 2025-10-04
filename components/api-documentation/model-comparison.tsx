"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ModelComparison() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">国内大模型能力对比</h2>
        <p className="text-muted-foreground mt-2">对比各个国内大模型的能力、特点和适用场景，帮助您选择最适合的模型</p>
      </div>

      <TooltipProvider>
        <Table>
          <TableCaption>国内主流大语言模型能力对比表（数据更新于2024年5月）</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">模型</TableHead>
              <TableHead>提供方</TableHead>
              <TableHead>上下文窗口</TableHead>
              <TableHead>
                <div className="flex items-center">
                  推理能力
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">模型进行逻辑推理、数学计算和复杂问题解决的能力</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  创作能力
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">模型生成高质量文本、创意内容和多样化输出的能力</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  代码能力
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">模型理解、生成和调试代码的能力</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
              <TableHead>多模态</TableHead>
              <TableHead>适用场景</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">GLM-4</TableCell>
              <TableCell>智谱AI</TableCell>
              <TableCell>32K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>通用场景、代码开发、学术研究</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">GLM-3-Turbo</TableCell>
              <TableCell>智谱AI</TableCell>
              <TableCell>8K</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">不支持</Badge>
              </TableCell>
              <TableCell>日常对话、内容创作、客服</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ABAB6</TableCell>
              <TableCell>MiniMax</TableCell>
              <TableCell>32K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>通用场景、内容创作、教育</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">ABAB5.5</TableCell>
              <TableCell>MiniMax</TableCell>
              <TableCell>16K</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-yellow-500">一般</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">不支持</Badge>
              </TableCell>
              <TableCell>日常对话、内容创作、客服</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">文心一言4.0</TableCell>
              <TableCell>百度</TableCell>
              <TableCell>32K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>通用场景、内容创作、知识问答</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">通义千问2.0</TableCell>
              <TableCell>阿里云</TableCell>
              <TableCell>32K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>通用场景、内容创作、企业应用</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">星火认知大模型V3.0</TableCell>
              <TableCell>讯飞</TableCell>
              <TableCell>16K</TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-blue-500">良好</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-yellow-500">一般</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>内容创作、教育、客服</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">月之暗面Claude 3</TableCell>
              <TableCell>月之暗面</TableCell>
              <TableCell>200K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">支持</Badge>
              </TableCell>
              <TableCell>通用场景、长文档处理、学术研究</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Deepseek-R1</TableCell>
              <TableCell>飞桨星河</TableCell>
              <TableCell>32K</TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-green-500">优秀</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">不支持</Badge>
              </TableCell>
              <TableCell>代码开发、学术研究、通用场景</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TooltipProvider>

      <div className="bg-muted p-4 rounded-md mt-6">
        <h3 className="text-lg font-medium mb-2">选择模型的建议</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <span className="font-medium">代码开发场景：</span>
            <span className="text-muted-foreground">
              推荐使用 GLM-4、Deepseek-R1 或月之暗面Claude 3，这些模型在代码理解和生成方面表现优秀
            </span>
          </li>
          <li>
            <span className="font-medium">内容创作场景：</span>
            <span className="text-muted-foreground">
              推荐使用 ABAB6、文心一言4.0 或通义千问2.0，这些模型在创意写作和内容生成方面表现出色
            </span>
          </li>
          <li>
            <span className="font-medium">客服和对话场景：</span>
            <span className="text-muted-foreground">
              推荐使用 GLM-3-Turbo 或 ABAB5.5，这些模型成本较低且对话能力良好
            </span>
          </li>
          <li>
            <span className="font-medium">长文档处理：</span>
            <span className="text-muted-foreground">
              推荐使用月之暗面Claude 3，其200K的上下文窗口在处理长文档时具有明显优势
            </span>
          </li>
          <li>
            <span className="font-medium">多模态应用：</span>
            <span className="text-muted-foreground">推荐使用支持多模态的模型，如GLM-4、ABAB6、文心一言4.0等</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
