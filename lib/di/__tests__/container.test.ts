import { DIContainer } from "../container"

describe("依赖注入容器", () => {
  let container: DIContainer

  beforeEach(() => {
    container = new DIContainer()
  })

  test("应能注册和解析服务", () => {
    const mockService = { name: "测试服务" }
    container.register("testService", () => mockService)

    const resolved = container.resolve<typeof mockService>("testService")
    expect(resolved).toBe(mockService)
  })

  test("单例服务应返回相同实例", () => {
    let counter = 0
    container.register("counter", () => ({ value: counter++ }), true)

    const instance1 = container.resolve<{ value: number }>("counter")
    const instance2 = container.resolve<{ value: number }>("counter")

    expect(instance1).toBe(instance2)
    expect(instance1.value).toBe(0)
    expect(instance2.value).toBe(0)
  })

  test("非单例服务应返回新实例", () => {
    let counter = 0
    container.register("counter", () => ({ value: counter++ }), false)

    const instance1 = container.resolve<{ value: number }>("counter")
    const instance2 = container.resolve<{ value: number }>("counter")

    expect(instance1).not.toBe(instance2)
    expect(instance1.value).toBe(0)
    expect(instance2.value).toBe(1)
  })

  test("解析未注册服务应抛出错误", () => {
    expect(() => {
      container.resolve("nonExistentService")
    }).toThrow("未找到服务: nonExistentService")
  })

  test("应能检查服务是否已注册", () => {
    container.register("testService", () => ({}))

    expect(container.has("testService")).toBe(true)
    expect(container.has("nonExistentService")).toBe(false)
  })

  test("应能移除服务", () => {
    container.register("testService", () => ({}))
    expect(container.has("testService")).toBe(true)

    container.remove("testService")
    expect(container.has("testService")).toBe(false)
  })

  test("应能注册实例", () => {
    const instance = { name: "测试实例" }
    container.registerInstance("testInstance", instance)

    const resolved = container.resolve<typeof instance>("testInstance")
    expect(resolved).toBe(instance)
  })

  test("应能清除所有服务", () => {
    container.register("service1", () => ({}))
    container.register("service2", () => ({}))
    expect(container.has("service1")).toBe(true)
    expect(container.has("service2")).toBe(true)

    container.clear()
    expect(container.has("service1")).toBe(false)
    expect(container.has("service2")).toBe(false)
  })
})
