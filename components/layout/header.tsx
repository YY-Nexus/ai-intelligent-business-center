"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { YanYuLogo } from "@/components/ui/yanyu-logo"
import { UserDropdown } from "@/components/user/user-dropdown"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { SearchDialog } from "@/components/search/search-dialog"
import { useSearch } from "@/lib/hooks/use-search"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  Database,
  FileText,
  ShoppingCart,
  Menu,
  Search,
  Zap,
  Layers,
  BarChart,
  Sparkles,
  Activity,
  Brain,
} from "lucide-react"

// 模拟用户数据
const mockUser = {
  id: "1",
  name: "张三",
  email: "zhangsan@example.com",
  image: null,
  role: "admin",
}

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { isSearchOpen, openSearch, closeSearch } = useSearch()

  // 是否已登录状态（这里模拟为已登录）
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // 页面加载后设置加载状态
    setIsLoaded(true)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const mainNavItems = [
    {
      title: "智能门户",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
      description: "AI驱动的统一工作台",
      isAI: true,
    },
    {
      title: "API中心",
      href: "/api-config",
      icon: <Database className="h-4 w-4 mr-2" />,
      children: [
        {
          title: "智能配置",
          href: "/api-config?tab=list",
          description: "AI辅助的API配置管理",
          icon: <Sparkles className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "快速创建",
          href: "/api-config?tab=form",
          description: "模板化API快速创建",
          icon: <Zap className="h-4 w-4" />,
        },
        {
          title: "智能测试",
          href: "/api-config?tab=test",
          description: "自动化API测试套件",
          icon: <BarChart className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "实时监控",
          href: "/api-config?tab=monitoring",
          description: "全方位性能监控分析",
          icon: <Activity className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "智能文档",
      href: "/api-documentation",
      icon: <FileText className="h-4 w-4 mr-2" />,
      isAI: true,
      children: [
        {
          title: "AI大模型",
          href: "/api-documentation/chinese-llm",
          description: "中文大语言模型集成指南",
          icon: <Brain className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "性能对比",
          href: "/api-documentation/model-comparison",
          description: "AI模型性能基准测试",
          icon: <BarChart className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "代码助手",
          href: "/api-documentation/codegeex",
          description: "智能代码生成与优化",
          icon: <Zap className="h-4 w-4" />,
          isAI: true,
        },
      ],
    },
    {
      title: "实战示例",
      href: "/api-examples",
      icon: <Zap className="h-4 w-4 mr-2" />,
      children: [
        {
          title: "函数调用",
          href: "/api-examples/function-calling",
          description: "Function Calling最佳实践",
          icon: <Sparkles className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "多模态AI",
          href: "/api-examples/multimodal",
          description: "图像+文本智能处理",
          icon: <Layers className="h-4 w-4" />,
          isAI: true,
        },
        {
          title: "性能优化",
          href: "/api-examples/best-practices",
          description: "企业级性能调优方案",
          icon: <BarChart className="h-4 w-4" />,
        },
      ],
    },
    {
      title: "商业引擎",
      href: "/ecommerce-engine",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      description: "AI驱动的电商智能化平台",
      isAI: true,
    },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg shadow-blue-500/5 smart-glow"
          : "bg-white dark:bg-gray-950",
      )}
    >
      {/* 顶部装饰条 */}
      <div className="h-1 yanyu-gradient bg-size-200 animate-gradient-x" />

      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group">
            <YanYuLogo
              size="md"
              animated={isLoaded ? "hover" : "entrance"}
              responsive={true}
              className="transition-all duration-500 group-hover:scale-105"
            />
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {mainNavItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-10 px-4 py-2 bg-transparent smart-interactive micro-interaction nav-enhanced",
                        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/50 dark:hover:to-cyan-950/50",
                        pathname.startsWith(item.href) && "yanyu-gradient text-white shadow-md smart-glow active",
                        item.isAI && "ai-enhanced",
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {item.title}
                        {item.isAI && <Brain className="ml-1 h-3 w-3 animate-pulse" />}
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[500px] p-4 smart-glow">
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold yanyu-text-gradient mb-2 flex items-center">
                            {item.title}
                            {item.isAI && <Brain className="ml-2 h-4 w-4 text-purple-500" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <ul className="grid grid-cols-2 gap-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "group block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none smart-interactive micro-interaction flowing-light",
                                    "hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/50 dark:hover:to-cyan-950/50",
                                    "border border-transparent hover:border-blue-200/50 dark:hover:border-blue-800/50",
                                    child.isAI && "ai-enhanced gradient-border",
                                  )}
                                >
                                  <div className="flex items-center gap-2 text-sm font-medium leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {child.icon}
                                    {child.title}
                                    {child.isAI && <Brain className="h-3 w-3 text-purple-500" />}
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground group-hover:text-blue-500/70 dark:group-hover:text-blue-400/70 transition-colors">
                                    {child.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "h-10 px-4 py-2 bg-transparent smart-interactive micro-interaction nav-enhanced",
                          "hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-950/50 dark:hover:to-cyan-950/50",
                          pathname === item.href && "yanyu-gradient text-white shadow-md smart-glow active",
                          item.isAI && "ai-enhanced",
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          {item.title}
                          {item.isAI && <Brain className="ml-1 h-3 w-3 animate-pulse" />}
                        </div>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              className="hidden md:flex smart-interactive micro-interaction hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <Search className="h-5 w-5" />
            </Button>

            {isLoggedIn ? (
              <>
                <NotificationDropdown />
                <ModeToggle />
                <UserDropdown user={mockUser} />
              </>
            ) : (
              <>
                <ModeToggle />
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:inline-flex smart-interactive micro-interaction"
                  >
                    登录
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="smart-button">
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden smart-interactive micro-interaction">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 smart-glow">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <YanYuLogo size="sm" variant="icon-only" />
                  智能导航
                </SheetTitle>
                <SheetDescription>探索言语云的强大功能</SheetDescription>
              </SheetHeader>
              <div className="py-6">
                <div className="flex flex-col space-y-2">
                  {mainNavItems.map((item) => (
                    <Button
                      key={item.href}
                      variant={pathname === item.href ? "default" : "ghost"}
                      className={cn(
                        "justify-start h-12 smart-interactive micro-interaction",
                        pathname === item.href && "smart-button",
                        item.isAI && "ai-enhanced",
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <div className="flex flex-col items-start">
                          <div className="flex items-center">
                            <span>{item.title}</span>
                            {item.isAI && <Brain className="ml-1 h-3 w-3" />}
                          </div>
                          {item.description && (
                            <span className="text-xs text-muted-foreground">{item.description}</span>
                          )}
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* 全局搜索对话框 */}
      <SearchDialog open={isSearchOpen} onOpenChange={closeSearch} />
    </header>
  )
}
