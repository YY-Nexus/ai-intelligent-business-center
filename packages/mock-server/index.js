const express = require("express")
const cors = require("cors")

const app = express()
const PORT = process.env.MOCK_PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "yanyu-cloud-mock-api",
    version: "1.0.0",
  })
})

// Category distribution chart data
app.get("/api/chart/category-distribution", (req, res) => {
  const categories = [
    { category: "电子产品", value: 45000, percentage: 28.5, color: "#3b82f6" },
    { category: "服装鞋包", value: 38000, percentage: 24.1, color: "#8b5cf6" },
    { category: "家居生活", value: 32000, percentage: 20.3, color: "#06b6d4" },
    { category: "美妆护肤", value: 28000, percentage: 17.7, color: "#ec4899" },
    { category: "食品饮料", value: 25000, percentage: 15.8, color: "#10b981" },
    { category: "运动户外", value: 22000, percentage: 13.9, color: "#f59e0b" },
    { category: "图书文娱", value: 18000, percentage: 11.4, color: "#6366f1" },
    { category: "母婴用品", value: 15000, percentage: 9.5, color: "#14b8a6" },
  ]

  res.json({
    success: true,
    data: categories,
    timestamp: new Date().toISOString(),
    total: categories.reduce((sum, cat) => sum + cat.value, 0),
  })
})

// Auth login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  const users = {
    "admin@example.com": {
      password: "adminpassword123",
      role: "admin",
      name: "管理员",
      id: "admin-001",
    },
    "user@example.com": {
      password: "userpassword123",
      role: "user",
      name: "普通用户",
      id: "user-001",
    },
  }

  const user = users[email]

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "用户名或密码错误",
    })
  }

  const token = `mock_token_${Buffer.from(`${email}:${Date.now()}`).toString("base64")}`

  res.json({
    success: true,
    data: {
      id: user.id,
      email,
      name: user.name,
      role: user.role,
      token,
    },
    timestamp: new Date().toISOString(),
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path,
  })
})

// Start server
app.listen(PORT, () => {
  console.log("")
  console.log("=".repeat(60))
  console.log("✅ YanYu Cloud Mock API Server")
  console.log("=".repeat(60))
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📈 Category chart: http://localhost:${PORT}/api/chart/category-distribution`)
  console.log(`🔐 Auth login: http://localhost:${PORT}/api/auth/login`)
  console.log("=".repeat(60))
  console.log("")
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("\nSIGINT received, shutting down gracefully...")
  process.exit(0)
})
