"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Check, AlertCircle, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// 操作反馈组件
interface ActionFeedbackProps {
  action: string
  status: "success" | "error" | "loading"
  message?: string
  duration?: number
  onClose?: () => void
}

export function ActionFeedback({ action, status, message, duration = 3000, onClose }: ActionFeedbackProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [status, duration, onClose])

  const statusConfig = {
    success: {
      icon: <Check className="h-4 w-4" />,
      color: "bg-green-100 text-green-800 border-green-300",
      iconBg: "bg-green-500 text-white",
    },
    error: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 border-red-300",
      iconBg: "bg-red-500 text-white",
    },
    loading: {
      icon: (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ),
      color: "bg-blue-100 text-blue-800 border-blue-300",
      iconBg: "bg-blue-500 text-white",
    },
  }

  const config = statusConfig[status]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn("fixed top-4 right-4 z-50 flex items-center p-4 rounded-md border shadow-sm", config.color)}
        >
          <div className={cn("p-1 rounded-full mr-3", config.iconBg)}>{config.icon}</div>
          <div className="flex-1">
            <h4 className="font-medium">{action}</h4>
            {message && <p className="text-sm opacity-90">{message}</p>}
          </div>
          <button
            onClick={() => {
              setVisible(false)
              onClose?.()
            }}
            className="ml-4 p-1 rounded-full hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 引导提示组件
interface GuideTipProps {
  id: string
  title: string
  content: string
  position?: "top" | "right" | "bottom" | "left"
  children: React.ReactNode
  onDismiss?: () => void
  onComplete?: () => void
  showOnce?: boolean
}

export function GuideTip({
  id,
  title,
  content,
  position = "bottom",
  children,
  onDismiss,
  onComplete,
  showOnce = true,
}: GuideTipProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // 检查是否已经显示过
    if (showOnce) {
      const shown = localStorage.getItem(`guide_tip_${id}`)
      if (shown) return
    }

    // 延迟显示提示
    const timer = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id, showOnce])

  const handleDismiss = () => {
    setShow(false)
    if (showOnce) {
      localStorage.setItem(`guide_tip_${id}`, "true")
    }
    onDismiss?.()
  }

  const handleComplete = () => {
    setShow(false)
    if (showOnce) {
      localStorage.setItem(`guide_tip_${id}`, "true")
    }
    onComplete?.()
  }

  // 位置样式
  const positionStyles = {
    top: "bottom-full mb-2",
    right: "left-full ml-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
  }

  return (
    <div className="relative inline-block">
      {children}

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "absolute z-50 w-64 bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg border border-gray-200 dark:border-gray-700",
              positionStyles[position],
            )}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-medium flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                {title}
              </h4>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{content}</p>
            <div className="mt-3 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                跳过
              </Button>
              <Button size="sm" onClick={handleComplete}>
                了解
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 功能引导组件
interface FeatureTourProps {
  steps: {
    id: string
    title: string
    content: string
    elementId: string
    position?: "top" | "right" | "bottom" | "left"
  }[]
  onComplete?: () => void
  tourId: string
}

export function FeatureTour({ steps, onComplete, tourId }: FeatureTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // 检查是否已经完成过导览
    const completed = localStorage.getItem(`feature_tour_${tourId}`)
    if (completed) return

    // 延迟显示导览
    const timer = setTimeout(() => {
      setVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [tourId])

  useEffect(() => {
    if (!visible) return

    // 滚动到当前步骤元素
    const element = document.getElementById(steps[currentStep]?.elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [currentStep, steps, visible])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setVisible(false)
    localStorage.setItem(`feature_tour_${tourId}`, "true")
    onComplete?.()
  }

  if (!visible) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{currentStepData.title}</h3>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">{currentStepData.content}</p>

          <div className="flex justify-between">
            <div>
              <Button variant="outline" onClick={handleComplete}>
                跳过导览
              </Button>
            </div>
            <div className="space-x-2">
              {currentStep > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  上一步
                </Button>
              )}
              <Button onClick={handleNext}>{currentStep < steps.length - 1 ? "下一步" : "完成"}</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// 帮助提示组件
interface HelpTooltipProps {
  content: string
  children?: React.ReactNode
}

export function HelpTooltip({ content, children }: HelpTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {children || <HelpCircle className="h-4 w-4" />}
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300"
          >
            {content}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
