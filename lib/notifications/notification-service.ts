/**
 * 通知服务
 * 用于发送和管理系统通知
 */

import type { Notification, SystemAuditNotification, RepairNotification } from "./notification-types"

/**
 * 发送通知到服务器
 * @param notification 通知对象
 */
export async function sendNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    })

    if (!response.ok) {
      throw new Error(`发送通知失败: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("发送通知失败:", error)
    throw error
  }
}

/**
 * 获取通知列表
 * @param limit 限制返回数量
 * @param unreadOnly 是否只返回未读通知
 */
export async function getNotifications(limit = 50, unreadOnly = false) {
  try {
    const response = await fetch(`/api/notifications?limit=${limit}&unreadOnly=${unreadOnly}`)

    if (!response.ok) {
      throw new Error(`获取通知失败: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取通知失败:", error)
    throw error
  }
}

/**
 * 标记通知为已读
 * @param id 通知ID
 */
export async function markNotificationAsRead(id: string) {
  try {
    const response = await fetch("/api/notifications", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, read: true }),
    })

    if (!response.ok) {
      throw new Error(`标记通知已读失败: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("标记通知已读失败:", error)
    throw error
  }
}

/**
 * 删除通知
 * @param id 通知ID
 */
export async function deleteNotification(id: string) {
  try {
    const response = await fetch(`/api/notifications?id=${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`删除通知失败: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("删除通知失败:", error)
    throw error
  }
}

/**
 * 清除所有通知
 */
export async function clearAllNotifications() {
  try {
    const response = await fetch("/api/notifications?clearAll=true", {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`清除所有通知失败: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("清除所有通知失败:", error)
    throw error
  }
}

/**
 * 发送系统审计通知
 */
export async function sendSystemAuditNotification(
  notification: Omit<SystemAuditNotification, "id" | "timestamp" | "read">,
) {
  return sendNotification({
    ...notification,
    source: notification.source || "系统审计",
  })
}

/**
 * 发送修复通知
 */
export async function sendRepairNotification(notification: Omit<RepairNotification, "id" | "timestamp" | "read">) {
  return sendNotification({
    ...notification,
    source: notification.source || "系统修复",
  })
}

/**
 * 发送问题检测通知
 */
export function sendIssueDetectedNotification(componentName: string, issueType: string, message: string) {
  return sendSystemAuditNotification({
    title: `检测到问题: ${componentName}`,
    message,
    level: "warning",
    source: "系统审计",
    componentName,
    issueType,
    repairAvailable: true,
    actionLabel: "查看详情",
    actionUrl: `/system-repair?component=${encodeURIComponent(componentName)}`,
  })
}

/**
 * 发送修复开始通知
 */
export function sendRepairStartedNotification(componentName: string, repairId: string) {
  return sendRepairNotification({
    title: `修复开始: ${componentName}`,
    message: `系统已开始修复 ${componentName} 中的问题`,
    level: "info",
    source: "系统修复",
    repairId,
    status: "started",
    affectedComponents: [componentName],
    actionLabel: "查看进度",
    actionUrl: `/system-repair/history?id=${repairId}`,
  })
}

/**
 * 发送修复完成通知
 */
export function sendRepairCompletedNotification(componentName: string, repairId: string, success: boolean) {
  return sendRepairNotification({
    title: `修复${success ? "完成" : "失败"}: ${componentName}`,
    message: success ? `系统已成功修复 ${componentName} 中的问题` : `系统修复 ${componentName} 中的问题失败`,
    level: success ? "success" : "error",
    source: "系统修复",
    repairId,
    status: success ? "completed" : "failed",
    affectedComponents: [componentName],
    actionLabel: "查看详情",
    actionUrl: `/system-repair/history?id=${repairId}`,
  })
}
