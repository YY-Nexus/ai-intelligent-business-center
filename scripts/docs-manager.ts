import * as fs from "fs"
import * as path from "path"
import * as glob from "glob"
import * as matter from "gray-matter"
import * as marked from "marked"
import * as yaml from "js-yaml"

// 文档配置
interface DocsConfig {
  sourcePath: string
  outputPath: string
  siteTitle: string
  siteDescription: string
  categories: {
    id: string
    title: string
    description: string
    order: number
  }[]
  sidebar: {
    category: string
    items: {
      id: string
      title: string
      path: string
      order: number
    }[]
  }[]
}

// 文档元数据
interface DocMeta {
  title: string
  description: string
  category: string
  tags: string[]
  order: number
  author: string
  createdAt: string
  updatedAt: string
}

// 文档项
interface DocItem {
  id: string
  path: string
  relativePath: string
  meta: DocMeta
  content: string
  html: string
}

/**
 * 文档管理器
 * 用于生成和管理文档站点
 */
class DocsManager {
  private config: DocsConfig
  private docs: DocItem[] = []

  constructor(configPath: string) {
    // 加载配置
    this.config = this.loadConfig(configPath)

    // 创建输出目录
    if (!fs.existsSync(this.config.outputPath)) {
      fs.mkdirSync(this.config.outputPath, { recursive: true })
    }
  }

  /**
   * 加载配置文件
   */
  private loadConfig(configPath: string): DocsConfig {
    try {
      const configContent = fs.readFileSync(configPath, "utf8")
      return yaml.load(configContent) as DocsConfig
    } catch (error) {
      console.error("加载配置文件失败:", error)
      process.exit(1)
    }
  }

  /**
   * 加载所有文档
   */
  public loadDocs(): void {
    const pattern = path.join(this.config.sourcePath, "**/*.md")
    const files = glob.sync(pattern)

    this.docs = files.map((file) => {
      const relativePath = path.relative(this.config.sourcePath, file)
      const id = this.getDocId(relativePath)
      const content = fs.readFileSync(file, "utf8")
      const { data, content: markdown } = matter(content)

      // 解析元数据
      const meta: DocMeta = {
        title: data.title || this.getTitleFromContent(markdown) || id,
        description: data.description || "",
        category: data.category || "uncategorized",
        tags: data.tags || [],
        order: data.order || 0,
        author: data.author || "Unknown",
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      }

      // 转换为HTML
      const html = marked.parse(markdown)

      return {
        id,
        path: file,
        relativePath,
        meta,
        content: markdown,
        html,
      }
    })

    console.log(`已加载 ${this.docs.length} 个文档`)
  }

  /**
   * 从文档内容中提取标题
   */
  private getTitleFromContent(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1] : null
  }

  /**
   * 从文件路径获取文档ID
   */
  private getDocId(relativePath: string): string {
    return relativePath.replace(/\.md$/, "").replace(/\\/g, "/")
  }

  /**
   * 生成文档站点
   */
  public generateSite(): void {
    // 生成首页
    this.generateHomePage()

    // 生成分类页面
    this.generateCategoryPages()

    // 生成文档页面
    this.generateDocPages()

    // 生成搜索索引
    this.generateSearchIndex()

    // 生成侧边栏配置
    this.generateSidebarConfig()

    // 复制静态资源
    this.copyStaticAssets()

    console.log(`文档站点已生成到 ${this.config.outputPath}`)
  }

  /**
   * 生成首页
   */
  private generateHomePage(): void {
    const categories = this.config.categories.map((category) => {
      const categoryDocs = this.docs.filter((doc) => doc.meta.category === category.id)
      return {
        ...category,
        count: categoryDocs.length,
      }
    })

    const data = {
      title: this.config.siteTitle,
      description: this.config.siteDescription,
      categories,
      recentDocs: this.getRecentDocs(5),
    }

    const outputPath = path.join(this.config.outputPath, "index.json")
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
  }

  /**
   * 获取最近更新的文档
   */
  private getRecentDocs(count: number): any[] {
    return this.docs
      .sort((a, b) => new Date(b.meta.updatedAt).getTime() - new Date(a.meta.updatedAt).getTime())
      .slice(0, count)
      .map((doc) => ({
        id: doc.id,
        title: doc.meta.title,
        description: doc.meta.description,
        category: doc.meta.category,
        updatedAt: doc.meta.updatedAt,
      }))
  }

  /**
   * 生成分类页面
   */
  private generateCategoryPages(): void {
    const categoriesDir = path.join(this.config.outputPath, "categories")
    if (!fs.existsSync(categoriesDir)) {
      fs.mkdirSync(categoriesDir, { recursive: true })
    }

    this.config.categories.forEach((category) => {
      const categoryDocs = this.docs
        .filter((doc) => doc.meta.category === category.id)
        .sort((a, b) => a.meta.order - b.meta.order)
        .map((doc) => ({
          id: doc.id,
          title: doc.meta.title,
          description: doc.meta.description,
          tags: doc.meta.tags,
          updatedAt: doc.meta.updatedAt,
        }))

      const data = {
        id: category.id,
        title: category.title,
        description: category.description,
        docs: categoryDocs,
      }

      const outputPath = path.join(categoriesDir, `${category.id}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    })
  }

  /**
   * 生成文档页面
   */
  private generateDocPages(): void {
    const docsDir = path.join(this.config.outputPath, "docs")
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true })
    }

    this.docs.forEach((doc) => {
      const dirPath = path.join(docsDir, path.dirname(doc.id))
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }

      const data = {
        id: doc.id,
        meta: doc.meta,
        content: doc.content,
        html: doc.html,
      }

      const outputPath = path.join(docsDir, `${doc.id}.json`)
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))
    })
  }

  /**
   * 生成搜索索引
   */
  private generateSearchIndex(): void {
    const searchIndex = this.docs.map((doc) => ({
      id: doc.id,
      title: doc.meta.title,
      description: doc.meta.description,
      category: doc.meta.category,
      tags: doc.meta.tags,
      content: doc.content.substring(0, 1000), // 限制索引内容大小
    }))

    const outputPath = path.join(this.config.outputPath, "search-index.json")
    fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2))
  }

  /**
   * 生成侧边栏配置
   */
  private generateSidebarConfig(): void {
    // 使用配置中的侧边栏定义
    const outputPath = path.join(this.config.outputPath, "sidebar.json")
    fs.writeFileSync(outputPath, JSON.stringify(this.config.sidebar, null, 2))
  }

  /**
   * 复制静态资源
   */
  private copyStaticAssets(): void {
    const staticDir = path.join(this.config.sourcePath, "static")
    const outputStaticDir = path.join(this.config.outputPath, "static")

    if (fs.existsSync(staticDir)) {
      if (!fs.existsSync(outputStaticDir)) {
        fs.mkdirSync(outputStaticDir, { recursive: true })
      }

      // 复制所有静态文件
      const files = glob.sync(path.join(staticDir, "**/*"))
      files.forEach((file) => {
        if (fs.statSync(file).isFile()) {
          const relativePath = path.relative(staticDir, file)
          const outputPath = path.join(outputStaticDir, relativePath)
          const outputDir = path.dirname(outputPath)

          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true })
          }

          fs.copyFileSync(file, outputPath)
        }
      })
    }
  }

  /**
   * 验证文档
   * 检查文档的元数据和链接
   */
  public validateDocs(): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // 检查每个文档
    this.docs.forEach((doc) => {
      // 检查必填元数据
      if (!doc.meta.title) {
        errors.push(`文档 ${doc.id} 缺少标题`)
      }

      if (!doc.meta.category) {
        errors.push(`文档 ${doc.id} 缺少分类`)
      } else if (!this.config.categories.some((c) => c.id === doc.meta.category)) {
        errors.push(`文档 ${doc.id} 使用了未定义的分类: ${doc.meta.category}`)
      }

      // 检查内部链接
      const linkRegex = /\[.*?\]$$(.*?)$$/g
      let match
      while ((match = linkRegex.exec(doc.content)) !== null) {
        const link = match[1]

        // 检查内部链接
        if (link.startsWith("./") || link.startsWith("../") || (!link.startsWith("http") && !link.startsWith("#"))) {
          const linkedPath = path.resolve(path.dirname(doc.path), link)
          const relativePath = path.relative(this.config.sourcePath, linkedPath)

          // 检查链接是否存在
          if (!fs.existsSync(linkedPath) && !this.docs.some((d) => d.relativePath === relativePath)) {
            errors.push(`文档 ${doc.id} 包含无效链接: ${link}`)
          }
        }
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * 更新文档元数据
   */
  public updateDocMeta(docId: string, meta: Partial<DocMeta>): boolean {
    const doc = this.docs.find((d) => d.id === docId)
    if (!doc) {
      console.error(`未找到文档: ${docId}`)
      return false
    }

    // 更新元数据
    const updatedMeta = { ...doc.meta, ...meta, updatedAt: new Date().toISOString() }

    // 读取原始内容
    const content = fs.readFileSync(doc.path, "utf8")
    const { data, content: markdown } = matter(content)

    // 创建新的前置元数据
    const newContent = matter.stringify(markdown, updatedMeta)

    // 写入文件
    fs.writeFileSync(doc.path, newContent)

    // 更新内存中的文档
    doc.meta = updatedMeta

    console.log(`已更新文档 ${docId} 的元数据`)
    return true
  }

  /**
   * 创建新文档
   */
  public createDoc(options: {
    id: string
    title: string
    category: string
    content?: string
    meta?: Partial<DocMeta>
  }): boolean {
    const { id, title, category, content = "", meta = {} } = options

    // 检查分类是否存在
    if (!this.config.categories.some((c) => c.id === category)) {
      console.error(`未定义的分类: ${category}`)
      return false
    }

    // 构建文档路径
    const docPath = path.join(this.config.sourcePath, `${id}.md`)

    // 检查文档是否已存在
    if (fs.existsSync(docPath)) {
      console.error(`文档已存在: ${id}`)
      return false
    }

    // 创建目录
    const dir = path.dirname(docPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // 构建元数据
    const docMeta: DocMeta = {
      title,
      description: meta.description || "",
      category,
      tags: meta.tags || [],
      order: meta.order || 0,
      author: meta.author || "Unknown",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 创建文档内容
    const docContent = matter.stringify(content || `# ${title}\n\n内容待添加`, docMeta)

    // 写入文件
    fs.writeFileSync(docPath, docContent)

    console.log(`已创建文档: ${id}`)

    // 重新加载文档
    this.loadDocs()

    return true
  }
}

// 如果直接运行脚本
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command) {
    console.error("请指定命令: generate, validate, update, create")
    process.exit(1)
  }

  const configPath = args[1] || "docs-config.yml"
  const manager = new DocsManager(configPath)

  switch (command) {
    case "generate":
      manager.loadDocs()
      manager.generateSite()
      break

    case "validate":
      manager.loadDocs()
      const validation = manager.validateDocs()
      if (validation.valid) {
        console.log("所有文档验证通过")
      } else {
        console.error("文档验证失败:")
        validation.errors.forEach((error) => console.error(`- ${error}`))
        process.exit(1)
      }
      break

    case "update":
      const docId = args[2]
      if (!docId) {
        console.error("请指定文档ID")
        process.exit(1)
      }

      const metaPath = args[3]
      if (!metaPath) {
        console.error("请指定元数据文件路径")
        process.exit(1)
      }

      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
      manager.loadDocs()
      const success = manager.updateDocMeta(docId, meta)
      if (!success) {
        process.exit(1)
      }
      break

    case "create":
      const newDocId = args[2]
      if (!newDocId) {
        console.error("请指定文档ID")
        process.exit(1)
      }

      const optionsPath = args[3]
      if (!optionsPath) {
        console.error("请指定选项文件路径")
        process.exit(1)
      }

      const options = JSON.parse(fs.readFileSync(optionsPath, "utf8"))
      manager.loadDocs()
      const createSuccess = manager.createDoc({
        id: newDocId,
        ...options,
      })
      if (!createSuccess) {
        process.exit(1)
      }
      break

    default:
      console.error(`未知命令: ${command}`)
      process.exit(1)
  }
}

export default DocsManager
