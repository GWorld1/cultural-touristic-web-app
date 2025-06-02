// Client-side API functions
interface ApiResponse<T> {
    data?: T
    error?: string
  }
  
  class ApiClient {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
      try {
        const response = await fetch(`/api${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          return { error: data.error || "An error occurred" }
        }
  
        return { data }
      } catch (error) {
        return { error: "Network error" }
      }
    }
  
    // Auth
    async login(email: string, password: string) {
      return this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
    }
  
    async signup(username: string, email: string, password: string, fullName?: string) {
      return this.request("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password, fullName }),
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
      return this.request("/users/me")
    }
  
    async updateProfile(fullName: string, bio: string) {
      return this.request("/users/me", {
        method: "PUT",
        body: JSON.stringify({ full_name: fullName, bio }),
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
  