"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell, Settings, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

// 模拟通知数据
const mockNotifications = [
  {
    id: "1",
    title: "系统更新",
    description: "系统已更新到最新版本",
    time: "10分钟前",
    read: false,
    type: "system",
  },
  {
    id: "2",
    title: "API配额提醒",
    description: "您的GLM-4V API使用量已达到80%",
    time: "1小时前",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "任务完成",
    description: "批量处理任务已完成",
    time: "3小时前",
    read: true,
    type: "success",
  },
]

export function NotificationDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleNotificationClick = (id: string) => {
    // 标记为已读
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))

    // 这里可以根据通知类型导航到不同页面
    setIsOpen(false)
  }

  const handleSettingsClick = () => {
    router.push("/settings/notifications")
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>通知</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-8 text-xs">
              全部标为已读
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn("flex flex-col items-start p-3 cursor-pointer", !notification.read && "bg-muted/50")}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{notification.description}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground text-center">没有新通知</p>
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>通知设置</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
