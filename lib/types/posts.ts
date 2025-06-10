/**
 * Post-related TypeScript type definitions
 * Based on the Post API Endpoints documentation
 */

// Base interfaces
export interface Location {
  name: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: number;
  isEquirectangular: boolean;
  thumbnailUrl: string;
  mediumUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}

export interface Post {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  authorId: string;
  caption: string;
  imageUrl: string;
  imagePublicId: string;
  location?: Location;
  tags: string[];
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  imageMetadata: ImageMetadata;
  author?: User;
}

export interface Comment {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  postId: string;
  authorId: string;
  content: string;
  isEdited: boolean;
  parentCommentId?: string;
  repliesCount: number;
  author: User;
  replies?: Comment[];
}

export interface Like {
  $id: string;
  $createdAt: string;
  postId: string;
  userId: string;
  user?: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Request types
export interface CreatePostRequest {
  image: File;
  caption: string;
  location?: Location;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdatePostRequest {
  caption?: string;
  location?: Location;
  tags?: string[];
  isPublic?: boolean;
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// Response types
export interface PostResponse {
  success: true;
  data: {
    post: Post;
    author?: User;
  };
  message?: string;
}

export interface PostsResponse {
  success: true;
  data: {
    posts: Post[];
    pagination: Pagination;
  };
}

export interface CommentResponse {
  success: true;
  data: Comment;
  message?: string;
}

export interface CommentsResponse {
  success: true;
  data: {
    comments: Comment[];
    pagination: Pagination;
  };
}

export interface LikeResponse {
  success: true;
  data: {
    isLiked: boolean;
    likesCount: number;
    postId: string;
    userId: string;
  };
  message?: string;
}

export interface LikesResponse {
  success: true;
  data: {
    likes: Like[];
    pagination: Pagination;
  };
}

export interface LikeStatusResponse {
  success: true;
  data: {
    isLiked: boolean;
    postId: string;
    userId?: string;
  };
}

export interface LikeStatsResponse {
  success: true;
  data: {
    postId: string;
    totalLikes: number;
    recentLikes: Array<{
      userId: string;
      userName: string;
      likedAt: string;
    }>;
  };
}

// Error response type
export interface PostError {
  success: false;
  error: string;
  details?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// State types for stores
export interface PostState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}

export interface CommentState {
  comments: Record<string, Comment[]>; // postId -> comments
  loading: boolean;
  error: string | null;
}

export interface LikeState {
  likedPosts: Set<string>;
  loading: boolean;
  error: string | null;
}

// Store actions
export interface PostActions {
  fetchPosts: (page?: number, limit?: number, userId?: string) => Promise<void>;
  fetchPost: (postId: string) => Promise<void>;
  createPost: (postData: CreatePostRequest) => Promise<boolean>;
  updatePost: (postId: string, postData: UpdatePostRequest) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface CommentActions {
  fetchComments: (postId: string, page?: number, limit?: number) => Promise<void>;
  addComment: (postId: string, commentData: CreateCommentRequest) => Promise<boolean>;
  updateComment: (postId: string, commentId: string, commentData: UpdateCommentRequest) => Promise<boolean>;
  deleteComment: (postId: string, commentId: string) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export interface LikeActions {
  toggleLike: (postId: string) => Promise<boolean>;
  checkLikeStatus: (postId: string) => Promise<void>;
  fetchLikes: (postId: string, page?: number, limit?: number) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

// Combined store types
export type PostStore = PostState & PostActions;
export type CommentStore = CommentState & CommentActions;
export type LikeStore = LikeState & LikeActions;
