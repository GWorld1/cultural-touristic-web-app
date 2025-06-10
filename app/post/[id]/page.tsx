"use client"

import React, { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"
import PostCard from "@/components/posts/PostCard"
import { usePostsStore } from "@/lib/stores/posts"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const { currentPost, fetchPost, loading, error } = usePostsStore()

  useEffect(() => {
    if (postId) {
      fetchPost(postId)
    }
  }, [postId, fetchPost])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Post not found</h3>
              <p className="text-gray-600 mb-4">{error || 'The post you are looking for does not exist.'}</p>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 mb-6 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {/* Post Card with Comments */}
        <PostCard post={currentPost} showComments={true} />
      </main>
    </div>
  )
}
