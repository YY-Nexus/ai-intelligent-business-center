"use client"

import { useState, useEffect } from "react"
import { ApiClient } from "@/lib/api-binding"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// 定义用户类型
interface User {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

// 定义帖子类型
interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// 创建API客户端
const apiClient = new ApiClient({
  config: {
    name: "JSONPlaceholder API",
    baseUrl: "https://jsonplaceholder.typicode.com",
    timeout: 10000,
  },
  auth: {
    type: "none",
    enabled: false,
  },
})

export default function ApiBindingDemo() {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<{ users: boolean; posts: boolean }>({ users: false, posts: false })
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("users")

  // 获取用户数据
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }))
    setError(null)
    try {
      const response = await apiClient.get<User[]>("/users")
      setUsers(response.data)
    } catch (err) {
      setError(`获取用户失败: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading((prev) => ({ ...prev, users: false }))
    }
  }

  // 获取帖子数据
  const fetchPosts = async () => {
    setLoading((prev) => ({ ...prev, posts: true }))
    setError(null)
    try {
      const response = await apiClient.get<Post[]>("/posts", {
        queryParams: {
          _limit: 10,
        },
      })
      setPosts(response.data)
    } catch (err) {
      setError(`获取帖子失败: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }))
    }
  }

  // 创建新帖子
  const createPost = async () => {
    setLoading((prev) => ({ ...prev, posts: true }))
    setError(null)
    try {
      const newPost = {
        title: `新帖子 - ${new Date().toLocaleString()}`,
        body: "这是一个通过API绑定系统创建的新帖子。",
        userId: 1,
      }

      const response = await apiClient.post<Post>("/posts", newPost)
      setPosts((prev) => [response.data, ...prev])
    } catch (err) {
      setError(`创建帖子失败: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }))
    }
  }

  // 初始加载
  useEffect(() => {
    fetchUsers()
    fetchPosts()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API绑定系统演示</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="users">用户</TabsTrigger>
          <TabsTrigger value="posts">帖子</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>从JSONPlaceholder API获取的用户数据</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading.users ? (
                  <p>加载中...</p>
                ) : (
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <div key={user.id} className="border p-4 rounded">
                        <h3 className="font-bold">{user.name}</h3>
                        <p>邮箱: {user.email}</p>
                        <p>电话: {user.phone}</p>
                        <p>网站: {user.website}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={fetchUsers} disabled={loading.users}>
                {loading.users ? "加载中..." : "刷新用户"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <Card>
            <CardHeader>
              <CardTitle>帖子列表</CardTitle>
              <CardDescription>从JSONPlaceholder API获取的帖子数据</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {loading.posts ? (
                  <p>加载中...</p>
                ) : (
                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border p-4 rounded">
                        <h3 className="font-bold">{post.title}</h3>
                        <p className="text-sm text-gray-500">用户ID: {post.userId}</p>
                        <p className="mt-2">{post.body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={fetchPosts} disabled={loading.posts}>
                {loading.posts ? "加载中..." : "刷新帖子"}
              </Button>
              <Button onClick={createPost} disabled={loading.posts} variant="outline">
                创建新帖子
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
