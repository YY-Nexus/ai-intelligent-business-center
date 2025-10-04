"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface TechBackgroundProps {
  variant?: "vortex" | "grid" | "particles" | "waves" | "circuit"
  intensity?: "light" | "medium" | "strong"
  className?: string
}

export function TechBackground({ variant = "vortex", intensity = "medium", className = "" }: TechBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布大小为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // 根据主题和强度设置颜色
    const getColors = () => {
      const intensityValues = {
        light: isDark ? 0.3 : 0.15,
        medium: isDark ? 0.5 : 0.25,
        strong: isDark ? 0.7 : 0.4,
      }

      const primaryColor = isDark ? "36, 170, 245" : "12, 142, 224"
      const secondaryColor = isDark ? "7, 89, 153" : "54, 170, 245"
      const accentColor = isDark ? "12, 142, 224" : "7, 42, 74"

      return {
        primaryColor,
        secondaryColor,
        accentColor,
        opacity: intensityValues[intensity],
      }
    }

    let animationFrameId: number
    let particles: any[] = []
    let lines: any[] = []
    let vortexPoints: any[] = []
    let circuitNodes: any[] = []
    let circuitConnections: any[] = []

    // 科技蓝旋涡
    const initVortex = () => {
      const { primaryColor, secondaryColor } = getColors()
      vortexPoints = []

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const spiralCount = 3
      const pointsPerSpiral = 100

      for (let s = 0; s < spiralCount; s++) {
        const spiralOffset = (s / spiralCount) * Math.PI * 2

        for (let i = 0; i < pointsPerSpiral; i++) {
          const progress = i / pointsPerSpiral
          const size = progress * 2 + 0.5
          const distance = progress * Math.min(canvas.width, canvas.height) * 0.4
          const angle = progress * Math.PI * 10 + spiralOffset

          vortexPoints.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            size,
            color: i % 2 === 0 ? primaryColor : secondaryColor,
            speed: 0.002 + progress * 0.003,
            offset: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    // 科技网格
    const initGrid = () => {
      const { primaryColor, secondaryColor } = getColors()
      lines = []

      // 水平线
      const horizontalCount = Math.ceil(canvas.height / 80)
      for (let i = 0; i < horizontalCount; i++) {
        lines.push({
          x1: 0,
          y1: i * 80,
          x2: canvas.width,
          y2: i * 80,
          color: i % 3 === 0 ? primaryColor : secondaryColor,
          pulseSpeed: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }

      // 垂直线
      const verticalCount = Math.ceil(canvas.width / 80)
      for (let i = 0; i < verticalCount; i++) {
        lines.push({
          x1: i * 80,
          y1: 0,
          x2: i * 80,
          y2: canvas.height,
          color: i % 3 === 0 ? primaryColor : secondaryColor,
          pulseSpeed: 0.5 + Math.random() * 0.5,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    // 粒子效果
    const initParticles = () => {
      const { primaryColor, secondaryColor, accentColor } = getColors()
      particles = []

      const particleCount = Math.floor((canvas.width * canvas.height) / 10000)

      for (let i = 0; i < particleCount; i++) {
        const colors = [primaryColor, secondaryColor, accentColor]
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          connections: [],
        })
      }
    }

    // 波浪效果
    const initWaves = () => {
      // 波浪效果不需要初始化数据
    }

    // 电路效果
    const initCircuit = () => {
      const { primaryColor, secondaryColor } = getColors()
      circuitNodes = []
      circuitConnections = []

      const gridSize = 80
      const cols = Math.ceil(canvas.width / gridSize)
      const rows = Math.ceil(canvas.height / gridSize)

      // 创建节点
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (Math.random() > 0.7) {
            const x = j * gridSize + (Math.random() * 20 - 10)
            const y = i * gridSize + (Math.random() * 20 - 10)

            circuitNodes.push({
              x,
              y,
              size: Math.random() * 3 + 2,
              color: Math.random() > 0.5 ? primaryColor : secondaryColor,
              pulseSpeed: 0.5 + Math.random() * 1.5,
              pulseOffset: Math.random() * Math.PI * 2,
            })
          }
        }
      }

      // 创建连接
      for (let i = 0; i < circuitNodes.length; i++) {
        const node = circuitNodes[i]

        // 找到最近的2-4个节点
        const nearestNodes = [...circuitNodes]
          .filter((n) => n !== node)
          .map((n) => ({
            node: n,
            distance: Math.sqrt(Math.pow(n.x - node.x, 2) + Math.pow(n.y - node.y, 2)),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, Math.floor(Math.random() * 3) + 2)

        for (const nearest of nearestNodes) {
          if (nearest.distance < gridSize * 2) {
            circuitConnections.push({
              x1: node.x,
              y1: node.y,
              x2: nearest.node.x,
              y2: nearest.node.y,
              color: node.color,
              pulseSpeed: 0.5 + Math.random() * 0.5,
              pulseOffset: Math.random() * Math.PI * 2,
              progress: 0,
              active: false,
              activationDelay: Math.random() * 10,
            })
          }
        }
      }
    }

    // 绘制科技蓝旋涡
    const drawVortex = (time: number) => {
      const { opacity } = getColors()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const point of vortexPoints) {
        const pulse = Math.sin(time * point.speed + point.offset) * 0.5 + 0.5
        const size = point.size * (0.5 + pulse * 0.5)

        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${point.color}, ${opacity * pulse})`
        ctx.fill()
      }

      // 绘制连接线
      ctx.lineWidth = 0.5
      for (let i = 0; i < vortexPoints.length - 1; i++) {
        const p1 = vortexPoints[i]
        const p2 = vortexPoints[i + 1]
        const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))

        if (distance < 50) {
          const pulse = Math.sin(time * ((p1.speed + p2.speed) / 2) + p1.offset) * 0.5 + 0.5

          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.strokeStyle = `rgba(${p1.color}, ${opacity * pulse * 0.5})`
          ctx.stroke()
        }
      }
    }

    // 绘制科技网格
    const drawGrid = (time: number) => {
      const { opacity } = getColors()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const line of lines) {
        const pulse = Math.sin(time * line.pulseSpeed + line.pulseOffset) * 0.5 + 0.5

        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = `rgba(${line.color}, ${opacity * pulse})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    // 绘制粒子效果
    const drawParticles = (time: number) => {
      const { opacity } = getColors()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新粒子位置
      for (const particle of particles) {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // 边界检查
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${opacity})`
        ctx.fill()

        // 重置连接
        particle.connections = []
      }

      // 绘制连接线
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))

          if (distance < 100) {
            p1.connections.push(p2)
            p2.connections.push(p1)

            const lineOpacity = (1 - distance / 100) * opacity * 0.5

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${p1.color}, ${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    // 绘制波浪效果
    const drawWaves = (time: number) => {
      const { primaryColor, secondaryColor, opacity } = getColors()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const waveCount = 3
      const waveHeight = canvas.height * 0.05

      for (let w = 0; w < waveCount; w++) {
        const baseY = canvas.height * (0.3 + w * 0.2)
        const frequency = 0.005 + w * 0.002
        const speed = time * (0.5 + w * 0.2)
        const waveOpacity = opacity * (0.3 + w * 0.2)
        const color = w % 2 === 0 ? primaryColor : secondaryColor

        // 绘制填充波浪
        ctx.beginPath()
        ctx.moveTo(0, canvas.height)

        for (let x = 0; x < canvas.width; x += 5) {
          const y = baseY + Math.sin(x * frequency + speed) * waveHeight
          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.closePath()
        ctx.fillStyle = `rgba(${color}, ${waveOpacity * 0.1})`
        ctx.fill()

        // 绘制波浪线
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x += 5) {
          const y = baseY + Math.sin(x * frequency + speed) * waveHeight
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.strokeStyle = `rgba(${color}, ${waveOpacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // 绘制电路效果
    const drawCircuit = (time: number) => {
      const { opacity } = getColors()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制连接
      for (const connection of circuitConnections) {
        const pulse = Math.sin(time * connection.pulseSpeed + connection.pulseOffset) * 0.5 + 0.5

        if (!connection.active) {
          connection.activationDelay -= 0.016
          if (connection.activationDelay <= 0) {
            connection.active = true
          }
        }

        if (connection.active) {
          connection.progress += 0.005
          if (connection.progress > 1) {
            connection.progress = 0
          }

          // 绘制基础线
          ctx.beginPath()
          ctx.moveTo(connection.x1, connection.y1)
          ctx.lineTo(connection.x2, connection.y2)
          ctx.strokeStyle = `rgba(${connection.color}, ${opacity * 0.3})`
          ctx.lineWidth = 1
          ctx.stroke()

          // 绘制流动效果
          const progressX = connection.x1 + (connection.x2 - connection.x1) * connection.progress
          const progressY = connection.y1 + (connection.y2 - connection.y1) * connection.progress

          ctx.beginPath()
          ctx.arc(progressX, progressY, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${connection.color}, ${opacity})`
          ctx.fill()
        }
      }

      // 绘制节点
      for (const node of circuitNodes) {
        const pulse = Math.sin(time * node.pulseSpeed + node.pulseOffset) * 0.5 + 0.5

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.size * (0.8 + pulse * 0.4), 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${node.color}, ${opacity * pulse})`
        ctx.fill()
      }
    }

    // 初始化
    const init = () => {
      switch (variant) {
        case "vortex":
          initVortex()
          break
        case "grid":
          initGrid()
          break
        case "particles":
          initParticles()
          break
        case "waves":
          initWaves()
          break
        case "circuit":
          initCircuit()
          break
      }
    }

    // 动画循环
    const animate = () => {
      const time = Date.now() * 0.001

      switch (variant) {
        case "vortex":
          drawVortex(time)
          break
        case "grid":
          drawGrid(time)
          break
        case "particles":
          drawParticles(time)
          break
        case "waves":
          drawWaves(time)
          break
        case "circuit":
          drawCircuit(time)
          break
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [variant, intensity, theme, isDark])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full -z-10 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
