// 在所有测试之前运行的代码
import "@testing-library/jest-dom"

// 模拟fetch API
global.fetch = jest.fn()

// 重置所有模拟
beforeEach(() => {
  jest.resetAllMocks()
})
