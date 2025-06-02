"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { X, MapPin, PaletteIcon as Panorama } from "lucide-react"
import Navigation from "@/components/navigation"
import { apiClient } from "@/lib/api-client"

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [caption, setCaption] = useState("")
  const [location, setLocation] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage || !caption.trim() || !location.trim()) {
      alert("Please fill in all fields")
      return
    }

    setIsUploading(true)

    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In production, you would upload the image to cloud storage first
    const response = await apiClient.createPost(selectedImage, caption, location)

    if (response.data) {
      // Reset form
      setSelectedImage(null)
      setCaption("")
      setLocation("")
      setIsUploading(false)

      // Navigate back to home
      router.push("/")
    } else {
      setIsUploading(false)
      alert("Failed to upload post")
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <Navigation />

      <main className="max-w-2xl mx-auto py-6 px-4 pb-20 md:pb-6">
        <Card className="bg-white/90 backdrop-blur-sm border-primary-100 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-secondary-800 flex items-center justify-center gap-2">
              <Panorama className="h-6 w-6 text-primary-600" />
              Share Your Panoramic View
            </CardTitle>
            <p className="text-center text-secondary-600 text-sm">Upload only panoramic images (360° views)</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Panoramic Image Upload */}
            <div className="space-y-4">
              {!selectedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-primary-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-400 transition-colors bg-primary-50/50"
                >
                  <Panorama className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                  <p className="text-secondary-700 font-semibold">Click to upload panoramic image</p>
                  <p className="text-secondary-500 text-sm mt-2">Only 360° panoramic tourism photos accepted</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-[2/1] rounded-lg overflow-hidden">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected panoramic image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-md">
                      <Panorama className="h-4 w-4" />
                      360° View
                    </div>
                  </div>
                  <Button
                    onClick={removeImage}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <label className="text-secondary-800 font-semibold">Caption *</label>
              <Textarea
                placeholder="Describe your panoramic view..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="bg-white border-primary-200 focus:border-primary-400 resize-none"
                rows={3}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-secondary-800 font-semibold flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary-600" />
                Location *
              </label>
              <Input
                placeholder="Where was this taken?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white border-primary-200 focus:border-primary-400"
                required
              />
            </div>

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedImage || !caption.trim() || !location.trim() || isUploading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 shadow-lg"
            >
              {isUploading ? "Uploading..." : "Share Panoramic Post"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
