"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Send, ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"
import { getPost, addComment, toggleSavePost, isSaved } from "@/lib/database/queries"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = Number.parseInt(params.id as string)

  const [post, setPost] = useState(getPost(postId))
  const [isLiked, setIsLiked] = useState(false)
  const [isSavedPost, setIsSavedPost] = useState(false)
  const [commentText, setCommentText] = useState("")

  useEffect(() => {
    if (post) {
      setIsSavedPost(isSaved(post.id))
    }
  }, [post])

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleSave = () => {
    if (post) {
      const saved = toggleSavePost(post.id)
      setIsSavedPost(saved)
    }
  }

  const handleAddComment = () => {
    if (!commentText.trim() || !post) return

    const newComment = addComment(post.id, commentText)
    if (newComment) {
      setPost(getPost(postId)) // Refresh post to show new comment
      setCommentText("") // Clear input
    }
  }

  const handleUsernameClick = (username: string) => {
    router.push(`/search?q=${encodeURIComponent(username)}`)
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <Navigation />
        <main className="max-w-2xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <p className="text-secondary-600">Post not found</p>
            <Button onClick={() => router.back()} className="mt-4 bg-primary-500 hover:bg-primary-600 text-white">
              Go Back
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-2xl mx-auto py-6 px-4 pb-20 md:pb-6">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-4 text-secondary-600 hover:text-secondary-800 hover:bg-primary-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Post Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-primary-100 shadow-lg">
          <CardHeader className="flex flex-row items-center p-4">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-10 h-10 border-2 border-primary-200">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
                <AvatarFallback className="bg-primary-500 text-white">
                  {post.user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <button
                  onClick={() => handleUsernameClick(post.user.username)}
                  className="font-semibold text-secondary-800 hover:text-primary-600 transition-colors"
                >
                  {post.user.username}
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
              <Image src={post.image || "/placeholder.svg"} alt="Post image" fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
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
                  onClick={handleLike}
                  className={`p-0 ${isLiked ? "text-red-500" : "text-secondary-600"} hover:text-red-500`}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="sm" className="p-0 text-secondary-600 hover:text-primary-600">
                  <MessageCircle className="h-6 w-6" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`p-0 ${isSavedPost ? "text-accent-600" : "text-secondary-600"} hover:text-accent-600`}
                onClick={handleSave}
              >
                <Bookmark className={`h-6 w-6 ${isSavedPost ? "fill-current" : ""}`} />
              </Button>
            </div>

            <div className="w-full text-left">
              <p className="font-semibold text-secondary-800 text-sm">{post.likes + (isLiked ? 1 : 0)} likes</p>
              <p className="text-secondary-700 text-sm mt-1">
                <button
                  onClick={() => handleUsernameClick(post.user.username)}
                  className="font-semibold hover:text-primary-600 transition-colors"
                >
                  {post.user.username}
                </button>{" "}
                {post.caption}
              </p>

              {/* Comments Section */}
              {post.comments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-secondary-500 text-sm font-semibold">Comments ({post.comments.length})</p>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.username} />
                        <AvatarFallback className="bg-primary-200 text-primary-800 text-xs">
                          {comment.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm text-secondary-700">
                          <button
                            onClick={() => handleUsernameClick(comment.username)}
                            className="font-semibold hover:text-primary-600 transition-colors"
                          >
                            {comment.username}
                          </button>{" "}
                          {comment.text}
                        </p>
                        <p className="text-xs text-secondary-500">{comment.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="flex gap-2 mt-3">
                <Input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-white border-primary-200 focus:border-primary-400 text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="bg-primary-500 hover:bg-primary-600 text-white shadow-md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-secondary-500 text-xs mt-2">{post.timeAgo}</p>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
