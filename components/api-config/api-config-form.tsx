"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useApiConfig, type ApiConfigWithMeta } from "./api-config-manager"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { ApiConfig, AuthConfig } from "@/lib/api-binding"
import ApiTemplateSelector from "./api-template-selector"
import { getTemplateById } from "@/lib/api-binding/templates/api-templates"

interface ApiConfigFormProps {
  initialConfig?: ApiConfigWithMeta
  onComplete?: () => void
}

export default function ApiConfigForm({ initialConfig, onComplete }: ApiConfigFormProps) {
  const { addConfig, updateConfig } = useApiConfig()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(!!initialConfig)

  // 表单状态
  const [name, setName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [version, setVersion] = useState("")
  const [timeout, setTimeout] = useState("10000")
  const [headers, setHeaders] = useState("")

  // 认证状态
  const [authType, setAuthType] = useState<AuthConfig["type"]>("none")
  const [authEnabled, setAuthEnabled] = useState(false)

  // 基本认证
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Bearer认证
  const [token, setToken] = useState("")
  const [refreshToken, setRefreshToken] = useState("")
  const [refreshUrl, setRefreshUrl] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(false)

  // API密钥认证
  const [apiKey, setApiKey] = useState("")
  const [headerName, setHeaderName] = useState("X-API-Key")
  const [queryParamName, setQueryParamName] = useState("")

  // OAuth2认证
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [authorizationUrl, setAuthorizationUrl] = useState("")
  const [tokenUrl, setTokenUrl] = useState("")
  const [redirectUrl, setRedirectUrl] = useState("")
  const [scope, setScope] = useState("")

  // 加载初始配置
  useEffect(() => {
    if (initialConfig) {
      setName(initialConfig.name)
      setBaseUrl(initialConfig.config.baseUrl)
      setVersion(initialConfig.config.version || "")
      setTimeout(initialConfig.config.timeout?.toString() || "10000")
      setHeaders(initialConfig.config.headers ? JSON.stringify(initialConfig.config.headers, null, 2) : "")

      // 认证设置
      setAuthType(initialConfig.auth.type)
      setAuthEnabled(initialConfig.auth.enabled)

      // 根据认证类型设置相应字段
      switch (initialConfig.auth.type) {
        case "basic":
          setUsername(initialConfig.auth.username)
          setPassword(initialConfig.auth.password)
          break
        case "bearer":
          setToken(initialConfig.auth.token)
          setRefreshToken(initialConfig.auth.refreshToken || "")
          setRefreshUrl(initialConfig.auth.refreshUrl || "")
          setAutoRefresh(initialConfig.auth.autoRefresh || false)
          break
        case "api-key":
          setApiKey(initialConfig.auth.apiKey)
          setHeaderName(initialConfig.auth.headerName || "X-API-Key")
          setQueryParamName(initialConfig.auth.queryParamName || "")
          break
        case "oauth2":
          setClientId(initialConfig.auth.clientId)
          setClientSecret(initialConfig.auth.clientSecret)
          setAuthorizationUrl(initialConfig.auth.authorizationUrl || "")
          setTokenUrl(initialConfig.auth.tokenUrl || "")
          setRedirectUrl(initialConfig.auth.redirectUrl || "")
          setScope(initialConfig.auth.scope ? initialConfig.auth.scope.join(" ") : "")
          setToken(initialConfig.auth.token || "")
          setRefreshToken(initialConfig.auth.refreshToken || "")
          break
      }
    }
  }, [initialConfig])

  // 处理模板选择
  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId)
    if (!template) return

    // 设置基本信息
    setName(template.config.name)
    setBaseUrl(template.config.config.baseUrl)
    setVersion(template.config.config.version || "")
    setTimeout(template.config.config.timeout?.toString() || "10000")
    setHeaders(template.config.config.headers ? JSON.stringify(template.config.config.headers, null, 2) : "")

    // 设置认证信息
    setAuthType(template.config.auth.type)
    setAuthEnabled(template.config.auth.enabled)

    // 根据认证类型设置相应字段
    switch (template.config.auth.type) {
      case "basic":
        setUsername(template.config.auth.username || "")
        setPassword(template.config.auth.password || "")
        break
      case "bearer":
        setToken(template.config.auth.token || "")
        setRefreshToken(template.config.auth.refreshToken || "")
        setRefreshUrl(template.config.auth.refreshUrl || "")
        setAutoRefresh(template.config.auth.autoRefresh || false)
        break
      case "api-key":
        setApiKey(template.config.auth.apiKey || "")
        setHeaderName(template.config.auth.headerName || "X-API-Key")
        setQueryParamName(template.config.auth.queryParamName || "")
        break
      case "oauth2":
        setClientId(template.config.auth.clientId || "")
        setClientSecret(template.config.auth.clientSecret || "")
        setAuthorizationUrl(template.config.auth.authorizationUrl || "")
        setTokenUrl(template.config.auth.tokenUrl || "")
        setRedirectUrl(template.config.auth.redirectUrl || "")
        setScope(template.config.auth.scope ? template.config.auth.scope.join(" ") : "")
        setToken(template.config.auth.token || "")
        setRefreshToken(template.config.auth.refreshToken || "")
        break
    }
  }

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // 解析头部
      let parsedHeaders: Record<string, string> = {}
      if (headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers)
        } catch (error) {
          toast({
            title: "头部格式错误",
            description: "请确保头部是有效的JSON格式。",
            variant: "destructive",
          })
          return
        }
      }

      // 创建API配置
      const apiConfig: ApiConfig = {
        name,
        baseUrl,
        version: version || undefined,
        timeout: Number.parseInt(timeout) || 10000,
        headers: Object.keys(parsedHeaders).length > 0 ? parsedHeaders : undefined,
      }

      // 创建认证配置
      let authConfig: AuthConfig

      switch (authType) {
        case "basic":
          authConfig = {
            type: "basic",
            enabled: authEnabled,
            username,
            password,
          }
          break
        case "bearer":
          authConfig = {
            type: "bearer",
            enabled: authEnabled,
            token,
            refreshToken: refreshToken || undefined,
            refreshUrl: refreshUrl || undefined,
            autoRefresh,
          }
          break
        case "api-key":
          authConfig = {
            type: "api-key",
            enabled: authEnabled,
            apiKey,
            headerName: headerName || undefined,
            queryParamName: queryParamName || undefined,
          }
          break
        case "oauth2":
          authConfig = {
            type: "oauth2",
            enabled: authEnabled,
            clientId,
            clientSecret,
            authorizationUrl: authorizationUrl || undefined,
            tokenUrl: tokenUrl || undefined,
            redirectUrl: redirectUrl || undefined,
            scope: scope ? scope.split(" ") : undefined,
            token: token || undefined,
            refreshToken: refreshToken || undefined,
          }
          break
        default:
          authConfig = {
            type: "none",
            enabled: false,
          }
      }

      // 保存配置
      if (isEditing && initialConfig) {
        updateConfig(initialConfig.id, {
          name,
          config: apiConfig,
          auth: authConfig,
        })
      } else {
        addConfig({
          name,
          config: apiConfig,
          auth: authConfig,
        })
      }

      // 重置表单或关闭
      if (onComplete) {
        onComplete()
      } else {
        resetForm()
      }
    } catch (error) {
      console.error("保存API配置失败:", error)
      toast({
        title: "保存失败",
        description: "无法保存API配置，请检查输入。",
        variant: "destructive",
      })
    }
  }

  // 重置表单
  const resetForm = () => {
    setName("")
    setBaseUrl("")
    setVersion("")
    setTimeout("10000")
    setHeaders("")
    setAuthType("none")
    setAuthEnabled(false)
    setUsername("")
    setPassword("")
    setToken("")
    setRefreshToken("")
    setRefreshUrl("")
    setAutoRefresh(false)
    setApiKey("")
    setHeaderName("X-API-Key")
    setQueryParamName("")
    setClientId("")
    setClientSecret("")
    setAuthorizationUrl("")
    setTokenUrl("")
    setRedirectUrl("")
    setScope("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "编辑API配置" : "添加API配置"}</CardTitle>
          <CardDescription>配置API连接信息和认证方式</CardDescription>
        </CardHeader>

        <CardContent>
          {!isEditing && (
            <div className="mb-6">
              <ApiTemplateSelector onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="auth">认证设置</TabsTrigger>
              <TabsTrigger value="advanced">高级设置</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">API名称 *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如：我的API"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseUrl">基础URL *</Label>
                <Input
                  id="baseUrl"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder="例如：https://api.example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">API版本</Label>
                <Input
                  id="version"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="例如：v1"
                />
                <p className="text-sm text-muted-foreground">可选。如果指定，将添加到URL路径中。</p>
              </div>
            </TabsContent>

            <TabsContent value="auth" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-enabled">启用认证</Label>
                <Switch id="auth-enabled" checked={authEnabled} onCheckedChange={setAuthEnabled} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auth-type">认证类型</Label>
                <Select
                  value={authType}
                  onValueChange={(value) => setAuthType(value as AuthConfig["type"])}
                  disabled={!authEnabled}
                >
                  <SelectTrigger id="auth-type">
                    <SelectValue placeholder="选择认证类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无认证</SelectItem>
                    <SelectItem value="basic">基本认证</SelectItem>
                    <SelectItem value="bearer">Bearer令牌</SelectItem>
                    <SelectItem value="api-key">API密钥</SelectItem>
                    <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {authEnabled && authType === "basic" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="用户名"
                      required={authEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="密码"
                      required={authEnabled}
                    />
                  </div>
                </div>
              )}

              {authEnabled && authType === "bearer" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="token">Bearer令牌</Label>
                    <Input
                      id="token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Bearer令牌"
                      required={authEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh">自动刷新令牌</Label>
                    <Switch
                      id="auto-refresh"
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                      disabled={!authEnabled}
                    />
                  </div>

                  {autoRefresh && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="refresh-token">刷新令牌</Label>
                        <Input
                          id="refresh-token"
                          value={refreshToken}
                          onChange={(e) => setRefreshToken(e.target.value)}
                          placeholder="刷新令牌"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="refresh-url">令牌刷新URL</Label>
                        <Input
                          id="refresh-url"
                          value={refreshUrl}
                          onChange={(e) => setRefreshUrl(e.target.value)}
                          placeholder="https://api.example.com/oauth/token"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {authEnabled && authType === "api-key" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API密钥</Label>
                    <Input
                      id="api-key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="API密钥"
                      required={authEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="header-name">头部名称</Label>
                    <Input
                      id="header-name"
                      value={headerName}
                      onChange={(e) => setHeaderName(e.target.value)}
                      placeholder="X-API-Key"
                    />
                    <p className="text-sm text-muted-foreground">如果API密钥在请求头中发送，请指定头部名称。</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="query-param-name">查询参数名称</Label>
                    <Input
                      id="query-param-name"
                      value={queryParamName}
                      onChange={(e) => setQueryParamName(e.target.value)}
                      placeholder="api_key"
                    />
                    <p className="text-sm text-muted-foreground">如果API密钥在URL查询参数中发送，请指定参数名称。</p>
                  </div>
                </div>
              )}

              {authEnabled && authType === "oauth2" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-id">客户端ID</Label>
                    <Input
                      id="client-id"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="客户端ID"
                      required={authEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-secret">客户端密钥</Label>
                    <Input
                      id="client-secret"
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="客户端密钥"
                      required={authEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorization-url">授权URL</Label>
                    <Input
                      id="authorization-url"
                      value={authorizationUrl}
                      onChange={(e) => setAuthorizationUrl(e.target.value)}
                      placeholder="https://api.example.com/oauth/authorize"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="token-url">令牌URL</Label>
                    <Input
                      id="token-url"
                      value={tokenUrl}
                      onChange={(e) => setTokenUrl(e.target.value)}
                      placeholder="https://api.example.com/oauth/token"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="redirect-url">重定向URL</Label>
                    <Input
                      id="redirect-url"
                      value={redirectUrl}
                      onChange={(e) => setRedirectUrl(e.target.value)}
                      placeholder="https://myapp.com/callback"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scope">权限范围</Label>
                    <Input
                      id="scope"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      placeholder="read write"
                    />
                    <p className="text-sm text-muted-foreground">用空格分隔多个权限范围��</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oauth-token">访问令牌</Label>
                    <Input
                      id="oauth-token"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="访问令牌"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oauth-refresh-token">刷新令牌</Label>
                    <Input
                      id="oauth-refresh-token"
                      value={refreshToken}
                      onChange={(e) => setRefreshToken(e.target.value)}
                      placeholder="刷新令牌"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeout">请求超时 (毫秒)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={timeout}
                  onChange={(e) => setTimeout(e.target.value)}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headers">默认请求头</Label>
                <Textarea
                  id="headers"
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder={`{\n  "Content-Type": "application/json",\n  "Accept": "application/json"\n}`}
                  className="font-mono"
                  rows={6}
                />
                <p className="text-sm text-muted-foreground">JSON格式的默认请求头。</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={resetForm}>
            重置
          </Button>
          <Button type="submit">{isEditing ? "更新" : "保存"}</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
