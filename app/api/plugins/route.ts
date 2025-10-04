import { NextResponse } from "next/server"
import type { AuditPlugin } from "@/lib/plugin-system"

// 模拟插件存储 - 实际应用中应替换为数据库
const pluginStore: AuditPlugin[] = [
  {
    id: "security-scanner",
    name: "安全漏洞扫描",
    description: "扫描代码中的安全漏洞并提供修复建议",
    version: "1.0.0",
    author: "安全团队",
    category: "security",
    enabled: true,
    configSchema: {
      scanDepth: {
        type: "number",
        default: 3,
        description: "扫描深度级别",
      },
      includeDependencies: {
        type: "boolean",
        default: true,
        description: "是否扫描依赖项",
      },
    },
  },
  {
    id: "performance-analyzer",
    name: "性能分析器",
    description: "分析代码性能瓶颈并提供优化建议",
    version: "1.2.1",
    author: "性能团队",
    category: "performance",
    enabled: true,
    configSchema: {
      analysisMode: {
        type: "string",
        enum: ["basic", "advanced"],
        default: "basic",
        description: "分析模式",
      },
    },
  },
  {
    id: "accessibility-checker",
    name: "无障碍检查器",
    description: "检查UI组件的无障碍性并提供改进建议",
    version: "0.9.5",
    author: "UI团队",
    category: "accessibility",
    enabled: false,
    configSchema: {
      checkLevel: {
        type: "string",
        enum: ["A", "AA", "AAA"],
        default: "AA",
        description: "WCAG合规级别",
      },
    },
  },
]

// 获取所有插件
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const enabled = searchParams.get("enabled")

    let filteredPlugins = [...pluginStore]

    // 按类别过滤
    if (category) {
      filteredPlugins = filteredPlugins.filter((p) => p.category === category)
    }

    // 按启用状态过滤
    if (enabled !== null) {
      const isEnabled = enabled === "true"
      filteredPlugins = filteredPlugins.filter((p) => p.enabled === isEnabled)
    }

    return NextResponse.json({
      success: true,
      plugins: filteredPlugins,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("插件API错误:", error)
    return NextResponse.json(
      { error: "获取插件时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}

// 添加新插件
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { plugin } = body

    if (!plugin || !plugin.id || !plugin.name) {
      return NextResponse.json({ error: "需要提供有效的插件信息" }, { status: 400 })
    }

    // 检查插件是否已存在
    const existingIndex = pluginStore.findIndex((p) => p.id === plugin.id)

    if (existingIndex >= 0) {
      // 更新现有插件
      pluginStore[existingIndex] = { ...pluginStore[existingIndex], ...plugin }

      return NextResponse.json({
        success: true,
        plugin: pluginStore[existingIndex],
        updated: true,
        timestamp: new Date().toISOString(),
      })
    } else {
      // 添加新插件
      pluginStore.push(plugin)

      return NextResponse.json({
        success: true,
        plugin,
        updated: false,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("插件API错误:", error)
    return NextResponse.json(
      { error: "添加插件时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 },
    )
  }
}
