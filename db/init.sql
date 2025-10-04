-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  image VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建会话表
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建用户设置表
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(50) DEFAULT 'system',
  avatar_color VARCHAR(50),
  language VARCHAR(50) DEFAULT 'zh-CN',
  timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
  notifications JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建权限表
CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建角色权限关联表
CREATE TABLE IF NOT EXISTS role_permissions (
  role VARCHAR(50) NOT NULL,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role, permission_id)
);

-- 插入默认权限
INSERT INTO permissions (name, description) VALUES
('dashboard:view', '查看仪表盘'),
('users:view', '查看用户列表'),
('users:create', '创建用户'),
('users:edit', '编辑用户'),
('users:delete', '删除用户'),
('settings:view', '查看设置'),
('settings:edit', '编辑设置'),
('audit:view', '查看审计'),
('audit:run', '运行审计'),
('repair:view', '查看修复'),
('repair:run', '运行修复'),
('api:view', '查看API'),
('api:create', '创建API'),
('api:edit', '编辑API'),
('api:delete', '删除API')
ON CONFLICT (name) DO NOTHING;

-- 插入角色权限
-- 管理员权限
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
ON CONFLICT DO NOTHING;

-- 普通用户权限
INSERT INTO role_permissions (role, permission_id)
SELECT 'user', id FROM permissions 
WHERE name IN ('dashboard:view', 'settings:view', 'settings:edit', 'audit:view', 'api:view')
ON CONFLICT DO NOTHING;

-- 创建默认管理员账户（密码: admin123）
INSERT INTO users (name, email, password_hash, role, settings)
VALUES (
  '管理员',
  'admin@example.com',
  '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', -- admin123的SHA-256哈希
  'admin',
  '{"theme":"system","notifications":{"email":true,"push":true,"sms":false},"language":"zh-CN","timezone":"Asia/Shanghai"}'
)
ON CONFLICT (email) DO NOTHING;

-- 创建默认用户账户（密码: user123）
INSERT INTO users (name, email, password_hash, role, settings)
VALUES (
  '测试用户',
  'user@example.com',
  '64ec88ca00b268e5ba1a35678a1b5316d212f4f366b2477232534a8aeca37f3c', -- user123的SHA-256哈希
  'user',
  '{"theme":"system","notifications":{"email":true,"push":true,"sms":false},"language":"zh-CN","timezone":"Asia/Shanghai"}'
)
ON CONFLICT (email) DO NOTHING;
