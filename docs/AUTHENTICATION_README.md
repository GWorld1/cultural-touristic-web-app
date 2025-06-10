# Authentication Implementation Guide

This document provides a comprehensive overview of the authentication system implemented for the Cultural Touristic Web Application.

## Overview

The authentication system provides secure user authentication and authorization functionality using:
- **Frontend**: Next.js 14+ with App Router and TypeScript
- **State Management**: Zustand for global authentication state
- **HTTP Client**: Axios with request/response interceptors
- **Backend Integration**: Ready for Appwrite integration (currently using mock API)
- **Route Protection**: Middleware-based route protection
- **Session Management**: JWT tokens with secure cookie storage

## Architecture

### Core Components

1. **Authentication Service** (`lib/api/auth.ts`)
   - Axios-based HTTP client with interceptors
   - Token management and automatic inclusion in requests
   - Comprehensive error handling
   - JSDoc documentation

2. **Authentication Store** (`lib/stores/auth.ts`)
   - Zustand store for global state management
   - Persistent authentication state across page refreshes
   - Actions for login, register, logout, profile management

3. **Authentication Context** (`lib/contexts/auth.tsx`)
   - React Context provider for easy access to auth state
   - Higher-order component for route protection
   - Automatic authentication status checking

4. **Protected Route Component** (`components/auth/ProtectedRoute.tsx`)
   - Component-level route protection
   - Loading states and automatic redirects
   - Customizable fallback components

5. **Middleware** (`middleware.ts`)
   - Next.js middleware for server-side route protection
   - Automatic redirects for unauthenticated users
   - Public route configuration

### Authentication Flow

1. **Registration**
   - User submits registration form
   - Client validates input and sends request to `/api/auth/register`
   - Server creates user account (currently mock, ready for Appwrite)
   - Success message displayed, email verification required

2. **Login**
   - User submits credentials
   - Client validates and sends request to `/api/auth/login`
   - Server validates credentials and returns JWT token + session ID
   - Tokens stored in secure cookies
   - User redirected to protected area

3. **Route Protection**
   - Middleware checks for valid tokens on protected routes
   - Unauthenticated users redirected to login
   - Authentication state maintained across page refreshes

4. **Logout**
   - Client sends logout request with session ID
   - Server invalidates session
   - Tokens cleared from cookies
   - User redirected to login page

## File Structure

```
lib/
├── api/
│   └── auth.ts                 # Authentication service
├── contexts/
│   └── auth.tsx               # Authentication context provider
├── stores/
│   └── auth.ts                # Zustand authentication store
└── types/
    └── auth.ts                # TypeScript type definitions

components/
└── auth/
    └── ProtectedRoute.tsx     # Protected route component

app/
├── auth/
│   ├── login/page.tsx         # Login page
│   ├── signup/page.tsx        # Registration page
│   └── forgot-password/page.tsx # Password reset page
└── api/
    └── auth/
        ├── health/route.ts    # Health check endpoint
        ├── login/route.ts     # Login endpoint
        ├── register/route.ts  # Registration endpoint
        ├── me/route.ts        # Current user endpoint
        ├── logout/route.ts    # Logout endpoint
        └── password/
            └── reset-request/route.ts # Password reset endpoint

middleware.ts                  # Next.js middleware for route protection
```

## Usage Examples

### Using Authentication in Components

```tsx
import { useAuth } from '@/lib/contexts/auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes with HOC

```tsx
import { withAuth } from '@/lib/contexts/auth';

function ProtectedPage() {
  return <div>This page requires authentication</div>;
}

export default withAuth(ProtectedPage);
```

### Protecting Routes with Component

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Page() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Using Authentication Service Directly

```tsx
import { authService } from '@/lib/api/auth';

async function handleLogin(email: string, password: string) {
  const response = await authService.login({ email, password });
  
  if (response.error) {
    console.error('Login failed:', response.error);
  } else {
    console.log('Login successful:', response.data);
  }
}
```

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables for production:

```env
# Appwrite Configuration
APPWRITE_ENDPOINT=your_appwrite_endpoint
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USERS_COLLECTION_ID=your_users_collection_id

# JWT Configuration
JWT_SECRET=your_jwt_secret

# Application Configuration
APP_URL=your_frontend_url
```

### Public Routes Configuration

Update `middleware.ts` to configure which routes don't require authentication:

```typescript
const publicRoutes = [
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  // Add more public routes as needed
];
```

## Security Features

1. **JWT Token Management**
   - Secure cookie storage with httpOnly, secure, and sameSite flags
   - Automatic token inclusion in API requests
   - Token expiration handling

2. **Request/Response Interceptors**
   - Automatic token refresh (ready for implementation)
   - Centralized error handling
   - Automatic logout on 401 responses

3. **Input Validation**
   - Client-side form validation
   - Server-side input sanitization
   - Email format validation
   - Password strength requirements

4. **Route Protection**
   - Server-side middleware protection
   - Client-side component protection
   - Automatic redirects for unauthenticated users

## Testing

### Demo Credentials

For testing the mock authentication:
- **Email**: demo@example.com
- **Password**: password123

### API Testing

Test the authentication endpoints:

```bash
# Health check
curl http://localhost:3000/api/auth/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

## Production Integration

To integrate with Appwrite in production:

1. **Update Authentication Service** (`lib/api/auth.ts`)
   - Replace mock API calls with Appwrite SDK calls
   - Implement proper JWT token validation
   - Add real session management

2. **Update API Routes** (`app/api/auth/*/route.ts`)
   - Replace mock implementations with Appwrite integration
   - Add proper error handling for Appwrite responses
   - Implement email verification and password reset flows

3. **Environment Configuration**
   - Set up Appwrite project and database
   - Configure environment variables
   - Set up email service for verification and password reset

## Troubleshooting

### Common Issues

1. **Authentication state not persisting**
   - Check if cookies are being set correctly
   - Verify middleware configuration
   - Check browser cookie settings

2. **Infinite redirect loops**
   - Verify public routes configuration in middleware
   - Check authentication status logic
   - Ensure proper token validation

3. **API requests failing**
   - Check network requests in browser dev tools
   - Verify API route implementations
   - Check CORS configuration if needed

### Debug Mode

Enable debug logging by adding console.log statements in:
- Authentication service methods
- Store actions
- Middleware logic
- API route handlers

## Next Steps

1. **Integrate with Appwrite**
   - Set up Appwrite project
   - Replace mock API implementations
   - Configure email services

2. **Add Advanced Features**
   - Two-factor authentication
   - Social login (Google, Facebook, etc.)
   - Role-based access control
   - Session management dashboard

3. **Enhance Security**
   - Implement rate limiting
   - Add CSRF protection
   - Set up security headers
   - Add audit logging

4. **Testing**
   - Write unit tests for authentication logic
   - Add integration tests for API routes
   - Set up end-to-end testing for auth flows
