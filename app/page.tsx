"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Send } from "lucide-react"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

// Static demo data for UI demonstration
interface DemoPost {
  id: string
  user: {
    id: string
    username: string
    avatar_url: string
    is_verified: boolean
  }
  image_url: string
  caption: string
  location: string
  likes_count: number
  comments_count: number
  created_at: string
  is_liked_by_current_user: boolean
  is_saved_by_current_user: boolean
  recent_comments: Array<{
    id: string
    text: string
    created_at: string
    user: {
      id: string
      username: string
      avatar_url: string
    }
  }>
}

const demoPosts: DemoPost[] = [
  {
    id: "1",
    user: {
      id: "2",
      username: "traveler_jane",
      avatar_url: "/placeholder.svg?height=40&width=40",
      is_verified: true,
    },
    image_url: "/placeholder.svg?height=400&width=800",
    caption: "Amazing sunset at Mount Cameroon! 🌅 The panoramic view from the summit is absolutely breathtaking. #Cameroon #Tourism #Nature #360Photography",
    location: "Mount Cameroon, Cameroon",
    likes_count: 234,
    comments_count: 12,
    created_at: "2024-01-15T10:00:00Z",
    is_liked_by_current_user: false,
    is_saved_by_current_user: false,
    recent_comments: [
      {
        id: "1",
        text: "Absolutely stunning view! 😍",
        created_at: "2024-01-15T10:30:00Z",
        user: {
          id: "3",
          username: "adventure_mike",
          avatar_url: "/placeholder.svg?height=40&width=40",
        },
      },
      {
        id: "2",
        text: "The colors are incredible! What camera did you use?",
        created_at: "2024-01-15T11:00:00Z",
        user: {
          id: "4",
          username: "photo_lover",
          avatar_url: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
  },
  {
    id: "2",
    user: {
      id: "5",
      username: "cultural_explorer",
      avatar_url: "/placeholder.svg?height=40&width=40",
      is_verified: false,
    },
    image_url: "/placeholder.svg?height=400&width=800",
    caption: "Traditional Bamileke architecture in the Western Highlands. The intricate details and craftsmanship are remarkable! 🏛️ #Culture #Architecture #Cameroon",
    location: "Bafoussam, Cameroon",
    likes_count: 156,
    comments_count: 8,
    created_at: "2024-01-14T15:30:00Z",
    is_liked_by_current_user: true,
    is_saved_by_current_user: true,
    recent_comments: [
      {
        id: "3",
        text: "Beautiful cultural heritage! 🏛️",
        created_at: "2024-01-14T16:00:00Z",
        user: {
          id: "6",
          username: "heritage_fan",
          avatar_url: "/placeholder.svg?height=40&width=40",
        },
      },
    ],
  },
]

function HomePageContent() {
  const [posts, setPosts] = useState<DemoPost[]>(demoPosts)
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()

  const handleLike = (postId: string) => {
    // Demo functionality - toggle like state
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              is_liked_by_current_user: !post.is_liked_by_current_user,
              likes_count: post.is_liked_by_current_user ? post.likes_count - 1 : post.likes_count + 1,
            }
          : post,
      ),
    )
  }

  const handleSave = (postId: string) => {
    // Demo functionality - toggle save state
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, is_saved_by_current_user: !post.is_saved_by_current_user }
          : post
      ),
    )
  }

  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId]?.trim()
    if (!text) return

    // Demo functionality - add comment to local state
    const newComment = {
      id: Date.now().toString(),
      text,
      created_at: new Date().toISOString(),
      user: {
        id: "current_user",
        username: "current_user",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    }

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              recent_comments: [...post.recent_comments, newComment],
              comments_count: post.comments_count + 1,
            }
          : post,
      ),
    )
    setCommentTexts((prev) => ({ ...prev, [postId]: "" }))
  }

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleUsernameClick = (username: string) => {
    router.push(`/search?q=${encodeURIComponent(username)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-2xl mx-auto py-6 px-4 pb-20 md:pb-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 border border-primary-100 shadow-lg">
              <h2 className="text-xl font-semibold text-secondary-800 mb-2">Welcome to TourismCam!</h2>
              <p className="text-secondary-600 mb-4">No posts yet. Be the first to share a panoramic view!</p>
              <Button
                onClick={() => router.push("/upload")}
                className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg"
              >
                Upload Your First Post
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-white/90 backdrop-blur-sm border-primary-100 shadow-lg">
                <CardHeader className="flex flex-row items-center p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-10 h-10 border-2 border-primary-200">
                      <AvatarImage src={post.user.avatar_url || "/placeholder.svg"} alt={post.user.username} />
                      <AvatarFallback className="bg-primary-500 text-white">
                        {post.user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <button
                        onClick={() => handleUsernameClick(post.user.username)}
                        className="font-semibold text-secondary-800 hover:text-primary-600 transition-colors flex items-center gap-1"
                      >
                        {post.user.username}
                        {post.user.is_verified && <span className="text-accent-500">✓</span>}
                      </button>
                      <p className="text-sm text-secondary-600">{post.location}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-secondary-600 hover:text-secondary-800">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="relative aspect-[2/1]">
                    <Image src={post.image_url || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                      360° View
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`p-0 ${post.is_liked_by_current_user ? "text-red-500" : "text-secondary-600"} hover:text-red-500`}
                      >
                        <Heart className={`h-6 w-6 ${post.is_liked_by_current_user ? "fill-current" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-secondary-600 hover:text-primary-600"
                        onClick={() => toggleComments(post.id)}
                      >
                        <MessageCircle className="h-6 w-6" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-0 ${post.is_saved_by_current_user ? "text-accent-600" : "text-secondary-600"} hover:text-accent-600`}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark className={`h-6 w-6 ${post.is_saved_by_current_user ? "fill-current" : ""}`} />
                    </Button>
                  </div>

                  <div className="w-full text-left">
                    <p className="font-semibold text-secondary-800 text-sm">{post.likes_count} likes</p>
                    <p className="text-secondary-700 text-sm mt-1">
                      <button
                        onClick={() => handleUsernameClick(post.user.username)}
                        className="font-semibold hover:text-primary-600 transition-colors"
                      >
                        {post.user.username}
                      </button>{" "}
                      {post.caption}
                    </p>

                    {post.comments_count > 0 && (
                      <button
                        className="text-secondary-500 text-sm mt-1 hover:text-secondary-700"
                        onClick={() => toggleComments(post.id)}
                      >
                        {showComments[post.id] ? "Hide" : "View all"} {post.comments_count} comments
                      </button>
                    )}

                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-3 space-y-2">
                        {post.recent_comments.map((comment) => (
                          <div key={comment.id} className="flex gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage
                                src={comment.user.avatar_url || "/placeholder.svg"}
                                alt={comment.user.username}
                              />
                              <AvatarFallback className="bg-primary-200 text-primary-800 text-xs">
                                {comment.user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm text-secondary-700">
                                <button
                                  onClick={() => handleUsernameClick(comment.user.username)}
                                  className="font-semibold hover:text-primary-600 transition-colors"
                                >
                                  {comment.user.username}
                                </button>{" "}
                                {comment.text}
                              </p>
                              <p className="text-xs text-secondary-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className="flex gap-2 mt-3">
                      <Input
                        placeholder="Add a comment..."
                        value={commentTexts[post.id] || ""}
                        onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 bg-white border-primary-200 focus:border-primary-400 text-sm"
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentTexts[post.id]?.trim()}
                        className="bg-primary-500 hover:bg-primary-600 text-white shadow-md"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-secondary-500 text-xs mt-2">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  )
}
