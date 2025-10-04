import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Notification } from "@/lib/notifications/notification-types"

// 模拟数据库中的通知
let notifications: Notification[] = []

export async function GET(request: NextRequest) {
  // 获取查询参数
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  // 过滤通知
  let filteredNotifications = [...notifications]
  if (unreadOnly) {
    filteredNotifications = filteredNotifications.filter((n) => !n.read)
  }

  // 限制返回数量并按时间排序
  filteredNotifications = filteredNotifications
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)

  return NextResponse.json({ notifications: filteredNotifications })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // 验证必填字段
    if (!data.title || !data.message || !data.level || !data.source) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 })
    }

    // 创建新通知
    const newNotification: Notification = {
      id: uuidv4(),
      title: data.title,
      message: data.message,
      level: data.level,
      source: data.source,
      timestamp: new Date(),
      read: false,
      actionUrl: data.actionUrl,
      actionLabel: data.actionLabel,
      ...data,
    }

    // 添加到通知列表
    notifications.unshift(newNotification)

    return NextResponse.json({ notification: newNotification })
  } catch (error) {
    console.error("创建通知失败:", error)
    return NextResponse.json({ error: "创建通知失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // 验证必填字段
    if (!data.id) {
      return NextResponse.json({ error: "缺少通知ID" }, { status: 400 })
    }

    // 查找并更新通知
    const index = notifications.findIndex((n) => n.id === data.id)
    if (index === -1) {
      return NextResponse.json({ error: "通知不存在" }, { status: 404 })
    }

    // 更新通知
    notifications[index] = {
      ...notifications[index],
      ...data,
    }

    return NextResponse.json({ notification: notifications[index] })
  } catch (error) {
    console.error("更新通知失败:", error)
    return NextResponse.json({ error: "更新通知失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  // 获取查询参数
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const clearAll = searchParams.get("clearAll") === "true"

  if (clearAll) {
    // 清除所有通知
    notifications = []
    return NextResponse.json({ success: true })
  }

  if (!id) {
    return NextResponse.json({ error: "缺少通知ID" }, { status: 400 })
  }

  // 查找并删除通知
  const initialLength = notifications.length
  notifications = notifications.filter((n) => n.id !== id)

  if (notifications.length === initialLength) {
    return NextResponse.json({ error: "通知不存在" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
