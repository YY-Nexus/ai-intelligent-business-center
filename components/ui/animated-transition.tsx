"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

interface AnimatedTransitionProps {
  children: ReactNode
  isVisible: boolean
  duration?: number
}

export function AnimatedTransition({ children, isVisible, duration = 0.3 }: AnimatedTransitionProps) {
  const [shouldRender, setShouldRender] = useState(isVisible)

  useEffect(() => {
    if (isVisible) setShouldRender(true)
  }, [isVisible])

  const onAnimationComplete = () => {
    if (!isVisible) setShouldRender(false)
  }

  return (
    <AnimatePresence>
      {shouldRender && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration }}
          onAnimationComplete={onAnimationComplete}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
