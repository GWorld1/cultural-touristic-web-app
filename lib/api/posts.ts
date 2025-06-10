/**
 * Posts API Service
 * 
 * This service provides post functionality using the Posts API
 * described in POST_API_ENDPOINTS.md. It uses axios for HTTP requests with proper
 * error handling, request/response interceptors, and TypeScript support.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
  PostResponse,
  PostsResponse,
  PostError,
  ApiResponse,
  Pagination
} from '../types/posts';

/**
 * Posts service class that handles all post-related API calls
 */
class PostsService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api/posts',
      timeout: 30000, // Longer timeout for file uploads
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
   * Create a new post
   */
  async createPost(postData: CreatePostRequest): Promise<ApiResponse<PostResponse>> {
    try {
      const formData = new FormData();
      formData.append('image', postData.image);
      formData.append('caption', postData.caption);
      
      if (postData.location) {
        formData.append('location', JSON.stringify(postData.location));
      }
      
      if (postData.tags && postData.tags.length > 0) {
        formData.append('tags', JSON.stringify(postData.tags));
      }
      
      if (postData.isPublic !== undefined) {
        formData.append('isPublic', postData.isPublic.toString());
      }

      const response = await this.api.post<PostResponse>('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get posts feed with pagination
   */
  async getPosts(page = 1, limit = 20, userId?: string): Promise<ApiResponse<PostsResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await this.api.get<PostsResponse>(`/?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get a single post by ID
   */
  async getPost(postId: string): Promise<ApiResponse<PostResponse>> {
    try {
      const response = await this.api.get<PostResponse>(`/${postId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Update a post
   */
  async updatePost(postId: string, postData: UpdatePostRequest): Promise<ApiResponse<PostResponse>> {
    try {
      const response = await this.api.put<PostResponse>(`/${postId}`, postData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.delete<{ message: string }>(`/${postId}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Get posts by user ID
   */
  async getUserPosts(userId: string, page = 1, limit = 20): Promise<ApiResponse<PostsResponse>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await this.api.get<PostsResponse>(`/user/${userId}?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }
}

// Export singleton instance
export const postsService = new PostsService();
export default postsService;
