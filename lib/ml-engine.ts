// 机器学习引擎

import type { Problem } from "@/app/components/system-audit/auto-fix-engine"
import type { RepairHistory } from "@/app/components/system-audit/repair-history"

// 特征提取器 - 从问题中提取特征
function extractFeatures(problem: Problem): number[] {
  // 问题类型编码
  const typeEncoding = {
    framework: [1, 0, 0, 0],
    fileCompliance: [0, 1, 0, 0],
    interaction: [0, 0, 1, 0],
    missingFeature: [0, 0, 0, 1],
  }

  // 严重程度编码
  const severityEncoding = {
    critical: [1, 0, 0, 0],
    high: [0, 1, 0, 0],
    medium: [0, 0, 1, 0],
    low: [0, 0, 0, 1],
  }

  // 提取问题类型特征
  const typeFeatures = typeEncoding[problem.type] || [0, 0, 0, 0]

  // 提取严重程度特征
  const severityFeatures = problem.severity ? severityEncoding[problem.severity] : [0, 0, 0, 0]

  // 提取描述长度特征（归一化）
  const descriptionLength = problem.description ? Math.min(problem.description.length / 200, 1) : 0

  // 组合所有特征
  return [...typeFeatures, ...severityFeatures, descriptionLength]
}

// 简单线性模型 - 用于预测修复成功率
class SuccessRatePredictor {
  private weights: number[] = []
  private bias = 0

  constructor() {
    // 初始化模型权重（在实际应用中，这些应该通过训练获得）
    this.weights = [
      0.7,
      0.8,
      0.6,
      0.5, // 问题类型权重
      -0.3,
      -0.2,
      0.1,
      0.2, // 严重程度权重
      -0.1, // 描述长度权重
    ]
    this.bias = 0.75 // 偏置项
  }

  // 预测成功率
  predict(features: number[]): number {
    if (features.length !== this.weights.length) {
      throw new Error(`特征维度不匹配: 期望 ${this.weights.length}, 实际 ${features.length}`)
    }

    // 计算加权和
    let sum = this.bias
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * this.weights[i]
    }

    // 应用sigmoid函数将输出映射到0-1范围
    const sigmoid = 1 / (1 + Math.exp(-sum))

    // 转换为百分比
    return sigmoid * 100
  }

  // 训练模型（简化版）
  train(problems: Problem[], labels: boolean[]): void {
    // 在实际应用中，这里应该实现真正的训练算法
    console.log(`训练模型，使用 ${problems.length} 个样本`)

    // 模拟训练过程
    this.weights = this.weights.map((w) => w + (Math.random() * 0.1 - 0.05))
    this.bias += Math.random() * 0.1 - 0.05
  }
}

// 修复时间预测器
class RepairTimePredictor {
  private weights: number[] = []
  private bias = 0

  constructor() {
    // 初始化模型权重
    this.weights = [
      180,
      120,
      150,
      300, // 问题类型权重
      120,
      60,
      0,
      -30, // 严重程度权重
      50, // 描述长度权重
    ]
    this.bias = 60 // 偏置项
  }

  // 预测修复时间（秒）
  predict(features: number[]): number {
    if (features.length !== this.weights.length) {
      throw new Error(`特征维度不匹配: 期望 ${this.weights.length}, 实际 ${features.length}`)
    }

    // 计算加权和
    let sum = this.bias
    for (let i = 0; i < features.length; i++) {
      sum += features[i] * this.weights[i]
    }

    // 确保预测时间为正
    return Math.max(30, sum)
  }

  // 训练模型（简化版）
  train(problems: Problem[], repairTimes: number[]): void {
    // 在实际应用中，这里应该实现真正的训练算法
    console.log(`训练模型，使用 ${problems.length} 个样本`)

    // 模拟训练过程
    this.weights = this.weights.map((w) => w + (Math.random() * 10 - 5))
    this.bias += Math.random() * 10 - 5
  }
}

// 模型管理器
class MLModelManager {
  private successPredictor: SuccessRatePredictor
  private timePredictor: RepairTimePredictor

  constructor() {
    this.successPredictor = new SuccessRatePredictor()
    this.timePredictor = new RepairTimePredictor()
  }

  // 预测修复成功率
  predictSuccessRate(problem: Problem): number {
    const features = extractFeatures(problem)
    return this.successPredictor.predict(features)
  }

  // 预测修复时间
  predictRepairTime(problem: Problem): number {
    const features = extractFeatures(problem)
    return this.timePredictor.predict(features)
  }

  // 从历史数据训练模型
  trainModels(histories: RepairHistory[]): void {
    // 提取训练数据
    const problems: Problem[] = []
    const successLabels: boolean[] = []
    const repairTimes: number[] = []

    // 处理每个历史记录
    histories.forEach((history) => {
      // 计算每个问题的平均修复时间
      const avgTimePerProblem = history.duration / history.problems.length

      // 添加每个问题到训练数据
      history.problems.forEach((problem) => {
        problems.push(problem)
        successLabels.push(problem.status === "fixed")
        repairTimes.push(avgTimePerProblem)
      })
    })

    // 训练模型
    if (problems.length > 0) {
      this.successPredictor.train(problems, successLabels)
      this.timePredictor.train(problems, repairTimes)
      console.log(`模型训练完成，使用 ${problems.length} 个样本`)
    } else {
      console.log("没有足够的数据进行训练")
    }
  }
}

// 导出模型管理器单例
export const mlModelManager = new MLModelManager()

// 预测修复成功率
export function predictSuccessRate(problem: Problem): number {
  return mlModelManager.predictSuccessRate(problem)
}

// 预测修复时间
export function predictRepairTime(problem: Problem): number {
  return mlModelManager.predictRepairTime(problem)
}

// 训练模型
export function trainModels(histories: RepairHistory[]): void {
  mlModelManager.trainModels(histories)
}
