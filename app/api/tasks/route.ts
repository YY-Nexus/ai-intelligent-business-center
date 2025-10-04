import { NextResponse } from "next/server"

// 模拟任务数据 - 实际应用中应替换为数据库
const tasksStore = [
  {
    id: "task-1",
    title: "修复CSRF漏洞",
    description: "实现CSRF令牌验证机制",
    status: "pending",
    priority: "high",
    assignedTo: "user-2",
    createdBy: "user-1",
    createdAt: "2023-05-10T08:30:00Z",
    dueDate: "2023-05-15T17:00:00Z",
    problemId: "f3",
    teamId: "team-1",
  },
  {
    id: "task-2",
    title: "优化表单验证",
    description: "为所有表单添加即时验证功能",
    status: "in-progress",
    priority: "medium",
    assignedTo: "user-3",
    createdBy: "user-1",
    createdAt: "2023-05-11T09:15:00Z",
    dueDate: "2023-05-16T17:00:00Z",
    problemId: "i2",
    teamId: "team-1",
  },
  {
    id: "task-3",
    title: "添加环境变量配置",
    description: "创建必要的环境变量配置文件",
    status: "completed",
    priority: "high",
    assignedTo: "user-5",
    createdBy: "user-4",
    createdAt: "2023-05-09T10:00:00Z",
    completedAt: "2023-05-12T14:30:00Z",
    problemId: "c3",
    teamId: "team-2",
  },
]

// 获取任务列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const problemId = searchParams.get("problemId")

    let filteredTasks = [...tasksStore]

    // 按团队过滤
    if (teamId) {
      filteredTasks = filteredTasks.filter((t) => t.teamId === teamId)
    }

    // 按用户过滤
    if (userId) {
      filteredTasks = filteredTasks.filter((t) => t.assignedTo === userId || t.createdBy === userId)
    }

    // 按状态过滤
    if (status) {
      filteredTasks = filteredTasks.filter((t) => t.status === status)
    }

    // 按问题ID过滤
    if (problemId) {
      filteredTasks = filteredTasks.filter((t) => t.problemId === problemId)
    }

    return NextResponse.json({
      success: true,
      tasks: filteredTasks,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("任务API错误:", error)
    return NextResponse.json(
      { error: "获取任务时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

// 创建或更新任务
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { task } = body

    if (!task || !task.title) {
      return NextResponse.json({ error: "需要提供有效的任务信息" }, { status: 400 })
    }

    // 检查任务是否已存在
    const existingIndex = tasksStore.findIndex((t) => t.id === task.id)

    if (existingIndex >= 0) {
      // 更新现有任务
      tasksStore[existingIndex] = { ...tasksStore[existingIndex], ...task }

      return NextResponse.json({
        success: true,
        task: tasksStore[existingIndex],
        updated: true,
        timestamp: new Date().toISOString(),
      })
    } else {
      // 创建新任务
      const newTask = {
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: "pending",
        ...task,
      }

      tasksStore.push(newTask)

      return NextResponse.json({
        success: true,
        task: newTask,
        updated: false,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("任务API错误:", error)
    return NextResponse.json(
      { error: "创建或更新任务时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
