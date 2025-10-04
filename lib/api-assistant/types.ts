export interface ApiAssistantMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: Date
}

export interface ApiAssistantSession {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ApiAssistantMessage[]
}

export interface ApiAssistantContext {
  apiDefinitions?: any[]
  apiDocumentation?: string
  codeSnippets?: string[]
  errorLogs?: string[]
  userPreferences?: {
    language: string
    framework: string
    codingStyle: string
  }
}

export interface ApiAssistantRequest {
  message: string
  sessionId?: string
  context?: ApiAssistantContext
}

export interface ApiAssistantResponse {
  id: string
  message: string
  code?: string
  codeLanguage?: string
  references?: {
    title: string
    url: string
  }[]
  suggestedActions?: {
    title: string
    description: string
    action: string
  }[]
}

export interface ApiAssistantFeedback {
  messageId: string
  rating: 1 | 2 | 3 | 4 | 5
  comment?: string
}
