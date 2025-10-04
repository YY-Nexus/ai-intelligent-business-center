import type { DataMapper, MappingConfig, MappingDirection, MappingResult, FieldMapping } from "./mapping-types"

/**
 * 数据映射引擎
 * 将API数据映射到应用数据模型
 */
export class ApiDataMapper implements DataMapper {
  private transforms: Record<string, (value: any, source: any) => any> = {}

  constructor() {
    // 注册一些常用的转换函数
    this.registerCommonTransforms()
  }

  /**
   * 映射数据
   */
  public map<S, T>(source: S, config: MappingConfig, direction: MappingDirection = "apiToApp"): MappingResult<T> {
    const result: any = {}
    const unmappedFields: string[] = []
    const errors: string[] = []

    try {
      // 映射字段
      for (const field of config.fields) {
        try {
          this.mapField(source, result, field, direction)
        } catch (error) {
          errors.push(
            `映射字段 ${field.source} 到 ${field.target} 失败: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }

      // 映射数组
      if (config.arrayMapping) {
        try {
          this.mapArray(source, result, config.arrayMapping, direction)
        } catch (error) {
          errors.push(
            `映射数组 ${config.arrayMapping.source} 到 ${config.arrayMapping.target} 失败: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }

      // 检查未映射的字段
      if (source && typeof source === "object") {
        const mappedSourceFields = new Set(config.fields.map((f) => (direction === "apiToApp" ? f.source : f.target)))
        const sourceFields = Object.keys(source as object)

        for (const field of sourceFields) {
          if (!mappedSourceFields.has(field)) {
            unmappedFields.push(field)
          }
        }
      }
    } catch (error) {
      errors.push(`映射过程中发生错误: ${error instanceof Error ? error.message : String(error)}`)
    }

    return {
      data: result as T,
      unmappedFields: unmappedFields.length > 0 ? unmappedFields : undefined,
      errors: errors.length > 0 ? errors : undefined,
    }
  }

  /**
   * 注册转换函数
   */
  public registerTransform(name: string, transform: (value: any, source: any) => any): void {
    this.transforms[name] = transform
  }

  /**
   * 获取转换函数
   */
  public getTransform(name: string): ((value: any, source: any) => any) | undefined {
    return this.transforms[name]
  }

  /**
   * 映射单个字段
   */
  private mapField(source: any, target: any, field: FieldMapping, direction: MappingDirection): void {
    // 根据映射方向确定源字段和目标字段
    const sourcePath = direction === "apiToApp" ? field.source : field.target
    const targetPath = direction === "apiToApp" ? field.target : field.source

    // 检查条件
    if (field.condition && !field.condition(source)) {
      return
    }

    // 获取源值
    const sourceValue = this.getValueByPath(source, sourcePath)

    // 如果源值不存在且有默认值，使用默认值
    if (sourceValue === undefined && field.defaultValue !== undefined) {
      this.setValueByPath(target, targetPath, field.defaultValue)
      return
    }

    // 如果源值不存在且没有默认值，不进行映射
    if (sourceValue === undefined) {
      return
    }

    // 应用转换函数
    let targetValue = sourceValue
    if (field.transform) {
      targetValue = field.transform(sourceValue, source)
    }

    // 设置目标值
    this.setValueByPath(target, targetPath, targetValue)
  }

  /**
   * 映射数组
   */
  private mapArray(source: any, target: any, arrayMapping: any, direction: MappingDirection): void {
    // 根据映射方向确定源数组和目标数组
    const sourcePath = direction === "apiToApp" ? arrayMapping.source : arrayMapping.target
    const targetPath = direction === "apiToApp" ? arrayMapping.target : arrayMapping.source

    // 获取源数组
    const sourceArray = this.getValueByPath(source, sourcePath)

    // 如果源数组不存在，不进行映射
    if (!Array.isArray(sourceArray)) {
      return
    }

    // 映射数组项
    const targetArray = sourceArray.map((item) => {
      const mappedItem = {}
      const result = this.map(item, arrayMapping.itemMapping, direction)
      return result.data
    })

    // 设置目标数组
    this.setValueByPath(target, targetPath, targetArray)
  }

  /**
   * 根据路径获取值
   */
  private getValueByPath(obj: any, path: string): any {
    if (!obj || !path) {
      return undefined
    }

    const parts = path.split(".")
    let current = obj

    for (const part of parts) {
      if (current === null || current === undefined) {
        return undefined
      }
      current = current[part]
    }

    return current
  }

  /**
   * 根据路径设置值
   */
  private setValueByPath(obj: any, path: string, value: any): void {
    if (!obj || !path) {
      return
    }

    const parts = path.split(".")
    let current = obj

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (current[part] === undefined) {
        current[part] = {}
      }
      current = current[part]
    }

    current[parts[parts.length - 1]] = value
  }

  /**
   * 注册常用转换函数
   */
  private registerCommonTransforms(): void {
    // 字符串转换
    this.registerTransform("toString", (value) => String(value))
    this.registerTransform("toLowerCase", (value) =>
      typeof value === "string" ? value.toLowerCase() : String(value).toLowerCase(),
    )
    this.registerTransform("toUpperCase", (value) =>
      typeof value === "string" ? value.toUpperCase() : String(value).toUpperCase(),
    )
    this.registerTransform("trim", (value) => (typeof value === "string" ? value.trim() : String(value).trim()))

    // 数字转换
    this.registerTransform("toNumber", (value) => Number(value))
    this.registerTransform("toInteger", (value) => Number.parseInt(String(value), 10))
    this.registerTransform("toFloat", (value) => Number.parseFloat(String(value)))

    // 布尔转换
    this.registerTransform("toBoolean", (value) => {
      if (typeof value === "boolean") return value
      if (typeof value === "string") {
        return value.toLowerCase() === "true" || value === "1"
      }
      return Boolean(value)
    })

    // 日期转换
    this.registerTransform("toDate", (value) => new Date(value))
    this.registerTransform("toISOString", (value) => {
      const date = value instanceof Date ? value : new Date(value)
      return date.toISOString()
    })
    this.registerTransform("toLocaleDateString", (value) => {
      const date = value instanceof Date ? value : new Date(value)
      return date.toLocaleDateString()
    })

    // 数组转换
    this.registerTransform("toArray", (value) => (Array.isArray(value) ? value : [value]))
    this.registerTransform("join", (value, source) => (Array.isArray(value) ? value.join(",") : value))
    this.registerTransform("split", (value) => (typeof value === "string" ? value.split(",") : value))
  }
}

// 在文件末尾添加 createDataMapper 函数
/**
 * 创建数据映射器实例的工厂函数
 * 方便在应用中快速创建和配置数据映射器
 */
export function createDataMapper(): ApiDataMapper {
  return new ApiDataMapper()
}
