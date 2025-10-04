"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { YanYuLogo } from "@/components/ui/yanyu-logo"
import {
  Activity,
  BarChart2,
  Boxes,
  Code,
  Cpu,
  Database,
  FileText,
  Gauge,
  GitCompare,
  History,
  Home,
  Layers,
  List,
  MessageSquare,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Sparkles,
  Workflow,
  Wrench,
  Settings,
  LineChart,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  ActivityIcon as Function,
  AlertTriangle,
  Zap,
  BarChart,
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
  badgeColor?: "default" | "success" | "warning" | "danger" | "info"
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
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer group smart-interactive micro-interaction",
            isActive
              ? "yanyu-gradient text-white shadow-lg smart-glow"
              : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground",
            isAI && "ai-enhanced gradient-border",
          )}
          onClick={handleClick}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-300",
              isActive && "bg-white/20 backdrop-blur-sm",
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
                    "ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium transition-all duration-300",
                    badgeColorClasses[badgeColor],
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-0.5 opacity-80">{description}</p>}
          </div>
          <div className="transition-transform duration-300 group-hover:scale-110">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
      ) : (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm group smart-interactive micro-interaction nav-enhanced",
            isActive
              ? "yanyu-gradient text-white shadow-lg smart-glow"
              : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground",
            isAI && "ai-enhanced gradient-border",
            isActive && "active",
          )}
          onClick={onClick}
        >
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-300 group-hover:scale-110",
              isActive && "bg-white/20 backdrop-blur-sm",
              isAI && "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30",
            )}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium transition-all duration-300 group-hover:translate-x-1">{label}</span>
              {isAI && <Brain className="ml-1 h-3 w-3 text-purple-500 animate-pulse" />}
              {badge && (
                <span
                  className={cn(
                    "ml-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium transition-all duration-300 group-hover:scale-110",
                    badgeColorClasses[badgeColor],
                  )}
                >
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                {description}
              </p>
            )}
          </div>
        </Link>
      )}
      {hasChildren && isOpen && (
        <div className="ml-4 pl-4 border-l-2 border-gradient-to-b from-blue-200 to-cyan-200 dark:from-blue-800 dark:to-cyan-800 mt-2 space-y-1 animate-in slide-in-from-left-2 duration-300">
          {children}
        </div>
      )}
    </div>
  )
}

// AI模型项组件
function ModelItem({
  icon,
  name,
  provider,
  href,
  isActive = false,
  capability,
  iconBgColor,
}: {
  icon: React.ReactNode
  name: string
  provider: string
  href: string
  isActive?: boolean
  capability: string
  iconBgColor: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm group smart-interactive micro-interaction card-3d flowing-light",
        isActive
          ? "yanyu-gradient text-white shadow-lg smart-glow"
          : "text-muted-foreground hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/30 dark:hover:to-cyan-950/30 hover:text-foreground border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
          iconBgColor,
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate transition-all duration-300 group-hover:translate-x-1">{name}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate transition-opacity duration-300 group-hover:opacity-80">
          {provider}
        </p>
        <p className="text-xs text-blue-600/70 dark:text-blue-400/70 truncate transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {capability}
        </p>
      </div>
    </Link>
  )
}

// 导航组组件
function NavGroup({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 group">
        {icon && (
          <div className="text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
        )}
        <h3 className="text-xs font-semibold yanyu-text-gradient uppercase tracking-wider transition-all duration-300 group-hover:tracking-widest">
          {title}
        </h3>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

// 主侧边栏组件
export function Sidebar() {
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
      <div className="p-4 border-b border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <Link href="/" className="flex items-center group">
          <YanYuLogo size="md" animated="hover" className="transition-all duration-500 group-hover:scale-105" />
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
          <div className="rounded-xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 p-4 border border-purple-200/20 dark:border-purple-800/20 smart-glow">
            <NavGroup title="AI大模型中心" icon={<Brain className="h-4 w-4" />}>
              <div className="space-y-2 py-2">
                <ModelItem
                  icon={<Cpu className="h-5 w-5 text-purple-400" />}
                  name="GLM-4V"
                  provider="智谱AI"
                  capability="多模态理解"
                  href="/api-config/glm4v"
                  isActive={isModelPathActive("/api-config/glm4v")}
                  iconBgColor="bg-gradient-to-br from-purple-500/20 to-purple-600/30"
                />
                <ModelItem
                  icon={<ImageIcon className="h-5 w-5 text-pink-400" />}
                  name="CogView"
                  provider="智源研究院"
                  capability="图像生成"
                  href="/api-config/cogview"
                  isActive={isModelPathActive("/api-config/cogview")}
                  iconBgColor="bg-gradient-to-br from-pink-500/20 to-pink-600/30"
                />
                <ModelItem
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

          {/* API示例 */}
          <NavGroup title="API示例" icon={<Function className="h-4 w-4" />}>
            <NavItem
              icon={<Function className="h-4 w-4" />}
              label="函数调用"
              href="/api-examples/function-calling"
              isActive={isPathActive("/api-examples/function-calling")}
              description="Function Calling实践"
            />
            <NavItem
              icon={<ImageIcon className="h-4 w-4" />}
              label="多模态示例"
              href="/api-examples/multimodal"
              isActive={isPathActive("/api-examples/multimodal")}
              description="图像+文本处理"
            />
            <NavItem
              icon={<AlertTriangle className="h-4 w-4" />}
              label="异常处理"
              href="/api-examples/best-practices"
              isActive={isPathActive("/api-examples/best-practices")}
              description="最佳实践指南"
            />
            <NavItem
              icon={<Zap className="h-4 w-4" />}
              label="性能优化"
              href="/api-examples/best-practices?tab=performance"
              isActive={isTabActive("/api-examples/best-practices", "performance")}
              description="性能调优方案"
            />
            <NavItem
              icon={<BarChart className="h-4 w-4" />}
              label="服务监控"
              href="/api-examples/monitoring"
              isActive={isPathActive("/api-examples/monitoring")}
              description="监控与分析"
            />
          </NavGroup>

          {/* 商业引擎 */}
          <NavGroup title="商业引擎" icon={<Target className="h-4 w-4" />}>
            <NavItem
              icon={<ShoppingCart className="h-4 w-4" />}
              label="电商引擎"
              href="/ecommerce-engine"
              isActive={isPathActive("/ecommerce-engine")}
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
              <NavItem
                icon={<BarChart2 className="h-4 w-4" />}
                label="竞争追踪"
                href="/ecommerce-engine?tab=competitor-tracker"
                isActive={isTabActive("/ecommerce-engine", "competitor-tracker")}
                isAI={true}
              />
              <NavItem
                icon={<Sparkles className="h-4 w-4" />}
                label="趋势预测"
                href="/ecommerce-engine?tab=trend-predictor"
                isActive={isTabActive("/ecommerce-engine", "trend-predictor")}
                isAI={true}
              />
              <NavItem
                icon={<Activity className="h-4 w-4" />}
                label="销售表现"
                href="/ecommerce-engine?tab=sales-performance"
                isActive={isTabActive("/ecommerce-engine", "sales-performance")}
                isAI={true}
              />
            </NavItem>
          </NavGroup>

          {/* 接口管理 */}
          <NavGroup title="接口管理" icon={<Database className="h-4 w-4" />}>
            <NavItem
              icon={<Gauge className="h-4 w-4" />}
              label="性能监控"
              href="/api-config?tab=monitoring"
              isActive={isTabActive("/api-config", "monitoring")}
              description="实时性能分析"
            />
            <NavItem
              icon={<FileText className="h-4 w-4" />}
              label="接口文档"
              href="/api-config?tab=documentation"
              isActive={isTabActive("/api-config", "documentation")}
              description="智能文档生成"
            />
            <NavItem
              icon={<History className="h-4 w-4" />}
              label="请求历史"
              href="/api-config?tab=history"
              isActive={isTabActive("/api-config", "history")}
              badge={3}
              badgeColor="info"
              description="历史记录查询"
            />
            <NavItem
              icon={<Sparkles className="h-4 w-4" />}
              label="智能助手"
              href="/api-config?tab=ai"
              isActive={isTabActive("/api-config", "ai")}
              description="AI辅助管理"
              isAI={true}
            />
          </NavGroup>

          {/* 高级功能 */}
          <NavGroup title="高级功能" icon={<Zap className="h-4 w-4" />}>
            <NavItem
              icon={<Boxes className="h-4 w-4" />}
              label="批量处理"
              href="/api-config/batch-processor"
              isActive={isPathActive("/api-config/batch-processor")}
              description="批量操作工具"
            />
            <NavItem
              icon={<LineChart className="h-4 w-4" />}
              label="性能测试"
              href="/api-config/performance"
              isActive={isPathActive("/api-config/performance")}
              description="压力测试分析"
            />
            <NavItem
              icon={<GitCompare className="h-4 w-4" />}
              label="版本对比"
              href="/api-config/versions"
              isActive={isPathActive("/api-config/versions")}
              description="版本差异分析"
            />
            <NavItem
              icon={<BarChart2 className="h-4 w-4" />}
              label="数据分析"
              href="/api-config/analytics"
              isActive={isPathActive("/api-config/analytics")}
              description="深度数据洞察"
            />
          </NavGroup>

          {/* 系统工具 */}
          <NavGroup title="系统工具" icon={<Wrench className="h-4 w-4" />}>
            <NavItem
              icon={<Wrench className="h-4 w-4" />}
              label="系统审计"
              href="/admin/system"
              isActive={isPathActive("/admin/system")}
              description="全面系统检查"
            >
              <NavItem
                icon={<Shield className="h-4 w-4" />}
                label="框架审计"
                href="/admin/system?tab=framework"
                isActive={isTabActive("/admin/system", "framework")}
              />
              <NavItem
                icon={<FileText className="h-4 w-4" />}
                label="文件合规性"
                href="/admin/system?tab=file-compliance"
                isActive={isTabActive("/admin/system", "file-compliance")}
              />
              <NavItem
                icon={<Activity className="h-4 w-4" />}
                label="交互审计"
                href="/admin/system?tab=interaction"
                isActive={isTabActive("/admin/system", "interaction")}
              />
              <NavItem
                icon={<Search className="h-4 w-4" />}
                label="缺失功能"
                href="/admin/system?tab=missing-features"
                isActive={isTabActive("/admin/system", "missing-features")}
              />
            </NavItem>
            <NavItem
              icon={<Shield className="h-4 w-4" />}
              label="安全检测"
              href="/api-config/security"
              isActive={isPathActive("/api-config/security")}
              description="安全漏洞扫描"
            />
            <NavItem
              icon={<Workflow className="h-4 w-4" />}
              label="变更分析"
              href="/api-config/impact"
              isActive={isPathActive("/api-config/impact")}
              description="影响评估分析"
            />
            <NavItem
              icon={<Search className="h-4 w-4" />}
              label="高级搜索"
              href="/api-config/search"
              isActive={isPathActive("/api-config/search")}
              description="智能搜索引擎"
            />
          </NavGroup>

          {/* API分类 */}
          <NavGroup title="API分类" icon={<Layers className="h-4 w-4" />}>
            <NavItem
              icon={<Database className="h-4 w-4" />}
              label="数据存储"
              href="/api-documentation/databases"
              isActive={isPathActive("/api-documentation/databases")}
              description="数据库集成"
            />
            <NavItem
              icon={<MessageSquare className="h-4 w-4" />}
              label="媒体平台"
              href="/api-documentation/media-channels"
              isActive={isPathActive("/api-documentation/media-channels")}
              description="社交媒体API"
            />
            <NavItem
              icon={<Server className="h-4 w-4" />}
              label="商业平台"
              href="/api-documentation/business-platforms"
              isActive={isPathActive("/api-documentation/business-platforms")}
              description="企业服务API"
            />
            <NavItem
              icon={<Layers className="h-4 w-4" />}
              label="接口类型"
              href="/api-documentation/api-types"
              isActive={isPathActive("/api-documentation/api-types")}
              description="API分类管理"
            />
          </NavGroup>
        </div>
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t border-blue-100 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="text-center group">
          <YanYuLogo size="xs" variant="text-only" className="transition-all duration-300 group-hover:scale-105" />
          <p className="text-xs text-muted-foreground mt-1 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            AI驱动的智能平台
          </p>
        </div>
      </div>
    </aside>
  )
}
