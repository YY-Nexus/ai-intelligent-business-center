"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  category: string
  status: "active" | "inactive"
}

interface Notification {
  id: string
  supplierId: string
  supplierName: string
  type: "order" | "inventory" | "delivery" | "quality" | "other"
  subject: string
  content: string
  status: "sent" | "draft" | "scheduled" | "failed"
  date: string
  isRead?: boolean
}

interface Template {
  id: string
  name: string
  type: "order" | "inventory" | "delivery" | "quality" | "other"
  subject: string
  content: string
}

const suppliers: Supplier[] = [
  {
    id: "SUP001",
    name: "北京电子科技有限公司",
    email: "contact@bjtech.com",
    phone: "010-12345678",
    category: "电子产品",
    status: "active",
  },
  {
    id: "SUP002",
    name: "上海数码配件制造商",
    email: "info@shdigital.com",
    phone: "021-87654321",
    category: "配件",
    status: "active",
  },
  {
    id: "SUP003",
    name: "广州智能设备有限公司",
    email: "support@gzsmartdevice.com",
    phone: "020-56781234",
    category: "智能设备",
    status: "active",
  },
  {
    id: "SUP004",
    name: "深圳移动科技有限公司",
    email: "contact@szmobiletech.com",
    phone: "0755-43218765",
    category: "移动设备",
    status: "inactive",
  },
  {
    id: "SUP005",
    name: "杭州网络设备有限公司",
    email: "info@hznetwork.com",
    phone: "0571-98765432",
    category: "网络设备",
    status: "active",
  },
]

const notifications: Notification[] = [
  {
    id: "NOT001",
    supplierId: "SUP001",
    supplierName: "北京电子科技有限公司",
    type: "order",
    subject: "新订单通知 #ORD-2023-1248",
    content: "您有一个新的订单需要处理，订单号：ORD-2023-1248，请在48小时内确认。",
    status: "sent",
    date: "2023-05-14 14:30:22",
    isRead: true,
  },
  {
    id: "NOT002",
    supplierId: "SUP002",
    supplierName: "上海数码配件制造商",
    type: "inventory",
    subject: "库存不足提醒",
    content: '您的产品"无线蓝牙耳机"库存低于安全库存水平，请及时补充。',
    status: "sent",
    date: "2023-05-14 13:25:18",
    isRead: false,
  },
  {
    id: "NOT003",
    supplierId: "SUP003",
    supplierName: "广州智能设备有限公司",
    type: "delivery",
    subject: "发货延迟通知",
    content: "订单 #ORD-2023-1246 的发货时间已超过约定时间，请尽快处理。",
    status: "sent",
    date: "2023-05-14 12:15:45",
    isRead: true,
  },
  {
    id: "NOT004",
    supplierId: "SUP001",
    supplierName: "北京电子科技有限公司",
    type: "quality",
    subject: "产品质量问题反馈",
    content: '最近一批"超薄笔记本电脑"有多起客户反馈屏幕出现问题，请检查并回复。',
    status: "draft",
    date: "2023-05-14 11:05:32",
  },
  {
    id: "NOT005",
    supplierId: "SUP005",
    supplierName: "杭州网络设备有限公司",
    type: "order",
    subject: "订单变更通知 #ORD-2023-1240",
    content: "订单 #ORD-2023-1240 的数量已更新，请查看详情并确认。",
    status: "scheduled",
    date: "2023-05-15 09:00:00",
  },
]

const templates: Template[] = [
  {
    id: "TPL001",
    name: "新订单通知",
    type: "order",
    subject: "新订单通知 #{订单号}",
    content:
      "您有一个新的订单需要处理，订单号：{订单号}，请在48小时内确认。\n\n订单详情：\n- 产品：{产品}\n- 数量：{数量}\n- 交付日期：{交付日期}\n\n请登录供应商平台查看详细信息。",
  },
  {
    id: "TPL002",
    name: "库存不足提醒",
    type: "inventory",
    subject: "库存不足提醒",
    content:
      '您的产品"{产品名称}"库存低于安全库存水平，当前库存：{当前库存}，安全库存：{安全库存}。\n\n请及时补充库存，以免影响销售。',
  },
  {
    id: "TPL003",
    name: "发货延迟通知",
    type: "delivery",
    subject: "发货延迟通知",
    content:
      "订单 #{订单号} 的发货时间已超过约定时间，原定发货日期：{约定日期}，当前状态：{当前状态}。\n\n请尽快处理并更新发货状态，如有问题请及时联系我们。",
  },
  {
    id: "TPL004",
    name: "产品质量问题反馈",
    type: "quality",
    subject: "产品质量问题反馈",
    content:
      '最近一批"{产品名称}"有客户反馈以下问题：\n\n{问题描述}\n\n影响订单：{影响订单}\n影响数量：{影响数量}\n\n请检查并在3个工作日内回复处理方案。',
  },
  {
    id: "TPL005",
    name: "价格调整通知",
    type: "other",
    subject: "价格调整通知",
    content:
      "根据我们的合作协议，以下产品的价格将进行调整：\n\n{产品列表}\n\n新价格将从 {生效日期} 开始生效。如有疑问，请与您的客户经理联系。",
  },
]

export function SupplierNotification() {
  const [activeTab, setActiveTab] = useState("notifications")
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [newNotification, setNewNotification] = useState({
    supplierId: "",
    type: "order",
    subject: "",
    content: "",
  })

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId) ? prev.filter((id) => id !== notificationId) : [...prev, notificationId],
    )
  }

  const toggleAllNotifications = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((notification) => notification.id))
    }
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setNewNotification({
      ...newNotification,
      type: template.type,
      subject: template.subject,
      content: template.content,
    })
    setIsTemplateDialogOpen(false)
  }

  const handleSendNotification = () => {
    // 模拟发送通知
    console.log("Sending notification:", newNotification)
    setIsComposeDialogOpen(false)
    // 重置表单
    setNewNotification({
      supplierId: "",
      type: "order",
      subject: "",
      content: "",
    })
    setSelectedTemplate(null)
  }

  // 过滤通知
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      searchQuery === "" ||
      notification.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.supplierName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>供应商通知</CardTitle>
          <CardDescription>管理和发送供应商通知</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="notifications">通知管理</TabsTrigger>
              <TabsTrigger value="suppliers">供应商管理</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索通知主题或供应商..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-40">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="类型" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类型</SelectItem>
                        <SelectItem value="order">订单通知</SelectItem>
                        <SelectItem value="inventory">库存通知</SelectItem>
                        <SelectItem value="delivery">发货通知</SelectItem>
                        <SelectItem value="quality">质量通知</SelectItem>
                        <SelectItem value="other">其他通知</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="状态" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="sent">已发送</SelectItem>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="scheduled">已计划</SelectItem>
                        <SelectItem value="failed">发送失败</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setIsComposeDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    新建通知
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0
                    }
                    onCheckedChange={toggleAllNotifications}
                  />
                  <label htmlFor="select-all" className="text-sm text-muted-foreground">
                    已选择 {selectedNotifications.length} 个通知
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={selectedNotifications.length === 0}
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>重新发送</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    disabled={selectedNotifications.length === 0}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>导出</span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>主题</TableHead>
                      <TableHead>供应商</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notification) => (
                        <>
                          <TableRow key={notification.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedNotifications.includes(notification.id)}
                                  onCheckedChange={() => toggleNotificationSelection(notification.id)}
                                />
                                <button
                                  onClick={() =>
                                    setExpandedNotification(
                                      expandedNotification === notification.id ? null : notification.id,
                                    )
                                  }
                                  className="focus:outline-none"
                                >
                                  {expandedNotification === notification.id ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {notification.isRead === false && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                                <span className="font-medium">{notification.subject}</span>
                              </div>
                            </TableCell>
                            <TableCell>{notification.supplierName}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  notification.type === "order"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : notification.type === "inventory"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : notification.type === "delivery"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                        : notification.type === "quality"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }
                              >
                                {notification.type === "order"
                                  ? "订单通知"
                                  : notification.type === "inventory"
                                    ? "库存通知"
                                    : notification.type === "delivery"
                                      ? "发货通知"
                                      : notification.type === "quality"
                                        ? "质量通知"
                                        : "其他通知"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  notification.status === "sent"
                                    ? "bg-green-500"
                                    : notification.status === "draft"
                                      ? "bg-gray-500"
                                      : notification.status === "scheduled"
                                        ? "bg-blue-500"
                                        : "bg-red-500"
                                }
                              >
                                {notification.status === "sent"
                                  ? "已发送"
                                  : notification.status === "draft"
                                    ? "草稿"
                                    : notification.status === "scheduled"
                                      ? "已计划"
                                      : "发送失败"}
                              </Badge>
                            </TableCell>
                            <TableCell>{notification.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>通知操作</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      编辑通知
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Send className="h-4 w-4 mr-2" />
                                      重新发送
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      导出通知
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">删除通知</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedNotification === notification.id && (
                            <TableRow>
                              <TableCell colSpan={7} className="bg-muted/30 p-4">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">通知内容</h4>
                                    <div className="p-3 bg-muted rounded-md">
                                      <p className="text-sm whitespace-pre-line">{notification.content}</p>
                                    </div>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                                      <Edit className="h-3.5 w-3.5" />
                                      <span>编辑</span>
                                    </Button>
                                    <Button size="sm" className="flex items-center gap-1">
                                      <Send className="h-3.5 w-3.5" />
                                      <span>重新发送</span>
                                    </Button>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          没有找到匹配的通知
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  显示 {filteredNotifications.length} 个通知中的 {Math.min(10, filteredNotifications.length)} 个
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    下一页
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="suppliers">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="搜索供应商..." className="pl-9" />
                </div>
                <div className="flex gap-2">
                  <div className="w-40">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="类别" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有类别</SelectItem>
                        <SelectItem value="电子产品">电子产品</SelectItem>
                        <SelectItem value="配件">配件</SelectItem>
                        <SelectItem value="智能设备">智能设备</SelectItem>
                        <SelectItem value="移动设备">移动设备</SelectItem>
                        <SelectItem value="网络设备">网络设备</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="状态" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有状态</SelectItem>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">非活跃</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    添加供应商
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>供应商名称</TableHead>
                      <TableHead>类别</TableHead>
                      <TableHead>联系邮箱</TableHead>
                      <TableHead>联系电话</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.category}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>
                          <Badge className={supplier.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                            {supplier.status === "active" ? "活跃" : "非活跃"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => {
                                setNewNotification({
                                  ...newNotification,
                                  supplierId: supplier.id,
                                })
                                setIsComposeDialogOpen(true)
                              }}
                            >
                              <Send className="h-3.5 w-3.5" />
                              <span>发送通知</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>供应商操作</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  编辑供应商
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="h-4 w-4 mr-2" />
                                  通知历史
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">停用供应商</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>创建新通知</DialogTitle>
            <DialogDescription>创建并发送供应商通知</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">选择供应商</Label>
              <Select
                value={newNotification.supplierId}
                onValueChange={(value) => setNewNotification({ ...newNotification, supplierId: value })}
              >
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="选择供应商" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="notification-type">通知类型</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsTemplateDialogOpen(true)}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>使用模板</span>
                </Button>
              </div>
              <Select
                value={newNotification.type}
                onValueChange={(value) =>
                  setNewNotification({
                    ...newNotification,
                    type: value as "order" | "inventory" | "delivery" | "quality" | "other",
                  })
                }
              >
                <SelectTrigger id="notification-type">
                  <SelectValue placeholder="选择通知类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order">订单通知</SelectItem>
                  <SelectItem value="inventory">库存通知</SelectItem>
                  <SelectItem value="delivery">发货通知</SelectItem>
                  <SelectItem value="quality">质量通知</SelectItem>
                  <SelectItem value="other">其他通知</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">通知主题</Label>
              <Input
                id="subject"
                placeholder="输入通知主题"
                value={newNotification.subject}
                onChange={(e) => setNewNotification({ ...newNotification, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">通知内容</Label>
              <Textarea
                id="content"
                placeholder="输入通知内容"
                className="min-h-[200px]"
                value={newNotification.content}
                onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="schedule" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="schedule"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  计划发送
                </label>
                <p className="text-sm text-muted-foreground">选择计划发送时间而不是立即发送</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
              保存为草稿
            </Button>
            <Button onClick={handleSendNotification}>发送通知</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>选择通知模板</DialogTitle>
            <DialogDescription>选择一个预设模板快速创建通知</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>通知类型</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="选择通知类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有类型</SelectItem>
                  <SelectItem value="order">订单通知</SelectItem>
                  <SelectItem value="inventory">库存通知</SelectItem>
                  <SelectItem value="delivery">发货通知</SelectItem>
                  <SelectItem value="quality">质量通知</SelectItem>
                  <SelectItem value="other">其他通知</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>可用模板</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedTemplate?.id === template.id ? "border-primary" : ""
                    }`}
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{template.subject}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            template.type === "order"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : template.type === "inventory"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : template.type === "delivery"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : template.type === "quality"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                          }
                        >
                          {template.type === "order"
                            ? "订单通知"
                            : template.type === "inventory"
                              ? "库存通知"
                              : template.type === "delivery"
                                ? "发货通知"
                                : template.type === "quality"
                                  ? "质量通知"
                                  : "其他通知"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
              取消
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  handleSelectTemplate(selectedTemplate)
                }
              }}
              disabled={!selectedTemplate}
            >
              使用模板
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
