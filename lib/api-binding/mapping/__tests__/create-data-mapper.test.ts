import { createDataMapper } from "../data-mapper"
import { ApiDataMapper } from "../data-mapper"

describe("createDataMapper 工厂函数", () => {
  test("应该返回 ApiDataMapper 的实例", () => {
    const mapper = createDataMapper()
    expect(mapper).toBeInstanceOf(ApiDataMapper)
  })

  test("返回的实例应该具有所有必要的方法", () => {
    const mapper = createDataMapper()
    expect(typeof mapper.map).toBe("function")
    expect(typeof mapper.registerTransform).toBe("function")
    expect(typeof mapper.getTransform).toBe("function")
  })

  test("返回的实例应该预先注册了常用转换函数", () => {
    const mapper = createDataMapper()

    // 测试字符串转换函数
    expect(mapper.getTransform("toString")).toBeDefined()
    expect(mapper.getTransform("toLowerCase")).toBeDefined()
    expect(mapper.getTransform("toUpperCase")).toBeDefined()
    expect(mapper.getTransform("trim")).toBeDefined()

    // 测试数字转换函数
    expect(mapper.getTransform("toNumber")).toBeDefined()
    expect(mapper.getTransform("toInteger")).toBeDefined()
    expect(mapper.getTransform("toFloat")).toBeDefined()

    // 测试布尔转换函数
    expect(mapper.getTransform("toBoolean")).toBeDefined()

    // 测试日期转换函数
    expect(mapper.getTransform("toDate")).toBeDefined()
    expect(mapper.getTransform("toISOString")).toBeDefined()
    expect(mapper.getTransform("toLocaleDateString")).toBeDefined()

    // 测试数组转换函数
    expect(mapper.getTransform("toArray")).toBeDefined()
    expect(mapper.getTransform("join")).toBeDefined()
    expect(mapper.getTransform("split")).toBeDefined()
  })

  test("应该能够正确执行映射操作", () => {
    const mapper = createDataMapper()

    const source = {
      user_id: 1,
      user_name: "测试用户",
      user_email: "test@example.com",
    }

    const config = {
      fields: [
        { source: "user_id", target: "id" },
        { source: "user_name", target: "name" },
        { source: "user_email", target: "email" },
      ],
    }

    const result = mapper.map(source, config)

    expect(result.data).toEqual({
      id: 1,
      name: "测试用户",
      email: "test@example.com",
    })
  })
})
