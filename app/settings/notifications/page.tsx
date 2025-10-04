"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/lib/notifications/notification-context"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function NotificationSettingsPage() {
  const { settings, updateSettings } = useNotifications()
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "设置已保存",
      description: "您的通知设置已成功更新",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">通知设置</h1>
        <Button onClick={handleSaveSettings}>保存设置</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>通知首选项</CardTitle>
          <CardDescription>配置您希望如何接收系统通知</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-enabled">启用通知</Label>
              <p className="text-sm text-muted-foreground">控制是否接收任何类型的通知</p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings({ enabled: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">通知渠道</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="desktop-notifications">桌面通知</Label>
                <p className="text-sm text-muted-foreground">在浏览器中显示桌面通知</p>
              </div>
              <Switch
                id="desktop-notifications"
                checked={settings.desktopNotifications}
                onCheckedChange={(checked) => updateSettings({ desktopNotifications: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">电子邮件通知</Label>
                <p className="text-sm text-muted-foreground">通过电子邮件接收通知</p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSettings({ emailNotifications: checked })}
                disabled={!settings.enabled}
              />
            </div>

            {settings.emailNotifications && (
              <div className="space-y-2">
                <Label htmlFor="email-address">电子邮件地址</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={settings.emailAddress || ""}
                  onChange={(e) => updateSettings({ emailAddress: e.target.value })}
                  disabled={!settings.enabled || !settings.emailNotifications}
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">通知类型</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="audit-complete">审计完成</Label>
                <p className="text-sm text-muted-foreground">系统审计完成时通知我</p>
              </div>
              <Switch
                id="audit-complete"
                checked={settings.notifyOnAuditComplete}
                onCheckedChange={(checked) => updateSettings({ notifyOnAuditComplete: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="issue-detected">问题检测</Label>
                <p className="text-sm text-muted-foreground">检测到系统问题时通知我</p>
              </div>
              <Switch
                id="issue-detected"
                checked={settings.notifyOnIssueDetected}
                onCheckedChange={(checked) => updateSettings({ notifyOnIssueDetected: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="repair-started">修复开始</Label>
                <p className="text-sm text-muted-foreground">系统修复开始时通知我</p>
              </div>
              <Switch
                id="repair-started"
                checked={settings.notifyOnRepairStarted}
                onCheckedChange={(checked) => updateSettings({ notifyOnRepairStarted: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="repair-complete">修复完成</Label>
                <p className="text-sm text-muted-foreground">系统修复完成时通知我</p>
              </div>
              <Switch
                id="repair-complete"
                checked={settings.notifyOnRepairComplete}
                onCheckedChange={(checked) => updateSettings({ notifyOnRepairComplete: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-updates">系统更新</Label>
                <p className="text-sm text-muted-foreground">系统更新和维护信息</p>
              </div>
              <Switch
                id="system-updates"
                checked={settings.notifyOnSystemUpdates}
                onCheckedChange={(checked) => updateSettings({ notifyOnSystemUpdates: checked })}
                disabled={!settings.enabled}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">通知频率</h3>

            <RadioGroup
              value={settings.digestMode}
              onValueChange={(value) => updateSettings({ digestMode: value as "realtime" | "hourly" | "daily" })}
              disabled={!settings.enabled}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="realtime" id="realtime" />
                <Label htmlFor="realtime">实时通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly">每小时摘要</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">每日摘要</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
