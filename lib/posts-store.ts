interface User {
    username: string
    avatar: string
    fullName?: string
    bio?: string
  }
  
  interface Comment {
    id: number
    username: string
    avatar: string
    text: string
    timeAgo: string
  }
  
  interface Post {
    id: number
    user: User
    image: string
    caption: string
    likes: number
    comments: Comment[]
    timeAgo: string
    location: string
    isPanoramic: boolean
  }
  
  // Simple in-memory store for posts
  const posts: Post[] = [
    {
      id: 1,
      user: {
        username: "traveler_jane",
        avatar: "/placeholder.svg?height=40&width=40",
        fullName: "Jane Traveler",
        bio: "🌍 Explorer | 📸 Photography enthusiast",
      },
      image: "/placeholder.svg?height=400&width=800",
      caption: "Amazing sunset at Mount Cameroon! 🌅 #Cameroon #Tourism #Nature",
      likes: 234,
      comments: [
        {
          id: 1,
          username: "adventure_mike",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "Absolutely stunning view! 😍",
          timeAgo: "1h",
        },
        {
          id: 2,
          username: "photo_lover",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "The colors are incredible! What camera did you use?",
          timeAgo: "30m",
        },
      ],
      timeAgo: "2h",
      location: "Mount Cameroon, Cameroon",
      isPanoramic: true,
    },
    {
      id: 2,
      user: {
        username: "adventure_mike",
        avatar: "/placeholder.svg?height=40&width=40",
        fullName: "Mike Adventure",
        bio: "🏔️ Mountain climber | 🌊 Ocean lover",
      },
      image: "/placeholder.svg?height=400&width=800",
      caption: "Panoramic view of the beautiful coastline! Perfect for tourism 🏖️",
      likes: 189,
      comments: [
        {
          id: 3,
          username: "beach_walker",
          avatar: "/placeholder.svg?height=40&width=40",
          text: "I need to visit this place! Where exactly is this?",
          timeAgo: "2h",
        },
      ],
      timeAgo: "4h",
      location: "Kribi Beach, Cameroon",
      isPanoramic: true,
    },
  ]
  
  // Current user data
  let currentUser: User = {
    username: "current_user",
    avatar: "/placeholder.svg?height=40&width=40",
    fullName: "John Doe",
    bio: "🌍 Travel enthusiast | 📸 Tourism photographer\nExploring the beautiful landscapes of Cameroon 🇨🇲",
  }
  
  // Saved posts for current user
  const savedPosts: number[] = []
  
  export function getPosts(): Post[] {
    try {
      return [...posts].sort((a, b) => b.id - a.id)
    } catch (error) {
      console.error("Error in getPosts:", error)
      return []
    }
  }
  
  export function getPost(id: number): Post | undefined {
    return posts.find((post) => post.id === id)
  }
  
  export function addPost(post: Omit<Post, "id" | "likes" | "comments" | "timeAgo">): Post {
    const newPost: Post = {
      ...post,
      id: Math.max(...posts.map((p) => p.id), 0) + 1,
      likes: 0,
      comments: [],
      timeAgo: "now",
    }
    posts.unshift(newPost)
    return newPost
  }
  
  export function addComment(postId: number, text: string): Comment | null {
    const post = posts.find((p) => p.id === postId)
    if (!post) return null
  
    const newComment: Comment = {
      id: Math.max(...post.comments.map((c) => c.id), 0) + 1,
      username: currentUser.username,
      avatar: currentUser.avatar,
      text,
      timeAgo: "now",
    }
  
    post.comments.push(newComment)
    return newComment
  }
  
  export function toggleSavePost(postId: number): boolean {
    const index = savedPosts.indexOf(postId)
    if (index > -1) {
      savedPosts.splice(index, 1)
      return false // unsaved
    } else {
      savedPosts.push(postId)
      return true // saved
    }
  }
  
  export function getSavedPosts(): Post[] {
    return posts.filter((post) => savedPosts.includes(post.id))
  }
  
  export function isSaved(postId: number): boolean {
    return savedPosts.includes(postId)
  }
  
  export function getCurrentUser(): User {
    return currentUser
  }
  
  export function updateCurrentUser(updates: Partial<User>): User {
    currentUser = { ...currentUser, ...updates }
    return currentUser
  }
  