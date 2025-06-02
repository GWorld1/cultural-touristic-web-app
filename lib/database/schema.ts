// Database Schema Definitions
export interface User {
    id: string
    username: string
    email: string
    password_hash: string
    full_name?: string
    bio?: string
    avatar_url?: string
    created_at: Date
    updated_at: Date
    is_verified: boolean
    total_likes_received: number
    post_count: number
  }
  
  export interface Post {
    id: string
    user_id: string
    image_url: string
    caption: string
    location: string
    is_panoramic: boolean
    likes_count: number
    comments_count: number
    views_count: number
    created_at: Date
    updated_at: Date
    is_deleted: boolean
  }
  
  export interface Comment {
    id: string
    post_id: string
    user_id: string
    text: string
    created_at: Date
    updated_at: Date
    is_deleted: boolean
  }
  
  export interface Like {
    id: string
    post_id: string
    user_id: string
    created_at: Date
  }
  
  export interface SavedPost {
    id: string
    post_id: string
    user_id: string
    created_at: Date
  }
  
  export interface PostView {
    id: string
    post_id: string
    user_id?: string // nullable for anonymous views
    ip_address: string
    created_at: Date
  }
  
  export interface Session {
    id: string
    user_id: string
    token: string
    expires_at: Date
    created_at: Date
  }
  
  // API Response Types
  export interface PostWithDetails extends Post {
    user: Pick<User, "id" | "username" | "avatar_url" | "is_verified">
    is_liked_by_current_user: boolean
    is_saved_by_current_user: boolean
    recent_comments: Array<Comment & { user: Pick<User, "id" | "username" | "avatar_url"> }>
  }
  
  export interface UserProfile extends User {
    posts: Post[]
    saved_posts: PostWithDetails[]
  }
  