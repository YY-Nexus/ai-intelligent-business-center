"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  Notification,
  type NotificationSettings,
  type SystemAuditNotification,
  type RepairNotification,
} from "./notification-types"

// 默认通知设置
const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  desktopNotifications: true,
  emailNotifications: false,
  notifyOnAuditComplete: true,
  notifyOnIssueDetected: true,
  notifyOnRepairStarted: true,
  notifyOnRepairComplete: true,
  notifyOnSystemUpdates: true,
  digestMode: "realtime",
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  settings: NotificationSettings
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  addSystemAuditNotification: (notification: Omit<SystemAuditNotification, "id" | "timestamp" | "read">) => void
  addRepairNotification: (notification: Omit<RepairNotification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  updateSettings: (settings: Partial<NotificationSettings>) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const unreadCount = notifications.filter((n) => !n.read).length

  // 从本地存储加载通知和设置
  useEffect(() => {
    const storedNotifications = localStorage.getItem("notifications")
    const storedSettings = localStorage.getItem("notificationSettings")

    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications)
        // 将字符串日期转换回Date对象
        const processedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
        setNotifications(processedNotifications)
      } catch (error) {
        console.error("加载通知失败:", error)
      }
    }

    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch (error) {
        console.error("加载通知设置失败:", error)
      }
    }
  }, [])

  // 保存通知和设置到本地存储
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings))
  }, [settings])

  // 发送桌面通知
  const sendDesktopNotification = (notification: Notification) => {
    if (settings.desktopNotifications && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/images/yanyu-cloud-logo.png",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(notification.title, {
              body: notification.message,
              icon: "/images/yanyu-cloud-logo.png",
            })
          }
        })
      }
    }
  }

  // 添加通知
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    if (!settings.enabled) return

    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // 发送桌面通知
    if (settings.desktopNotifications) {
      sendDesktopNotification(newNotification)
    }

    // 这里可以添加发送邮件通知的逻辑
    if (settings.emailNotifications && settings.emailAddress) {
      // 调用发送邮件的API
      console.log(`发送邮件通知到 ${settings.emailAddress}`)
    }
  }

  // 添加系统审计通知
  const addSystemAuditNotification = (notification: Omit<SystemAuditNotification, "id" | "timestamp" | "read">) => {
    if (!settings.enabled) return
    if (!settings.notifyOnAuditComplete && !settings.notifyOnIssueDetected) return

    // 如果是问题检测通知但设置为不通知，则返回
    if (notification.issueType && !settings.notifyOnIssueDetected) return

    // 如果是审计完成通知但设置为不通知，则返回
    if (!notification.issueType && !settings.notifyOnAuditComplete) return

    addNotification(notification)
  }

  // 添加修复通知
  const addRepairNotification = (notification: Omit<RepairNotification, "id" | "timestamp" | "read">) => {
    if (!settings.enabled) return

    // 根据修复状态和设置决定是否发送通知
    if (notification.status === "started" && !settings.notifyOnRepairStarted) return
    if (notification.status === "completed" && !settings.notifyOnRepairComplete) return
    if (notification.status === "failed" && !settings.notifyOnRepairComplete) return

    addNotification(notification)
  }

  // 标记通知为已读
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // 删除通知
  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  // 清除所有通知
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // 更新通知设置
  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const value = {
    notifications,
    unreadCount,
    settings,
    addNotification,
    addSystemAuditNotification,
    addRepairNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    updateSettings,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
