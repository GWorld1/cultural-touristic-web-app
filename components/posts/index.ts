/**
 * Posts Components Export Index
 * 
 * This file exports all post-related components for easier imports
 * throughout the application.
 */

export { default as PanoramicViewer } from './PanoramicViewer';
export { default as PostCard } from './PostCard';
export { default as PostFeed } from './PostFeed';
export { default as CreatePost } from './CreatePost';
export { default as CommentsSection } from './CommentsSection';

// Re-export types for convenience
export type {
  Post,
  Comment,
  Like,
  Location,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
} from '../../lib/types/posts';
