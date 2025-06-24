/**
 * Comments Section Component
 * 
 * This component handles displaying and managing comments for posts,
 * including adding, editing, and deleting comments with proper authentication.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Send, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { usePostsStore } from '../../lib/stores/posts';
import { useAuthStore } from '../../lib/stores/auth';
import type { Comment } from '../../lib/types/posts';

interface CommentsSectionProps {
  postId: string;
  className?: string;
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
}

/**
 * Individual Comment Item Component
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showActions, setShowActions] = useState(false);
  
  const { user } = useAuthStore();
  const isOwner = user?.id === comment.authorId;

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit?.(comment.$id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="flex space-x-3 py-3">
      {/* Avatar */}
      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-white font-semibold text-xs">
          {comment.author?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm text-gray-900">
              {comment.author?.name || 'Unknown User'}
            </h4>
            
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(comment.$id);
                        setShowActions(false);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                maxLength={1000}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 text-sm leading-relaxed">
              {comment.content}
              {comment.isEdited && (
                <span className="text-gray-500 text-xs ml-2">(edited)</span>
              )}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
          <span>{formatDate(comment.$createdAt)}</span>
          {comment.repliesCount > 0 && (
            <button className="hover:text-blue-500 transition-colors">
              {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Comments Section Component
 */
export const CommentsSection: React.FC<CommentsSectionProps> = ({
  postId,
  className = '',
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    comments,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    commentsLoading,
    commentsError,
  } = usePostsStore();

  const { isAuthenticated, user } = useAuthStore();

  const postComments = comments[postId] || [];

  // Fetch comments on mount
  useEffect(() => {
    fetchComments(postId);
  }, [postId, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !isAuthenticated) return;

    setIsSubmitting(true);
    
    const success = await addComment(postId, {
      content: newComment.trim(),
    });

    if (success) {
      setNewComment('');
    }
    
    setIsSubmitting(false);
  };

  const handleEditComment = async (commentId: string, content: string) => {
    await updateComment(postId, commentId, { content });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(postId, commentId);
    }
  };

  return (
    <div className={`border-t border-gray-100 ${className}`}>
      {/* Comments List */}
      <div className="p-4">
        {commentsLoading && postComments.length === 0 ? (
          <div className="text-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
          </div>
        ) : postComments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {postComments.map((comment) => (
              <CommentItem
                key={comment.$id}
                comment={comment}
                postId={postId}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}

        {commentsError && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm">{commentsError}</p>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <form onSubmit={handleSubmitComment} className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={1000}
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-gray-600">
            <a href="/auth/login" className="text-blue-500 hover:text-blue-600">
              Sign in
            </a>{' '}
            to add a comment
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
