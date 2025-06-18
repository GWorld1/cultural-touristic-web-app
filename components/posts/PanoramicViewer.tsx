/**
 * 360° Panoramic Viewer Component
 * 
 * This component provides 360-degree panoramic image viewing using A-Frame.
 * It follows the implementation examples from FRONTEND_INTEGRATION_EXAMPLES.md
 * and integrates with the existing cultural-touristic app architecture.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface PanoramicViewerProps {
  imageUrl: string;
  alt?: string;
  className?: string;
  height?: string;
  autoRotate?: boolean;
  showControls?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 360° Panoramic Viewer Component using A-Frame
 */
export const PanoramicViewer: React.FC<PanoramicViewerProps> = ({
  imageUrl,
  className = '',
  height = '400px',
  autoRotate = false,
  showControls = true,
  onLoad,
  onError,
}) => {
  const sceneRef = useRef<HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [aframeLoaded, setAframeLoaded] = useState(false);

  // Load A-Frame dynamically on client side
  useEffect(() => {
    const loadAFrame = async () => {
      try {
        // Check if A-Frame is already loaded
        if (typeof window !== 'undefined' && (window).AFRAME) {
          setAframeLoaded(true);
          return;
        }

        // Dynamically import A-Frame
        await import('aframe');
        setAframeLoaded(true);
      } catch (error) {
        console.error('Failed to load A-Frame:', error);
        setHasError(true);
        onError?.(error as Error);
      }
    };

    loadAFrame();
  }, [onError]);

  // Handle image loading
  useEffect(() => {
    if (!aframeLoaded || !imageUrl) return;

    const handleImageLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };

    const handleImageError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.(new Error('Failed to load panoramic image'));
    };

    // Create a temporary image to check if the URL is valid
    const img = new Image();
    img.onload = handleImageLoad;
    img.onerror = handleImageError;
   
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, aframeLoaded, onLoad, onError]);

  // Handle fullscreen toggle
  const toggleFullscreen = async () => {
    if (!sceneRef.current) return;

    try {
      if (!isFullscreen) {
        if (sceneRef.current.requestFullscreen) {
          await sceneRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen not supported or failed:', error);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Show loading state
  if (!aframeLoaded || isLoading) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-500" />
            <p className="text-sm text-gray-500">Loading 360° view...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div 
        className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
        style={{ height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl text-gray-500">📷</span>
            </div>
            <p className="text-sm text-gray-500">Failed to load 360° view</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* A-Frame Scene */}
      <a-scene
        ref={sceneRef}
        embedded
        style={{ 
          height: '100%', 
          width: '100%',
          display: 'block'
        }}
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        {/* 360° Sky */}
        <a-sky 
          src={imageUrl} 
          rotation="0 -130 0"
          animation={autoRotate ? "property: rotation; to: 0 230 0; loop: true; dur: 20000" : undefined}
        />
        
        {/* Camera with cursor */}
        <a-camera>
          <a-cursor 
            color="white"
            opacity="0.8"
            scale="0.5 0.5 0.5"
            animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; to: 0.3 0.3 0.3"
            animation__fusing="property: scale; startEvents: fusing; easing: easeInCubic; dur: 1500; to: 0.1 0.1 0.1"
            animation__mouseleave="property: scale; startEvents: mouseleave; easing: easeInCubic; dur: 500; to: 0.5 0.5 0.5"
          />
        </a-camera>
      </a-scene>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Instructions Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 text-white text-xs px-3 py-2 rounded-lg">
          <p className="text-center">
            🖱️ Click and drag to look around • 📱 Move your device to explore
          </p>
        </div>
      </div>
    </div>
  );
};

export default PanoramicViewer;
