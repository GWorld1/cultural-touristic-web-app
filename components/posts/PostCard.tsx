/**
 * Post Card Component
 * 
 * This component displays a single post with integrated 360° panoramic viewer,
 * like/comment functionality, and follows the existing design patterns.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, MoreHorizontal, Share2 } from 'lucide-react';
import { usePostsStore } from '../../lib/stores/posts';
import { useAuthStore } from '../../lib/stores/auth';
import PanoramicViewer from './PanoramicViewer';
import CommentsSection from './CommentsSection';
import type { Post } from '../../lib/types/posts';

interface PostCardProps {
  post: Post;
  showComments?: boolean;
  className?: string;
}

/**
 * Post Card Component with 360° Viewer
 */
export const PostCard: React.FC<PostCardProps> = ({
  post,
  showComments = false,
  className = '',
}) => {
  const [showCommentsSection, setShowCommentsSection] = useState(showComments);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  
  const { 
    toggleLike, 
    checkLikeStatus, 
    likedPosts, 
    likesLoading 
  } = usePostsStore();
  
  const { isAuthenticated } = useAuthStore();

  // Check if post is liked on mount
  useEffect(() => {
    const liked = likedPosts.has(post.$id);
    setIsLiked(liked);
    
    // Check like status from server if authenticated
    if (isAuthenticated) {
      checkLikeStatus(post.$id);
    }
  }, [post.$id, likedPosts, isAuthenticated, checkLikeStatus]);

  // Update local state when store changes
  useEffect(() => {
    setIsLiked(likedPosts.has(post.$id));
    setLikesCount(post.likesCount);
  }, [likedPosts, post.$id, post.likesCount]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/auth/login';
      return;
    }

    const success = await toggleLike(post.$id);
    if (success) {
      // State will be updated by the store
    }
  };

  const handleCommentToggle = () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = '/auth/login';
      return;
    }
    
    setShowCommentsSection(!showCommentsSection);
  };

  const handleShare = async () => {
    const shareData = {
      title: `360° View: ${post.caption.substring(0, 50)}...`,
      text: post.caption,
      url: `${window.location.origin}/post/${post.$id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.warn('Share failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Post Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {post.author?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {post.author?.name || 'Unknown User'}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDate(post.$createdAt)}
              </p>
            </div>
          </div>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Caption */}
        <div className="mt-3">
          <p className="text-gray-900 leading-relaxed">{post.caption}</p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-blue-600 text-sm hover:text-blue-800 cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Location */}
          {post.location && (
            <div className="flex items-center mt-2 text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{post.location.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* 360° Panoramic Viewer */}
      <div className="relative">
        <PanoramicViewer
          imageUrl={post.imageUrl}
          alt={`360° view: ${post.caption}`}
          height="400px"
          showControls={true}
          autoRotate={false}
        />
      </div>

      {/* Post Actions */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLikeToggle}
              disabled={likesLoading}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-600 hover:text-red-500'
              } ${likesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart 
                className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} 
              />
              <span className="font-medium">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleCommentToggle}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{post.commentsCount}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          {/* Views Count */}
          <div className="text-sm text-gray-500">
            {post.viewsCount} views
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showCommentsSection && (
        <CommentsSection postId={post.$id} />
      )}
    </div>
  );
};

export default PostCard;
