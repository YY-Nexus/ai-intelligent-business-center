"use client"

import { useState } from "react"
import { CheckCircle, AlertTriangle, XCircle, Code, FileCode, Database, Lock, Layers } from "lucide-react"

type FrameworkAuditProps = {
  results: {
    passed: number
    warnings: number
    failed: number
    total: number
  }
}

// 框架审查项目类型
interface FrameworkItem {
  id: number
  name: string
  category: "core" | "security" | "data" | "ui" | "integration"
  status: "passed" | "warning" | "failed"
  description: string
  impact: "high" | "medium" | "low"
  fixComplexity: "simple" | "moderate" | "complex"
  autoFixable: boolean
  codeSnippet?: string
  fixDescription?: string
}

// 增强的框架审查项目数据
const enhancedFrameworkItems: FrameworkItem[] = [
  {
    id: 1,
    name: "用户认证模块",
    category: "security",
    status: "passed",
    description: "用户登录和认证功能正常",
    impact: "high",
    fixComplexity: "complex",
    autoFixable: false,
  },
  {
    id: 2,
    name: "商品管理模块",
    category: "core",
    status: "passed",
    description: "商品CRUD功能完整",
    impact: "high",
    fixComplexity: "moderate",
    autoFixable: false,
  },
  {
    id: 3,
    name: "订单处理流程",
    category: "core",
    status: "warning",
    description: "订单取消功能存在潜在问题",
    impact: "medium",
    fixComplexity: "moderate",
    autoFixable: true,
    codeSnippet: `// 修复订单取消功能
async function cancelOrder(orderId) {
  // 检查订单状态
  const order = await getOrderById(orderId);
  if (!order) {
    throw new Error('订单不存在');
  }
  
  // 检查是否可以取消
  if (!['pending', 'processing'].includes(order.status)) {
    throw new Error('该订单状态不可取消');
  }
  
  // 事务处理
  return await db.transaction(async (trx) => {
    // 更新订单状态
    await trx('orders').where({ id: orderId }).update({ status: 'cancelled' });
    
    // 恢复库存
    for (const item of order.items) {
      await trx('inventory').where({ productId: item.productId })
        .increment('quantity', item.quantity);
    }
    
    // 记录取消原因和时间
    await trx('order_history').insert({
      orderId,
      action: 'cancel',
      timestamp: new Date(),
      metadata: JSON.stringify({ reason: 'user_request' })
    });
    
    return { success: true };
  });
}`,
    fixDescription: "完善订单取消流程，添加状态检查、库存恢复和历史记录",
  },
  {
    id: 4,
    name: "支付集成",
    category: "integration",
    status: "passed",
    description: "支付网关集成正确",
    impact: "high",
    fixComplexity: "complex",
    autoFixable: false,
  },
  {
    id: 5,
    name: "库存管理",
    category: "data",
    status: "failed",
    description: "库存锁定机制缺失",
    impact: "high",
    fixComplexity: "complex",
    autoFixable: true,
    codeSnippet: `// 实现库存锁定机制
async function lockInventory(productId, quantity, orderId) {
  // 检查库存是否充足
  const inventory = await db('inventory').where({ productId }).first();
  if (!inventory || inventory.availableQuantity < quantity) {
    throw new Error('库存不足');
  }
  
  // 锁定库存
  await db('inventory').where({ productId })
    .decrement('availableQuantity', quantity);
  
  // 记录库存锁定
  await db('inventory_locks').insert({
    productId,
    orderId,
    quantity,
    lockedAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30分钟过期
  });
  
  // 设置定时任务，处理过期的锁定
  scheduleInventoryLockCleanup(productId, orderId);
  
  return { success: true };
}

// 释放库存锁定
async function releaseInventoryLock(orderId) {
  const locks = await db('inventory_locks').where({ orderId });
  
  for (const lock of locks) {
    await db('inventory').where({ productId: lock.productId })
      .increment('availableQuantity', lock.quantity);
  }
  
  await db('inventory_locks').where({ orderId }).delete();
  
  return { success: true };
}`,
    fixDescription: "实现库存锁定机制，确保下单过程中锁定相应库存，防止超卖情况",
  },
  {
    id: 6,
    name: "数据验证",
    category: "security",
    status: "warning",
    description: "部分API缺少输入验证",
    impact: "high",
    fixComplexity: "simple",
    autoFixable: true,
    codeSnippet: `// 添加输入验证中间件
import { z } from 'zod';

// 创建验证模式
const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  price: z.number().positive(),
  description: z.string().optional(),
  categoryId: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
});

// 验证中间件
export function validateInput(schema) {
  return async (req, res, next) => {
    try {
      req.validatedData = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
  };
}

// 在路由中使用
app.post('/api/products', 
  validateInput(createProductSchema),
  async (req, res) => {
    // 使用验证后的数据
    const product = await createProduct(req.validatedData);
    res.json(product);
  }
);`,
    fixDescription: "添加输入验证中间件，确保所有API请求的数据都经过验证",
  },
  {
    id: 7,
    name: "错误处理",
    category: "core",
    status: "warning",
    description: "全局错误处理不完善",
    impact: "medium",
    fixComplexity: "moderate",
    autoFixable: true,
    codeSnippet: `// 全局错误处理中间件
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // 处理不同类型的错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Authentication Error',
      message: '请先登录或提供有效的认证信息'
    });
  }
  
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      error: 'Permission Error',
      message: '您没有执行此操作的权限'
    });
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message || '请求的资源不存在'
    });
  }
  
  // 默认服务器错误
  return res.status(500).json({
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? '服务器内部错误，请稍后再试' 
      : err.message
  });
}

// 在应用中注册错误处理中间件
app.use(errorHandler);`,
    fixDescription: "实现全局错误处理中间件，统一处理不同类型的错误",
  },
  {
    id: 8,
    name: "CSRF防护",
    category: "security",
    status: "failed",
    description: "缺少CSRF防护机制",
    impact: "high",
    fixComplexity: "simple",
    autoFixable: true,
    codeSnippet: `// 添加CSRF防护
import { csrf } from '@vercel/edge-csrf';

// 创建CSRF中间件
export const csrfProtection = csrf({
  cookie: {
    name: 'csrf',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  },
});

// 在中间件中应用
export default function middleware(request) {
  return csrfProtection(request);
}

// 在表单中添加CSRF令牌
<form action="/api/submit" method="POST">
  <input type="hidden" name="csrfToken" value={csrfToken} />
  <!-- 其他表单字段 -->
</form>

// 在API路由中验证CSRF令牌
export async function POST(request) {
  const formData = await request.formData();
  const csrfToken = formData.get('csrfToken');
  
  if (!validateCsrfToken(csrfToken)) {
    return new Response(JSON.stringify({ error: 'CSRF验证失败' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 处理请求...
}`,
    fixDescription: "添加CSRF防护机制，确保表单提交和API请求的安全性",
  },
  {
    id: 9,
    name: "路由配置",
    category: "core",
    status: "passed",
    description: "路由配置正确",
    impact: "medium",
    fixComplexity: "moderate",
    autoFixable: false,
  },
  {
    id: 10,
    name: "状态管理",
    category: "ui",
    status: "passed",
    description: "状态管理机制完善",
    impact: "medium",
    fixComplexity: "complex",
    autoFixable: false,
  },
  {
    id: 11,
    name: "数据缓存",
    category: "data",
    status: "warning",
    description: "缓存策略不完善",
    impact: "medium",
    fixComplexity: "moderate",
    autoFixable: true,
    codeSnippet: `// 实现数据缓存策略
import { LRUCache } from 'lru-cache';

// 创建缓存实例
const cache = new LRUCache({
  max: 500, // 最大缓存项数
  ttl: 1000 * 60 * 5, // 5分钟过期
});

// 缓存中间件
export function cacheMiddleware(ttl = 300000) {
  return (req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }
    
    res.setHeader('X-Cache', 'MISS');
    
    // 保存原始的res.json方法
    const originalJson = res.json;
    
    // 重写res.json方法以缓存响应
    res.json = function(data) {
      cache.set(key, data, { ttl });
      return originalJson.call(this, data);
    };
    
    next();
  };
}

// 在路由中使用
app.get('/api/products', cacheMiddleware(60000), async (req, res) => {
  const products = await getProducts();
  res.json(products);
});`,
    fixDescription: "实现数据缓存策略，提高API响应速度和系统性能",
  },
  {
    id: 12,
    name: "日志记录",
    category: "core",
    status: "passed",
    description: "日志记录机制完善",
    impact: "medium",
    fixComplexity: "simple",
    autoFixable: false,
  },
]

export function EnhancedFrameworkAudit({ results }: FrameworkAuditProps) {
  const [items, setItems] = useState(enhancedFrameworkItems)
  const [fixingItem, setFixingItem] = useState<FrameworkItem | null>(null)
  const [isFixing, setIsFixing] = useState(false)
  const [fixProgress, setFixProgress] = useState(0)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // 修复问题的实际逻辑
  const fixIssue = async (item: FrameworkItem) => {
    setIsFixing(true)
    setFixProgress(0)

    try {
      // 模拟修复过程
      for (let i = 1; i <= 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setFixProgress(i * 10)
      }

      // 更新项目状态
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, status: "passed", description: `${i.name}问题已修复` } : i
      )

      setItems(updatedItems)
      setFixingItem(null)
    } catch (error) {
      console.error("修复问题时出错:", error)
      // 处理错误情况
    } finally {
      setIsFixing(false)
      setFixProgress(0)
    }
  }

  // 批量修复所有可自动修复的问题
  const fixAllAutoFixableIssues = async () => {
    const autoFixableItems = items.filter((item) => item.autoFixable && item.status !== "passed")
    
    if (autoFixableItems.length === 0) {
      return
    }
    
    setIsFixing(true)
    setFixProgress(0)
    
    try {
      for (let i = 0; i < autoFixableItems.length; i++) {
        const item = autoFixableItems[i]
        
        // 更新进度
        setFixProgress(Math.round((i / autoFixableItems.length) * 100))
        
        // 模拟修复过程
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        // 更新项目状态
        setItems((prevItems) =>
          prevItems.map((prevItem) =>
            prevItem.id === item.id
              ? { ...prevItem, status: "passed", description: `${prevItem.name}问题已修复` }
              : prevItem
          )
        )
      }
      
      setFixProgress(100)
    } catch (error) {
      console.error("批量修复问题时出错:", error)
    } finally {
      setIsFixing(false)
      setTimeout(() => setFixProgress(0), 1000)
    }
  }

  // 过滤和搜索项目
  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesSearch = searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // 获取类别图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "core":
        return <Layers className="h-4 w-4" />
      case "security":
        return <Lock className="h-4 w-4" />
      case "data":
        return <Database className="h-4 w-4" />
      case "ui":
        return <FileCode className="h-4 w-4" />
      case "integration":
        return <Code className="h-4 w-4" />
      default:
        return null
    }
  }

  // 获取类别名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case "core":
        return "核心功能"
      case "security":
        return "安全机制"
      case "data":
        return "数据处理"
      case "ui":
        return "用户界面"
      case "integration":
        return "集成服务"
      default:
        return category
    }
  }

  // 获取影响程度样式
  const getImpactStyle = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return ""
    }
  }

  // 获取复杂度样式
  const getComplexityStyle = (complexity: string) => {
    switch (complexity) {
      case "complex":
        return "bg-red-50 text-red-700 border-red-200"
      case "moderate":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "simple":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return ""
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">框架完整性审查结果</h3>
        <p className="text-sm text-muted-foreground mb-4">检查系统核心功能模块是否完整，各模块间衔接是否正常</p>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="filter-category" className="block text-sm font-medium mb-1">
                按类别筛选
              </label>\
            </div>
