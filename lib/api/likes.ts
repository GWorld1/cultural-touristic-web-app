/**
 * Likes API Service
 * 
 * This service provides like functionality for posts using the Posts API
 * described in POST_API_ENDPOINTS.md. It uses axios for HTTP requests with proper
 * error handling, request/response interceptors, and TypeScript support.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';
import type {
  LikeResponse,
  LikesResponse,
  LikeStatusResponse,
  LikeStatsResponse,
  PostError,
  ApiResponse
} from '../types/posts';

/**
 * Likes service class that handles all like-related API calls
 */
class LikesService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_LIKE_SERVICE_URL}/api/posts`,
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
   * Toggle like status for a post
   */
  async toggleLike(postId: string): Promise<ApiResponse<LikeResponse>> {
    try {
      const response = await this.api.post<LikeResponse>(`/${postId}/likes`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Check if user has liked a post
   */
  async checkLikeStatus(postId: string): Promise<ApiResponse<LikeStatusResponse>> {
    try {
      const response = await this.api.get<LikeStatusResponse>(`/${postId}/likes/check`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get likes for a post with pagination
   */
  async getPostLikes(postId: string, page = 1, limit = 20): Promise<ApiResponse<LikesResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await this.api.get<LikesResponse>(`/${postId}/likes?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get like statistics for a post
   */
  async getLikeStats(postId: string): Promise<ApiResponse<LikeStatsResponse>> {
    try {
      const response = await this.api.get<LikeStatsResponse>(`/${postId}/likes/stats`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get posts liked by a user
   */
  async getUserLikedPosts(userId: string, page = 1, limit = 20): Promise<ApiResponse<LikesResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await this.api.get(`/users/${userId}/likes?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }
}

// Export singleton instance
export const likesService = new LikesService();
export default likesService;
