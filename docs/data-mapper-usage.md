# 数据映射器使用指南

## 简介

数据映射器（Data Mapper）是API绑定系统中的核心组件之一，用于在API数据和应用数据模型之间进行转换。它提供了灵活的配置选项，支持字段映射、数据转换、条件映射和数组映射等功能。

## 基本用法

### 创建数据映射器

使用 `createDataMapper` 函数创建数据映射器实例：

\`\`\`typescript
import { createDataMapper } from "@/lib/api-binding/mapping/data-mapper"

// 创建数据映射器实例
const mapper = createDataMapper()
\`\`\`

### 简单字段映射

最基本的用法是将API字段映射到应用字段：

\`\`\`typescript
// API数据
const apiData = {
  user_id: 1,
  user_name: "张三",
  user_email: "zhangsan@example.com"
}

// 映射配置
const config = {
  fields: [
    { source: "user_id", target: "id" },
    { source: "user_name", target: "name" },
    { source: "user_email", target: "email" }
  ]
}

// 执行映射
const result = mapper.map(apiData, config)

// 结果
// {
//   data: {
//     id: 1,
//     name: "张三",
//     email: "zhangsan@example.com"
//   }
// }
\`\`\`

### 数据转换

可以在映射过程中应用转换函数：

\`\`\`typescript
const config = {
  fields: [
    { source: "user_id", target: "id" },
    { 
      source: "user_name", 
      target: "name",
      transform: (value) => value.toUpperCase() 
    },
    { 
      source: "created_at", 
      target: "createdAt",
      transform: (value) => new Date(value) 
    }
  ]
}
\`\`\`

### 条件映射

可以根据条件决定是否执行映射：

\`\`\`typescript
const config = {
  fields: [
    { source: "user_id", target: "id" },
    { 
      source: "is_admin", 
      target: "role",
      condition: (data) => data.is_admin === true,
      transform: () => "管理员" 
    },
    { 
      source: "is_admin", 
      target: "role",
      condition: (data) => data.is_admin === false,
      transform: () => "普通用户" 
    }
  ]
}
\`\`\`

### 默认值

可以为缺失的字段设置默认值：

\`\`\`typescript
const config = {
  fields: [
    { source: "user_id", target: "id" },
    { source: "user_name", target: "name" },
    { 
      source: "user_avatar", 
      target: "avatar",
      defaultValue: "/images/default-avatar.png" 
    }
  ]
}
\`\`\`

### 数组映射

可以映射数组中的每个项目：

\`\`\`typescript
const apiData = {
  user: {
    id: 1,
    name: "张三"
  },
  orders: [
    { order_id: 101, order_amount: 99.99 },
    { order_id: 102, order_amount: 199.99 }
  ]
}

const config = {
  fields: [
    { source: "user.id", target: "userId" },
    { source: "user.name", target: "userName" }
  ],
  arrayMapping: {
    source: "orders",
    target: "orderList",
    itemMapping: {
      fields: [
        { source: "order_id", target: "id" },
        { source: "order_amount", target: "amount" }
      ]
    }
  }
}

// 结果
// {
//   data: {
//     userId: 1,
//     userName: "张三",
//     orderList: [
//       { id: 101, amount: 99.99 },
//       { id: 102, amount: 199.99 }
//     ]
//   }
// }
\`\`\`

### 双向映射

数据映射器支持双向映射，可以从API到应用，也可以从应用到API：

\`\`\`typescript
// API到应用（默认方向）
const appData = mapper.map(apiData, config).data

// 应用到API
const apiData = mapper.map(appData, config, "appToApi").data
\`\`\`

## 内置转换函数

数据映射器预注册了一系列常用的转换函数，可以直接在映射配置中使用：

### 字符串转换

- `toString`: 转换为字符串
- `toLowerCase`: 转换为小写
- `toUpperCase`: 转换为大写
- `trim`: 去除首尾空格

### 数字转换

- `toNumber`: 转换为数字
- `toInteger`: 转换为整数
- `toFloat`: 转换为浮点数

### 布尔转换

- `toBoolean`: 转换为布尔值

### 日期转换

- `toDate`: 转换为Date对象
- `toISOString`: 转换为ISO日期字符串
- `toLocaleDateString`: 转换为本地日期字符串

### 数组转换

- `toArray`: 转换为数组
- `join`: 数组连接为字符串
- `split`: 字符串分割为数组

## 自定义转换函数

可以注册自定义的转换函数：

\`\`\`typescript
// 注册自定义转换函数
mapper.registerTransform("formatCurrency", (value) => {
  return `¥${Number(value).toFixed(2)}`
})

// 在映射中使用
const config = {
  fields: [
    { 
      source: "price", 
      target: "formattedPrice",
      transform: (value) => mapper.getTransform("formatCurrency")(value)
    }
  ]
}
\`\`\`

## 错误处理

数据映射器会捕获映射过程中的错误，但不会中断整个映射过程。错误信息会包含在返回结果中：

\`\`\`typescript
const result = mapper.map(apiData, config)

if (result.errors) {
  console.warn("映射过程中发生错误:", result.errors)
}
\`\`\`

## 未映射字段检测

数据映射器可以检测源对象中未被映射的字段：

\`\`\`typescript
const result = mapper.map(apiData, config)

if (result.unmappedFields) {
  console.info("未映射的字段:", result.unmappedFields)
}
\`\`\`

## 最佳实践

### 1. 创建映射配置文件

为不同的API创建专用的映射配置文件：

\`\`\`typescript
// user-mapping.ts
export const userMapping = {
  fields: [
    { source: "user_id", target: "id" },
    { source: "user_name", target: "name" },
    { source: "user_email", target: "email" }
  ]
}

// order-mapping.ts
export const orderMapping = {
  fields: [
    { source: "order_id", target: "id" },
    { source: "order_amount", target: "amount" },
    { source: "order_status", target: "status" }
  ]
}
\`\`\`

### 2. 在服务类中使用

在服务类中集成数据映射器：

\`\`\`typescript
import { createDataMapper } from "@/lib/api-binding/mapping/data-mapper"
import { userMapping } from "./mappings/user-mapping"

class UserService {
  private mapper = createDataMapper()
  
  async getUser(id: number) {
    const response = await fetch(`/api/users/${id}`)
    const apiData = await response.json()
    
    return this.mapper.map(apiData, userMapping).data
  }
  
  async updateUser(user: any) {
    const apiData = this.mapper.map(user, userMapping, "appToApi").data
    
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apiData)
    })
  }
}
\`\`\`

### 3. 处理复杂的映射需求

对于复杂的映射需求，可以组合使用多种映射功能：

\`\`\`typescript
const complexMapping = {
  fields: [
    // 基本字段映射
    { source: "user.id", target: "id" },
    { source: "user.name", target: "name" },
    
    // 条件映射
    { 
      source: "user.role", 
      target: "isAdmin",
      transform: (value) => value === "admin" 
    },
    
    // 自定义映射
    { 
      source: "_custom", 
      target: "fullAddress",
      transform: (_, source) => {
        return `${source.address.street}, ${source.address.city}, ${source.address.country}`
      }
    }
  ],
  
  // 数组映射
  arrayMapping: {
    source: "orders",
    target: "recentOrders",
    itemMapping: {
      fields: [
        { source: "id", target: "orderId" },
        { source: "date", target: "orderDate", transform: (value) => new Date(value) },
        { source: "amount", target: "total" }
      ]
    }
  }
}
\`\`\`

## 总结

数据映射器是一个强大的工具，可以简化API数据和应用数据模型之间的转换。通过合理配置，可以处理各种复杂的映射需求，提高代码的可维护性和可读性。
