import { NextResponse } from "next/server"

// 模拟团队和成员数据 - 实际应用中应替换为数据库
const teamsStore = [
  {
    id: "team-1",
    name: "前端开发团队",
    description: "负责前端界面和用户体验",
    members: [
      { id: "user-1", name: "张三", role: "团队负责人", email: "zhangsan@example.com" },
      { id: "user-2", name: "李四", role: "高级开发", email: "lisi@example.com" },
      { id: "user-3", name: "王五", role: "开发工程师", email: "wangwu@example.com" },
    ],
  },
  {
    id: "team-2",
    name: "后端开发团队",
    description: "负责API和服务器端逻辑",
    members: [
      { id: "user-4", name: "赵六", role: "团队负责人", email: "zhaoliu@example.com" },
      { id: "user-5", name: "钱七", role: "高级开发", email: "qianqi@example.com" },
    ],
  },
  {
    id: "team-3",
    name: "QA团队",
    description: "负责质量保证和测试",
    members: [
      { id: "user-6", name: "孙八", role: "QA负责人", email: "sunba@example.com" },
      { id: "user-7", name: "周九", role: "测试工程师", email: "zhoujiu@example.com" },
    ],
  },
]

// 模拟任务数据
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

// 获取团队列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("teamId")

    if (teamId) {
      // 获取特定团队
      const team = teamsStore.find((t) => t.id === teamId)

      if (!team) {
        return NextResponse.json({ error: "找不到指定的团队" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        team,
        timestamp: new Date().toISOString(),
      })
    } else {
      // 获取所有团队
      return NextResponse.json({
        success: true,
        teams: teamsStore,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("团队API错误:", error)
    return NextResponse.json(
      { error: "获取团队信息时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
