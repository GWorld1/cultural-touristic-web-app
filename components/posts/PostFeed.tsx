/**
 * Post Feed Component
 * 
 * This component displays a feed of posts with pagination,
 * loading states, and error handling. It integrates with the
 * existing authentication system and follows the app's design patterns.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { usePostsStore } from '../../lib/stores/posts';
import { useAuthStore } from '../../lib/stores/auth';
import PostCard from './PostCard';
import Link from 'next/link';

interface PostFeedProps {
  userId?: string; // If provided, shows posts from specific user
  className?: string;
  showCreateButton?: boolean;
}

/**
 * Post Feed Component
 */
export const PostFeed: React.FC<PostFeedProps> = ({
  userId,
  className = '',
  showCreateButton = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    posts,
    userPosts,
    loading,
    error,
    pagination,
    fetchPosts,
    fetchUserPosts,
    clearError,
  } = usePostsStore();

  const { isAuthenticated } = useAuthStore();

  const displayPosts = userId ? userPosts : posts;
  const isUserFeed = !!userId;

  // Fetch posts on mount and when dependencies change
  useEffect(() => {
    if (isUserFeed) {
      fetchUserPosts(userId, currentPage);
    } else {
      fetchPosts(currentPage);
    }
  }, [currentPage, userId, isUserFeed, fetchPosts, fetchUserPosts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    
    try {
      if (isUserFeed) {
        await fetchUserPosts(userId, 1);
      } else {
        await fetchPosts(1);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.hasNextPage && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination?.hasPrevPage && !loading) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Loading state for initial load
  if (loading && displayPosts.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Loading skeleton */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-300"></div>
            <div className="p-4">
              <div className="flex space-x-6">
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && displayPosts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load posts
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                'Try Again'
              )}
            </button>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (displayPosts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📷</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isUserFeed ? 'No posts yet' : 'No posts to show'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isUserFeed 
              ? 'This user hasn\'t shared any 360° experiences yet.'
              : 'Be the first to share a 360° experience!'
            }
          </p>
          {showCreateButton && isAuthenticated && (
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {isUserFeed ? 'Posts' : 'Feed'}
        </h2>
        
        <div className="flex items-center space-x-3">
          {showCreateButton && isAuthenticated && (
            <Link
              href="/upload"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Link>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            title="Refresh posts"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {displayPosts.map((post) => (
          <PostCard key={post.$id} post={post} />
        ))}
      </div>

      {/* Loading more indicator */}
      {loading && displayPosts.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Loading more posts...</span>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} posts
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={!pagination.hasPrevPage || loading}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 bg-blue-500 text-white rounded">
              {pagination.page}
            </span>
            
            <button
              onClick={handleLoadMore}
              disabled={!pagination.hasNextPage || loading}
              className="px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && displayPosts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostFeed;
