/**
 * 文件上传选项
 */
export interface FileUploadOptions {
  file: File | Blob
  purpose:
    | "batch"
    | "retrieval"
    | "file-extract"
    | "code-interpreter"
    | "fine-tune"
    | "fine-tune-function-calling"
    | "fine-tune-vision-cogview"
    | "fine-tune-vision-cogvlm"
  knowledge_id?: string
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
  status: string
  status_details?: string
}

/**
 * 文件删除响应
 */
export interface FileDeleteResponse {
  id: string
  object: string
  deleted: boolean
}

/**
 * 文件列表选项
 */
export interface FileListOptions {
  purpose: "batch" | "retrieval" | "file-extract" | "fine-tune"
  knowledge_id?: string
  page?: number
  limit?: number
  after?: string
  order?: "desc" | "asc"
}

/**
 * 文件列表响应
 */
export interface FileListResponse {
  object: string
  data: Array<{
    id: string
    object: string
    bytes: number
    created_at: number
    filename: string
    purpose: string
    status: string
    status_details?: string
  }>
  has_more: boolean
}

/**
 * 文档详情响应
 */
export interface DocumentDetailResponse {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
  status: string
  status_details?: string
  knowledge_id?: string
  knowledge_type?: number
  custom_separator?: string[]
  sentence_size?: number
}

/**
 * 文档编辑选项
 */
export interface DocumentEditOptions {
  document_id: string
  knowledge_type: string | number
  custom_separator?: string[]
  sentence_size?: number
}

/**
 * 文档编辑响应
 */
export interface DocumentEditResponse {
  id: string
  object: string
  bytes: number
  created_at: number
  filename: string
  purpose: string
  status: string
  status_details?: string
  knowledge_id?: string
  knowledge_type?: number
  custom_separator?: string[]
  sentence_size?: number
}

/**
 * 文件内容响应
 */
export interface FileContentResponse {
  content: string
}
