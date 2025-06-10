"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search } from "lucide-react"
import { SearchRequest } from "@/lib/types/posts"

interface SearchFiltersProps {
  onSearch: (params: SearchRequest) => void
  loading?: boolean
  initialParams?: SearchRequest
}

export default function SearchFilters({ onSearch, loading = false, initialParams }: SearchFiltersProps) {
  const [tags, setTags] = useState<string[]>(
    Array.isArray(initialParams?.tags) ? initialParams.tags : 
    typeof initialParams?.tags === 'string' ? initialParams.tags.split(',').map(t => t.trim()) : []
  )
  const [tagInput, setTagInput] = useState("")
  const [location, setLocation] = useState(initialParams?.location || "")
  const [city, setCity] = useState(initialParams?.city || "")
  const [country, setCountry] = useState(initialParams?.country || "")
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>(initialParams?.sortBy || 'newest')

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSearch = () => {
    // Validate that at least one search parameter is provided
    if (!tags.length && !location.trim() && !city.trim() && !country.trim()) {
      return
    }

    const searchParams: SearchRequest = {
      page: 1,
      limit: 20,
      sortBy,
    }

    if (tags.length > 0) {
      searchParams.tags = tags
    }
    if (location.trim()) {
      searchParams.location = location.trim()
    }
    if (city.trim()) {
      searchParams.city = city.trim()
    }
    if (country.trim()) {
      searchParams.country = country.trim()
    }

    onSearch(searchParams)
  }

  const handleClear = () => {
    setTags([])
    setTagInput("")
    setLocation("")
    setCity("")
    setCountry("")
    setSortBy('newest')
  }

  const hasFilters = tags.length > 0 || location.trim() || city.trim() || country.trim()

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-primary-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-secondary-800">Search Filters</h3>
      </div>

      {/* Tags Input */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium text-secondary-700">
          Tags
        </Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            placeholder="Enter a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Location Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-secondary-700">
            Location
          </Label>
          <Input
            id="location"
            placeholder="e.g., Mount Cameroon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-secondary-700">
            City
          </Label>
          <Input
            id="city"
            placeholder="e.g., Buea"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-medium text-secondary-700">
            Country
          </Label>
          <Input
            id="country"
            placeholder="e.g., Cameroon"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <Label htmlFor="sortBy" className="text-sm font-medium text-secondary-700">
          Sort By
        </Label>
        <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest' | 'popular') => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSearch}
          disabled={loading || !hasFilters}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          {loading ? 'Searching...' : 'Search Posts'}
        </Button>
        
        {hasFilters && (
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={loading}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {!hasFilters && (
        <p className="text-sm text-secondary-500 mt-2">
          Please enter at least one search criteria (tags, location, city, or country).
        </p>
      )}
    </div>
  )
}
