import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"

export const metadata: Metadata = {
  title: "个人资料 | API OS",
  description: "管理您的个人资料和账户设置",
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">个人资料</h1>
        <p className="text-muted-foreground">管理您的个人资料信息和账户设置。</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="profile">基本信息</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>
        <Card className="mt-4 border rounded-lg">
          <TabsContent value="profile" className="p-4">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="security" className="p-4">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="notifications" className="p-4">
            <NotificationSettings />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  )
}
