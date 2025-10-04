# API绑定系统使用指南

## 1. 简介

API绑定系统是一个强大的工具，用于简化与各种API的集成。本指南将帮助您了解如何使用该系统。

## 2. 安装

首先，确保您的项目中已安装所需的依赖：

\`\`\`bash
npm install @api-binding/core
\`\`\`

## 3. 基本用法

### 3.1 创建API客户端

使用`DIApiClient`创建API客户端：

\`\`\`typescript
import { DIApiClient } from '@api-binding/core';

const client = new DIApiClient({
  config: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  },
  auth: {
    type: 'bearer',
    enabled: true,
    token: 'your-token',
  },
});
\`\`\`

### 3.2 发送请求

使用客户端发送���种HTTP请求：

\`\`\`typescript
// GET请求
const response = await client.get('/users');

// 带查询参数的GET请求
const response = await client.get('/users', {
  queryParams: { page: 1, limit: 10 },
});

// POST请求
const response = await client.post('/users', {
  name: '新用户',
  email: 'new@example.com',
});

// PUT请求
const response = await client.put('/users/1', {
  name: '更新的用户',
});

// DELETE请求
const response = await client.delete('/users/1');
\`\`\`

### 3.3 处理响应

响应对象包含以下属性：

\`\`\`typescript
{
  data: any; // 响应数据
  status: number; // HTTP状态码
  statusText: string; // HTTP状态文本
  headers: Record<string, string>; // 响应头
  metadata?: { // 可选的元数据
    pagination?: {
      total: number;
      page: number;
      perPage: number;
    };
  };
}
\`\`\`

### 3.4 错误处理

使用try/catch处理错误：

\`\`\`typescript
try {
  const response = await client.get('/users/999');
} catch (error) {
  console.error('API错误:', error.message);
  
  // 检查错误类型
  if (error.status === 404) {
    console.log('资源未找到');
  } else if (error.status === 401) {
    console.log('未授权');
  }
}
\`\`\`

## 4. 高级用法

### 4.1 数据映射

使用数据映射转换API数据：

\`\`\`typescript
const response = await client.get('/users/1', {
  mapping: {
    user_id: 'id',
    user_name: 'name',
    user_email: 'email',
    created_at: {
      key: 'createdAt',
      transform: (value) => new Date(value),
    },
  },
});
\`\`\`

### 4.2 请求拦截器

添加请求拦截器：

\`\`\`typescript
const client = new DIApiClient({
  // ...配置
  requestInterceptors: [
    {
      onRequest: (config) => {
        // 修改请求配置
        config.headers['X-Custom-Header'] = 'Value';
        return config;
      },
    },
  ],
});
\`\`\`

### 4.3 响应拦截器

添加响应拦截器：

\`\`\`typescript
const client = new DIApiClient({
  // ...配置
  responseInterceptors: [
    {
      onResponse: (response, data) => {
        // 修改响应数据
        return data.items || data;
      },
      onError: (error, request) => {
        // 处理错误
        console.error(`请求 ${request.url} 失败:`, error);
        return error;
      },
    },
  ],
});
\`\`\`

### 4.4 自定义认证

使用自定义认证策略：

\`\`\`typescript
const client = new DIApiClient({
  // ...配置
  auth: {
    type: 'custom',
    enabled: true,
    getAuthHeaders: async () => {
      // 自定义逻辑获取认证头
      return {
        'X-API-Key': 'your-api-key',
        'X-Custom-Auth': 'custom-value',
      };
    },
  },
});
\`\`\`

### 4.5 批量请求

处理批量请求：

\`\`\`typescript
// 创建多个请求
const requests = [
  client.get('/users/1'),
  client.get('/users/2'),
  client.get('/users/3'),
];

// 并行执行
const responses = await Promise.all(requests);
\`\`\`

## 5. 配置选项

### 5.1 API配置

\`\`\`typescript
interface ApiConfiguration {
  baseUrl: string; // API基础URL
  timeout?: number; // 请求超时时间（毫秒）
  headers?: Record<string, string>; // 默认请求头
  retryConfig?: { // 重试配置
    maxRetries: number; // 最大重试次数
    retryDelay: number; // 重试延迟（毫秒）
    retryableStatusCodes: number[]; // 可重试的状态码
  };
}
\`\`\`

### 5.2 认证配置

\`\`\`typescript
// Basic认证
{
  type: 'basic',
  enabled: true,
  username: 'your-username',
    // 可重试的状态码
  };
}
\`\`\`

### 5.2 认证配置

\`\`\`typescript
// Basic认证
{
  type: 'basic',
  enabled: true,
  username: 'your-username',
  password: 'your-password',
}

// Bearer认证
{
  type: 'bearer',
  enabled: true,
  token: 'your-token',
}

// API Key认证
{
  type: 'api-key',
  enabled: true,
  apiKey: 'your-api-key',
  headerName: 'X-API-Key', // 可选，默认为'X-API-Key'
}

// OAuth2认证
{
  type: 'oauth2',
  enabled: true,
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  tokenUrl: 'https://auth.example.com/token',
  scopes: ['read', 'write'], // 可选
}

// 自定义认证
{
  type: 'custom',
  enabled: true,
  getAuthHeaders: async () => {
    // 自定义逻辑
    return { 'X-Custom-Auth': 'value' };
  },
}
\`\`\`

## 6. 最佳实践

### 6.1 组织API客户端

为不同的API创建专用客户端：

\`\`\`typescript
// 用户API客户端
const userApiClient = new DIApiClient({
  config: { baseUrl: 'https://api.example.com/users' },
  // ...其他配置
});

// 产品API客户端
const productApiClient = new DIApiClient({
  config: { baseUrl: 'https://api.example.com/products' },
  // ...其他配置
});
\`\`\`

### 6.2 使用服务类

创建服务类封装API操作：

\`\`\`typescript
class UserService {
  private client: DIApiClient;
  
  constructor() {
    this.client = new DIApiClient({
      config: { baseUrl: 'https://api.example.com' },
      // ...其他配置
    });
  }
  
  async getUsers(page = 1, limit = 10) {
    return this.client.get('/users', {
      queryParams: { page, limit },
      mapping: {
        items: [
          {
            user_id: 'id',
            user_name: 'name',
            user_email: 'email',
          },
        ],
        total: 'totalCount',
        page: 'currentPage',
      },
    });
  }
  
  async getUserById(id: number) {
    return this.client.get(`/users/${id}`, {
      mapping: {
        user_id: 'id',
        user_name: 'name',
        user_email: 'email',
      },
    });
  }
  
  async createUser(userData: any) {
    return this.client.post('/users', userData);
  }
  
  async updateUser(id: number, userData: any) {
    return this.client.put(`/users/${id}`, userData);
  }
  
  async deleteUser(id: number) {
    return this.client.delete(`/users/${id}`);
  }
}
\`\`\`

### 6.3 错误处理策略

实现全局错误处理：

\`\`\`typescript
// 创建自定义错误处理器
class CustomErrorHandler {
  handleError(error: any) {
    // 记录错误
    console.error('API错误:', error);
    
    // 根据错误类型处理
    if (error.status === 401) {
      // 处理认证错误
      authService.refreshToken();
    } else if (error.status === 403) {
      // 处理授权错误
      notificationService.show('您没有权限执行此操作');
    } else if (error.status === 404) {
      // 处理资源未找到
      notificationService.show('请求的资源不存在');
    } else {
      // 处理其他错误
      notificationService.show('发生错误，请稍后重试');
    }
    
    // 返回处理后的错误
    return error;
  }
}

// 注册错误处理器
container.register(SERVICE_TOKENS.ERROR_HANDLER, () => new CustomErrorHandler());
\`\`\`

### 6.4 缓存策略

实现请求缓存：

\`\`\`typescript
// 创建缓存拦截器
const cacheInterceptor = {
  onRequest: (config) => {
    const cacheKey = `${config.method}:${config.url}`;
    const cachedResponse = cache.get(cacheKey);
    
    if (cachedResponse && !config.noCache) {
      // 返回缓存的响应
      return Promise.resolve(cachedResponse);
    }
    
    return config;
  },
  onResponse: (response, data) => {
    const cacheKey = `${response.config.method}:${response.config.url}`;
    
    // 缓存响应
    cache.set(cacheKey, data, 60 * 1000); // 缓存60秒
    
    return data;
  },
};

// 添加缓存拦截器
const client = new DIApiClient({
  // ...配置
  requestInterceptors: [cacheInterceptor],
});
\`\`\`

## 7. 故障排除

### 7.1 常见问题

#### 请求超时

如果请求超时，可以：
- 增加超时时间
- 检查网络连接
- 检查服务器响应时间

\`\`\`typescript
const client = new DIApiClient({
  config: {
    baseUrl: 'https://api.example.com',
    timeout: 10000, // 增加到10秒
  },
  // ...其他配置
});
\`\`\`

#### 认证错误

如果遇到认证错误，可以：
- 检查认证凭据
- 刷新令牌
- 检查认证配置

\`\`\`typescript
// 刷新令牌示例
async function refreshToken() {
  try {
    const response = await fetch('https://auth.example.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: 'your-refresh-token',
        client_id: 'your-client-id',
        client_secret: 'your-client-secret',
      }),
    });
    
    const data = await response.json();
    
    // 更新客户端认证
    client.updateAuth({
      type: 'bearer',
      enabled: true,
      token: data.access_token,
    });
    
    return data.access_token;
  } catch (error) {
    console.error('刷新令牌失败:', error);
    throw error;
  }
}
\`\`\`

#### 数据映射错误

如果遇到数据映射错误，可以：
- 检查映射模式
- 检查API响应格式
- 使用转换函数处理特殊情况

\`\`\`typescript
// 处理可能缺失的字段
const mapping = {
  user_id: 'id',
  user_name: {
    key: 'name',
    transform: (value) => value || '未知用户',
  },
  user_email: {
    key: 'email',
    transform: (value) => value || 'no-email@example.com',
  },
};
\`\`\`

### 7.2 调试技巧

#### 启用调试日志

\`\`\`typescript
// 创建日志拦截器
const logInterceptor = {
  onRequest: (config) => {
    console.log('请求:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      body: config.body,
    });
    return config;
  },
  onResponse: (response, data) => {
    console.log('响应:', {
      status: response.status,
      headers: response.headers,
      data,
    });
    return data;
  },
};

// 添加日志拦截器
const client = new DIApiClient({
  // ...配置
  requestInterceptors: [logInterceptor],
});
\`\`\`

#### 使用网络监控工具

使用浏览器开发者工具或专用工具监控网络请求：
- Chrome DevTools
- Postman
- Fiddler

#### 模拟API响应

在开发和测试阶段，可以使用模拟响应：

\`\`\`typescript
// 创建模拟拦截器
const mockInterceptor = {
  onRequest: (config) => {
    // 检查是否应该模拟
    if (config.mock) {
      // 返回模拟响应
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        data: config.mockData,
      });
    }
    return config;
  },
};

// 使用模拟数据
const response = await client.get('/users/1', {
  mock: true,
  mockData: {
    user_id: 1,
    user_name: '模拟用户',
    user_email: 'mock@example.com',
  },
});
\`\`\`

## 8. 参考

### 8.1 API参考

完整的API参考文档可在以下位置找到：
- [API客户端参考](https://example.com/docs/api-client)
- [配置管理器参考](https://example.com/docs/config-manager)
- [认证处理器参考](https://example.com/docs/auth-handler)
- [请求构建器参考](https://example.com/docs/request-builder)
- [响应解析器参考](https://example.com/docs/response-parser)
- [数据映射器参考](https://example.com/docs/data-mapper)
- [错误处理器参考](https://example.com/docs/error-handler)

### 8.2 示例项目

查看示例项目以了解更多用法：
- [基本示例](https://github.com/example/api-binding-basic)
- [高级示例](https://github.com/example/api-binding-advanced)
- [完整应用示例](https://github.com/example/api-binding-app)
\`\`\`

创建依赖注入模式文档：
