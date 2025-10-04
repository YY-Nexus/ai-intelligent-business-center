"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { GitBranch, GitPullRequest, GitCommit, Settings, Play, Save, RefreshCw } from "lucide-react"
import type { CIIntegrationConfig, CIProvider } from "@/lib/ci-integration"

interface CIIntegrationProps {
  projectId: string
  onRunAudit?: (branch: string) => void
}

export function CIIntegration({ projectId, onRunAudit }: CIIntegrationProps) {
  const [config, setConfig] = useState<CIIntegrationConfig>({
    provider: "github",
    repositoryUrl: "",
    branch: "main",
    webhookUrl: "",
    apiToken: "",
    enabledEvents: ["push", "pull_request", "release"],
    auditOnPush: true,
    auditOnPR: true,
    autoFixEnabled: false,
    notifyOnResults: true,
  })

  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recentRuns, setRecentRuns] = useState<any[]>([
    {
      id: "run-1",
      type: "push",
      branch: "main",
      commit: "a1b2c3d",
      status: "completed",
      result: "passed",
      timestamp: "2023-05-10T14:30:00Z",
      issues: 0,
    },
    {
      id: "run-2",
      type: "pull_request",
      branch: "feature/new-component",
      commit: "e4f5g6h",
      status: "completed",
      result: "failed",
      timestamp: "2023-05-09T10:15:00Z",
      issues: 3,
    },
    {
      id: "run-3",
      type: "release",
      branch: "v1.2.0",
      commit: "i7j8k9l",
      status: "in_progress",
      timestamp: "2023-05-11T09:45:00Z",
    },
  ])

  // 模拟加载配置
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 检查是否已配置
        if (projectId === "demo-project") {
          setConfig({
            provider: "github",
            repositoryUrl: "https://github.com/example/demo-project",
            branch: "main",
            webhookUrl: "https://example.com/api/ci/webhook",
            apiToken: "•••••••••••••••••",
            enabledEvents: ["push", "pull_request", "release"],
            auditOnPush: true,
            auditOnPR: true,
            autoFixEnabled: true,
            notifyOnResults: true,
          })
          setIsConfigured(true)
        }
      } catch (error) {
        console.error("加载CI配置错误:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadConfig()
  }, [projectId])

  // 保存配置
  const saveConfig = async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 设置为已配置
      setIsConfigured(true)

      // 在实际应用中，这里应该调用API保存配置
      console.log("保存CI配置:", config)
    } catch (error) {
      console.error("保存CI配置错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 运行审查
  const runAudit = () => {
    if (onRunAudit) {
      onRunAudit(config.branch)
    }

    // 添加一个新的运行记录
    const newRun = {
      id: `run-${Date.now()}`,
      type: "manual",
      branch: config.branch,
      commit: "manual",
      status: "in_progress",
      timestamp: new Date().toISOString(),
    }

    setRecentRuns([newRun, ...recentRuns])
  }

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 获取状态标签
  const getStatusBadge = (status: string, result?: string) => {
    if (status === "in_progress") {
      return (
        <Badge variant="secondary" className="animate-pulse">
          进行中
        </Badge>
      )
    } else if (status === "completed") {
      if (result === "passed") {
        return (
          <Badge variant="default" className="bg-green-600">
            通过
          </Badge>
        )
      } else if (result === "failed") {
        return <Badge variant="destructive">失败</Badge>
      }
      return <Badge variant="outline">完成</Badge>
    }
    return <Badge variant="outline">未知</Badge>
  }

  // 获取事件图标
  const getEventIcon = (type: string) => {
    switch (type) {
      case "push":
        return <GitCommit className="h-4 w-4" />
      case "pull_request":
        return <GitPullRequest className="h-4 w-4" />
      case "release":
        return <GitBranch className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <GitBranch className="mr-2 h-5 w-5" />
              CI/CD集成
            </CardTitle>
            <CardDescription>将系统审查和自动修复集成到CI/CD流程</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={runAudit} disabled={isLoading || !isConfigured}>
              <Play className="mr-2 h-4 w-4" />
              运行审查
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isConfigured ? "runs" : "settings"}>
          <TabsList className="mb-4">
            <TabsTrigger value="runs" className="flex items-center">
              <GitCommit className="mr-2 h-4 w-4" />
              运行记录
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              配置设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="runs">
            {recentRuns.length > 0 ? (
              <div className="space-y-4">
                {recentRuns.map((run) => (
                  <div
                    key={run.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">{getEventIcon(run.type)}</div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {run.type === "pull_request" ? "PR审查" : run.type === "release" ? "发布审查" : "代码审查"}
                          {getStatusBadge(run.status, run.result)}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {run.branch}
                          {run.commit && (
                            <>
                              <span className="mx-1">•</span>
                              <GitCommit className="h-3 w-3" />
                              {run.commit.substring(0, 7)}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {run.status === "completed" && run.result === "failed" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700">
                          {run.issues} 个问题
                        </Badge>
                      )}
                      <div className="text-sm text-muted-foreground">{formatDate(run.timestamp)}</div>
                      <Button variant="ghost" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <GitCommit className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>暂无运行记录</p>
                <p className="text-sm">配置CI/CD集成并运行审查</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">基本设置</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="provider">CI/CD提供商</Label>
                    <select
                      id="provider"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={config.provider}
                      onChange={(e) => setConfig({ ...config, provider: e.target.value as CIProvider })}
                      disabled={isLoading}
                    >
                      <option value="github">GitHub Actions</option>
                      <option value="gitlab">GitLab CI</option>
                      <option value="jenkins">Jenkins</option>
                      <option value="azure-devops">Azure DevOps</option>
                      <option value="circle-ci">CircleCI</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="repositoryUrl">仓库URL</Label>
                    <Input
                      id="repositoryUrl"
                      value={config.repositoryUrl}
                      onChange={(e) => setConfig({ ...config, repositoryUrl: e.target.value })}
                      placeholder="https://github.com/username/repo"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="branch">默认分支</Label>
                    <Input
                      id="branch"
                      value={config.branch}
                      onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                      placeholder="main"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="apiToken">API令牌</Label>
                    <Input
                      id="apiToken"
                      type="password"
                      value={config.apiToken}
                      onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                      placeholder="输入API令牌"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">用于访问CI/CD系统的API令牌，具有读写权限</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">触发设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>推送时审查</Label>
                      <p className="text-xs text-muted-foreground">当代码推送到仓库时自动运行审查</p>
                    </div>
                    <Switch
                      checked={config.auditOnPush}
                      onCheckedChange={(checked) => setConfig({ ...config, auditOnPush: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PR时审查</Label>
                      <p className="text-xs text-muted-foreground">当创建或更新PR时自动运行审查</p>
                    </div>
                    <Switch
                      checked={config.auditOnPR}
                      onCheckedChange={(checked) => setConfig({ ...config, auditOnPR: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>启用自动修复</Label>
                      <p className="text-xs text-muted-foreground">自动创建修复PR解决发现的问题</p>
                    </div>
                    <Switch
                      checked={config.autoFixEnabled}
                      onCheckedChange={(checked) => setConfig({ ...config, autoFixEnabled: checked })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>结果通知</Label>
                      <p className="text-xs text-muted-foreground">审查完成后发送通知</p>
                    </div>
                    <Switch
                      checked={config.notifyOnResults}
                      onCheckedChange={(checked) => setConfig({ ...config, notifyOnResults: checked })}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">事件监听</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-push"
                      checked={config.enabledEvents.includes("push")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setConfig({
                            ...config,
                            enabledEvents: [...config.enabledEvents, "push"],
                          })
                        } else {
                          setConfig({
                            ...config,
                            enabledEvents: config.enabledEvents.filter((e) => e !== "push"),
                          })
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-push"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        推送事件
                      </label>
                      <p className="text-sm text-muted-foreground">监听代码推送事件</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-pr"
                      checked={config.enabledEvents.includes("pull_request")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setConfig({
                            ...config,
                            enabledEvents: [...config.enabledEvents, "pull_request"],
                          })
                        } else {
                          setConfig({
                            ...config,
                            enabledEvents: config.enabledEvents.filter((e) => e !== "pull_request"),
                          })
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-pr"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        PR事件
                      </label>
                      <p className="text-sm text-muted-foreground">监听PR创建和更新事件</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="event-release"
                      checked={config.enabledEvents.includes("release")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setConfig({
                            ...config,
                            enabledEvents: [...config.enabledEvents, "release"],
                          })
                        } else {
                          setConfig({
                            ...config,
                            enabledEvents: config.enabledEvents.filter((e) => e !== "release"),
                          })
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="event-release"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        发布事件
                      </label>
                      <p className="text-sm text-muted-foreground">监听版本发布事件</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {isConfigured ? "CI/CD集成已配置，系统审查将自动运行" : "配置CI/CD集成以自动运行系统审查"}
        </div>
        {!isConfigured && (
          <Button onClick={saveConfig} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                保存配置
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
