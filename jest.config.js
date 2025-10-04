const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // 指向Next.js应用的路径
  dir: "./",
})

// Jest的自定义配置
const customJestConfig = {
  // 添加更多自定义配置
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // 处理模块别名
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "lib/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
}

// createJestConfig会自动处理一些配置，如处理Next.js的/api/路由
module.exports = createJestConfig(customJestConfig)
