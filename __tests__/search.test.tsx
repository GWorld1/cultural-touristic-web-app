/**
 * Search functionality tests
 */

import { searchService } from '../lib/api/search';
import { SearchRequest } from '../lib/types/posts';

// Mock the auth service
jest.mock('../lib/api/auth', () => ({
  authService: {
    getAuthToken: jest.fn(() => 'mock-token'),
  },
}));

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  })),
}));

describe('Search Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchPosts', () => {
    it('should validate that at least one search parameter is provided', async () => {
      const emptyParams: SearchRequest = {};
      const result = await searchService.searchPosts(emptyParams);
      
      expect(result.error).toBe(
        'At least one search parameter (tags, location, city, or country) must be provided.'
      );
    });

    it('should accept tags as array', async () => {
      const params: SearchRequest = {
        tags: ['nature', 'adventure'],
        page: 1,
        limit: 10,
      };

      // Mock successful response
      const mockResponse = {
        data: {
          success: true,
          data: {
            posts: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
            searchParams: params,
          },
        },
      };

      const mockAxios = require('axios');
      const mockInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      mockAxios.create.mockReturnValue(mockInstance);

      // Create new instance to use mocked axios
      const { searchService: newSearchService } = require('../lib/api/search');
      const result = await newSearchService.searchPosts(params);

      expect(result.data).toBeDefined();
      expect(mockInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/search?')
      );
    });

    it('should accept tags as comma-separated string', async () => {
      const params: SearchRequest = {
        tags: 'nature,adventure',
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            posts: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
            searchParams: params,
          },
        },
      };

      const mockAxios = require('axios');
      const mockInstance = {
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      mockAxios.create.mockReturnValue(mockInstance);

      const { searchService: newSearchService } = require('../lib/api/search');
      const result = await newSearchService.searchPosts(params);

      expect(result.data).toBeDefined();
      expect(mockInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('tags=nature%2Cadventure')
      );
    });
  });

  describe('convenience methods', () => {
    it('should have searchByTags method', () => {
      expect(typeof searchService.searchByTags).toBe('function');
    });

    it('should have searchByLocation method', () => {
      expect(typeof searchService.searchByLocation).toBe('function');
    });

    it('should have searchByCity method', () => {
      expect(typeof searchService.searchByCity).toBe('function');
    });

    it('should have searchByCountry method', () => {
      expect(typeof searchService.searchByCountry).toBe('function');
    });
  });
});

describe('Search Components', () => {
  it('should have SearchFilters component', () => {
    const SearchFilters = require('../components/search/SearchFilters').default;
    expect(SearchFilters).toBeDefined();
  });

  it('should have SearchResults component', () => {
    const SearchResults = require('../components/search/SearchResults').default;
    expect(SearchResults).toBeDefined();
  });
});

describe('Posts Store Search Integration', () => {
  it('should have search actions in posts store', () => {
    // This test verifies that the store has the required search methods
    const storeModule = require('../lib/stores/posts');
    expect(storeModule.usePostsStore).toBeDefined();
    
    // Note: We can't easily test the store methods without setting up the full Zustand environment
    // This is more of a smoke test to ensure the module loads correctly
  });
});
