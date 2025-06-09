import { UserProfile } from './../database/schema';
/**
 * Authentication Store using Zustand
 * 
 * This store manages global authentication state including user data,
 * authentication status, loading states, and authentication actions.
 * It persists authentication state across page refreshes.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../api/auth';
import type {
  AuthStore,
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  PasswordResetCompleteRequest,
  EmailVerificationRequest
} from '../types/auth';

/**
 * Authentication store implementation
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      UserProfile: null,
      token: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login user with email and password
       */
      login: async (credentials: LoginRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.login(credentials);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          if (response.data) {
            set({
              user: response.data.user,
              token: response.data.token,
              sessionId: response.data.sessionId,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return true;
          }

          set({ error: 'Login failed', isLoading: false });
          return false;
        } catch (error) {
          set({ 
            error: `An unexpected error occurred during login: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Register new user account
       */
      register: async (userData: RegisterRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.register(userData);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          if (response.data) {
            set({ 
              isLoading: false, 
              error: null 
            });
            return true;
          }

          set({ error: 'Registration failed', isLoading: false });
          return false;
        } catch (error) {
          set({ 
            error: `An unexpected error occurred during registration: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Logout current user
       */
      logout: async (): Promise<void> => {
        set({ isLoading: true });

        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state regardless of API response
          set({
            user: null,
            token: null,
            sessionId: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      /**
       * Get current user data
       */
      getCurrentUser: async (): Promise<void> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.getCurrentUser();
          
          if (response.error) {
            // If unauthorized, clear auth state
            if (response.error.includes('Unauthorized') || response.error.includes('401')) {
              set({
                user: null,
                token: null,
                sessionId: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
              });
            } else {
              set({ error: response.error, isLoading: false });
            }
            return;
          }

          if (response.data) {
            set({
              user: response.data.user,
              UserProfile: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          set({ 
            error: `Failed to get user data: ${error}`, 
            isLoading: false 
          });
        }
      },

      /**
       * Update user profile
       */
      updateProfile: async (data: UpdateProfileRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.updateProfile(data);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          // Refresh user data after successful update
          await get().getCurrentUser();
          return true;
        } catch (error) {
          set({ 
            error: `Failed to update profile: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Request password reset
       */
      requestPasswordReset: async (email: string): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.requestPasswordReset(email);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          set({ isLoading: false, error: null });
          return true;
        } catch (error) {
          set({ 
            error: `Failed to request password reset: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Complete password reset
       */
      completePasswordReset: async (data: PasswordResetCompleteRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.completePasswordReset(data);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          set({ isLoading: false, error: null });
          return true;
        } catch (error) {
          set({ 
            error: `Failed to reset password: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Verify email address
       */
      verifyEmail: async (data: EmailVerificationRequest): Promise<boolean> => {
        set({ isLoading: true, error: null });

        try {
          const response = await authService.verifyEmail(data);
          
          if (response.error) {
            set({ error: response.error, isLoading: false });
            return false;
          }

          set({ isLoading: false, error: null });
          return true;
        } catch (error) {
          set({ 
            error: `Failed to verify email: ${error}`, 
            isLoading: false 
          });
          return false;
        }
      },

      /**
       * Clear error state
       */
      clearError: (): void => {
        set({ error: null });
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean): void => {
        set({ isLoading: loading });
      },

      /**
       * Check authentication status on app initialization
       */
      checkAuthStatus: async (): Promise<void> => {
        const currentState = get();

        // Prevent multiple simultaneous auth checks
        if (currentState.isLoading) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          if (authService.isAuthenticated()) {
            await get().getCurrentUser();
          } else {
            set({
              user: null,
              token: null,
              sessionId: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        } catch (err) {
          console.error('Auth status check failed:', err);
          set({
            user: null,
            token: null,
            sessionId: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to check authentication status'
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist essential data, not sensitive tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;
