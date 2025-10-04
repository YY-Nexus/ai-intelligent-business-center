import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "言语云³ - AI驱动的智能API管理平台",
  description: "基于人工智能的统一API管理系统，提供智能配置、实时监控、安全防护等全方位服务",
  keywords: "API管理,人工智能,智能配置,实时监控,言语云",
  authors: [{ name: "言语云团队" }],
  creator: "言语云",
  publisher: "言语云",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://yanyu-cloud.com"),
  openGraph: {
    title: "言语云³ - AI驱动的智能API管理平台",
    description: "基于人工智能的统一API管理系统，提供智能配置、实时监控、安全防护等全方位服务",
    url: "https://yanyu-cloud.com",
    siteName: "言语云",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "言语云³ - AI驱动的智能API管理平台",
    description: "基于人工智能的统一API管理系统",
    creator: "@yanyu_cloud",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/yanyu-cloud-logo.png" />
        <link rel="apple-touch-icon" href="/images/yanyu-cloud-logo.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={cn(inter.className, "antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <Header />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">{children}</div>
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
