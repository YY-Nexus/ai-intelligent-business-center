"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, ClipboardList, UserPlus, Plus, Calendar } from "lucide-react"
import type { Problem } from "./auto-fix-engine"

// 团队类型
interface Team {
  id: string
  name: string
  description: string
  members: TeamMember[]
}

// 团队成员类型
interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatarUrl?: string
}

// 任务类型
interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "failed"
  priority: "low" | "medium" | "high" | "critical"
  assignedTo: string
  createdBy: string
  createdAt: string
  dueDate?: string
  completedAt?: string
  problemId?: string
  teamId: string
}

interface TeamCollaborationProps {
  problems: Problem[]
  onTaskCreated?: (task: Task) => void
}

export function TeamCollaboration({ problems, onTaskCreated }: TeamCollaborationProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)
  const [isLoadingTasks, setIsLoadingTasks] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
  })
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)

  // 获取团队列表
  const fetchTeams = async () => {
    setIsLoadingTeams(true)
    try {
      const response = await fetch("/api/teams")
      if (!response.ok) {
        throw new Error(`获取团队失败: ${response.status}`)
      }
      const data = await response.json()
      setTeams(data.teams)
      if (data.teams.length > 0 && !selectedTeam) {
        setSelectedTeam(data.teams[0].id)
      }
    } catch (error) {
      console.error("获取团队错误:", error)
    } finally {
      setIsLoadingTeams(false)
    }
  }

  // 获取任务列表
  const fetchTasks = async (teamId?: string) => {
    setIsLoadingTasks(true)
    try {
      const url = teamId ? `/api/tasks?teamId=${teamId}` : "/api/tasks"
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`获取任务失败: ${response.status}`)
      }
      const data = await response.json()
      setTasks(data.tasks)
    } catch (error) {
      console.error("获取任务错误:", error)
    } finally {
      setIsLoadingTasks(false)
    }
  }

  // 初始加载
  useEffect(() => {
    fetchTeams()
  }, [])

  // 当选择的团队变化时，获取该团队的任务
  useEffect(() => {
    if (selectedTeam) {
      fetchTasks(selectedTeam)
    }
  }, [selectedTeam])

  // 创建新任务
  const createTask = async () => {
    if (!selectedTeam || !newTask.title) return

    try {
      const taskToCreate = {
        ...newTask,
        teamId: selectedTeam,
        problemId: selectedProblem || undefined,
        createdBy: "user-1", // 假设当前用户ID
        assignedTo: newTask.assignedTo || "user-1", // 如果未分配，则分配给自己
        createdAt: new Date().toISOString(),
      }

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task: taskToCreate }),
      })

      if (!response.ok) {
        throw new Error(`创建任务失败: ${response.status}`)
      }

      const data = await response.json()

      // 更新任务列表
      setTasks([data.task, ...tasks])

      // 重置表单
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
      })
      setSelectedProblem(null)

      // 关闭对话框
      setIsCreateTaskDialogOpen(false)

      // 回调
      if (onTaskCreated) {
        onTaskCreated(data.task)
      }
    } catch (error) {
      console.error("创建任务错误:", error)
    }
  }

  // 获取团队成员
  const getTeamMembers = (): TeamMember[] => {
    if (!selectedTeam) return []
    const team = teams.find((t) => t.id === selectedTeam)
    return team ? team.members : []
  }

  // 获取成员名称
  const getMemberName = (memberId: string): string => {
    for (const team of teams) {
      const member = team.members.find((m) => m.id === memberId)
      if (member) return member.name
    }
    return "未知用户"
  }

  // 获取问题名称
  const getProblemName = (problemId?: string): string => {
    if (!problemId) return "无关联问题"
    const problem = problems.find((p) => p.id === problemId)
    return problem ? problem.name : "未知问题"
  }

  // 获取任务状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">待处理</Badge>
      case "in-progress":
        return <Badge variant="secondary">进行中</Badge>
      case "completed":
        return (
          <Badge variant="default" className="bg-green-600">
            已完成
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">失败</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 获取优先级标签
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive">紧急</Badge>
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-600">
            高
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-600">
            中
          </Badge>
        )
      case "low":
        return <Badge variant="outline">低</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  // 格式化日期
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "未设置"
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 从问题创建任务
  const createTaskFromProblem = (problem: Problem) => {
    setNewTask({
      title: `修复: ${problem.name}`,
      description: `修复问题: ${problem.description}`,
      priority:
        problem.severity === "critical"
          ? "critical"
          : problem.severity === "high"
            ? "high"
            : problem.severity === "medium"
              ? "medium"
              : "low",
      status: "pending",
    })
    setSelectedProblem(problem.id)
    setIsCreateTaskDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              团队协作
            </CardTitle>
            <CardDescription>分配和跟踪修复任务</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateTaskDialogOpen} onOpenChange={setIsCreateTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  创建任务
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>创建新任务</DialogTitle>
                  <DialogDescription>创建一个新的修复任务并分配给团队成员</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      任务标题
                    </label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="输入任务标题"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      任务描述
                    </label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="输入任务描述"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="priority" className="text-sm font-medium">
                        优先级
                      </label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="选择优先级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="critical">紧急</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="assignee" className="text-sm font-medium">
                        分配给
                      </label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger id="assignee">
                          <SelectValue placeholder="选择成员" />
                        </SelectTrigger>
                        <SelectContent>
                          {getTeamMembers().map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} ({member.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">
                      截止日期
                    </label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="problem" className="text-sm font-medium">
                      关联问题
                    </label>
                    <Select value={selectedProblem || "none"} onValueChange={setSelectedProblem}>
                      <SelectTrigger id="problem">
                        <SelectValue placeholder="选择关联问题" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">无关联问题</SelectItem>
                        {problems.map((problem) => (
                          <SelectItem key={problem.id} value={problem.id}>
                            {problem.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateTaskDialogOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={createTask} disabled={!newTask.title}>
                    创建任务
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks" className="flex items-center">
              <ClipboardList className="mr-2 h-4 w-4" />
              任务列表
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              团队成员
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <div className="mb-4">
              <Select value={selectedTeam || ""} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="选择团队" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoadingTasks ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="mx-auto h-12 w-12 mb-4 animate-pulse" />
                <p>加载任务中...</p>
              </div>
            ) : tasks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>优先级</TableHead>
                    <TableHead>分配给</TableHead>
                    <TableHead>截止日期</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground">{getProblemName(task.problemId)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>{getMemberName(task.assignedTo).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{getMemberName(task.assignedTo)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                          {formatDate(task.dueDate)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>暂无任务</p>
                <p className="text-sm">点击"创建任务"按钮创建新任务</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="teams">
            {isLoadingTeams ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 animate-pulse" />
                <p>加载团队中...</p>
              </div>
            ) : teams.length > 0 ? (
              <div className="space-y-6">
                {teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>{team.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {team.members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{member.name}</div>
                                <div className="text-sm text-muted-foreground">{member.role}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              查看任务
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        添加成员
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>暂无团队</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>团队协作功能可帮助您分配和跟踪修复任务</div>
        <Button variant="link" size="sm" className="h-auto p-0">
          查看所有任务
        </Button>
      </CardFooter>
    </Card>
  )
}
