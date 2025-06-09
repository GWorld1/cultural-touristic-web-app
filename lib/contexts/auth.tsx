/**
 * Authentication Context Provider
 * 
 * This context provider wraps the application and provides authentication
 * state and methods to all child components. It handles initialization
 * of authentication state and provides a convenient way to access auth
 * functionality throughout the app.
 */

'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../stores/auth';
import type { AuthStore } from '../types/auth';

// Create the authentication context
const AuthContext = createContext<AuthStore | null>(null);

/**
 * Props for the AuthProvider component
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication Provider Component
 * 
 * Wraps the application and provides authentication context to all child components.
 * Automatically checks authentication status on mount and handles initialization.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const authStore = useAuthStore();

  useEffect(() => {
    // Check authentication status when the app initializes
    // Only run once on mount
    authStore.checkAuthStatus();
  }, []); // Empty dependency array to run only once

  return (
    <AuthContext.Provider value={authStore}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 * 
 * Provides easy access to authentication state and methods from any component.
 * Throws an error if used outside of AuthProvider.
 * 
 * @returns Authentication store with state and methods
 */
export function useAuth(): AuthStore {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Higher-order component for protecting routes
 * 
 * Wraps a component and ensures the user is authenticated before rendering.
 * Redirects to login page if user is not authenticated.
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        // Redirect to login page if not authenticated
        window.location.href = '/auth/login';
      }
    }, [isAuthenticated, isLoading]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 border border-primary-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="text-secondary-700">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    // Don't render the component if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
}

export default AuthProvider;
