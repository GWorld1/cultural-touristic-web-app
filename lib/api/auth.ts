/**
 * Authentication API Service
 * 
 * This service provides authentication functionality using the Authentication API
 * described in authServiceDoc.md. It uses axios for HTTP requests with proper
 * error handling, request/response interceptors, and TypeScript support.
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  PasswordResetRequest,
  PasswordResetCompleteRequest,
  EmailVerificationRequest,
  LogoutRequest,
  AuthResponse,
  RegisterResponse,
  UserResponse,
  MessageResponse,
  AuthError,
  ApiResponse,
  User
} from '../types/auth';

/**
 * Authentication service class that handles all authentication-related API calls
 */
class AuthService {
  private api: AxiosInstance;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly SESSION_KEY = 'session_id';

  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api/auth',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
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
      (error: AxiosError<AuthError>) => {
        // Handle 401 unauthorized responses
        if (error.response?.status === 401) {
          this.clearTokens();
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
   * Get stored authentication token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(this.TOKEN_KEY) || null;
  }

  /**
   * Get stored session ID
   */
  private getSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return Cookies.get(this.SESSION_KEY) || null;
  }

  /**
   * Store authentication tokens
   */
  private setTokens(token: string, sessionId: string): void {
    if (typeof window === 'undefined') return;
    
    // Set cookies with 24-hour expiration (matching JWT expiration)
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);
    
    Cookies.set(this.TOKEN_KEY, token, { expires, secure: false, sameSite: 'strict' });
    Cookies.set(this.SESSION_KEY, sessionId, { expires, secure: false, sameSite: 'strict' });
  }

  /**
   * Clear stored authentication tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    Cookies.remove(this.TOKEN_KEY);
    Cookies.remove(this.SESSION_KEY);
  }

  /**
   * Handle API response and extract data or error
   */
  private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return { data: response.data };
  }

  /**
   * Handle API errors and format them consistently
   */
  private handleError(error: AxiosError<AuthError>): ApiResponse<never> {
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
   * Check if authentication service is running
   */
  async healthCheck(): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.api.get<MessageResponse>('/health');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Register a new user account
   */
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await this.api.post<RegisterResponse>('/register', userData);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.api.post<AuthResponse>('/login', credentials);
      
      if (response.data.token && response.data.sessionId) {
        this.setTokens(response.data.token, response.data.sessionId);
      }
      
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    try {
      const response = await this.api.get<UserResponse>('/me');
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.api.put<MessageResponse>('/profile', data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<MessageResponse>> {
    try {
      const sessionId = this.getSessionId();
      if (!sessionId) {
        this.clearTokens();
        return { data: { message: 'Logged out successfully' } };
      }

      const response = await this.api.post<MessageResponse>('/logout', { sessionId });
      this.clearTokens();
      return this.handleResponse(response);
    } catch (error) {
      // Clear tokens even if logout request fails
      this.clearTokens();
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.api.post<MessageResponse>('/password/reset-request', { email });
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Complete password reset
   */
  async completePasswordReset(data: PasswordResetCompleteRequest): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.api.post<MessageResponse>('/password/reset-complete', data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(data: EmailVerificationRequest): Promise<ApiResponse<MessageResponse>> {
    try {
      const response = await this.api.post<MessageResponse>('/email/verify', data);
      return this.handleResponse(response);
    } catch (error) {
      return this.handleError(error as AxiosError<AuthError>);
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current authentication token
   */
  getAuthToken(): string | null {
    return this.getToken();
  }

  /**
   * Manually clear authentication state
   */
  clearAuth(): void {
    this.clearTokens();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
