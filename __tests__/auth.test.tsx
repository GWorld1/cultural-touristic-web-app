import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../lib/contexts/auth';
import { useAuthStore } from '../lib/stores/auth';

// Mock the auth store
jest.mock('../lib/stores/auth', () => ({
  useAuthStore: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn()
  })
}));

describe('Authentication', () => {
  // Helper component to test authentication hooks
  const TestComponent = () => {
    const { isAuthenticated, user, login } = useAuth();
    return (
      <div>
        <div data-testid="auth-status">
          {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        </div>
        {user && <div data-testid="user-email">{user.email}</div>}
        <button
          onClick={() => login({ email: 'test@example.com', password: 'password123' })}
          data-testid="login-button"
        >
          Login
        </button>
      </div>
    );
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn()
    }));
  });

  test('renders authentication status correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });

  test('shows authenticated state when user is logged in', () => {
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      isAuthenticated: true,
      user: { email: 'test@example.com', name: 'Test User' },
      token: 'fake-token',
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn()
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  test('handles login attempt', async () => {
    const mockLogin = jest.fn().mockResolvedValue(true);
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn()
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('displays loading state during authentication', () => {
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: true,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn()
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toBeInTheDocument();
  });

  test('handles login errors', async () => {
    const mockLogin = jest.fn().mockResolvedValue(false);
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: 'Invalid credentials',
      login: mockLogin,
      logout: jest.fn(),
      register: jest.fn(),
      checkAuthStatus: jest.fn()
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    expect(mockLogin).toHaveBeenCalled();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });
});