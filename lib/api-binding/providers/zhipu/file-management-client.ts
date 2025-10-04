import { ApiClient } from "../../core/api-client"
import type { RequestConfig } from "../../request/request-types"
import type { NormalizedResponse } from "../../response/response-types"
import type {
  FileUploadOptions,
  FileUploadResponse,
  FileListOptions,
  FileListResponse,
  FileDeleteResponse,
  DocumentDetailResponse,
  DocumentEditOptions,
  DocumentEditResponse,
  FileContentResponse,
} from "./file-types"

/**
 * 智谱AI文件管理和内容抽取客户端
 */
export class FileManagementClient extends ApiClient {
  constructor(apiKey: string, baseUrl = "https://open.bigmodel.cn/api/paas/v4") {
    super({
      baseUrl,
      defaultHeaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })
  }

  /**
   * 上传文件
   * @param options 上传选项
   * @returns 上传响应
   */
  public async uploadFile(options: FileUploadOptions): Promise<NormalizedResponse<FileUploadResponse>> {
    const { file, purpose, knowledge_id } = options

    const formData = new FormData()
    formData.append("file", file)
    formData.append("purpose", purpose)

    if (knowledge_id) {
      formData.append("knowledge_id", knowledge_id)
    }

    const requestConfig: RequestConfig = {
      method: "POST",
      url: `${this.config.baseUrl}/files`,
      headers: {
        ...this.config.defaultHeaders,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }

    return this.request<FileUploadResponse>(requestConfig)
  }

  /**
   * 删除文件
   * @param fileId 文件ID
   * @returns 删除响应
   */
  public async deleteFile(fileId: string): Promise<NormalizedResponse<FileDeleteResponse>> {
    const requestConfig: RequestConfig = {
      method: "DELETE",
      url: `${this.config.baseUrl}/files/${fileId}`,
      headers: { ...this.config.defaultHeaders },
    }

    return this.request<FileDeleteResponse>(requestConfig)
  }

  /**
   * 获取文件列表
   * @param options 列表选项
   * @returns 文件列表
   */
  public async listFiles(options: FileListOptions): Promise<NormalizedResponse<FileListResponse>> {
    const { purpose, knowledge_id, page, limit, after, order } = options

    let url = `${this.config.baseUrl}/files?purpose=${purpose}`

    if (knowledge_id) url += `&knowledge_id=${knowledge_id}`
    if (page) url += `&page=${page}`
    if (limit) url += `&limit=${limit}`
    if (after) url += `&after=${after}`
    if (order) url += `&order=${order}`

    const requestConfig: RequestConfig = {
      method: "GET",
      url,
      headers: { ...this.config.defaultHeaders },
    }

    return this.request<FileListResponse>(requestConfig)
  }

  /**
   * 获取知识库文件详情
   * @param documentId 文档ID
   * @returns 文档详情
   */
  public async getDocumentDetail(documentId: string): Promise<NormalizedResponse<DocumentDetailResponse>> {
    const requestConfig: RequestConfig = {
      method: "GET",
      url: `${this.config.baseUrl}/document/${documentId}`,
      headers: { ...this.config.defaultHeaders },
    }

    return this.request<DocumentDetailResponse>(requestConfig)
  }

  /**
   * 编辑知识库文件
   * @param options 编辑选项
   * @returns 编辑响应
   */
  public async editDocument(options: DocumentEditOptions): Promise<NormalizedResponse<DocumentEditResponse>> {
    const { document_id, knowledge_type, custom_separator, sentence_size } = options

    const requestConfig: RequestConfig = {
      method: "PUT",
      url: `${this.config.baseUrl}/document/${document_id}`,
      headers: { ...this.config.defaultHeaders },
      body: {
        knowledge_type,
        ...(custom_separator && { custom_separator }),
        ...(sentence_size && { sentence_size }),
      },
    }

    return this.request<DocumentEditResponse>(requestConfig)
  }

  /**
   * 获取文件内容
   * @param fileId 文件ID
   * @returns 文件内容
   */
  public async getFileContent(fileId: string): Promise<NormalizedResponse<FileContentResponse>> {
    const requestConfig: RequestConfig = {
      method: "GET",
      url: `${this.config.baseUrl}/files/${fileId}/content`,
      headers: { ...this.config.defaultHeaders },
    }

    return this.request<FileContentResponse>(requestConfig)
  }

  /**
   * 基于文件内容进行问答
   * @param fileId 文件ID
   * @param question 问题
   * @param model 模型名称
   * @returns 问答响应
   */
  public async fileQA(fileId: string, question: string, model = "glm-4-long"): Promise<any> {
    // 首先获取文件内容
    const contentResponse = await this.getFileContent(fileId)
    const fileContent = JSON.parse(contentResponse.data.content).content

    // 构建问答请求
    const messageContent = `请对\n${fileContent}\n的内容进行分析，回答以下问题：${question}`

    const requestConfig: RequestConfig = {
      method: "POST",
      url: `${this.config.baseUrl}/chat/completions`,
      headers: { ...this.config.defaultHeaders },
      body: {
        model,
        messages: [{ role: "user", content: messageContent }],
      },
    }

    return this.request(requestConfig)
  }
}
