"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Grid, Settings, Bookmark, PaletteIcon as Panorama, Heart, MessageCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import { getPosts, getSavedPosts, getCurrentUser, updateCurrentUser } from "@/lib/posts-store"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [user, setUser] = useState(getCurrentUser())
  const [editForm, setEditForm] = useState({
    fullName: user.fullName || "",
    bio: user.bio || "",
  })
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Get posts with proper error handling
  const userPosts = (() => {
    try {
      const posts = getPosts()
      return Array.isArray(posts) ? posts.filter((post) => post.user.username === user.username) : []
    } catch (error) {
      console.error("Error fetching user posts:", error)
      return []
    }
  })()

  // Get saved posts with proper error handling
  const savedPosts = (() => {
    try {
      const posts = getSavedPosts()
      return Array.isArray(posts) ? posts : []
    } catch (error) {
      console.error("Error fetching saved posts:", error)
      return []
    }
  })()

  // Calculate total likes for user's posts
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0)

  const handleSaveProfile = () => {
    const updatedUser = updateCurrentUser({
      fullName: editForm.fullName,
      bio: editForm.bio,
    })
    setUser(updatedUser)
    setIsEditOpen(false)
  }

  const postsToShow = activeTab === "posts" ? userPosts : savedPosts

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-primary-100 shadow-lg">
          <CardContent className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <Avatar className="w-32 h-32 border-4 border-primary-200">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-primary-500 text-white text-2xl">
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold text-secondary-800">{user.username}</h1>

                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-primary-300 text-primary-700 hover:bg-primary-50">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-primary-200">
                      <DialogHeader>
                        <DialogTitle className="text-secondary-800">Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-secondary-800 font-semibold">Full Name</label>
                          <Input
                            value={editForm.fullName}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            className="bg-white border-primary-200 focus:border-primary-400"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="text-secondary-800 font-semibold">Bio</label>
                          <Textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                            className="bg-white border-primary-200 focus:border-primary-400"
                            placeholder="Tell us about yourself..."
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            className="border-primary-300 text-primary-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-center md:justify-start gap-8 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-secondary-800">{userPosts.length}</div>
                    <div className="text-secondary-600 text-sm">posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-secondary-800">{totalLikes}</div>
                    <div className="text-secondary-600 text-sm">likes</div>
                  </div>
                </div>

                <div className="text-secondary-700">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="whitespace-pre-line">{user.bio}</p>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="border-t border-primary-200 pt-6">
              <div className="flex justify-center mb-6 gap-4">
                <Button
                  variant={activeTab === "posts" ? "default" : "ghost"}
                  className={
                    activeTab === "posts"
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "text-secondary-600 hover:text-secondary-800 hover:bg-primary-50"
                  }
                  onClick={() => setActiveTab("posts")}
                >
                  <Grid className="h-4 w-4 mr-2" />
                  POSTS
                </Button>
                <Button
                  variant={activeTab === "saved" ? "default" : "ghost"}
                  className={
                    activeTab === "saved"
                      ? "bg-primary-500 hover:bg-primary-600 text-white"
                      : "text-secondary-600 hover:text-secondary-800 hover:bg-primary-50"
                  }
                  onClick={() => setActiveTab("saved")}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  SAVED ({savedPosts.length})
                </Button>
              </div>

              {postsToShow.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-secondary-500 mb-2">
                    {activeTab === "posts" ? (
                      <>
                        <Grid className="h-12 w-12 mx-auto mb-4" />
                        <p>No posts yet</p>
                        <p className="text-sm">Share your first panoramic view!</p>
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-12 w-12 mx-auto mb-4" />
                        <p>No saved posts</p>
                        <p className="text-sm">Save posts by tapping the bookmark icon</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 md:gap-4">
                  {postsToShow.map((post) => (
                    <div
                      key={post.id}
                      className="relative aspect-square group cursor-pointer"
                      onClick={() => {
                        if (activeTab === "saved") {
                          // Navigate to individual post page for saved posts
                          window.location.href = `/post/${post.id}`
                        }
                      }}
                    >
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={`Post ${post.id}`}
                        fill
                        className="object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                      />
                      <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
                        <Panorama className="h-3 w-3" />
                      </div>
                      {/* Overlay with stats on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 fill-current" />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 fill-current" />
                              <span className="text-sm">{post.comments.length}</span>
                            </div>
                          </div>
                          {activeTab === "saved" && <p className="text-xs mt-1 opacity-75">Click to view</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
