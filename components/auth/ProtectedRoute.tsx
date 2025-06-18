/**
 * Protected Route Component
 * 
 * This component wraps other components and ensures that only authenticated
 * users can access them. It provides loading states and automatic redirects
 * for unauthenticated users.
 */

'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/contexts/auth';

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Loading component displayed while checking authentication
 */
const AuthLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>      
  </div>
);

/**
 * Protected Route Component
 * 
 * Renders children only if user is authenticated, otherwise redirects to login.
 * Shows loading state while authentication is being checked.
 * 
 * @param children - Components to render if authenticated
 * @param redirectTo - Path to redirect to if not authenticated (default: '/auth/login')
 * @param fallback - Custom loading component (optional)
 */
export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  fallback
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <AuthLoadingFallback />;
  }

  // Don't render anything if not authenticated (redirect is in progress)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}

export default ProtectedRoute;
