/**
 * Search API Service
 * 
 * This service provides search functionality for posts using the Posts API
 * search endpoint. It uses axios for HTTP requests with proper
 * error handling, request/response interceptors, and TypeScript support.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { authService } from './auth';
import type {
  SearchRequest,
  SearchResponse,
  PostError,
  ApiResponse
} from '../types/posts';

/**
 * Search service class that handles all search-related API calls
 */
class SearchService {
  private api: AxiosInstance;

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: `${process.env.NEXT_PUBLIC_POST_SERVICE_URL}/api/posts`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token (optional for search)
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
      (response) => response,
      (error: AxiosError) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Token might be expired, but search can work without auth
          console.warn('Authentication token expired or invalid for search');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle successful API responses
   */
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError<PostError>): ApiResponse<never> {
    console.error('Search API Error:', error);

    if (error.response?.data) {
      return {
        error: error.response.data.error || 'Search request failed',
      };
    }

    if (error.code === 'ECONNABORTED') {
      return {
        error: 'Search request timed out. Please try again.',
      };
    }

    if (!error.response) {
      return {
        error: 'Network error. Please check your connection and try again.',
      };
    }

    return {
      error: 'An unexpected error occurred during search.',
    };
  }

  /**
   * Search posts with various filters
   * 
   * @param searchParams - Search parameters including tags, location, city, country, etc.
   * @returns Promise with search results
   */
  async searchPosts(searchParams: SearchRequest): Promise<ApiResponse<SearchResponse>> {
    try {
      // Validate that at least one search parameter is provided
      const { tags, location, city, country } = searchParams;
      if (!tags && !location && !city && !country) {
        return {
          error: 'At least one search parameter (tags, location, city, or country) must be provided.',
        };
      }

      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchParams.page) {
        params.append('page', searchParams.page.toString());
      }
      
      if (searchParams.limit) {
        params.append('limit', searchParams.limit.toString());
      }
      
      if (searchParams.tags) {
        if (Array.isArray(searchParams.tags)) {
          params.append('tags', JSON.stringify(searchParams.tags));
        } else {
          params.append('tags', searchParams.tags);
        }
      }
      
      if (searchParams.location) {
        params.append('location', searchParams.location);
      }
      
      if (searchParams.city) {
        params.append('city', searchParams.city);
      }
      
      if (searchParams.country) {
        params.append('country', searchParams.country);
      }
      
      if (searchParams.sortBy) {
        params.append('sortBy', searchParams.sortBy);
      }

      const response = await this.api.get<SearchResponse>(`/search?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<PostError>);
    }
  }

  /**
   * Search posts by tags only (convenience method)
   * 
   * @param tags - Array of tags or comma-separated string
   * @param page - Page number (optional)
   * @param limit - Posts per page (optional)
   * @param sortBy - Sort order (optional)
   * @returns Promise with search results
   */
  async searchByTags(
    tags: string[] | string,
    page = 1,
    limit = 20,
    sortBy: 'newest' | 'oldest' | 'popular' = 'newest'
  ): Promise<ApiResponse<SearchResponse>> {
    return this.searchPosts({ tags, page, limit, sortBy });
  }

  /**
   * Search posts by location only (convenience method)
   * 
   * @param location - Location name
   * @param page - Page number (optional)
   * @param limit - Posts per page (optional)
   * @param sortBy - Sort order (optional)
   * @returns Promise with search results
   */
  async searchByLocation(
    location: string,
    page = 1,
    limit = 20,
    sortBy: 'newest' | 'oldest' | 'popular' = 'newest'
  ): Promise<ApiResponse<SearchResponse>> {
    return this.searchPosts({ location, page, limit, sortBy });
  }

  /**
   * Search posts by city only (convenience method)
   * 
   * @param city - City name
   * @param page - Page number (optional)
   * @param limit - Posts per page (optional)
   * @param sortBy - Sort order (optional)
   * @returns Promise with search results
   */
  async searchByCity(
    city: string,
    page = 1,
    limit = 20,
    sortBy: 'newest' | 'oldest' | 'popular' = 'newest'
  ): Promise<ApiResponse<SearchResponse>> {
    return this.searchPosts({ city, page, limit, sortBy });
  }

  /**
   * Search posts by country only (convenience method)
   * 
   * @param country - Country name
   * @param page - Page number (optional)
   * @param limit - Posts per page (optional)
   * @param sortBy - Sort order (optional)
   * @returns Promise with search results
   */
  async searchByCountry(
    country: string,
    page = 1,
    limit = 20,
    sortBy: 'newest' | 'oldest' | 'popular' = 'newest'
  ): Promise<ApiResponse<SearchResponse>> {
    return this.searchPosts({ country, page, limit, sortBy });
  }
}

// Export singleton instance
export const searchService = new SearchService();
