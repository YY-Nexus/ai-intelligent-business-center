"use client"

import React from "react"

/**
 * 性能优化工具类
 * 提供各种性能优化相关的工具函数
 */
export class PerformanceOptimizer {
  /**
   * 组件懒加载包装器
   * @param importFunc 动态导入函数
   * @param loadingComponent 加载中显示的组件
   * @returns 懒加载的组件
   */
  static lazyLoad(importFunc: () => Promise<any>, loadingComponent: React.ReactNode = null) {
    const LazyComponent = React.lazy(importFunc)
    return (props: any) => (
      <React.Suspense fallback={loadingComponent}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  }

  /**
   * 图片优化加载
   * @param src 图片源
   * @param options 图片加载选项
   * @returns 优化后的图片URL
   */
  static optimizeImage(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: "webp" | "jpeg" | "png" | "avif"
    } = {},
  ) {
    // 实际项目中可以使用图片处理服务如Cloudinary或Imgix
    // 这里仅作为示例
    const { width, height, quality = 80, format = "webp" } = options
    let url = src

    // 添加参数
    const params = new URLSearchParams()
    if (width) params.append("w", width.toString())
    if (height) params.append("h", height.toString())
    params.append("q", quality.toString())
    params.append("fmt", format)

    // 如果URL已经有参数，则添加&，否则添加?
    url += url.includes("?") ? "&" : "?"
    url += params.toString()

    return url
  }

  /**
   * 资源预加载
   * @param resources 需要预加载的资源URL列表
   */
  static preloadResources(resources: { url: string; type: "image" | "style" | "script" | "font" }[]) {
    resources.forEach((resource) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = resource.url

      switch (resource.type) {
        case "image":
          link.as = "image"
          break
        case "style":
          link.as = "style"
          break
        case "script":
          link.as = "script"
          break
        case "font":
          link.as = "font"
          link.crossOrigin = "anonymous"
          break
      }

      document.head.appendChild(link)
    })
  }

  /**
   * 数据缓存管理
   */
  static cache = {
    // 内存缓存
    memoryCache: new Map<string, { data: any; expiry: number }>(),

    /**
     * 设置缓存
     * @param key 缓存键
     * @param data 缓存数据
     * @param ttl 过期时间（毫秒）
     */
    set(key: string, data: any, ttl = 60000) {
      this.memoryCache.set(key, {
        data,
        expiry: Date.now() + ttl,
      })
    },

    /**
     * 获取缓存
     * @param key 缓存键
     * @returns 缓存数据，如果过期或不存在则返回null
     */
    get(key: string) {
      const cached = this.memoryCache.get(key)
      if (!cached) return null

      if (cached.expiry < Date.now()) {
        this.memoryCache.delete(key)
        return null
      }

      return cached.data
    },

    /**
     * 清除缓存
     * @param key 缓存键，如果不提供则清除所有缓存
     */
    clear(key?: string) {
      if (key) {
        this.memoryCache.delete(key)
      } else {
        this.memoryCache.clear()
      }
    },
  }
}

/**
 * 性能监控工具类
 * 用于监控和记录性能指标
 */
export class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {}

  /**
   * 记录性能指标
   * @param name 指标名称
   * @param value 指标值
   */
  static recordMetric(name: string, value: number) {
    if (!this.metrics[name]) {
      this.metrics[name] = []
    }
    this.metrics[name].push(value)
  }

  /**
   * 获取性能指标统计
   * @param name 指标名称
   * @returns 指标统计信息
   */
  static getMetricStats(name: string) {
    const values = this.metrics[name] || []
    if (values.length === 0) return null

    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return { avg, min, max, count: values.length }
  }

  /**
   * 性能计时器
   * @param name 计时器名称
   * @returns 停止计时的函数，调用后会记录耗时
   */
  static startTimer(name: string) {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.recordMetric(name, duration)
      return duration
    }
  }

  /**
   * 记录组件渲染时间
   * @param componentName 组件名称
   * @returns 高阶组件
   */
  static trackRenderTime<P extends object>(componentName: string) {
    return (Component: React.ComponentType<P>) => {
      return (props: P) => {
        const stopTimer = this.startTimer(`render_${componentName}`)
        const result = <Component {...props} />
        // 使用useEffect确保在渲染完成后停止计时
        React.useEffect(() => {
          stopTimer()
        }, [])
        return result
      }
    }
  }
}
