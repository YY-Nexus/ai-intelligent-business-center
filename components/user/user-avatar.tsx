import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserAvatarProps {
  user?: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      {user?.image ? (
        <AvatarImage alt="用户头像" src={user.image || "/placeholder.svg"} />
      ) : (
        <AvatarImage alt="用户头像" src={`/placeholder.svg?height=32&width=32&query=用户`} />
      )}
      <AvatarFallback>{user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}</AvatarFallback>
    </Avatar>
  )
}
