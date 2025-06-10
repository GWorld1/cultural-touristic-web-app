/**
 * Profile Page Tests
 * 
 * Tests for the updated profile page functionality including
 * user posts loading and profile management.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the stores and contexts
jest.mock('../lib/stores/posts', () => ({
  usePostsStore: () => ({
    userPosts: [
      {
        $id: 'test-post-1',
        caption: 'Test post 1',
        likesCount: 10,
        commentsCount: 5,
        author: { name: 'Test User' },
        imageUrl: 'https://example.com/test1.jpg',
      },
      {
        $id: 'test-post-2',
        caption: 'Test post 2',
        likesCount: 20,
        commentsCount: 3,
        author: { name: 'Test User' },
        imageUrl: 'https://example.com/test2.jpg',
      },
    ],
    fetchUserPosts: jest.fn(),
    loading: false,
  }),
}));

jest.mock('../lib/contexts/auth', () => ({
  useAuth: () => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    },
    UserProfile: {
      name: 'Test User',
      email: 'test@example.com',
      bio: 'Test bio',
      phone: '+1234567890',
    },
    updateProfile: jest.fn(),
    isLoading: false,
    error: null,
    clearError: jest.fn(),
  }),
}));

// Mock PostFeed component
jest.mock('../components/posts/PostFeed', () => {
  return function MockPostFeed({ userId }: { userId?: string }) {
    return (
      <div data-testid="post-feed">
        <p>Posts for user: {userId}</p>
        <div>Test Post 1</div>
        <div>Test Post 2</div>
      </div>
    );
  };
});

// Mock Next.js Link
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock ProtectedRoute
jest.mock('../components/auth/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
});

// Mock Navigation
jest.mock('../components/navigation', () => {
  return function MockNavigation() {
    return <nav data-testid="navigation">Navigation</nav>;
  };
});

// Import the component after mocks
import ProfilePage from '../app/profile/page';

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user profile information correctly', async () => {
    render(<ProfilePage />);

    // Check if user name is displayed
    expect(screen.getByText('Test User')).toBeInTheDocument();
    
    // Check if email is displayed
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Check if bio is displayed
    expect(screen.getByText('Test bio')).toBeInTheDocument();
    
    // Check if phone is displayed
    expect(screen.getByText('📞 +1234567890')).toBeInTheDocument();
  });

  it('displays posts statistics correctly', async () => {
    render(<ProfilePage />);

    // Check if posts count is displayed (should be 2 from mock data)
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('posts')).toBeInTheDocument();
    
    // Check if total likes count is displayed (10 + 20 = 30)
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('likes')).toBeInTheDocument();
  });

  it('renders the PostFeed component with correct userId', async () => {
    render(<ProfilePage />);

    // Check if PostFeed is rendered
    const postFeed = screen.getByTestId('post-feed');
    expect(postFeed).toBeInTheDocument();
    
    // Check if PostFeed receives the correct userId
    expect(screen.getByText('Posts for user: test-user-id')).toBeInTheDocument();
  });

  it('shows edit profile button', async () => {
    render(<ProfilePage />);

    // Check if edit profile button is present
    const editButton = screen.getByText('Edit Profile');
    expect(editButton).toBeInTheDocument();
  });

  it('shows create new post link', async () => {
    render(<ProfilePage />);

    // Check if create new post link is present
    const createPostLink = screen.getByText('Create New Post');
    expect(createPostLink).toBeInTheDocument();
    expect(createPostLink.closest('a')).toHaveAttribute('href', '/upload');
  });

  it('displays posts section header', async () => {
    render(<ProfilePage />);

    // Check if posts section header is displayed
    expect(screen.getByText('Posts')).toBeInTheDocument();
  });

  it('does not show saved posts section', async () => {
    render(<ProfilePage />);

    // Ensure saved posts section is not present
    expect(screen.queryByText('SAVED')).not.toBeInTheDocument();
    expect(screen.queryByText('No saved posts')).not.toBeInTheDocument();
  });
});

describe('Profile Page Integration', () => {
  it('should integrate with posts store correctly', () => {
    const { usePostsStore } = require('../lib/stores/posts');
    const store = usePostsStore();
    
    expect(store.userPosts).toBeDefined();
    expect(store.fetchUserPosts).toBeDefined();
    expect(typeof store.fetchUserPosts).toBe('function');
  });

  it('should integrate with auth context correctly', () => {
    const { useAuth } = require('../lib/contexts/auth');
    const auth = useAuth();
    
    expect(auth.user).toBeDefined();
    expect(auth.UserProfile).toBeDefined();
    expect(auth.updateProfile).toBeDefined();
    expect(typeof auth.updateProfile).toBe('function');
  });
});
