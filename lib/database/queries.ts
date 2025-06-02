// Database Query Functions (would use actual DB in production)

import type { User, Post, Comment, Like, SavedPost, PostWithDetails } from "./schema"

// Mock database - in production, this would be replaced with actual database queries
const users: User[] = [
  {
    id: "1",
    username: "current_user",
    email: "user@example.com",
    password_hash: "hashed_password",
    full_name: "John Doe",
    bio: "🌍 Travel enthusiast | 📸 Tourism photographer\nExploring the beautiful landscapes of Cameroon 🇨🇲",
    avatar_url: "/placeholder.svg?height=40&width=40",
    created_at: new Date("2024-01-01"),
    updated_at: new Date(),
    is_verified: false,
    total_likes_received: 0,
    post_count: 0,
  },
  {
    id: "2",
    username: "traveler_jane",
    email: "jane@example.com",
    password_hash: "hashed_password",
    full_name: "Jane Traveler",
    bio: "🌍 Explorer | 📸 Photography enthusiast",
    avatar_url: "/placeholder.svg?height=40&width=40",
    created_at: new Date("2024-01-01"),
    updated_at: new Date(),
    is_verified: true,
    total_likes_received: 234,
    post_count: 1,
  },
]

const posts: Post[] = [
  {
    id: "1",
    user_id: "2",
    image_url: "/placeholder.svg?height=400&width=800",
    caption: "Amazing sunset at Mount Cameroon! 🌅 #Cameroon #Tourism #Nature",
    location: "Mount Cameroon, Cameroon",
    is_panoramic: true,
    likes_count: 234,
    comments_count: 2,
    views_count: 1250,
    created_at: new Date("2024-01-15"),
    updated_at: new Date("2024-01-15"),
    is_deleted: false,
  },
]

const comments: Comment[] = [
  {
    id: "1",
    post_id: "1",
    user_id: "1",
    text: "Absolutely stunning view! 😍",
    created_at: new Date("2024-01-15T10:00:00"),
    updated_at: new Date("2024-01-15T10:00:00"),
    is_deleted: false,
  },
]

let likes: Like[] = []
let savedPosts: SavedPost[] = []
let currentUserId = "1" // Mock current user

// User Queries
export async function getUserById(id: string): Promise<User | null> {
  return users.find((user) => user.id === id) || null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  return users.find((user) => user.username === username) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((user) => user.email === email) || null
}

export async function createUser(
  userData: Omit<User, "id" | "created_at" | "updated_at" | "total_likes_received" | "post_count">,
): Promise<User> {
  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(),
    created_at: new Date(),
    updated_at: new Date(),
    total_likes_received: 0,
    post_count: 0,
  }
  users.push(newUser)
  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date() }
  return users[userIndex]
}

// Post Queries
export async function getPosts(limit = 20, offset = 0): Promise<PostWithDetails[]> {
  const postsSlice = posts
    .filter((post) => !post.is_deleted)
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(offset, offset + limit)

  return Promise.all(
    postsSlice.map(async (post) => {
      const user = await getUserById(post.user_id)
      const recentComments = comments
        .filter((comment) => comment.post_id === post.id && !comment.is_deleted)
        .slice(0, 3)

      const commentsWithUsers = await Promise.all(
        recentComments.map(async (comment) => {
          const commentUser = await getUserById(comment.user_id)
          return {
            ...comment,
            user: {
              id: commentUser!.id,
              username: commentUser!.username,
              avatar_url: commentUser!.avatar_url,
            },
          }
        }),
      )

      return {
        ...post,
        user: {
          id: user!.id,
          username: user!.username,
          avatar_url: user!.avatar_url,
          is_verified: user!.is_verified,
        },
        is_liked_by_current_user: likes.some((like) => like.post_id === post.id && like.user_id === currentUserId),
        is_saved_by_current_user: savedPosts.some(
          (saved) => saved.post_id === post.id && saved.user_id === currentUserId,
        ),
        recent_comments: commentsWithUsers,
      }
    }),
  )
}

export async function getPostById(id: string): Promise<PostWithDetails | null> {
  const post = posts.find((p) => p.id === id && !p.is_deleted)
  if (!post) return null

  const user = await getUserById(post.user_id)
  const postComments = comments.filter((comment) => comment.post_id === post.id && !comment.is_deleted)

  const commentsWithUsers = await Promise.all(
    postComments.map(async (comment) => {
      const commentUser = await getUserById(comment.user_id)
      return {
        ...comment,
        user: {
          id: commentUser!.id,
          username: commentUser!.username,
          avatar_url: commentUser!.avatar_url,
        },
      }
    }),
  )

  return {
    ...post,
    user: {
      id: user!.id,
      username: user!.username,
      avatar_url: user!.avatar_url,
      is_verified: user!.is_verified,
    },
    is_liked_by_current_user: likes.some((like) => like.post_id === post.id && like.user_id === currentUserId),
    is_saved_by_current_user: savedPosts.some((saved) => saved.post_id === post.id && saved.user_id === currentUserId),
    recent_comments: commentsWithUsers,
  }
}

export async function createPost(
  postData: Omit<
    Post,
    "id" | "created_at" | "updated_at" | "likes_count" | "comments_count" | "views_count" | "is_deleted"
  >,
): Promise<Post> {
  const newPost: Post = {
    ...postData,
    id: (posts.length + 1).toString(),
    likes_count: 0,
    comments_count: 0,
    views_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
  }
  posts.push(newPost)

  // Update user post count
  const user = users.find((u) => u.id === postData.user_id)
  if (user) {
    user.post_count += 1
  }

  return newPost
}

export async function getUserPosts(userId: string): Promise<PostWithDetails[]> {
  const userPosts = posts.filter((post) => post.user_id === userId && !post.is_deleted)
  return Promise.all(
    userPosts.map(async (post) => {
      const user = await getUserById(post.user_id)
      return {
        ...post,
        user: {
          id: user!.id,
          username: user!.username,
          avatar_url: user!.avatar_url,
          is_verified: user!.is_verified,
        },
        is_liked_by_current_user: likes.some((like) => like.post_id === post.id && like.user_id === currentUserId),
        is_saved_by_current_user: savedPosts.some(
          (saved) => saved.post_id === post.id && saved.user_id === currentUserId,
        ),
        recent_comments: [],
      }
    }),
  )
}

// Comment Queries
export async function createComment(
  commentData: Omit<Comment, "id" | "created_at" | "updated_at" | "is_deleted">,
): Promise<Comment> {
  const newComment: Comment = {
    ...commentData,
    id: (comments.length + 1).toString(),
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
  }
  comments.push(newComment)

  // Update post comment count
  const post = posts.find((p) => p.id === commentData.post_id)
  if (post) {
    post.comments_count += 1
  }

  return newComment
}

// Like Queries
export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const existingLike = likes.find((like) => like.post_id === postId && like.user_id === userId)

  if (existingLike) {
    // Remove like
    likes = likes.filter((like) => like.id !== existingLike.id)
    const post = posts.find((p) => p.id === postId)
    if (post) post.likes_count -= 1
    return false
  } else {
    // Add like
    const newLike: Like = {
      id: (likes.length + 1).toString(),
      post_id: postId,
      user_id: userId,
      created_at: new Date(),
    }
    likes.push(newLike)
    const post = posts.find((p) => p.id === postId)
    if (post) post.likes_count += 1
    return true
  }
}

// Saved Posts Queries
export async function toggleSavedPost(postId: string, userId: string): Promise<boolean> {
  const existingSave = savedPosts.find((save) => save.post_id === postId && save.user_id === userId)

  if (existingSave) {
    // Remove save
    savedPosts = savedPosts.filter((save) => save.id !== existingSave.id)
    return false
  } else {
    // Add save
    const newSave: SavedPost = {
      id: (savedPosts.length + 1).toString(),
      post_id: postId,
      user_id: userId,
      created_at: new Date(),
    }
    savedPosts.push(newSave)
    return true
  }
}

export async function getSavedPosts(userId: string): Promise<PostWithDetails[]> {
  const userSavedPosts = savedPosts.filter((save) => save.user_id === userId)
  const savedPostIds = userSavedPosts.map((save) => save.post_id)

  const savedPostsData = posts.filter((post) => savedPostIds.includes(post.id) && !post.is_deleted)

  return Promise.all(
    savedPostsData.map(async (post) => {
      const user = await getUserById(post.user_id)
      return {
        ...post,
        user: {
          id: user!.id,
          username: user!.username,
          avatar_url: user!.avatar_url,
          is_verified: user!.is_verified,
        },
        is_liked_by_current_user: likes.some((like) => like.post_id === post.id && like.user_id === currentUserId),
        is_saved_by_current_user: true,
        recent_comments: [],
      }
    }),
  )
}

// Search Queries
export async function searchPosts(query: string): Promise<PostWithDetails[]> {
  const filteredPosts = posts.filter(
    (post) =>
      !post.is_deleted &&
      (post.caption.toLowerCase().includes(query.toLowerCase()) ||
        post.location.toLowerCase().includes(query.toLowerCase())),
  )

  return Promise.all(
    filteredPosts.map(async (post) => {
      const user = await getUserById(post.user_id)
      return {
        ...post,
        user: {
          id: user!.id,
          username: user!.username,
          avatar_url: user!.avatar_url,
          is_verified: user!.is_verified,
        },
        is_liked_by_current_user: likes.some((like) => like.post_id === post.id && like.user_id === currentUserId),
        is_saved_by_current_user: savedPosts.some(
          (saved) => saved.post_id === post.id && saved.user_id === currentUserId,
        ),
        recent_comments: [],
      }
    }),
  )
}

export async function searchUsers(query: string): Promise<User[]> {
  return users.filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(query.toLowerCase()),
  )
}

// Current user helper
export function getCurrentUserId(): string {
  return currentUserId
}

export function setCurrentUserId(userId: string): void {
  currentUserId = userId
}
