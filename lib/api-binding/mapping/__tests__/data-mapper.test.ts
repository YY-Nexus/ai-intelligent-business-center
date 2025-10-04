import { ApiDataMapper } from "../data-mapper"
import type { MappingSchema } from "../mapping-types"

describe("数据映射器", () => {
  let mapper: ApiDataMapper

  beforeEach(() => {
    mapper = new ApiDataMapper()
  })

  test("应正确映射简单对象", () => {
    const apiData = {
      user_id: 1,
      user_name: "测试用户",
      user_email: "test@example.com",
    }

    const schema: MappingSchema = {
      user_id: "id",
      user_name: "name",
      user_email: "email",
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      id: 1,
      name: "测试用户",
      email: "test@example.com",
    })
    expect(result.errors).toBeUndefined()
  })

  test("应正确映射嵌套对象", () => {
    const apiData = {
      user_id: 1,
      user_info: {
        first_name: "测试",
        last_name: "用户",
        contact: {
          email: "test@example.com",
          phone: "123456789",
        },
      },
    }

    const schema: MappingSchema = {
      user_id: "id",
      user_info: {
        first_name: "firstName",
        last_name: "lastName",
        contact: {
          email: "email",
          phone: "phoneNumber",
        },
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      id: 1,
      firstName: "测试",
      lastName: "用户",
      email: "test@example.com",
      phoneNumber: "123456789",
    })
  })

  test("应正确映射数组", () => {
    const apiData = {
      items: [
        { item_id: 1, item_name: "商品1" },
        { item_id: 2, item_name: "商品2" },
      ],
    }

    const schema: MappingSchema = {
      items: [
        {
          item_id: "id",
          item_name: "name",
        },
      ],
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      items: [
        { id: 1, name: "商品1" },
        { id: 2, name: "商品2" },
      ],
    })
  })

  test("应正确处理转换函数", () => {
    const apiData = {
      created_at: "2023-01-01T00:00:00Z",
      price: "99.99",
      is_active: "1",
    }

    const schema: MappingSchema = {
      created_at: {
        key: "createdAt",
        transform: (value) => new Date(value),
      },
      price: {
        key: "price",
        transform: (value) => Number.parseFloat(value),
      },
      is_active: {
        key: "isActive",
        transform: (value) => value === "1",
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data.createdAt).toBeInstanceOf(Date)
    expect(result.data.createdAt.toISOString()).toBe("2023-01-01T00:00:00.000Z")
    expect(result.data.price).toBe(99.99)
    expect(result.data.isActive).toBe(true)
  })

  test("应正确处理条件映射", () => {
    const apiData = {
      status: "active",
      user_type: "admin",
    }

    const schema: MappingSchema = {
      status: {
        key: "statusText",
        transform: (value) => {
          const statusMap: Record<string, string> = {
            active: "活跃",
            inactive: "不活跃",
            pending: "待处理",
          }
          return statusMap[value] || value
        },
      },
      user_type: {
        key: "role",
        condition: (data) => data.status === "active",
        transform: (value) => value.toUpperCase(),
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      statusText: "活跃",
      role: "ADMIN",
    })

    // 测试条件不满足的情况
    const inactiveData = {
      status: "inactive",
      user_type: "admin",
    }
    const result2 = mapper.map(inactiveData, schema, "apiToApp")
    expect(result2.data).toEqual({
      statusText: "不活跃",
    })
    expect(result2.data.role).toBeUndefined()
  })

  test("应正确处理默认值", () => {
    const apiData = {
      name: "测试用户",
    }

    const schema: MappingSchema = {
      name: "name",
      age: {
        key: "age",
        default: 18,
      },
      status: {
        key: "status",
        default: "活跃",
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      name: "测试用户",
      age: 18,
      status: "活跃",
    })
  })

  test("应正确处理应用到API的映射方向", () => {
    const appData = {
      id: 1,
      name: "测试用户",
      email: "test@example.com",
    }

    const schema: MappingSchema = {
      user_id: "id",
      user_name: "name",
      user_email: "email",
    }

    const result = mapper.map(appData, schema, "appToApi")
    expect(result.data).toEqual({
      user_id: 1,
      user_name: "测试用户",
      user_email: "test@example.com",
    })
  })

  test("应记录映射错误但不中断处理", () => {
    const apiData = {
      user_id: 1,
      user_name: "测试用户",
    }

    const schema: MappingSchema = {
      user_id: "id",
      user_name: "name",
      user_email: {
        key: "email",
        required: true,
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      id: 1,
      name: "测试用户",
    })
    expect(result.errors).toHaveLength(1)
    expect(result.errors?.[0]).toContain("缺少必需字段")
  })

  test("应正确处理自定义映射函数", () => {
    const apiData = {
      first_name: "测试",
      last_name: "用户",
    }

    const schema: MappingSchema = {
      _custom: {
        key: "fullName",
        transform: (data) => `${data.first_name} ${data.last_name}`,
      },
    }

    const result = mapper.map(apiData, schema, "apiToApp")
    expect(result.data).toEqual({
      fullName: "测试 用户",
    })
  })
})
