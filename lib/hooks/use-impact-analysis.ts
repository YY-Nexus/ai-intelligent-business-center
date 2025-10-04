import useSWR from "swr"
import {
  getChangesList,
  getChangeDetail,
  getImpactAnalysis,
  createChange,
  updateChange,
  deleteChange,
  saveImpactAnalysis,
  deleteImpactAnalysis,
} from "@/lib/api/impact-analysis-service"
import type { Change, ImpactAnalysis, PaginationParams, FilterParams } from "@/lib/models/impact-analysis-types"

// 获取变更列表的钩子
export function useChangesList(params?: PaginationParams & FilterParams) {
  const { data, error, isLoading, mutate } = useSWR(["changes", params], () => getChangesList(params), {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // 5秒内不重复请求
  })

  return {
    changes: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// 获取变更详情的钩子
export function useChangeDetail(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["change", id] : null,
    () => (id ? getChangeDetail(id) : null),
    {
      revalidateOnFocus: false,
    },
  )

  return {
    change: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// 获取影响分析的钩子
export function useImpactAnalysis(changeId: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    changeId ? ["analysis", changeId] : null,
    () => (changeId ? getImpactAnalysis(changeId) : null),
    {
      revalidateOnFocus: false,
    },
  )

  return {
    analysis: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

// 变更操作钩子
export function useChangeOperations() {
  const { mutate: mutateList } = useSWR(["changes"])

  // 创建变更
  const create = async (change: Omit<Change, "id" | "createdAt" | "updatedAt">) => {
    const result = await createChange(change)
    mutateList() // 刷新列表
    return result.data
  }

  // 更新变更
  const update = async (id: string, change: Partial<Change>) => {
    const result = await updateChange(id, change)
    mutateList() // 刷新列表
    return result.data
  }

  // 删除变更
  const remove = async (id: string) => {
    const result = await deleteChange(id)
    mutateList() // 刷新列表
    return result.success
  }

  return { create, update, remove }
}

// 分析操作钩子
export function useAnalysisOperations() {
  // 保存分析
  const save = async (
    changeId: string,
    analysis: Omit<ImpactAnalysis, "id" | "changeId" | "createdAt" | "updatedAt">,
  ) => {
    const result = await saveImpactAnalysis(changeId, analysis)
    return result.data
  }

  // 删除分析
  const remove = async (changeId: string) => {
    const result = await deleteImpactAnalysis(changeId)
    return result.success
  }

  return { save, remove }
}
