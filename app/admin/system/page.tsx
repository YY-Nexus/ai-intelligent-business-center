"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedAuditDashboard from "@/app/components/system-audit/enhanced-audit-dashboard"
import { FrameworkAudit } from "@/app/components/system-audit/framework-audit"
import { FileComplianceAudit } from "@/app/components/system-audit/file-compliance-audit"
import { InteractionAudit } from "@/app/components/system-audit/interaction-audit"
import { MissingFeaturesAudit } from "@/app/components/system-audit/missing-features-audit"

export default function SystemAuditPage() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  // 根据URL参数设置默认选项卡
  const defaultTab = tabParam || "dashboard"
  const [activeTab, setActiveTab] = useState(defaultTab)

  // 模拟审计结果数据
  const frameworkResults = {
    passed: 10,
    warnings: 1,
    failed: 1,
    total: 12,
  }

  const fileComplianceResults = {
    passed: 20,
    warnings: 3,
    failed: 1,
    total: 24,
  }

  const interactionResults = {
    passed: 15,
    warnings: 2,
    failed: 1,
    total: 18,
  }

  const missingFeaturesResults = {
    identified: 5,
    implemented: 0,
    total: 5,
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">系统审计</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="dashboard">审计仪表盘</TabsTrigger>
          <TabsTrigger value="framework">框架审计</TabsTrigger>
          <TabsTrigger value="file-compliance">文件合规性</TabsTrigger>
          <TabsTrigger value="interaction">交互审计</TabsTrigger>
          <TabsTrigger value="missing-features">缺失功能</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EnhancedAuditDashboard />
        </TabsContent>

        <TabsContent value="framework">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">框架审计</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              检查系统核心功能模块是否完整，各模块间衔接是否正常，确保系统框架稳定可靠。
            </p>
            <FrameworkAudit results={frameworkResults} />
          </div>
        </TabsContent>

        <TabsContent value="file-compliance">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">文件合规性</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              审核代码是否符合项目规范和最佳实践，检查文件命名、组织结构是否一致，确保代码质量。
            </p>
            <FileComplianceAudit results={fileComplianceResults} />
          </div>
        </TabsContent>

        <TabsContent value="interaction">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">交互审计</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              验证用户主要路径是否流畅，无断点或死角，检查页面间跳转是否正常，提升用户体验。
            </p>
            <InteractionAudit results={interactionResults} />
          </div>
        </TabsContent>

        <TabsContent value="missing-features">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">缺失功能</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              识别系统中缺失的功能点，并提供实现建议，确保系统功能完整，满足用户需求。
            </p>
            <MissingFeaturesAudit results={missingFeaturesResults} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
