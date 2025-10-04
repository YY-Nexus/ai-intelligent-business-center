const nextJest = require("next/jest")

const createJestConfig = nextJest({
  dir: "./",
})

// 组件测试的自定义配置
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js", "<rootDir>/jest.component.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testMatch: ["**/__tests__/**/*.component.test.{ts,tsx}"],
  collectCoverage: true,
  collectCoverageFrom: ["components/**/*.{ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  coverageDirectory: "coverage/components",
}

module.exports = createJestConfig(customJestConfig)
