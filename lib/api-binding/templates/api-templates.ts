import type { NewApiConfig } from "@/components/api-config/api-config-manager"

// API模板类型
export interface ApiTemplate {
  id: string
  name: string
  description: string
  category: "ai" | "cloud" | "payment" | "social" | "messaging" | "other"
  config: NewApiConfig
  documentationUrl?: string
  logoUrl?: string
}

// API模板数据
export const apiTemplates: ApiTemplate[] = [
  // AI服务API
  {
    id: "openai",
    name: "OpenAI API",
    description: "OpenAI的API提供对GPT-4、GPT-3.5等大型语言模型的访问",
    category: "ai",
    documentationUrl: "https://platform.openai.com/docs/api-reference",
    logoUrl: "/api-logos/openai.svg",
    config: {
      name: "OpenAI API",
      config: {
        name: "OpenAI API",
        baseUrl: "https://api.openai.com/v1",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "",
      },
    },
  },
  {
    id: "zhipuai",
    name: "智谱AI API",
    description: "智谱AI提供GLM大模型API服务",
    category: "ai",
    documentationUrl: "https://open.bigmodel.cn/dev/api",
    logoUrl: "/api-logos/zhipuai.svg",
    config: {
      name: "智谱AI API",
      config: {
        name: "智谱AI API",
        baseUrl: "https://open.bigmodel.cn/api/paas/v4",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "bearer",
        enabled: true,
        token: "",
      },
    },
  },
  {
    id: "baidu-qianfan",
    name: "百度千帆API",
    description: "百度智能云千帆大模型平台API",
    category: "ai",
    documentationUrl: "https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html",
    logoUrl: "/api-logos/baidu.svg",
    config: {
      name: "百度千帆API",
      config: {
        name: "百度千帆API",
        baseUrl: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "X-Qianfan-API-Key",
      },
    },
  },
  {
    id: "aliyun-dashscope",
    name: "阿里云通义千问API",
    description: "阿里云通义千问大语言模型API",
    category: "ai",
    documentationUrl: "https://help.aliyun.com/document_detail/2400395.html",
    logoUrl: "/api-logos/aliyun.svg",
    config: {
      name: "阿里云通义千问API",
      config: {
        name: "阿里云通义千问API",
        baseUrl: "https://dashscope.aliyuncs.com/api/v1",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
        queryParamName: "",
      },
    },
  },

  // 云服务API
  {
    id: "aliyun-oss",
    name: "阿里云OSS",
    description: "阿里云对象存储服务API",
    category: "cloud",
    documentationUrl: "https://help.aliyun.com/document_detail/31947.html",
    logoUrl: "/api-logos/aliyun.svg",
    config: {
      name: "阿里云OSS",
      config: {
        name: "阿里云OSS",
        baseUrl: "https://oss-cn-hangzhou.aliyuncs.com",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
      },
    },
  },
  {
    id: "tencent-cos",
    name: "腾讯云COS",
    description: "腾讯云对象存储服务API",
    category: "cloud",
    documentationUrl: "https://cloud.tencent.com/document/product/436/7751",
    logoUrl: "/api-logos/tencent.svg",
    config: {
      name: "腾讯云COS",
      config: {
        name: "腾讯云COS",
        baseUrl: "https://cos.ap-beijing.myqcloud.com",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
      },
    },
  },

  // 支付服务API
  {
    id: "alipay",
    name: "支付宝开放平台",
    description: "支付宝支付、登录等API服务",
    category: "payment",
    documentationUrl: "https://opendocs.alipay.com/apis",
    logoUrl: "/api-logos/alipay.svg",
    config: {
      name: "支付宝开放平台",
      config: {
        name: "支付宝开放平台",
        baseUrl: "https://openapi.alipay.com/gateway.do",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "",
        queryParamName: "app_id",
      },
    },
  },
  {
    id: "wechat-pay",
    name: "微信支付",
    description: "微信支付API服务",
    category: "payment",
    documentationUrl: "https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml",
    logoUrl: "/api-logos/wechat.svg",
    config: {
      name: "微信支付",
      config: {
        name: "微信支付",
        baseUrl: "https://api.mch.weixin.qq.com/v3",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
      },
    },
  },

  // 社交媒体API
  {
    id: "weibo",
    name: "微博开放平台",
    description: "新浪微博开放平台API",
    category: "social",
    documentationUrl: "https://open.weibo.com/wiki/%E5%BE%AE%E5%8D%9AAPI",
    logoUrl: "/api-logos/weibo.png",
    config: {
      name: "微博开放平台",
      config: {
        name: "微博开放平台",
        baseUrl: "https://api.weibo.com/2",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "oauth2",
        enabled: true,
        clientId: "",
        clientSecret: "",
        authorizationUrl: "https://api.weibo.com/oauth2/authorize",
        tokenUrl: "https://api.weibo.com/oauth2/access_token",
        redirectUrl: "",
        token: "",
      },
    },
  },
  {
    id: "wechat-official",
    name: "微信公众平台",
    description: "微信公众号API服务",
    category: "social",
    documentationUrl: "https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html",
    logoUrl: "/api-logos/wechat.svg",
    config: {
      name: "微信公众平台",
      config: {
        name: "微信公众平台",
        baseUrl: "https://api.weixin.qq.com/cgi-bin",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "",
        queryParamName: "access_token",
      },
    },
  },

  // 消息服务API
  {
    id: "aliyun-sms",
    name: "阿里云短信服务",
    description: "阿里云SMS短信发送API",
    category: "messaging",
    documentationUrl: "https://help.aliyun.com/document_detail/419298.html",
    logoUrl: "/api-logos/aliyun.svg",
    config: {
      name: "阿里云短信服务",
      config: {
        name: "阿里云短信服务",
        baseUrl: "https://dysmsapi.aliyuncs.com",
        version: "2017-05-25",
        headers: {
          "Content-Type": "application/json",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
      },
    },
  },
  {
    id: "tencent-sms",
    name: "腾讯云短信服务",
    description: "腾讯云SMS短信发送API",
    category: "messaging",
    documentationUrl: "https://cloud.tencent.com/document/product/382/55981",
    logoUrl: "/api-logos/tencent.svg",
    config: {
      name: "腾讯云短信服务",
      config: {
        name: "腾讯云短信服务",
        baseUrl: "https://sms.tencentcloudapi.com",
        headers: {
          "Content-Type": "application/json",
          "X-TC-Version": "2021-01-11",
        },
      },
      auth: {
        type: "api-key",
        enabled: true,
        apiKey: "",
        headerName: "Authorization",
      },
    },
  },
]

// 按类别获取模板
export function getTemplatesByCategory(category: ApiTemplate["category"]) {
  return apiTemplates.filter((template) => template.category === category)
}

// 通过ID获取模板
export function getTemplateById(id: string) {
  return apiTemplates.find((template) => template.id === id)
}

// 获取所有类别
export function getAllCategories() {
  return [
    { id: "ai", name: "AI服务" },
    { id: "cloud", name: "云服务" },
    { id: "payment", name: "支付服务" },
    { id: "social", name: "社交媒体" },
    { id: "messaging", name: "消息服务" },
    { id: "other", name: "其他服务" },
  ]
}
