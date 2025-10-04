"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import {
  Shield,
  Smartphone,
  Mail,
  Key,
  RefreshCw,
  AlertTriangle,
  Copy,
  QrCode,
  Clock,
  Info,
  Lock,
  Unlock,
} from "lucide-react"

// 2FA方法类型
type TwoFactorMethod = "app" | "sms" | "email" | "backup"

// 2FA状态类型
interface TwoFactorStatus {
  enabled: boolean
  method: TwoFactorMethod | null
  lastVerified: string | null
  backupCodesRemaining: number
}

export function TwoFactorAuth() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [twoFactorStatus, setTwoFactorStatus] = useState<TwoFactorStatus>({
    enabled: false,
    method: null,
    lastVerified: null,
    backupCodesRemaining: 0,
  })
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod>("app")
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false)
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secretKey, setSecretKey] = useState("")

  // 加载2FA状态
  useEffect(() => {
    const fetchTwoFactorStatus = async () => {
      setIsLoading(true)
      try {
        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 模拟数据
        const status: TwoFactorStatus = {
          enabled: false,
          method: null,
          lastVerified: null,
          backupCodesRemaining: 0,
        }

        setTwoFactorStatus(status)

        // 模拟用户数据
        setPhoneNumber("138****1234")
        setEmail("user@example.com")
      } catch (error) {
        console.error("加载2FA状态失败:", error)
        toast({
          title: "加载失败",
          description: "无法加载双因素认证状态，请稍后重试",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTwoFactorStatus()
  }, [toast])

  // 生成认证器应用数据
  const generateAuthenticatorData = async () => {
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟数据
      setQrCodeUrl("/placeholder.svg?key=r98nx")
      setSecretKey("ABCD EFGH IJKL MNOP")

      toast({
        title: "生成成功",
        description: "认证器应用数据已生成",
      })
    } catch (error) {
      console.error("生成认证器数据失败:", error)
      toast({
        title: "生成失败",
        description: "无法生成认证器应用数据，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 生成备份码
  const generateBackupCodes = async () => {
    setIsGeneratingCodes(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟数据
      const codes = [
        "1234-5678-9012",
        "2345-6789-0123",
        "3456-7890-1234",
        "4567-8901-2345",
        "5678-9012-3456",
        "6789-0123-4567",
        "7890-1234-5678",
        "8901-2345-6789",
        "9012-3456-7890",
        "0123-4567-8901",
      ]

      setBackupCodes(codes)

      toast({
        title: "生成成功",
        description: "备份码已生成，请妥善保存",
      })
    } catch (error) {
      console.error("生成备份码失败:", error)
      toast({
        title: "生成失败",
        description: "无法生成备份码，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingCodes(false)
    }
  }

  // 验证并启用2FA
  const verifyAndEnable = async () => {
    if (!verificationCode) {
      toast({
        title: "验证失败",
        description: "请输入验证码",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟成功响应
      setTwoFactorStatus({
        enabled: true,
        method: selectedMethod,
        lastVerified: new Date().toISOString(),
        backupCodesRemaining: 10,
      })

      toast({
        title: "设置成功",
        description: "双因素认证已成功启用",
      })
    } catch (error) {
      console.error("验证失败:", error)
      toast({
        title: "验证失败",
        description: "无法验证验证码，请确保输入正确",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
      setVerificationCode("")
    }
  }

  // 禁用2FA
  const disableTwoFactor = async () => {
    setIsVerifying(true)
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 模拟成功响应
      setTwoFactorStatus({
        enabled: false,
        method: null,
        lastVerified: null,
        backupCodesRemaining: 0,
      })

      toast({
        title: "已禁用",
        description: "双因素认证已成功禁用",
      })
    } catch (error) {
      console.error("禁用2FA失败:", error)
      toast({
        title: "禁用失败",
        description: "无法禁用双因素认证，请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // 复制到剪贴板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    })
  }

  // 获取方法图标
  const getMethodIcon = (method: TwoFactorMethod) => {
    switch (method) {
      case "app":
        return <Smartphone className="h-5 w-5 text-blue-500" />
      case "sms":
        return <Smartphone className="h-5 w-5 text-green-500" />
      case "email":
        return <Mail className="h-5 w-5 text-purple-500" />
      case "backup":
        return <Key className="h-5 w-5 text-yellow-500" />
    }
  }

  // 获取方法名称
  const getMethodName = (method: TwoFactorMethod) => {
    switch (method) {
      case "app":
        return "认证器应用"
      case "sms":
        return "短信验证"
      case "email":
        return "电子邮件"
      case "backup":
        return "备份码"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">双因素认证</h2>
        <Badge
          variant={twoFactorStatus.enabled ? "default" : "outline"}
          className={twoFactorStatus.enabled ? "bg-green-600" : ""}
        >
          {twoFactorStatus.enabled ? (
            <>
              <Lock className="mr-1 h-4 w-4" />
              已启用
            </>
          ) : (
            <>
              <Unlock className="mr-1 h-4 w-4" />
              未启用
            </>
          )}
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      ) : twoFactorStatus.enabled ? (
        <Card>
          <CardHeader>
            <CardTitle>双因素认证已启用</CardTitle>
            <CardDescription>您的账户已受到额外保护。每次登录时，您都需要提供第二个验证因素。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                {twoFactorStatus.method && getMethodIcon(twoFactorStatus.method)}
                <div>
                  <h3 className="font-medium">当前方法</h3>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorStatus.method && getMethodName(twoFactorStatus.method)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedMethod(twoFactorStatus.method || "app")}>
                更改
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">上次验证</h3>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {twoFactorStatus.lastVerified
                    ? new Date(twoFactorStatus.lastVerified).toLocaleString("zh-CN")
                    : "从未验证"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">备份码</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span>剩余 {twoFactorStatus.backupCodesRemaining} 个备份码</span>
                </div>
                <Button variant="outline" size="sm" onClick={generateBackupCodes} disabled={isGeneratingCodes}>
                  {isGeneratingCodes ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    "生成新的备份码"
                  )}
                </Button>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>安全提示</AlertTitle>
              <AlertDescription>定期更改您的双因素认证方法和备份码，以提高账户安全性。</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" onClick={disableTwoFactor} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                "禁用双因素认证"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>设置双因素认证</CardTitle>
            <CardDescription>
              双因素认证为您的账户添加额外的安全层。设置后，您需要提供第二个验证因素才能登录。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as TwoFactorMethod)}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="app">认证器应用</TabsTrigger>
                <TabsTrigger value="sms">短信验证</TabsTrigger>
                <TabsTrigger value="email">电子邮件</TabsTrigger>
                <TabsTrigger value="backup">备份码</TabsTrigger>
              </TabsList>

              <TabsContent value="app" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">使用认证器应用</h3>
                  <p className="text-sm text-muted-foreground">
                    使用 Google Authenticator、Microsoft Authenticator 或其他认证器应用扫描下方的二维码。
                  </p>
                </div>

                {qrCodeUrl ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="border p-4 rounded-lg">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="认证器二维码" className="w-48 h-48" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">密钥:</span>
                      <code className="bg-muted px-2 py-1 rounded text-sm">{secretKey}</code>
                      <Button variant="ghost" size="icon" onClick={() => copyToClipboard(secretKey)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={generateAuthenticatorData}>
                    <QrCode className="mr-2 h-4 w-4" />
                    生成二维码
                  </Button>
                )}

                {qrCodeUrl && (
                  <div className="space-y-2">
                    <Label htmlFor="app-code">输入应用生成的验证码</Label>
                    <div className="flex gap-2">
                      <Input
                        id="app-code"
                        placeholder="6位数验证码"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button onClick={verifyAndEnable} disabled={isVerifying || !verificationCode}>
                        {isVerifying ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            验证中...
                          </>
                        ) : (
                          "验证并启用"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">使用短信验证</h3>
                  <p className="text-sm text-muted-foreground">我们将向您的手机发送包含验证码的短信。</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">手机号码</Label>
                  <Input
                    id="phone-number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="输入手机号码"
                  />
                </div>

                <Button onClick={() => toast({ title: "验证码已发送", description: "请检查您的手机" })}>
                  发送验证码
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="sms-code">输入短信验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sms-code"
                      placeholder="6位数验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={verifyAndEnable} disabled={isVerifying || !verificationCode}>
                      {isVerifying ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          验证中...
                        </>
                      ) : (
                        "验证并启用"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">使用电子邮件验证</h3>
                  <p className="text-sm text-muted-foreground">我们将向您的电子邮件地址发送包含验证码的邮件。</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-address">电子邮件地址</Label>
                  <Input
                    id="email-address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="输入电子邮件地址"
                  />
                </div>

                <Button onClick={() => toast({ title: "验证码已发送", description: "请检查您的邮箱" })}>
                  发送验证码
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="email-code">输入邮件验证码</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email-code"
                      placeholder="6位数验证码"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                    <Button onClick={verifyAndEnable} disabled={isVerifying || !verificationCode}>
                      {isVerifying ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          验证中...
                        </>
                      ) : (
                        "验证并启用"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="backup" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">使用备份码</h3>
                  <p className="text-sm text-muted-foreground">
                    备份码可在您无法使用主要验证方法时使用。请将这些代码保存在安全的地方。
                  </p>
                </div>

                {backupCodes.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <code className="text-sm">{code}</code>
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(code)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>重要提示</AlertTitle>
                      <AlertDescription>这些备份码只会显示一次。请立即将它们保存在安全的地方。</AlertDescription>
                    </Alert>
                    <Button onClick={verifyAndEnable}>我已保存备份码，启用双因素认证</Button>
                  </div>
                ) : (
                  <Button onClick={generateBackupCodes} disabled={isGeneratingCodes}>
                    {isGeneratingCodes ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      "生成备份码"
                    )}
                  </Button>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Alert className="w-full">
              <Shield className="h-4 w-4" />
              <AlertTitle>提高账户安全性</AlertTitle>
              <AlertDescription>
                启用双因素认证后，即使有人知道您的密码，也无法访问您的账户，除非他们也能获取到您的第二个验证因素。
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
