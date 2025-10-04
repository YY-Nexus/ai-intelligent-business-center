/**
 * 数据映射类型定义
 */

// 映射方向
export type MappingDirection = "apiToApp" | "appToApi"

// 字段映射
export interface FieldMapping {
  // 源字段路径
  source: string
  // 目标字段路径
  target: string
  // 转换函数
  transform?: (value: any, source: any) => any
  // 默认值
  defaultValue?: any
  // 条件函数
  condition?: (source: any) => boolean
}

// 数组映射
export interface ArrayMapping {
  // 源数组路径
  source: string
  // 目标数组路径
  target: string
  // 项目映射配置
  itemMapping: MappingConfig
}

// 映射配置
export interface MappingConfig {
  // 字段映射列表
  fields: FieldMapping[]
  // 数组映射
  arrayMapping?: ArrayMapping
}

// 映射结果
export interface MappingResult<T> {
  // 映射后的数据
  data: T
  // 未映射的字段
  unmappedFields?: string[]
  // 错误信息
  errors?: string[]
}

// 数据映射器接口
export interface DataMapper {
  // 映射数据
  map<S, T>(source: S, config: MappingConfig, direction?: MappingDirection): MappingResult<T>
  // 注册转换函数
  registerTransform(name: string, transform: (value: any, source: any) => any): void
  // 获取转换函数
  getTransform(name: string): ((value: any, source: any) => any) | undefined
}
