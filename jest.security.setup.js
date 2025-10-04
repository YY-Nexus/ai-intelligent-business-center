// 安全测试全局设置
global.securityConfig = {
  apiBaseUrl: process.env.TEST_API_BASE_URL || "http://localhost:3000/api",
  adminCredentials: {
    username: process.env.TEST_ADMIN_USERNAME || "admin",
    password: process.env.TEST_ADMIN_PASSWORD || "admin_password",
  },
  userCredentials: {
    username: process.env.TEST_USER_USERNAME || "user",
    password: process.env.TEST_USER_PASSWORD || "user_password",
  },
  testTimeout: 30000,
}

// 安全测试辅助函数
global.securityHelpers = {
  // 生成随机字符串
  randomString: (length = 10) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // 生成SQL注入测试字符串
  sqlInjectionStrings: [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT username, password FROM users; --",
    "1; SELECT * FROM users",
    "admin'--",
  ],

  // 生成XSS测试字符串
  xssStrings: [
    "<script>alert('XSS')</script>",
    "<img src='x' onerror='alert(\"XSS\")'>",
    "<svg onload='alert(\"XSS\")'>",
    "javascript:alert('XSS')",
    "\"><script>alert('XSS')</script>",
  ],

  // 生成命令注入测试字符串
  commandInjectionStrings: [
    "; ls -la",
    "| cat /etc/passwd",
    "`cat /etc/passwd`",
    "$(cat /etc/passwd)",
    "&& cat /etc/passwd",
  ],
}
