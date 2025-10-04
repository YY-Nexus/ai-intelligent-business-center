const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

// 安全测试的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "<rootDir>/jest.security.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.security.test.{ts,tsx}"],
  testTimeout: 30000, // 安全测试可能需要更长时间
}

module.exports = createJestConfig(customJestConfig)
