/**
 * 通知类型定义
 */

export type NotificationLevel = "info" | "success" | "warning" | "error"

export interface Notification {
  id: string
  title: string
  message: string
  level: NotificationLevel
  timestamp: Date
  read: boolean
  source: string
  actionUrl?: string
  actionLabel?: string
}

export interface SystemAuditNotification extends Notification {
  auditId?: string
  issueType?: string
  componentName?: string
  repairAvailable?: boolean
}

export interface RepairNotification extends Notification {
  repairId?: string
  status?: "started" | "completed" | "failed"
  affectedComponents?: string[]
}

export interface NotificationSettings {
  enabled: boolean
  desktopNotifications: boolean
  emailNotifications: boolean
  emailAddress?: string
  notifyOnAuditComplete: boolean
  notifyOnIssueDetected: boolean
  notifyOnRepairStarted: boolean
  notifyOnRepairComplete: boolean
  notifyOnSystemUpdates: boolean
  digestMode: "realtime" | "hourly" | "daily"
}
