# 依赖注入模式指南

## 1. 什么是依赖注入？

依赖注入（Dependency Injection，简称DI）是一种设计模式，它允许我们将一个对象的依赖关系从代码中分离出来。在这种模式中，我们不在类内部创建依赖对象，而是从外部接收它们。

## 2. 为什么使用依赖注入？

依赖注入提供了以下好处：

- **降低耦合度**：组件之间的依赖关系更加松散，更容易替换和修改。
- **提高可测试性**：可以轻松地模拟依赖，使单元测试更加简单。
- **提高可维护性**：代码更加模块化，更容易理解和维护。
- **提高可扩展性**：可以轻松地添加新功能和替换现有功能。

## 3. 依赖注入的类型

### 3.1 构造函数注入

通过构造函数参数注入依赖：

\`\`\`typescript
class UserService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getUsers() {
    return this.apiClient.get('/users');
  }
}

// 使用
const apiClient = new ApiClient();
const userService = new UserService(apiClient);
\`\`\`

### 3.2 属性注入

通过设置属性注入依赖：

\`\`\`typescript
class UserService {
  apiClient: ApiClient;
  
  async getUsers() {
    return this.apiClient.get('/users');
  }
}

// 使用
const userService = new UserService();
userService.apiClient = new ApiClient();
\`\`\`

### 3.3 方法注入

通过方法参数注入依赖：

\`\`\`typescript
class UserService {
  async getUsers(apiClient: ApiClient) {
    return apiClient.get('/users');
  }
}

// 使用
const userService = new UserService();
const apiClient = new ApiClient();
userService.getUsers(apiClient);
\`\`\`

## 4. 依赖注入容器

依赖注入容器是一个管理依赖关系的对象。它负责创建、配置和提供依赖对象。

### 4.1 容器的基本功能

- **注册**：将服务注册到容器中。
- **解析**：从容器中获取服务实例。
- **管理生命周期**：管理服务实例的生命周期（单例、瞬态等）。

### 4.2 我们的DIContainer实现

我们的`DIContainer`类提供了以下功能：

\`\`\`typescript
class DIContainer {
  // 注册服务
  register<T>(token: string, factory: () => T, singleton = true): void;
  
  // 注册实例
  registerInstance<T>(token: string, instance: T): void;
  
  // 解析服务
  resolve<T>(token: string): T;
  
  // 检查服务是否已注册
  has(token: string): boolean;
  
  // 移除服务
  remove(token: string): void;
  
  // 清除所有服务
  clear(): void;
}
\`\`\`

### 4.3 使用DIContainer

\`\`\`typescript
// 创建容器
const container = new DIContainer();

// 注册服务
container.register('apiClient', () => new ApiClient({
  baseUrl: 'https://api.example.com',
}), true); // 单例

container.register('userService', () => {
  const apiClient = container.resolve<ApiClient>('apiClient');
  return new UserService(apiClient);
}, true); // 单例

// 解析服务
const userService = container.resolve<UserService>('userService');
userService.getUsers().then(users => console.log(users));
\`\`\`

## 5. 服务提供者模式

服务提供者是一个负责向容器注册一组相关服务的对象。

### 5.1 服务提供者接口

\`\`\`typescript
interface ServiceProvider {
  register(container: DIContainer): void;
}
\`\`\`

### 5.2 实现服务提供者

\`\`\`typescript
class ApiServiceProvider implements ServiceProvider {
  register(container: DIContainer): void {
    // 注册配置管理器
    container.register(SERVICE_TOKENS.CONFIG_MANAGER, () => {
      return new ConfigManager();
    }, true);
    
    // 注册认证处理器工厂
    container.register(SERVICE_TOKENS.AUTH_HANDLER, () => {
      const config = container.resolve<ApiConfiguration>(SERVICE_TOKENS.AUTH_CONFIG);
      return AuthHandlerFactory.createHandler(config);
    }, false);
    
    // 注册请求构建器
    container.register(SERVICE_TOKENS.REQUEST_BUILDER, () => {
      const config = container.resolve<ApiConfiguration>(SERVICE_TOKENS.API_CONFIG);
      return new RequestBuilder(config.baseUrl);
    }, false);
    
    // 注册响应解析器
    container.register(SERVICE_TOKENS.RESPONSE_PARSER, () => {
      return new ApiResponseParser();
    }, true);
    
    // 注册数据映射器
    container.register(SERVICE_TOKENS.DATA_MAPPER, () => {
      return new ApiDataMapper();
    }, true);
    
    // 注册错误处理器
    container.register(SERVICE_TOKENS.ERROR_HANDLER, () => {
      return new ApiErrorHandler();
    }, true);
  }
}
\`\`\`

### 5.3 使用服务提供者

\`\`\`typescript
// 创建容器
const container = new DIContainer();

// 注册服务
const provider = new ApiServiceProvider();
provider.register(container);

// 解析服务
const apiClient = container.resolve<DIApiClient>(SERVICE_TOKENS.API_CLIENT);
\`\`\`

## 6. 最佳实践

### 6.1 使用接口而非具体实现

\`\`\`typescript
// 定义接口
interface ApiClient {
  get(path: string, options?: any): Promise<any>;
  post(path: string, data?: any, options?: any): Promise<any>;
  // ...其他方法
}

// 实现接口
class HttpApiClient implements ApiClient {
  // 实现方法
}

// 注册服务
container.register<ApiClient>('apiClient', () => {
  return new HttpApiClient();
});

// 使用接口类型
const apiClient = container.resolve<ApiClient>('apiClient');
\`\`\`

### 6.2 使用工厂函数

\`\`\`typescript
// 定义工厂函数
function createApiClient(config: ApiConfiguration): ApiClient {
  return new HttpApiClient(config);
}

// 注册服务
container.register<ApiClient>('apiClient', () => {
  const config = container.resolve<ApiConfiguration>('apiConfig');
  return createApiClient(config);
});
\`\`\`

### 6.3 使用标记常量

\`\`\`typescript
// 定义标记常量
const SERVICE_TOKENS = {
  API_CLIENT: 'apiClient',
  API_CONFIG: 'apiConfig',
  AUTH_HANDLER: 'authHandler',
  // ...其他标记
};

// 注册服务
container.register(SERVICE_TOKENS.API_CLIENT, () => {
  return new HttpApiClient();
});

// 解析服务
const apiClient = container.resolve<ApiClient>(SERVICE_TOKENS.API_CLIENT);
\`\`\`

### 6.4 管理服务生命周期

\`\`\`typescript
// 单例服务（默认）
container.register('logger', () => {
  return new Logger();
}, true);

// 瞬态服务
container.register('requestBuilder', () => {
  return new RequestBuilder();
}, false);
\`\`\`

### 6.5 懒加载服务

\`\`\`typescript
// 服务只在首次解析时创建
container.register('expensiveService', () => {
  console.log('创建昂贵服务');
  return new ExpensiveService();
}, true);

// 服务��在需要时创建
if (needExpensiveService) {
  const service = container.resolve<ExpensiveService>('expensiveService');
  service.doSomething();
}
\`\`\`

## 7. 测试与依赖注入

### 7.1 使用模拟对象

\`\`\`typescript
// 创建模拟API客户端
const mockApiClient: ApiClient = {
  get: jest.fn().mockResolvedValue({ data: 'mock data' }),
  post: jest.fn().mockResolvedValue({ data: 'mock data' }),
  // ...其他方法
};

// 注册模拟服务
container.registerInstance('apiClient', mockApiClient);

// 测试使用模拟服务的组件
const userService = container.resolve<UserService>('userService');
const users = await userService.getUsers();

// 验证模拟对象被调用
expect(mockApiClient.get).toHaveBeenCalledWith('/users');
\`\`\`

### 7.2 创建测试容器

\`\`\`typescript
// 创建测试容器
function createTestContainer() {
  const container = new DIContainer();
  
  // 注册模拟服务
  container.registerInstance('apiClient', {
    get: jest.fn().mockResolvedValue({ data: 'mock data' }),
    post: jest.fn().mockResolvedValue({ data: 'mock data' }),
  });
  
  // 注册真实服务
  container.register('userService', () => {
    const apiClient = container.resolve<ApiClient>('apiClient');
    return new UserService(apiClient);
  });
  
  return container;
}

// 在测试中使用
test('用户服务应返回用户列表', async () => {
  const container = createTestContainer();
  const userService = container.resolve<UserService>('userService');
  
  const users = await userService.getUsers();
  
  expect(users).toEqual({ data: 'mock data' });
});
\`\`\`

## 8. 常见问题与解决方案

### 8.1 循环依赖

当两个或多个服务相互依赖时，会出现循环依赖问题。

解决方案：
- **使用接口**：通过接口打破循环依赖。
- **使用事件**：通过事件机制解耦组件。
- **重构设计**：重新设计组件，避免循环依赖。

### 8.2 过度使用依赖注入

过度使用依赖注入会导致代码复杂度增加。

解决方案：
- **只注入必要的依赖**：不要注入可以在内部创建的简单对象。
- **使用默认实现**：为依赖提供默认实现，减少配置复杂度。
- **平衡灵活性和复杂性**：在灵活性和复杂性之间找到平衡点。

### 8.3 容器泄漏

在应用代码中直接使用容器会导致容器泄漏。

解决方案：
- **使用工厂**：通过工厂隐藏容器。
- **使用服务定位器**：将容器封装在服务定位器中。
- **只在组合根中使用容器**：只在应用的入口点使用容器。

## 9. 总结

依赖注入是一种强大的设计模式，它可以帮助我们创建松耦合、可测试和可维护的代码。通过使用依赖注入容器和服务提供者，我们可以更加方便地管理依赖关系。

在实践中，我们应该遵循以下原则：
- 使用接口而非具体实现
- 使用工厂函数创建复杂对象
- 使用标记常量管理服务标识
- 合理管理服务生命周期
- 在测试中使用模拟对象

通过遵循这些原则，我们可以充分发挥依赖注入的优势，创建高质量的代码。
