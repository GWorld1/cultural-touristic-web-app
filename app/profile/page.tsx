"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Grid, Settings, CheckCircle, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/lib/contexts/auth"
import { usePostsStore } from "@/lib/stores/posts"
import PostFeed from "@/components/posts/PostFeed"
import Link from "next/link"



function ProfilePageContent() {
  const { user, UserProfile, updateProfile, isLoading, error, clearError } = useAuth()
  const { userPosts, fetchUserPosts, loading: postsLoading } = usePostsStore()

  const [editForm, setEditForm] = useState({
    fullName: UserProfile?.name || "",
    bio: UserProfile?.bio,
    phone: UserProfile?.phone || "",
  })
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  console.log('UserProfile changed:', UserProfile)

  // Update form when user data changes
  useEffect(() => {
    if (UserProfile) {
      setEditForm({
        fullName: UserProfile.name || "",
        bio: UserProfile.bio || "",
        phone: UserProfile.phone || "",
      })
    }
  }, [UserProfile])

  // Fetch user posts when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserPosts(user.id)
    }
  }, [user?.id, fetchUserPosts])

  // Calculate total likes for user's posts
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likesCount, 0)

  const handleSaveProfile = async () => {
    // Clear any previous errors
    clearError()
    setSaveStatus('idle')

    // Validate required fields
    if (!editForm.fullName.trim()) {
      setSaveStatus('error')
      return
    }

    try {
      // Call the updateProfile function from auth store
      const success = await updateProfile({
        name: editForm.fullName.trim(),
        bio: editForm.bio?.trim() || undefined,
        phone: editForm.phone?.trim() || undefined,
      })

      if (success) {
        setSaveStatus('success')
        // Close dialog after a brief delay to show success message
        setTimeout(() => {
          setIsEditOpen(false)
          setSaveStatus('idle')
        }, 1500)
      } else {
        setSaveStatus('error')
      }
    } catch (err) {
      console.error('Failed to update profile:', err)
      setSaveStatus('error')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 px-4 pb-20 md:pb-6">

        <Card className="bg-white/90 backdrop-blur-sm border-primary-100 shadow-lg">
          <CardContent className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <Avatar className="w-32 h-32 border-4 border-primary-200">
                <AvatarImage src="/placeholder.svg" alt="Profile" />
                <AvatarFallback className="bg-primary-500 text-white text-2xl">
                  {UserProfile?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold text-secondary-800">{UserProfile?.name || 'User'}</h1>

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
                        {/* Status Messages */}
                        {saveStatus === 'success' && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 text-sm">Profile updated successfully!</span>
                          </div>
                        )}
                        {saveStatus === 'error' && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-700 text-sm">
                              {error || (!editForm.fullName.trim() ? 'Full name is required' : 'Failed to update profile. Please try again.')}
                            </span>
                          </div>
                        )}

                        <div>
                          <label className="text-secondary-800 font-semibold">Full Name *</label>
                          <Input
                            value={editForm.fullName}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                            className="bg-white border-primary-200 focus:border-primary-400"
                            placeholder="Enter your full name"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <label className="text-secondary-800 font-semibold">Phone</label>
                          <Input
                            value={editForm.phone}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="bg-white border-primary-200 focus:border-primary-400"
                            placeholder="Enter your phone number"
                            disabled={isLoading}
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
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50"
                            disabled={isLoading || saveStatus === 'success'}
                          >
                            {isLoading ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Changes'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditOpen(false)
                              setSaveStatus('idle')
                              clearError()
                            }}
                            className="border-primary-300 text-primary-700"
                            disabled={isLoading}
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
                  <p className="font-semibold">{UserProfile?.email || user?.email}</p>
                  {UserProfile?.bio && (
                    <p className="whitespace-pre-line mt-2">{UserProfile.bio}</p>
                  )}
                  {/* {UserProfile?.phone && (
                    <p className="text-sm text-secondary-600 mt-1">📞 {UserProfile.phone}</p>
                  )} */}
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="border-t border-primary-200 pt-6">
              <div className="flex justify-center items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <Grid className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-secondary-800">Posts</h3>
                </div>
                <Link
                  href="/upload"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  <span>Create New Post</span>
                </Link>
              </div>

              {/* User Posts Feed */}
              {postsLoading && userPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              ) : (
                <PostFeed
                  userId={user?.id}
                  showCreateButton={false}
                  className="space-y-4"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
