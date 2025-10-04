"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart, ShoppingCart, Users } from "lucide-react"

export function EcommerceNavigationLinks() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-6">
      <Link href="/ecommerce-engine" passHref>
        <Button variant="outline" size="sm" className={cn(pathname === "/ecommerce-engine" && "bg-muted")}>
          <BarChart className="h-4 w-4 mr-2" />
          数据分析
        </Button>
      </Link>
      <Link href="/ecommerce-engine/platform-integration" passHref>
        <Button
          variant="outline"
          size="sm"
          className={cn(pathname === "/ecommerce-engine/platform-integration" && "bg-muted")}
        >
          <Users className="h-4 w-4 mr-2" />
          平台集成
        </Button>
      </Link>
      <Link href="/ecommerce-engine/order-management" passHref>
        <Button
          variant="outline"
          size="sm"
          className={cn(pathname === "/ecommerce-engine/order-management" && "bg-muted")}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          订单管理
        </Button>
      </Link>
    </div>
  )
}
