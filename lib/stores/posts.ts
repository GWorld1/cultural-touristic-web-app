/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Posts Store using Zustand
 * 
 * This store manages global post state including posts data,
 * loading states, and post actions. It integrates with the existing
 * authentication system and follows the same patterns as the auth store.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { postsService } from '../api/posts';
import { likesService } from '../api/likes';
import { commentsService } from '../api/comments';
import { searchService } from '../api/search';
import type {
  Post,
  Comment,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  SearchRequest,
  Pagination,
  PostStore,
  CommentStore,
  LikeStore
} from '../types/posts';

/**
 * Posts Store Interface
 */
interface PostsState {
  // Posts data
  posts: Post[];
  currentPost: Post | null;
  userPosts: Post[];

  // Search data
  searchResults: Post[];
  searchLoading: boolean;
  searchError: string | null;
  searchPagination: Pagination | null;
  lastSearchParams: SearchRequest | null;

  // Comments data
  comments: Record<string, Comment[]>; // postId -> comments

  // Likes data
  likedPosts: Set<string>;

  // Loading states
  loading: boolean;
  commentsLoading: boolean;
  likesLoading: boolean;

  // Error states
  error: string | null;
  commentsError: string | null;
  likesError: string | null;

  // Pagination
  pagination: Pagination | null;
  commentsPagination: Record<string, Pagination>; // postId -> pagination
}

interface PostsActions {
  // Post actions
  fetchPosts: (page?: number, limit?: number, userId?: string) => Promise<void>;
  fetchPost: (postId: string) => Promise<void>;
  fetchUserPosts: (userId: string, page?: number, limit?: number) => Promise<void>;
  createPost: (postData: CreatePostRequest) => Promise<boolean>;
  updatePost: (postId: string, postData: UpdatePostRequest) => Promise<boolean>;
  deletePost: (postId: string) => Promise<boolean>;

  // Search actions
  searchPosts: (searchParams: SearchRequest) => Promise<void>;
  loadMoreSearchResults: (searchParams: SearchRequest) => Promise<void>;
  clearSearchResults: () => void;
  clearSearchError: () => void;

  // Comment actions
  fetchComments: (postId: string, page?: number, limit?: number) => Promise<void>;
  addComment: (postId: string, commentData: CreateCommentRequest) => Promise<boolean>;
  updateComment: (postId: string, commentId: string, commentData: UpdateCommentRequest) => Promise<boolean>;
  deleteComment: (postId: string, commentId: string) => Promise<boolean>;

  // Like actions
  toggleLike: (postId: string) => Promise<boolean>;
  checkLikeStatus: (postId: string) => Promise<void>;

  // Utility actions
  clearError: () => void;
  clearCommentsError: () => void;
  clearLikesError: () => void;
  setLoading: (loading: boolean) => void;
  setCommentsLoading: (loading: boolean) => void;
  setLikesLoading: (loading: boolean) => void;
}

type PostsStore = PostsState & PostsActions;

/**
 * Create the posts store
 */
export const usePostsStore = create<PostsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      posts: [],
      currentPost: null,
      userPosts: [],
      searchResults: [],
      searchLoading: false,
      searchError: null,
      searchPagination: null,
      lastSearchParams: null,
      comments: {},
      likedPosts: new Set(),
      loading: false,
      commentsLoading: false,
      likesLoading: false,
      error: null,
      commentsError: null,
      likesError: null,
      pagination: null,
      commentsPagination: {},

      // Post actions
      fetchPosts: async (page = 1, limit = 20, userId?: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.getPosts(page, limit, userId);
          
          if (response.data) {
            set({
              posts: response.data.data.posts,
              pagination: response.data.data.pagination,
              loading: false,
            });
          } else {
            set({
              error: response.error || 'Failed to fetch posts',
              loading: false,
            });
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while fetching posts',
            loading: false,
          });
        }
      },

      fetchPost: async (postId: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.getPost(postId);
          
          if (response.data) {
            set({
              currentPost: response.data.data.post,
              loading: false,
            });
          } else {
            set({
              error: response.error || 'Failed to fetch post',
              loading: false,
            });
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while fetching post',
            loading: false,
          });
        }
      },

      fetchUserPosts: async (userId: string, page = 1, limit = 20) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.getUserPosts(userId, page, limit);
          
          if (response.data) {
            set({
              userPosts: response.data.data.posts,
              pagination: response.data.data.pagination,
              loading: false,
            });
          } else {
            set({
              error: response.error || 'Failed to fetch user posts',
              loading: false,
            });
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while fetching user posts',
            loading: false,
          });
        }
      },

      createPost: async (postData: CreatePostRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.createPost(postData);
          
          if (response.data) {
            // Add the new post to the beginning of the posts array
            const newPost = response.data.data.post;
            set((state) => ({
              posts: [newPost, ...state.posts],
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.error || 'Failed to create post',
              loading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while creating post',
            loading: false,
          });
          return false;
        }
      },

      updatePost: async (postId: string, postData: UpdatePostRequest) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.updatePost(postId, postData);
          
          if (response.data) {
            const updatedPost = response.data.data.post;
            set((state) => ({
              posts: state.posts.map(post => 
                post.$id === postId ? updatedPost : post
              ),
              currentPost: state.currentPost?.$id === postId ? updatedPost : state.currentPost,
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.error || 'Failed to update post',
              loading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while updating post',
            loading: false,
          });
          return false;
        }
      },

      deletePost: async (postId: string) => {
        set({ loading: true, error: null });
        
        try {
          const response = await postsService.deletePost(postId);
          
          if (response.data) {
            set((state) => ({
              posts: state.posts.filter(post => post.$id !== postId),
              currentPost: state.currentPost?.$id === postId ? null : state.currentPost,
              loading: false,
            }));
            return true;
          } else {
            set({
              error: response.error || 'Failed to delete post',
              loading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            error: 'An unexpected error occurred while deleting post',
            loading: false,
          });
          return false;
        }
      },

      // Comment actions
      fetchComments: async (postId: string, page = 1, limit = 20) => {
        set({ commentsLoading: true, commentsError: null });

        try {
          const response = await commentsService.getComments(postId, page, limit, true);

          if (response.data) {
            set((state) => ({
              comments: {
                ...state.comments,
                [postId]: response.data!.data.comments,
              },
              commentsPagination: {
                ...state.commentsPagination,
                [postId]: response.data!.data.pagination,
              },
              commentsLoading: false,
            }));
          } else {
            set({
              commentsError: response.error || 'Failed to fetch comments',
              commentsLoading: false,
            });
          }
        } catch (error) {
          set({
            commentsError: 'An unexpected error occurred while fetching comments',
            commentsLoading: false,
          });
        }
      },

      addComment: async (postId: string, commentData: CreateCommentRequest) => {
        set({ commentsLoading: true, commentsError: null });

        try {
          const response = await commentsService.addComment(postId, commentData);

          if (response.data) {
            const newComment = response.data.data;
            set((state) => ({
              comments: {
                ...state.comments,
                [postId]: [newComment, ...(state.comments[postId] || [])],
              },
              // Update post comment count
              posts: state.posts.map(post =>
                post.$id === postId
                  ? { ...post, commentsCount: post.commentsCount + 1 }
                  : post
              ),
              currentPost: state.currentPost?.$id === postId
                ? { ...state.currentPost, commentsCount: state.currentPost.commentsCount + 1 }
                : state.currentPost,
              commentsLoading: false,
            }));
            return true;
          } else {
            set({
              commentsError: response.error || 'Failed to add comment',
              commentsLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            commentsError: 'An unexpected error occurred while adding comment',
            commentsLoading: false,
          });
          return false;
        }
      },

      updateComment: async (postId: string, commentId: string, commentData: UpdateCommentRequest) => {
        set({ commentsLoading: true, commentsError: null });

        try {
          const response = await commentsService.updateComment(postId, commentId, commentData);

          if (response.data) {
            const updatedComment = response.data.data;
            set((state) => ({
              comments: {
                ...state.comments,
                [postId]: (state.comments[postId] || []).map(comment =>
                  comment.$id === commentId ? updatedComment : comment
                ),
              },
              commentsLoading: false,
            }));
            return true;
          } else {
            set({
              commentsError: response.error || 'Failed to update comment',
              commentsLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            commentsError: 'An unexpected error occurred while updating comment',
            commentsLoading: false,
          });
          return false;
        }
      },

      deleteComment: async (postId: string, commentId: string) => {
        set({ commentsLoading: true, commentsError: null });

        try {
          const response = await commentsService.deleteComment(postId, commentId);

          if (response.data) {
            set((state) => ({
              comments: {
                ...state.comments,
                [postId]: (state.comments[postId] || []).filter(comment => comment.$id !== commentId),
              },
              // Update post comment count
              posts: state.posts.map(post =>
                post.$id === postId
                  ? { ...post, commentsCount: Math.max(0, post.commentsCount - 1) }
                  : post
              ),
              currentPost: state.currentPost?.$id === postId
                ? { ...state.currentPost, commentsCount: Math.max(0, state.currentPost.commentsCount - 1) }
                : state.currentPost,
              commentsLoading: false,
            }));
            return true;
          } else {
            set({
              commentsError: response.error || 'Failed to delete comment',
              commentsLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            commentsError: 'An unexpected error occurred while deleting comment',
            commentsLoading: false,
          });
          return false;
        }
      },

      // Like actions
      toggleLike: async (postId: string) => {
        set({ likesLoading: true, likesError: null });

        try {
          const response = await likesService.toggleLike(postId);

          if (response.data) {
            const { isLiked, likesCount } = response.data.data;

            set((state) => ({
              likedPosts: isLiked
                ? new Set([...state.likedPosts, postId])
                : new Set([...state.likedPosts].filter(id => id !== postId)),
              // Update post likes count
              posts: state.posts.map(post =>
                post.$id === postId
                  ? { ...post, likesCount }
                  : post
              ),
              currentPost: state.currentPost?.$id === postId
                ? { ...state.currentPost, likesCount }
                : state.currentPost,
              likesLoading: false,
            }));
            return true;
          } else {
            set({
              likesError: response.error || 'Failed to toggle like',
              likesLoading: false,
            });
            return false;
          }
        } catch (error) {
          set({
            likesError: 'An unexpected error occurred while toggling like',
            likesLoading: false,
          });
          return false;
        }
      },

      checkLikeStatus: async (postId: string) => {
        try {
          const response = await likesService.checkLikeStatus(postId);

          if (response.data) {
            const { isLiked } = response.data.data;

            set((state) => ({
              likedPosts: isLiked
                ? new Set([...state.likedPosts, postId])
                : new Set([...state.likedPosts].filter(id => id !== postId)),
            }));
          }
        } catch (error) {
          // Silently fail for like status checks
          console.warn('Failed to check like status:', error);
        }
      },

      // Search actions
      searchPosts: async (searchParams: SearchRequest) => {
        set({ searchLoading: true, searchError: null, lastSearchParams: searchParams });

        try {
          const response = await searchService.searchPosts(searchParams);

          if (response.data) {
            set({
              searchResults: response.data.data.posts,
              searchPagination: response.data.data.pagination,
              searchLoading: false,
            });
          } else {
            set({
              searchError: response.error || 'Failed to search posts',
              searchLoading: false,
            });
          }
        } catch (error) {
          set({
            searchError: 'An unexpected error occurred while searching posts',
            searchLoading: false,
          });
        }
      },

      loadMoreSearchResults: async (searchParams: SearchRequest) => {
        const { searchPagination, searchResults } = get();

        if (!searchPagination?.hasNextPage) {
          return;
        }

        set({ searchLoading: true, searchError: null });

        try {
          const nextPageParams = {
            ...searchParams,
            page: (searchPagination.page || 1) + 1,
          };

          const response = await searchService.searchPosts(nextPageParams);

          if (response.data) {
            set({
              searchResults: [...searchResults, ...response.data.data.posts],
              searchPagination: response.data.data.pagination,
              lastSearchParams: nextPageParams,
              searchLoading: false,
            });
          } else {
            set({
              searchError: response.error || 'Failed to load more search results',
              searchLoading: false,
            });
          }
        } catch (error) {
          set({
            searchError: 'An unexpected error occurred while loading more search results',
            searchLoading: false,
          });
        }
      },

      clearSearchResults: () => set({
        searchResults: [],
        searchPagination: null,
        lastSearchParams: null,
        searchError: null,
      }),

      clearSearchError: () => set({ searchError: null }),

      // Utility actions
      clearError: () => set({ error: null }),
      clearCommentsError: () => set({ commentsError: null }),
      clearLikesError: () => set({ likesError: null }),
      setLoading: (loading: boolean) => set({ loading }),
      setCommentsLoading: (loading: boolean) => set({ commentsLoading: loading }),
      setLikesLoading: (loading: boolean) => set({ likesLoading: loading }),
    }),
    {
      name: 'posts-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        likedPosts: Array.from(state.likedPosts), // Convert Set to Array for serialization
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.likedPosts)) {
          // Convert Array back to Set after rehydration
          state.likedPosts = new Set(state.likedPosts);
        }
      },
    }
  )
);
