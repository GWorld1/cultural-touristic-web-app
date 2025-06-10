"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import Navigation from "@/components/navigation"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import SearchFilters from "@/components/search/SearchFilters"
import SearchResults from "@/components/search/SearchResults"
import { usePostsStore } from "@/lib/stores/posts"
import { SearchRequest, Post } from "@/lib/types/posts"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  // Store state
  const {
    searchResults,
    searchLoading,
    searchError,
    searchPagination,
    lastSearchParams,
    searchPosts,
    loadMoreSearchResults,
  } = usePostsStore()

  // Local state
  const [showFilters] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)

  // Handle search
  const handleSearch = async (searchParams: SearchRequest) => {
    setHasSearched(true)
    await searchPosts(searchParams)
  }

  // Handle load more
  const handleLoadMore = async () => {
    if (lastSearchParams) {
      await loadMoreSearchResults(lastSearchParams)
    }
  }

  // Handle post click
  const handlePostClick = (post: Post) => {
    // TODO: Navigate to post detail page
    console.log('Post clicked:', post.$id)
  }

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery.trim()) {
      const searchParams: SearchRequest = {
        tags: [initialQuery.trim()],
        page: 1,
        limit: 20,
        sortBy: 'newest'
      }
      handleSearch(searchParams)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-6xl mx-auto py-6 px-4 pb-20 md:pb-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Search Posts</h1>
          <p className="text-secondary-600">
            Discover amazing 360° cultural and touristic experiences from around the world.
          </p>
        </div>

        {/* Search Filters */}
        {showFilters && (
          <div className="mb-8">
            <SearchFilters
              onSearch={handleSearch}
              loading={searchLoading}
              initialParams={lastSearchParams || undefined}
            />
          </div>
        )}

        {/* Search Error */}
        {searchError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              <strong>Error:</strong> {searchError}
            </p>
          </div>
        )}

        {/* Search Results or Welcome Message */}
        {hasSearched ? (
          <SearchResults
            posts={searchResults}
            loading={searchLoading}
            pagination={searchPagination}
            onLoadMore={handleLoadMore}
            onPostClick={handlePostClick}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <Search className="h-16 w-16 text-primary-400" />
            </div>
            <h2 className="text-2xl font-semibold text-secondary-800 mb-4">
              Discover Amazing Places
            </h2>
            <p className="text-secondary-600 max-w-md mx-auto mb-8">
              Use the search filters above to find 360° posts by tags, location, city, or country.
              Explore cultural and touristic experiences from around the world.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: "Nature", icon: "🌿" },
                { label: "Culture", icon: "🏛️" },
                { label: "Adventure", icon: "🏔️" },
                { label: "Beach", icon: "🏖️" },
              ].map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => handleSearch({ tags: [suggestion.label.toLowerCase()], page: 1, limit: 20 })}
                  className="p-4 bg-white/90 backdrop-blur-sm border border-primary-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {suggestion.icon}
                  </div>
                  <p className="text-sm font-medium text-secondary-700">
                    {suggestion.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchPageContent />
    </ProtectedRoute>
  )
}
