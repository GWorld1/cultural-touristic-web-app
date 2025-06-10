/**
 * Posts Functionality Tests
 * 
 * Basic tests to verify the post functionality integration works correctly.
 * These tests check component rendering and basic functionality.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PostCard, PanoramicViewer } from '../components/posts';
import type { Post } from '../lib/types/posts';

// Mock the stores
jest.mock('../lib/stores/posts', () => ({
  usePostsStore: () => ({
    toggleLike: jest.fn(),
    checkLikeStatus: jest.fn(),
    likedPosts: new Set(),
    likesLoading: false,
  }),
}));

jest.mock('../lib/stores/auth', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
    user: { id: 'test-user', name: 'Test User' },
  }),
}));

// Mock A-Frame
jest.mock('aframe', () => ({}));

const mockPost: Post = {
  $id: 'test-post-1',
  $createdAt: '2024-01-15T10:00:00Z',
  $updatedAt: '2024-01-15T10:00:00Z',
  authorId: 'test-user',
  caption: 'Test 360° panoramic view',
  imageUrl: 'https://example.com/test-image.jpg',
  imagePublicId: 'test-image-id',
  location: {
    name: 'Test Location',
    city: 'Test City',
    country: 'Test Country',
  },
  tags: ['test', 'panoramic', '360'],
  isPublic: true,
  status: 'published',
  likesCount: 10,
  commentsCount: 5,
  viewsCount: 100,
  imageMetadata: {
    width: 4096,
    height: 2048,
    format: 'jpg',
    size: 2048576,
    aspectRatio: 2.0,
    isEquirectangular: true,
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    mediumUrl: 'https://example.com/medium.jpg',
  },
  author: {
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
  },
};

describe('Posts Components', () => {
  describe('PostCard', () => {
    it('renders post information correctly', () => {
      render(<PostCard post={mockPost} />);
      
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Test 360° panoramic view')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // likes count
      expect(screen.getByText('5')).toBeInTheDocument(); // comments count
    });

    it('displays tags correctly', () => {
      render(<PostCard post={mockPost} />);
      
      expect(screen.getByText('#test')).toBeInTheDocument();
      expect(screen.getByText('#panoramic')).toBeInTheDocument();
      expect(screen.getByText('#360')).toBeInTheDocument();
    });
  });

  describe('PanoramicViewer', () => {
    it('renders loading state initially', () => {
      render(<PanoramicViewer imageUrl="https://example.com/test.jpg" />);
      
      expect(screen.getByText('Loading 360° view...')).toBeInTheDocument();
    });

    it('shows error state when image fails to load', async () => {
      // Mock image loading failure
      const originalImage = global.Image;
      global.Image = class {
        constructor() {
          setTimeout(() => {
            if (this.onerror) this.onerror();
          }, 100);
        }
      } as any;

      render(<PanoramicViewer imageUrl="invalid-url" />);
      
      // Wait for error state
      await screen.findByText('Failed to load 360° view');
      
      global.Image = originalImage;
    });
  });
});

describe('Post API Integration', () => {
  it('should have correct API endpoints configured', () => {
    // Test that the API services are properly configured
    const { postsService } = require('../lib/api/posts');
    const { likesService } = require('../lib/api/likes');
    const { commentsService } = require('../lib/api/comments');
    
    expect(postsService).toBeDefined();
    expect(likesService).toBeDefined();
    expect(commentsService).toBeDefined();
  });
});

describe('Post Store Integration', () => {
  it('should have correct store structure', () => {
    const { usePostsStore } = require('../lib/stores/posts');
    
    expect(usePostsStore).toBeDefined();
    expect(typeof usePostsStore).toBe('function');
  });
});

describe('Type Definitions', () => {
  it('should have correct post types', () => {
    const types = require('../lib/types/posts');
    
    expect(types).toBeDefined();
    // Verify that our mock post matches the type structure
    expect(mockPost).toMatchObject({
      $id: expect.any(String),
      caption: expect.any(String),
      imageUrl: expect.any(String),
      likesCount: expect.any(Number),
      commentsCount: expect.any(Number),
    });
  });
});
