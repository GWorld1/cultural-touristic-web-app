"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, MapPin, User } from "lucide-react"
import Navigation from "@/components/navigation"
import { getPosts } from "@/lib/database/queries"

interface SearchResult {
  id: number
  type: "post" | "location" | "user"
  image: string
  title: string
  username?: string
  avatar?: string
  location?: string
  postCount?: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)

  // Get posts with proper error handling
  const allPosts = (() => {
    try {
      const posts = getPosts()
      return Array.isArray(posts) ? posts : []
    } catch (error) {
      console.error("Error fetching posts:", error)
      return []
    }
  })()

  // Get unique users from posts with safety checks
  const uniqueUsers = (() => {
    try {
      const userMap = new Map()
      allPosts.forEach((post) => {
        if (post.user && post.user.username) {
          userMap.set(post.user.username, post.user)
        }
      })
      return Array.from(userMap.values())
    } catch (error) {
      console.error("Error processing users:", error)
      return []
    }
  })()

  // Create search results
  const allResults: SearchResult[] = [
    // Posts
    ...allPosts.map((post) => ({
      id: post.id,
      type: "post" as const,
      image: post.image,
      title: post.caption,
      username: post.user.username,
      avatar: post.user.avatar,
      location: post.location,
    })),
    // Users
    ...uniqueUsers.map((user, index) => ({
      id: 1000 + index,
      type: "user" as const,
      image: user.avatar,
      title: user.username,
      username: user.username,
      avatar: user.avatar,
      postCount: allPosts.filter((post) => post.user.username === user.username).length,
    })),
    // Locations
    {
      id: 2001,
      type: "location" as const,
      image: "/placeholder.svg?height=200&width=400",
      title: "Douala, Cameroon",
      location: "Douala, Cameroon",
    },
    {
      id: 2002,
      type: "location" as const,
      image: "/placeholder.svg?height=200&width=400",
      title: "Yaoundé, Cameroon",
      location: "Yaoundé, Cameroon",
    },
    {
      id: 2003,
      type: "location" as const,
      image: "/placeholder.svg?height=200&width=400",
      title: "Mount Cameroon",
      location: "Mount Cameroon, Cameroon",
    },
    {
      id: 2004,
      type: "location" as const,
      image: "/placeholder.svg?height=200&width=400",
      title: "Kribi Beach",
      location: "Kribi Beach, Cameroon",
    },
  ]

  const filteredResults = (() => {
    try {
      if (!searchQuery.trim()) return []

      return allResults.filter((result) => {
        const query = searchQuery.toLowerCase()
        return (
          result.title.toLowerCase().includes(query) ||
          result.location?.toLowerCase().includes(query) ||
          result.username?.toLowerCase().includes(query)
        )
      })
    } catch (error) {
      console.error("Error filtering results:", error)
      return []
    }
  })()

  // If searching for a specific user, show their posts
  const userPosts = (() => {
    try {
      if (!searchQuery.trim()) return []

      return allPosts.filter(
        (post) =>
          post.user && post.user.username && post.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    } catch (error) {
      console.error("Error filtering user posts:", error)
      return []
    }
  })()

  const isUserSearch = searchQuery.trim() && userPosts.length > 0 && filteredResults.some((r) => r.type === "user")

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-6">
        {/* Simple Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-500" />
            <Input
              placeholder="Search users, locations or posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm border-primary-200 focus:border-primary-400 text-secondary-800 placeholder:text-secondary-500"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-6">
            {isUserSearch && userPosts.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-secondary-800 mb-4">
                  Posts by {userPosts[0].user.username} ({userPosts.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/90 backdrop-blur-sm border border-primary-100 rounded-lg overflow-hidden hover:bg-white transition-colors cursor-pointer shadow-md"
                    >
                      <div className="relative aspect-[2/1]">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt={post.caption}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          360° View
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-secondary-800 line-clamp-2">{post.caption}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
                            <AvatarFallback className="bg-primary-200 text-primary-800 text-xs">
                              {post.user.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-secondary-600">{post.user.username}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-primary-500" />
                          <span className="text-xs text-secondary-500">{post.location}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-secondary-500">
                          <span>{post.likes} likes</span>
                          <span>{post.comments.length} comments</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredResults.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-secondary-800 mb-4">All Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white/90 backdrop-blur-sm border border-primary-100 rounded-lg overflow-hidden hover:bg-white transition-colors cursor-pointer shadow-md"
                      onClick={() => {
                        if (result.type === "user") {
                          setSearchQuery(result.username || "")
                        }
                      }}
                    >
                      {result.type === "user" ? (
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-primary-200">
                              <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.title} />
                              <AvatarFallback className="bg-primary-500 text-white">
                                {result.title[0]?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary-500" />
                                <p className="font-semibold text-secondary-800">{result.title}</p>
                              </div>
                              <p className="text-sm text-secondary-600">{result.postCount} posts</p>
                            </div>
                          </div>
                        </div>
                      ) : result.type === "location" ? (
                        <>
                          <div className="relative aspect-[2/1]">
                            <Image
                              src={result.image || "/placeholder.svg"}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary-500" />
                              <h3 className="font-semibold text-secondary-800">{result.title}</h3>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative aspect-[2/1]">
                            <Image
                              src={result.image || "/placeholder.svg"}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              360° View
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-secondary-800 line-clamp-2">{result.title}</h3>
                            {result.username && (
                              <div className="flex items-center gap-2 mt-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.username} />
                                  <AvatarFallback className="bg-primary-200 text-primary-800 text-xs">
                                    {result.username[0]?.toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-secondary-600">{result.username}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-primary-500" />
                              <span className="text-xs text-secondary-500">{result.location}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredResults.length === 0 && (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-primary-400 mx-auto mb-4" />
                <p className="text-secondary-600">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Popular Locations */
          <div>
            <h2 className="text-lg font-semibold text-secondary-800 mb-4">Popular Locations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allResults
                .filter((result) => result.type === "location")
                .map((location) => (
                  <div
                    key={location.id}
                    className="bg-white/90 backdrop-blur-sm border border-primary-100 rounded-lg overflow-hidden hover:bg-white transition-colors cursor-pointer shadow-md"
                  >
                    <div className="relative aspect-[2/1]">
                      <Image
                        src={location.image || "/placeholder.svg"}
                        alt={location.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary-500" />
                        <h3 className="font-semibold text-secondary-800">{location.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
