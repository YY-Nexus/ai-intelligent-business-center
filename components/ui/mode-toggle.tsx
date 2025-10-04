"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="smart-interactive micro-interaction hover:bg-blue-50 dark:hover:bg-blue-950/50"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="smart-glow">
        <DropdownMenuItem onClick={() => setTheme("light")} className="smart-interactive micro-interaction">
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="smart-interactive micro-interaction">
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="smart-interactive micro-interaction">
          系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
