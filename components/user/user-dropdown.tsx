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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user/user-avatar"
import { useToast } from "@/components/ui/use-toast"
import { User, Settings, LogOut, CreditCard, Bell, HelpCircle, FileText, Shield } from "lucide-react"

interface UserDropdownProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // 默认用户信息，如果没有提供用户信息
  const defaultUser = {
    name: "测试用户",
    email: "user@example.com",
    role: "用户",
  }

  const currentUser = user || defaultUser

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // 这里应该调用实际的登出API
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "已成功退出登录",
        description: "您已安全退出系统",
      })

      // 重定向到登录页面
      router.push("/auth/login")
    } catch (error) {
      toast({
        title: "退出登录失败",
        description: "请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleItemClick = (href: string) => {
    router.push(href)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar user={currentUser} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name || "未登录用户"}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentUser.email || "请登录账户"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleItemClick("/user/profile")} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>个人资料</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick("/dashboard")} className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            <span>我的仪表盘</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick("/user/billing")} className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>账单与订阅</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick("/settings")} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>设置</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleItemClick("/user/security")} className="cursor-pointer">
            <Shield className="mr-2 h-4 w-4" />
            <span>安全设置</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleItemClick("/user/notifications")} className="cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>通知偏好</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleItemClick("/help")} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>帮助与支持</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "退出中..." : "退出登录"}</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
