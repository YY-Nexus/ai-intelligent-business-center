const config = require("./jest.config")

module.exports = {
  ...config,
  testMatch: ["**/__integration_tests__/**/*.test.[jt]s?(x)"],
  testTimeout: 30000, // 集成测试可能需要更长的超时时间
}
