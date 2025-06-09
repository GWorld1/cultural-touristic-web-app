"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Send } from "lucide-react"
import Navigation from "@/components/navigation"
import { apiClient } from "@/lib/api-client"
import type { PostWithDetails } from "@/lib/database/schema"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

function HomePageContent() {
  const [posts, setPosts] = useState<PostWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({})
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    const response = await apiClient.getPosts()
    if (response.data) {
      setPosts(response.data.posts)
    }
    setLoading(false)
  }

  const handleLike = async (postId: string) => {
    const response = await apiClient.toggleLike(postId)
    if (response.data) {
      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked_by_current_user: response.data.isLiked,
                likes_count: response.data.isLiked ? post.likes_count + 1 : post.likes_count - 1,
              }
            : post,
        ),
      )
    }
  }

  const handleSave = async (postId: string) => {
    const response = await apiClient.toggleSave(postId)
    if (response.data) {
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, is_saved_by_current_user: response.data.isSaved } : post)),
      )
    }
  }

  const handleAddComment = async (postId: string) => {
    const text = commentTexts[postId]?.trim()
    if (!text) return

    const response = await apiClient.addComment(postId, text)
    if (response.data) {
      // Reload posts to get updated comments
      loadPosts()
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }))
    }
  }

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleUsernameClick = (username: string) => {
    router.push(`/search?q=${encodeURIComponent(username)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <Navigation />
        <main className="max-w-2xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-secondary-600 mt-2">Loading posts...</p>
          </div>
        </main>
      </div>
    )
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
                        onKeyPress={(e) => e.key === "Enter" && handleAddComment(post.id)}
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
