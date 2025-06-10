/**
 * Comments API Service
 * 
 * This service provides comment functionality for posts using the Posts API
 * described in POST_API_ENDPOINTS.md. It uses axios for HTTP requests with proper
 * error handling, request/response interceptors, and TypeScript support.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentResponse,
  CommentsResponse,
  PostError,
  ApiResponse
} from '../types/posts';

/**
 * Comments service class that handles all comment-related API calls
 */
class CommentsService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api/posts',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = authService.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<PostError>) => {
        // Handle 401 unauthorized responses
        if (error.response?.status === 401) {
          authService.clearAuth();
          // Redirect to login page if not already there
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle successful API responses
   */
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return { data: response.data };
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError<PostError>): ApiResponse<never> {
    if (error.response?.data?.error) {
      return { error: error.response.data.error };
    }
    
    if (error.code === 'ECONNABORTED') {
      return { error: 'Request timeout. Please try again.' };
    }
    
    if (!error.response) {
      return { error: 'Network error. Please check your connection.' };
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, commentData: CreateCommentRequest): Promise<ApiResponse<CommentResponse>> {
    try {
      const response = await this.api.post<CommentResponse>(`/${postId}/comments`, commentData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get comments for a post with pagination
   */
  async getComments(postId: string, page = 1, limit = 20, includeReplies = false): Promise<ApiResponse<CommentsResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        includeReplies: includeReplies.toString(),
      });

      const response = await this.api.get<CommentsResponse>(`/${postId}/comments?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Update a comment
   */
  async updateComment(postId: string, commentId: string, commentData: UpdateCommentRequest): Promise<ApiResponse<CommentResponse>> {
    try {
      const response = await this.api.put<CommentResponse>(`/${postId}/comments/${commentId}`, commentData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(postId: string, commentId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.delete<{ message: string }>(`/${postId}/comments/${commentId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get replies for a comment
   */
  async getCommentReplies(postId: string, commentId: string, page = 1, limit = 20): Promise<ApiResponse<CommentsResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await this.api.get<CommentsResponse>(`/${postId}/comments/${commentId}/replies?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }
}

// Export singleton instance
export const commentsService = new CommentsService();
export default commentsService;
