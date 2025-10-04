import * as jwt from "jsonwebtoken"

/**
 * 生成智谱AI JWT令牌
 * @param apiKey API密钥，格式为 {id}.{secret}
 * @param expSeconds 过期时间（秒）
 * @returns JWT令牌
 */
export function generateZhipuToken(apiKey: string, expSeconds = 3600): string {
  try {
    // 分割API密钥获取id和secret
    const [id, secret] = apiKey.split(".")

    if (!id || !secret) {
      throw new Error("无效的API密钥格式")
    }

    const now = Date.now()

    // 创建payload
    const payload = {
      api_key: id,
      exp: now + expSeconds * 1000,
      timestamp: now,
    }

    // 创建JWT
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      header: {
        alg: "HS256",
        sign_type: "SIGN",
      },
    })
  } catch (error) {
    console.error("生成智谱AI令牌出错:", error)
    throw error
  }
}

/**
 * 使用环境变量中的API密钥生成JWT令牌
 * @param expSeconds 过期时间（秒）
 * @returns JWT令牌
 */
export function generateZhipuTokenFromEnv(expSeconds = 3600): string {
  const apiKey = process.env.ZHIPU_API_KEY

  if (!apiKey) {
    throw new Error("ZHIPU_API_KEY环境变量未设置")
  }

  return generateZhipuToken(apiKey, expSeconds)
}
