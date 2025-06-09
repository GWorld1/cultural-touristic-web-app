// Client-side API functions
import Cookies from 'js-cookie';

interface ApiResponse<T> {
    data?: T
    error?: string
  }

  class ApiClient {
    private getAuthToken(): string | null {
      return Cookies.get('auth_token') || null;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
      try {
        const token = this.getAuthToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`/api${endpoint}`, {
          headers,
          ...options,
        })

        const data = await response.json()

        if (!response.ok) {
          // Handle 401 unauthorized responses
          if (response.status === 401) {
            // Clear auth token and redirect to login
            Cookies.remove('auth_token');
            Cookies.remove('session_id');
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
              window.location.href = '/auth/login';
            }
          }
          return { error: data.error || "An error occurred" }
        }

        return { data }
      } catch (error) {
        return { error: "Network error" }
      }
    }
  
    // Auth - Note: These methods are now handled by the authService
    // Keeping for backward compatibility, but recommend using authService directly
    async login(email: string, password: string) {
      return this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    }

    async signup(name: string, email: string, password: string, phone?: string) {
      return this.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, phone }),
      })
    }
  
    // Posts
    async getPosts(limit = 20, offset = 0) {
      return this.request(`/posts?limit=${limit}&offset=${offset}`)
    }
  
    async getPost(id: string) {
      return this.request(`/posts/${id}`)
    }
  
    async createPost(imageUrl: string, caption: string, location: string) {
      return this.request("/posts", {
        method: "POST",
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          location,
        }),
      })
    }
  
    async toggleLike(postId: string) {
      return this.request(`/posts/${postId}/like`, {
        method: "POST",
      })
    }
  
    async toggleSave(postId: string) {
      return this.request(`/posts/${postId}/save`, {
        method: "POST",
      })
    }
  
    async addComment(postId: string, text: string) {
      return this.request(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ text }),
      })
    }
  
    // Users
    async getCurrentUser() {
      return this.request("/auth/me")
    }

    async updateProfile(fullName: string, bio: string) {
      return this.request("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({ name: fullName, bio }),
      })
    }
  
    async getUserByUsername(username: string) {
      return this.request(`/users/${username}`)
    }
  
    // Search
    async search(query: string, type = "all") {
      return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`)
    }
  }
  
  export const apiClient = new ApiClient()
  