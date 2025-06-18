/**
 * Create Post Component
 * 
 * This component provides a form for creating new 360° posts with
 * image upload, caption, location, and tags. It integrates with the
 * existing upload page and follows the app's design patterns.
 */

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, MapPin, Tag, Eye, EyeOff, Loader2 } from 'lucide-react';
import { usePostsStore } from '../../lib/stores/posts';
import { useAuthStore } from '../../lib/stores/auth';
import { useRouter } from 'next/navigation';
import PanoramicViewer from './PanoramicViewer';
import type { Location } from '../../lib/types/posts';

interface CreatePostProps {
  className?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Create Post Component
 */
export const CreatePost: React.FC<CreatePostProps> = ({
  className = '',
  onSuccess,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationName, setLocationName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { createPost, error: storeError } = usePostsStore();
  const { isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors({ file: error });
      return;
    }

    setSelectedFile(file);
    setErrors({ ...errors, file: '' });

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    console.log('Selected file:', file);
    console.log('Preview URL:', url);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      
      if (tag && !tags.includes(tag) && tags.length < 10) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleLocationAdd = () => {
    if (locationName.trim()) {
      setLocation({ name: locationName.trim() });
      setLocationName('');
    }
  };

  const handleLocationRemove = () => {
    setLocation(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedFile) {
      newErrors.file = 'Please select a 360° panoramic image';
    }

    if (!caption.trim()) {
      newErrors.caption = 'Caption is required';
    } else if (caption.length > 2000) {
      newErrors.caption = 'Caption must be less than 2000 characters';
    }

    if (tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedFile) return;

    setIsSubmitting(true);

    try {
      const success = await createPost({
        image: selectedFile,
        caption: caption.trim(),
        location: location || undefined,
        tags: tags.length > 0 ? tags : undefined,
        isPublic,
      });

      if (success) {
        // Reset form
        handleRemoveFile();
        setCaption('');
        setLocation(null);
        setTags([]);
        setIsPublic(true);
        setErrors({});

        onSuccess?.();
        router.push('/'); // Redirect to home page
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={`max-w-2xl mx-auto bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Share Your 360° Experience
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              360° Panoramic Image *
            </label>
            
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Click to upload your 360° panoramic image
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG up to 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <PanoramicViewer
                    imageUrl={previewUrl!}
                    height="300px"
                    showControls={true}
                    className="rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
            <img src={previewUrl ? previewUrl : ""}/>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption *
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your 360° experience..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              {errors.caption && (
                <p className="text-red-500 text-sm">{errors.caption}</p>
              )}
              <p className="text-sm text-gray-500 ml-auto">
                {caption.length}/2000
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            
            {!location ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Add location..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleLocationAdd())}
                />
                <button
                  type="button"
                  onClick={handleLocationAdd}
                  disabled={!locationName.trim()}
                  className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-900">{location.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLocationRemove}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tags (press Enter or comma to add)..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={tags.length >= 10}
              />
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {errors.tags && (
                <p className="text-red-500 text-sm">{errors.tags}</p>
              )}
              
              <p className="text-sm text-gray-500">
                {tags.length}/10 tags
              </p>
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsPublic(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  isPublic
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Public</span>
              </button>
              
              <button
                type="button"
                onClick={() => setIsPublic(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  !isPublic
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <EyeOff className="w-4 h-4" />
                <span>Private</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {storeError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{storeError}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile || !caption.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Post...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Share Experience</span>
                </>
              )}
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
