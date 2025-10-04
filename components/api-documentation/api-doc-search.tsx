"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ApiDocSearchProps {
  onSearch: (query: string, filters: ApiDocSearchFilters) => void
}

export interface ApiDocSearchFilters {
  languages: string[]
  categories: string[]
  platforms: string[]
  types: string[]
}

export function ApiDocSearch({ onSearch }: ApiDocSearchProps) {
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<ApiDocSearchFilters>({
    languages: [],
    categories: [],
    platforms: [],
    types: [],
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const toggleFilter = (type: keyof ApiDocSearchFilters, value: string) => {
    setFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)

      if (index === -1) {
        current.push(value)
        setActiveFilters((prev) => [...prev, `${type}:${value}`])
      } else {
        current.splice(index, 1)
        setActiveFilters((prev) => prev.filter((filter) => filter !== `${type}:${value}`))
      }

      return { ...prev, [type]: current }
    })
  }

  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(":") as [keyof ApiDocSearchFilters, string]
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].filter((v) => v !== value),
    }))
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
  }

  const clearFilters = () => {
    setFilters({
      languages: [],
      categories: [],
      platforms: [],
      types: [],
    })
    setActiveFilters([])
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索API文档..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                编程语言
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>选择编程语言</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["JavaScript", "Python", "Java", "C#", "Go", "PHP", "Ruby", "Swift"].map((language) => (
                <DropdownMenuCheckboxItem
                  key={language}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={() => toggleFilter("languages", language)}
                >
                  {language}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                API类型
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>选择API类型</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["REST", "GraphQL", "gRPC", "WebSocket", "SOAP"].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => toggleFilter("types", type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                平台
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>选择平台</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["微信", "支付宝", "AWS", "Azure", "阿里云", "腾讯云", "百度智能云"].map((platform) => (
                <DropdownMenuCheckboxItem
                  key={platform}
                  checked={filters.platforms.includes(platform)}
                  onCheckedChange={() => toggleFilter("platforms", platform)}
                >
                  {platform}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={handleSearch}>搜索</Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <Card>
          <CardContent className="p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">已选筛选条件:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter.split(":")[1]}
                  <button onClick={() => removeFilter(filter)} className="ml-1 rounded-full hover:bg-muted">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                清除全部
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
