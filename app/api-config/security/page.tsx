"use client"

import { SystemToolsProvider } from "@/components/system-tools/system-tools-context"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSystemTools } from "@/components/system-tools/system-tools-context"
import { AlertTriangle, CheckCircle, XCircle, Shield, FileText, RefreshCw, Loader2 } from "lucide-react"

// 安全页面内容组件
function SecurityPageContent() {
  const { toolStatus, progress, issues, startTool, fixAllIssues } = useSystemTools()

  const [activeTab, setActiveTab] = useState<string>("overview")
  const [scanResults, setScanResults] = useState<any>(null)

  // 过滤安全相关问题
  const securityIssues = issues.filter((issue) => issue.category === "security")

  // 启动安全扫描
  const startSecurityScan = async () => {
    // 使用系统工具的扫描功能
    await startTool("scanner")

    // 设置模拟扫描结果
    setScanResults({
      score: 85,
      passedChecks: 17,
      failedChecks: 3,
      warningChecks: 2,
      totalChecks: 22,
      categories: {
        authentication: { score: 90, passed: 4, failed: 0, warning: 1, total: 5 },
        authorization: { score: 80, passed: 3, failed: 1, warning: 0, total: 4 },
        dataProtection: { score: 85, passed: 4, failed: 1, warning: 0, total: 5 },
        apiSecurity: { score: 95, passed: 3, failed: 0, warning: 0, total: 3 },
        configuration: { score: 75, passed: 3, failed: 1, warning: 1, total: 5 },
      },
    })
  }

  // 修复所有安全问题
  const fixAllSecurityIssues = async () => {
    await fixAllIssues()
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">API安全检测</CardTitle>
              <CardDescription>检查API配置和使用中的安全问题，确保系统安全</CardDescription>
            </div>
            {scanResults && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">安全评分:</span>
                <Badge
                  variant={scanResults.score >= 90 ? "default" : scanResults.score >= 70 ? "outline" : "destructive"}
                  className="text-lg px-3 py-1"
                >
                  {scanResults.score}/100
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 扫描进度 */}
          {toolStatus === "running" && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">扫描进度</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* 扫描结果 */}
          {scanResults ? (
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-5">
                <TabsTrigger value="overview">概览</TabsTrigger>
                <TabsTrigger value="authentication">认证安全</TabsTrigger>
                <TabsTrigger value="authorization">授权安全</TabsTrigger>
                <TabsTrigger value="dataProtection">数据保护</TabsTrigger>
                <TabsTrigger value="apiSecurity">API安全</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6 mt-4">
                  {/* 安全评分卡片 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                          <div className="text-2xl font-bold">{scanResults.passedChecks}</div>
                          <div className="text-xs text-muted-foreground">通过检查</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <XCircle className="h-8 w-8 text-red-500 mb-2" />
                          <div className="text-2xl font-bold">{scanResults.failedChecks}</div>
                          <div className="text-xs text-muted-foreground">失败检查</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                          <div className="text-2xl font-bold">{scanResults.warningChecks}</div>
                          <div className="text-xs text-muted-foreground">警告检查</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <FileText className="h-8 w-8 text-blue-500 mb-2" />
                          <div className="text-2xl font-bold">{scanResults.totalChecks}</div>
                          <div className="text-xs text-muted-foreground">总检查项</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 类别评分 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">安全类别评分</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">认证安全</span>
                          <span className="text-sm font-medium">{scanResults.categories.authentication.score}%</span>
                        </div>
                        <Progress value={scanResults.categories.authentication.score} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">授权安全</span>
                          <span className="text-sm font-medium">{scanResults.categories.authorization.score}%</span>
                        </div>
                        <Progress value={scanResults.categories.authorization.score} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">数据保护</span>
                          <span className="text-sm font-medium">{scanResults.categories.dataProtection.score}%</span>
                        </div>
                        <Progress value={scanResults.categories.dataProtection.score} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">API安全</span>
                          <span className="text-sm font-medium">{scanResults.categories.apiSecurity.score}%</span>
                        </div>
                        <Progress value={scanResults.categories.apiSecurity.score} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">配置安全</span>
                          <span className="text-sm font-medium">{scanResults.categories.configuration.score}%</span>
                        </div>
                        <Progress value={scanResults.categories.configuration.score} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* 安全问题 */}
                  {securityIssues.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">检测到的安全问题</h3>
                        {securityIssues.filter((i) => i.fixable && i.status === "detected").length > 0 && (
                          <Button size="sm" onClick={fixAllSecurityIssues}>
                            <Shield className="mr-2 h-4 w-4" />
                            修复所有安全问题
                          </Button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {securityIssues.map((issue) => (
                          <div key={issue.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  {issue.severity === "critical" && (
                                    <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                                  )}
                                  {issue.severity === "high" && (
                                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                                  )}
                                  <h4 className="font-medium">{issue.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getSeverityClass(issue.severity)}>
                                  {getSeverityLabel(issue.severity)}
                                </Badge>
                                <Badge variant="outline" className={getStatusClass(issue.status)}>
                                  {getStatusLabel(issue.status)}
                                </Badge>
                              </div>
                            </div>

                            {issue.status === "detected" && issue.fixable && (
                              <div className="mt-2 flex justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => (window.location.href = `/system-tools/issue/${issue.id}`)}
                                >
                                  查看详情
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="authentication">
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">认证安全检查</h3>
                    <Badge
                      variant={scanResults.categories.authentication.score >= 90 ? "default" : "outline"}
                      className="px-3 py-1"
                    >
                      评分: {scanResults.categories.authentication.score}/100
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">密码策略强度</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            密码策略符合安全要求，要求至少8个字符，包含大小写字母、数字和特殊字符。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">多因素认证</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">系统已启用多因素认证，提高账户安全性。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">会话超时设置</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">会话超时设置合理，闲置30分钟后自动登出。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">登录尝试限制</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">系统已限制登录尝试次数，防止暴力破解攻击。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                            <h4 className="font-medium">密码重置流程</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            密码重置链接有效期过长，建议缩短为24小时以内。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          警告
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline">
                          修复问题
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="authorization">
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">授权安全检查</h3>
                    <Badge
                      variant={scanResults.categories.authorization.score >= 90 ? "default" : "outline"}
                      className="px-3 py-1"
                    >
                      评分: {scanResults.categories.authorization.score}/100
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">角色权限分离</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            系统正确实现了角色权限分离，确保用户只能访问其角色允许的资源。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">API访问控制</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">API端点已正确实现访问控制，防止未授权访问。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">最小权限原则</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            系统遵循最小权限原则，用户只被授予必要的权限。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <h4 className="font-medium">水平越权保护</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            部分API端点缺少水平越权保护，用户可能访问到其他用户的数据。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          失败
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm">修复问题</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dataProtection">
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">数据保护检查</h3>
                    <Badge
                      variant={scanResults.categories.dataProtection.score >= 90 ? "default" : "outline"}
                      className="px-3 py-1"
                    >
                      评分: {scanResults.categories.dataProtection.score}/100
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">敏感数据加密</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">敏感数据已正确加密存储，使用了强加密算法。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">传输层安全</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">所有API通信均使用TLS 1.3加密，确保传输安全。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">数据备份策略</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            系统已实施定期数据备份策略，确保数据可恢复性。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">数据最小化</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            系统遵循数据最小化原则，只收集必要的用户数据。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <h4 className="font-medium">API密钥保护</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">部分API密钥存储不安全，可能导致泄露风险。</p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          失败
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Button size="sm">修复问题</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="apiSecurity">
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">API安全检查</h3>
                    <Badge
                      variant={scanResults.categories.apiSecurity.score >= 90 ? "default" : "outline"}
                      className="px-3 py-1"
                    >
                      评分: {scanResults.categories.apiSecurity.score}/100
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">输入验证</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            所有API端点已实施严格的输入验证，防止注入攻击。
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">速率限制</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">API已实施速率限制，防止滥用和DDoS攻击。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>

                    <div className="p-3 border rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            <h4 className="font-medium">CORS配置</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">CORS配置正确，只允许受信任的域访问API。</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          通过
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-6">点击下方按钮开始API安全检测</p>
              <Button onClick={startSecurityScan} disabled={toolStatus === "running"}>
                {toolStatus === "running" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    扫描中...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    开始安全检测
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={startSecurityScan} disabled={toolStatus === "running"}>
            <RefreshCw className={`mr-2 h-4 w-4 ${toolStatus === "running" ? "animate-spin" : ""}`} />
            重新扫描
          </Button>

          {scanResults && securityIssues.filter((i) => i.fixable && i.status === "detected").length > 0 && (
            <Button onClick={fixAllSecurityIssues} disabled={toolStatus === "running"}>
              <Shield className="mr-2 h-4 w-4" />
              修复所有安全问题
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

// 获取严重程度标签
function getSeverityLabel(severity: string): string {
  switch (severity) {
    case "critical":
      return "严重"
    case "high":
      return "高风险"
    case "medium":
      return "中风险"
    case "low":
      return "低风险"
    default:
      return severity
  }
}

// 获取严重程度样式类
function getSeverityClass(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 border-red-200"
    case "high":
      return "bg-orange-50 text-orange-700 border-orange-200"
    case "medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200"
    case "low":
      return "bg-green-50 text-green-700 border-green-200"
    default:
      return ""
  }
}

// 获取状态标签
function getStatusLabel(status: string): string {
  switch (status) {
    case "detected":
      return "已检测"
    case "fixing":
      return "修复中"
    case "fixed":
      return "已修复"
    case "failed":
      return "修复失败"
    default:
      return status
  }
}

// 获取状态样式类
function getStatusClass(status: string): string {
  switch (status) {
    case "detected":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "fixing":
      return "bg-purple-50 text-purple-700 border-purple-200"
    case "fixed":
      return "bg-green-50 text-green-700 border-green-200"
    case "failed":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return ""
  }
}

// 包装组件，确保使用SystemToolsProvider
export default function SecurityPage() {
  return (
    <SystemToolsProvider>
      <SecurityPageContent />
    </SystemToolsProvider>
  )
}
