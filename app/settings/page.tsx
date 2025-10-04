"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { ConnectedApps } from "@/components/settings/connected-apps"
import { AccountManagement } from "@/components/settings/account-management"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">用户设置</h1>
        <p className="text-muted-foreground">管理您的个人资料、安全选项、通知偏好和其他账户设置</p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <div className="overflow-x-auto">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
              <TabsTrigger
                value="profile"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                个人资料
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                安全设置
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                通知偏好
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                界面设置
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                隐私设置
              </TabsTrigger>
              <TabsTrigger
                value="connected-apps"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                连接的应用
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
              >
                账户管理
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <PrivacySettings />
        </TabsContent>

        <TabsContent value="connected-apps" className="space-y-6">
          <ConnectedApps />
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <AccountManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
