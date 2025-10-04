"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { YanYuLogo } from "@/components/ui/yanyu-logo"
import {
  Activity,
  Boxes,
  Code,
  Cpu,
  Home,
  List,
  ShoppingCart,
  Settings,
  LineChart,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Brain,
  Lightbulb,
  Target,
} from "lucide-react"

// 导航项接口
interface NavItemProps {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
  badge?: string | number
  badgeColor?: "default" | "success" | "warning" | "danger" | "info" | "new" | "ai"
  onClick?: () => void
  children?: React.ReactNode
  description?: string
  isAI?: boolean
}

// 导航项组件
function NavItem({
  icon,
  label,
  href,
  isActive = false,
  badge,
  badgeColor = "default",
  onClick,
  children,
  description,
  isAI = false,
}: NavItemProps) {
  const [isOpen, setIsOpen] = useState(isActive)
  const hasChildren = Boolean(children)

  const badgeColorClasses = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-400",
    new: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg",
    ai: "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg animate-pulse-glow",
  }

  useEffect(() => {
    if (isActive && hasChildren) {
      setIsOpen(true)
    }
  }, [isActive, hasChildren])

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
    if (onClick) onClick()
  }

  return (
    <div className="flex flex-col">
      {hasChildren ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all cursor-pointer group",
            isActive
              ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-blue-600 dark:from-blue-500/20 dark:to-cyan-500/10 dark:text-blue-400 shadow-md"
              : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground",
            isAI && "border border-purple-200/50 dark:border-purple-800/50",
          )}
          onClick={handleClick}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all",
              isActive && "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30",
              isAI && "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{label}</span>
              {isAI && <Brain className="ml-1 h-3 w-3 text-purple-500" />}
              {badge && (
                <span
                  className={cn(
                    "ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                    badgeColorClasses[badgeColor],
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          <div className="transition-transform duration-200">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
      ) : (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all group",
            isActive
              ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-blue-600 dark:from-blue-500/20 dark:to-cyan-500/10 dark:text-blue-400 shadow-md"
              : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground",
            isAI && "border border-purple-200/50 dark:border-purple-800/50",
          )}
          onClick={onClick}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all",
              isActive && "text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30",
              isAI && "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">{label}</span>
              {isAI && <Brain className="ml-1 h-3 w-3 text-purple-500" />}
              {badge && (
                <span
                  className={cn(
                    "ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                    badgeColorClasses[badgeColor],
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </Link>
      )}
      {hasChildren && isOpen && (
        <div className="ml-4 pl-4 border-l border-gradient-to-b from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}

// AI模型项组件
function AIModelItem({
  icon,
  name,
  provider,
  href,
  isActive = false,
  isNew = false,
  capability,
  iconBgColor,
}: {
  icon: React.ReactNode
  name: string
  provider: string
  href: string
  isActive?: boolean
  isNew?: boolean
  capability: string
  iconBgColor: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all group border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50",
        isActive
          ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 text-blue-600 dark:from-blue-500/20 dark:to-cyan-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50 shadow-md"
          : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground",
      )}
    >
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg shadow-sm", iconBgColor)}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">{name}</span>
          {isNew && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              新
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{provider}</p>
        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 truncate">{capability}</p>
      </div>
    </Link>
  )
}

// 导航组组件
function NavGroup({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2">
        {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
        <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

// 主侧边栏组件
export function EnhancedSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isMounted, setIsMounted] = useState(false)

  // 检查路径是否匹配或是子路径
  const isPathActive = (path: string) => {
    if (path === "/") {
      return pathname === "/"
    }
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // 检查AI模型路径
  const isModelPathActive = (modelPath: string) => {
    return pathname === modelPath || pathname.startsWith(`${modelPath}/`)
  }

  // 检查带有tab参数的路径
  const isTabActive = (path: string, tab: string) => {
    return pathname === path && searchParams.get("tab") === tab
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <aside className="w-72 flex flex-col border-r bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo区域 */}
      <div className="p-4 border-b border-blue-100 dark:border-blue-900/30">
        <Link href="/" className="flex items-center">
          <YanYuLogo size="md" animated="hover" className="transition-all duration-300" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-6">
          {/* 智能导航 */}
          <NavGroup title="智能导航" icon={<Lightbulb className="h-4 w-4" />}>
            <NavItem
              icon={<Home className="h-4 w-4" />}
              label="智能门户"
              href="/"
              isActive={isPathActive("/")}
              description="AI驱动的工作台"
              isAI={true}
            />
            <NavItem
              icon={<Activity className="h-4 w-4" />}
              label="智能看板"
              href="/dashboard"
              isActive={isPathActive("/dashboard")}
              description="实时数据洞察"
              isAI={true}
            />
            <NavItem
              icon={<List className="h-4 w-4" />}
              label="API中心"
              href="/api-config"
              isActive={isPathActive("/api-config") && !searchParams.has("tab")}
              description="统一接口管理"
            />
            <NavItem
              icon={<Settings className="h-4 w-4" />}
              label="系统设置"
              href="/settings"
              isActive={isPathActive("/settings")}
              description="个性化配置"
            />
          </NavGroup>

          {/* AI大模型中心 */}
          <div className="rounded-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 p-4 border border-purple-200/20 dark:border-purple-800/20">
            <NavGroup title="AI大模型中心" icon={<Brain className="h-4 w-4" />}>
              <div className="space-y-2 py-2">
                <AIModelItem
                  icon={<Cpu className="h-5 w-5 text-purple-400" />}
                  name="GLM-4V"
                  provider="智谱AI"
                  capability="多模态理解"
                  href="/api-config/glm4v"
                  isActive={isModelPathActive("/api-config/glm4v")}
                  isNew={true}
                  iconBgColor="bg-gradient-to-br from-purple-500/20 to-purple-600/30"
                />
                <AIModelItem
                  icon={<ImageIcon className="h-5 w-5 text-pink-400" />}
                  name="CogView"
                  provider="智源研究院"
                  capability="图像生成"
                  href="/api-config/cogview"
                  isActive={isModelPathActive("/api-config/cogview")}
                  iconBgColor="bg-gradient-to-br from-pink-500/20 to-pink-600/30"
                />
                <AIModelItem
                  icon={<Code className="h-5 w-5 text-green-400" />}
                  name="CodeGeeX"
                  provider="智谱AI"
                  capability="代码生成"
                  href="/api-documentation/codegeex"
                  isActive={isModelPathActive("/api-documentation/codegeex")}
                  iconBgColor="bg-gradient-to-br from-green-500/20 to-green-600/30"
                />
              </div>
            </NavGroup>
          </div>

          {/* 商业引擎 */}
          <NavGroup title="商业引擎" icon={<Target className="h-4 w-4" />}>
            <NavItem
              icon={<ShoppingCart className="h-4 w-4" />}
              label="电商引擎"
              href="/ecommerce-engine"
              isActive={isPathActive("/ecommerce-engine")}
              badge="AI"
              badgeColor="ai"
              description="智能电商解决方案"
              isAI={true}
            >
              <NavItem
                icon={<Activity className="h-4 w-4" />}
                label="市场分析"
                href="/ecommerce-engine?tab=market-analysis"
                isActive={isTabActive("/ecommerce-engine", "market-analysis")}
                isAI={true}
              />
              <NavItem
                icon={<Boxes className="h-4 w-4" />}
                label="产品优化"
                href="/ecommerce-engine?tab=product-optimizer"
                isActive={isTabActive("/ecommerce-engine", "product-optimizer")}
                isAI={true}
              />
              <NavItem
                icon={<LineChart className="h-4 w-4" />}
                label="定价策略"
                href="/ecommerce-engine?tab=pricing-strategy"
                isActive={isTabActive("/ecommerce-engine", "pricing-strategy")}
                isAI={true}
              />
            </NavItem>
          </NavGroup>

          {/* 其他现有导航项... */}
          {/* 这里保留原有的其他导航项，但应用新的设计风格 */}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-blue-100 dark:border-blue-900/30">
        <div className="text-center">
          <YanYuLogo size="xs" variant="text-only" />
          <p className="text-xs text-muted-foreground mt-1">AI驱动的智能平台</p>
        </div>
      </div>
    </aside>
  )
}
