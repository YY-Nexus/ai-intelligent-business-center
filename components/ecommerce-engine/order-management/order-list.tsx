"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Printer,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Order {
  id: string
  orderNumber: string
  customer: string
  date: string
  total: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  platform: string
  items: number
  paymentMethod: string
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2023-1248",
    customer: "张三",
    date: "2023-05-14 14:30:22",
    total: "¥1,245.00",
    status: "pending",
    platform: "淘宝/天猫",
    items: 3,
    paymentMethod: "支付宝",
  },
  {
    id: "2",
    orderNumber: "ORD-2023-1247",
    customer: "李四",
    date: "2023-05-14 13:25:18",
    total: "¥856.50",
    status: "processing",
    platform: "抖音小店",
    items: 2,
    paymentMethod: "微信支付",
  },
  {
    id: "3",
    orderNumber: "ORD-2023-1246",
    customer: "王五",
    date: "2023-05-14 12:15:45",
    total: "¥2,156.00",
    status: "shipped",
    platform: "淘宝/天猫",
    items: 5,
    paymentMethod: "支付宝",
  },
  {
    id: "4",
    orderNumber: "ORD-2023-1245",
    customer: "赵六",
    date: "2023-05-14 11:05:32",
    total: "¥458.00",
    status: "delivered",
    platform: "自营网站",
    items: 1,
    paymentMethod: "银联",
  },
  {
    id: "5",
    orderNumber: "ORD-2023-1244",
    customer: "钱七",
    date: "2023-05-14 10:45:18",
    total: "¥1,856.00",
    status: "cancelled",
    platform: "抖音小店",
    items: 4,
    paymentMethod: "微信支付",
  },
  {
    id: "6",
    orderNumber: "ORD-2023-1243",
    customer: "孙八",
    date: "2023-05-14 09:30:22",
    total: "¥756.50",
    status: "delivered",
    platform: "淘宝/天猫",
    items: 2,
    paymentMethod: "支付宝",
  },
  {
    id: "7",
    orderNumber: "ORD-2023-1242",
    customer: "周九",
    date: "2023-05-14 08:15:45",
    total: "¥1,245.00",
    status: "delivered",
    platform: "抖音小店",
    items: 3,
    paymentMethod: "微信支付",
  },
  {
    id: "8",
    orderNumber: "ORD-2023-1241",
    customer: "吴十",
    date: "2023-05-13 18:05:32",
    total: "¥3,456.00",
    status: "shipped",
    platform: "自营网站",
    items: 6,
    paymentMethod: "银联",
  },
  {
    id: "9",
    orderNumber: "ORD-2023-1240",
    customer: "郑十一",
    date: "2023-05-13 17:45:18",
    total: "¥956.00",
    status: "processing",
    platform: "淘宝/天猫",
    items: 2,
    paymentMethod: "支付宝",
  },
  {
    id: "10",
    orderNumber: "ORD-2023-1239",
    customer: "王十二",
    date: "2023-05-13 16:30:22",
    total: "¥1,856.50",
    status: "pending",
    platform: "抖音小店",
    items: 4,
    paymentMethod: "微信支付",
  },
]

function getStatusBadge(status: Order["status"]) {
  switch (status) {
    case "pending":
      return <Badge className="bg-blue-500">待付款</Badge>
    case "processing":
      return <Badge className="bg-amber-500">待发货</Badge>
    case "shipped":
      return <Badge className="bg-purple-500">已发货</Badge>
    case "delivered":
      return <Badge className="bg-green-500">已完成</Badge>
    case "cancelled":
      return <Badge className="bg-red-500">已取消</Badge>
  }
}

export function OrderList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order)
    setIsViewDialogOpen(true)
  }

  // 过滤和排序订单
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || order.status === statusFilter
      const matchesPlatform = platformFilter === "all" || order.platform === platformFilter

      return matchesSearch && matchesStatus && matchesPlatform
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>订单列表</CardTitle>
          <CardDescription>查看和管理所有订单</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索订单号或客户..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
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
                    <SelectItem value="pending">待付款</SelectItem>
                    <SelectItem value="processing">待发货</SelectItem>
                    <SelectItem value="shipped">已发货</SelectItem>
                    <SelectItem value="delivered">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="平台" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有平台</SelectItem>
                    <SelectItem value="淘宝/天猫">淘宝/天猫</SelectItem>
                    <SelectItem value="抖音小店">抖音小店</SelectItem>
                    <SelectItem value="自营网站">自营网站</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              >
                {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>显示选项</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Checkbox id="show-items" className="mr-2" />
                    <label htmlFor="show-items">显示商品数量</label>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox id="show-payment" className="mr-2" />
                    <label htmlFor="show-payment">显示支付方式</label>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>刷新数据</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                onCheckedChange={toggleAllOrders}
              />
              <label htmlFor="select-all" className="text-sm text-muted-foreground">
                已选择 {selectedOrders.length} 个订单
              </label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={selectedOrders.length === 0}
              >
                <Printer className="h-3.5 w-3.5" />
                <span>打印</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={selectedOrders.length === 0}
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
                  <TableHead>订单号</TableHead>
                  <TableHead>客户</TableHead>
                  <TableHead>日期</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>平台</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <>
                      <TableRow key={order.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedOrders.includes(order.id)}
                              onCheckedChange={() => toggleOrderSelection(order.id)}
                            />
                            <button
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              className="focus:outline-none"
                            >
                              {expandedOrder === order.id ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.platform}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>订单操作</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>编辑订单</DropdownMenuItem>
                                <DropdownMenuItem>发送通知</DropdownMenuItem>
                                <DropdownMenuItem>打印订单</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">取消订单</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedOrder === order.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-muted/30 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">订单详情</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">订单号:</span>
                                    <span>{order.orderNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">下单日期:</span>
                                    <span>{order.date}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">商品数量:</span>
                                    <span>{order.items}件</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">支付方式:</span>
                                    <span>{order.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">客户信息</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">姓名:</span>
                                    <span>{order.customer}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">电话:</span>
                                    <span>138****1234</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">邮箱:</span>
                                    <span>user@example.com</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">地址:</span>
                                    <span>北京市朝阳区...</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">订单状态</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">当前状态:</span>
                                    <span>{getStatusBadge(order.status)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">支付状态:</span>
                                    <span>
                                      {order.status === "pending" ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                        >
                                          未支付
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        >
                                          已支付
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">物流状态:</span>
                                    <span>
                                      {order.status === "pending" || order.status === "processing" ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                        >
                                          待发货
                                        </Badge>
                                      ) : order.status === "shipped" ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                        >
                                          运输中
                                        </Badge>
                                      ) : order.status === "delivered" ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                        >
                                          已送达
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                        >
                                          已取消
                                        </Badge>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">更新时间:</span>
                                    <span>{order.date}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                              <Button variant="outline" size="sm">
                                查看详情
                              </Button>
                              {order.status === "processing" && <Button size="sm">发货</Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      没有找到匹配的订单
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              显示 {filteredOrders.length} 个订单中的 {Math.min(10, filteredOrders.length)} 个
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
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>查看订单 {currentOrder?.orderNumber} 的详细信息</DialogDescription>
          </DialogHeader>

          {currentOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">订单信息</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">订单号:</span>
                      <span>{currentOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">下单日期:</span>
                      <span>{currentOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">平台:</span>
                      <span>{currentOrder.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">支付方式:</span>
                      <span>{currentOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">订单状态:</span>
                      <span>{getStatusBadge(currentOrder.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">客户信息</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">姓名:</span>
                      <span>{currentOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">电话:</span>
                      <span>138****1234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">邮箱:</span>
                      <span>user@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">收货地址:</span>
                      <span>北京市朝阳区...</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">配送信息</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">配送方式:</span>
                      <span>快递</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">物��公司:</span>
                      <span>顺丰速运</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">运单号:</span>
                      <span>SF1234567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">发货时间:</span>
                      <span>2023-05-14 15:30:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">预计送达:</span>
                      <span>2023-05-16</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">订单商品</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>商品</TableHead>
                        <TableHead>单价</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead className="text-right">小计</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <img
                                src="/placeholder.svg?key=zihhd"
                                alt="产品图片"
                                className="h-full w-full object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <p className="font-medium">超薄笔记本电脑</p>
                              <p className="text-xs text-muted-foreground">SKU: PRD-001</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>¥4,999.00</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell className="text-right">¥4,999.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <img
                                src="/placeholder.svg?key=hjodt"
                                alt="产品图片"
                                className="h-full w-full object-cover rounded-md"
                              />
                            </div>
                            <div>
                              <p className="font-medium">无线蓝牙耳机</p>
                              <p className="text-xs text-muted-foreground">SKU: PRD-002</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>¥299.00</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell className="text-right">¥598.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">订单金额</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">商品总额:</span>
                    <span>¥5,597.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">运费:</span>
                    <span>¥0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">优惠金额:</span>
                    <span>-¥200.00</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>订单总额:</span>
                    <span>{currentOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">订单日志</h3>
                <div className="space-y-2">
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground">2023-05-14 14:30:22</span>
                    <span>订单创建</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground">2023-05-14 14:35:18</span>
                    <span>订单支付成功</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <span className="text-muted-foreground">2023-05-14 15:30:00</span>
                    <span>订单已发货</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              关闭
            </Button>
            <Button>打印订单</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
