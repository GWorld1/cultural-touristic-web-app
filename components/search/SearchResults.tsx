"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, MapPin, Eye, Calendar, User } from "lucide-react"
import { Post, Pagination } from "@/lib/types/posts"
import { formatDistanceToNow } from "date-fns"

interface SearchResultsProps {
  posts: Post[]
  loading?: boolean
  pagination?: Pagination | null
  onLoadMore?: () => void
  onPostClick?: (post: Post) => void
}

export default function SearchResults({ 
  posts, 
  loading = false, 
  pagination, 
  onLoadMore,
  onPostClick 
}: SearchResultsProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const handleImageError = (postId: string) => {
    setImageErrors(prev => new Set(prev).add(postId))
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown time'
    }
  }

  const getImageUrl = (post: Post) => {
    if (imageErrors.has(post.$id)) {
      return "/placeholder.svg?height=400&width=800"
    }
    return post.imageUrl || "/placeholder.svg?height=400&width=800"
  }

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
          <Eye className="h-12 w-12 text-primary-400" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-800 mb-2">No posts found</h3>
        <p className="text-secondary-600">
          Try adjusting your search criteria or explore different tags and locations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-800">
          Search Results {pagination && `(${pagination.total} posts found)`}
        </h2>
        {pagination && (
          <p className="text-sm text-secondary-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.$id}
            className="bg-white/90 backdrop-blur-sm border border-primary-100 rounded-lg overflow-hidden hover:bg-white hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onPostClick?.(post)}
          >
            {/* Post Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={getImageUrl(post)}
                alt={post.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                onError={() => handleImageError(post.$id)}
              />
              
              {/* 360° Badge */}
              {post.imageMetadata?.isEquirectangular && (
                <div className="absolute top-3 left-3 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  360° View
                </div>
              )}

              {/* Post Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex items-center gap-4 text-white text-sm">
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.commentsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4 space-y-3">
              {/* Caption */}
              <p className="text-secondary-800 font-medium line-clamp-2 leading-relaxed">
                {post.caption}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Location */}
              {post.location && (
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MapPin className="h-4 w-4 text-primary-500" />
                  <span className="truncate">
                    {post.location.name}
                    {post.location.city && `, ${post.location.city}`}
                    {post.location.country && `, ${post.location.country}`}
                  </span>
                </div>
              )}

              {/* Author and Date */}
              <div className="flex items-center justify-between pt-2 border-t border-primary-100">
                <div className="flex items-center gap-2">
                  {post.author ? (
                    <>
                      <Avatar className="w-6 h-6">
                        <AvatarImage src="/placeholder.svg" alt={post.author.name} />
                        <AvatarFallback className="bg-primary-200 text-primary-800 text-xs">
                          {post.author.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-secondary-600 truncate">
                        {post.author.name}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-secondary-400" />
                      <span className="text-sm text-secondary-500">Unknown</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-secondary-500">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(post.$createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/90 border border-primary-100 rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-primary-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-primary-200 rounded w-3/4" />
                <div className="h-3 bg-primary-200 rounded w-1/2" />
                <div className="flex gap-2">
                  <div className="h-6 bg-primary-200 rounded w-16" />
                  <div className="h-6 bg-primary-200 rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {pagination?.hasNextPage && !loading && (
        <div className="text-center pt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  )
}
