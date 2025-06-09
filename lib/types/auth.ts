/**
 * Authentication-related TypeScript type definitions
 * Based on the Authentication Service API documentation
 */

// Base User interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  bio?: string;
}

// Authentication request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  bio?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetCompleteRequest {
  userId: string;
  secret: string;
  password: string;
  passwordAgain: string;
}

export interface EmailVerificationRequest {
  userId: string;
  secret: string;
}

export interface LogoutRequest {
  sessionId: string;
}

// Authentication response types
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  sessionId: string;
}

export interface RegisterResponse {
  message: string;
  user: Pick<User, 'id' | 'email' | 'name'>;
}

export interface UserResponse {
  user: User;
}

export interface MessageResponse {
  message: string;
}

// Error response type
export interface AuthError {
  error: string;
  details?: string;
}

// Authentication state types
export interface AuthState {
  user: User | null;
  UserProfile: User | null;
  token: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Authentication store actions
export interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  completePasswordReset: (data: PasswordResetCompleteRequest) => Promise<boolean>;
  verifyEmail: (data: EmailVerificationRequest) => Promise<boolean>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuthStatus: () => Promise<void>;
}

// Combined auth store type
export type AuthStore = AuthState & AuthActions;

// API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Token payload interface (for JWT decoding if needed)
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
