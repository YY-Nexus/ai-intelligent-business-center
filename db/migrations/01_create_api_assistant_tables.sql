-- 创建会话表
CREATE TABLE IF NOT EXISTS api_assistant_sessions (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- 创建消息表
CREATE TABLE IF NOT EXISTS api_assistant_messages (
  id VARCHAR(255) PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (session_id) REFERENCES api_assistant_sessions(id) ON DELETE CASCADE
);

-- 创建反馈表
CREATE TABLE IF NOT EXISTS api_assistant_feedback (
  id SERIAL PRIMARY KEY,
  message_id VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (message_id) REFERENCES api_assistant_messages(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON api_assistant_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON api_assistant_sessions(updated_at);
