# Post Functionality Frontend Implementation

This document describes the complete frontend implementation of the post functionality and 360° panoramic viewer integration for the Cultural Touristic Web App.

## Overview

The implementation includes:
- **360° Panoramic Viewer** using A-Frame
- **Post Management** (create, read, update, delete)
- **Comments System** with nested replies
- **Likes System** with real-time updates
- **State Management** using Zustand
- **API Integration** with existing authentication
- **TypeScript Support** throughout

## Architecture

### Components Structure
```
components/posts/
├── PanoramicViewer.tsx     # 360° A-Frame viewer
├── PostCard.tsx            # Individual post display
├── PostFeed.tsx            # Posts feed with pagination
├── CreatePost.tsx          # Post creation form
├── CommentsSection.tsx     # Comments management
└── index.ts               # Export index
```

### API Services
```
lib/api/
├── posts.ts               # Post CRUD operations
├── likes.ts               # Like management
├── comments.ts            # Comment management
└── auth.ts                # Existing auth service (extended)
```

### State Management
```
lib/stores/
├── posts.ts               # Posts, comments, likes state
└── auth.ts                # Existing auth state (unchanged)
```

### Type Definitions
```
lib/types/
├── posts.ts               # Post-related types
└── auth.ts                # Existing auth types (unchanged)
```

## Key Features

### 1. 360° Panoramic Viewer
- **Technology**: A-Frame for WebXR support
- **Features**: 
  - Touch/mouse controls
  - Fullscreen mode
  - Loading states
  - Error handling
  - Mobile responsive
- **Performance**: Lazy loading and optimized rendering

### 2. Post Management
- **Create**: File upload with preview
- **Read**: Feed and individual post views
- **Update**: Edit caption, location, tags
- **Delete**: With confirmation
- **Validation**: Client-side and server-side

### 3. Comments System
- **Features**:
  - Add/edit/delete comments
  - Nested replies support
  - Real-time updates
  - Pagination
  - User authentication

### 4. Likes System
- **Features**:
  - Toggle like/unlike
  - Real-time count updates
  - Like status checking
  - User authentication
  - Optimistic updates

## Integration Points

### Authentication
- Uses existing `authService` and `useAuthStore`
- Automatic token inclusion in API requests
- Protected routes integration
- User session management

### API Client
- Follows existing axios-based patterns
- Request/response interceptors
- Error handling consistency
- TypeScript support

### UI Components
- Integrates with existing design system
- Consistent styling with Tailwind CSS
- Responsive design
- Accessibility support

## Usage Examples

### Basic Post Feed
```tsx
import { PostFeed } from '@/components/posts';

function HomePage() {
  return (
    <div>
      <PostFeed showCreateButton={true} />
    </div>
  );
}
```

### Individual Post
```tsx
import { PostCard } from '@/components/posts';

function PostPage({ post }) {
  return (
    <PostCard 
      post={post} 
      showComments={true} 
    />
  );
}
```

### 360° Viewer
```tsx
import { PanoramicViewer } from '@/components/posts';

function ViewerPage() {
  return (
    <PanoramicViewer
      imageUrl="https://example.com/360-image.jpg"
      height="500px"
      showControls={true}
      autoRotate={false}
    />
  );
}
```

### Post Creation
```tsx
import { CreatePost } from '@/components/posts';

function UploadPage() {
  return (
    <CreatePost
      onSuccess={() => router.push('/')}
      onCancel={() => router.back()}
    />
  );
}
```

## State Management

### Posts Store
```tsx
import { usePostsStore } from '@/lib/stores/posts';

function MyComponent() {
  const {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    toggleLike,
    addComment
  } = usePostsStore();

  // Use the store methods...
}
```

## API Integration

### Posts API
```typescript
import { postsService } from '@/lib/api/posts';

// Create post
const result = await postsService.createPost({
  image: file,
  caption: 'Amazing view!',
  location: { name: 'Mount Cameroon' },
  tags: ['nature', '360'],
  isPublic: true
});

// Get posts
const posts = await postsService.getPosts(1, 20);
```

### Comments API
```typescript
import { commentsService } from '@/lib/api/comments';

// Add comment
const comment = await commentsService.addComment(postId, {
  content: 'Great shot!',
  parentCommentId: null // or parent comment ID for replies
});
```

### Likes API
```typescript
import { likesService } from '@/lib/api/likes';

// Toggle like
const result = await likesService.toggleLike(postId);
```

## Testing

### Component Tests
```bash
npm test __tests__/posts.test.tsx
```

### Integration Tests
- API service tests
- Store functionality tests
- Component integration tests

## Performance Considerations

### Image Optimization
- Cloudinary integration for image processing
- Multiple image sizes (thumbnail, medium, full)
- Lazy loading for better performance

### State Management
- Optimistic updates for better UX
- Efficient re-rendering with Zustand
- Pagination for large datasets

### 360° Viewer
- A-Frame optimizations
- WebGL performance
- Mobile device considerations

## Browser Support

### A-Frame Requirements
- WebGL support
- Modern browsers (Chrome 79+, Firefox 70+, Safari 13+)
- Mobile browsers with WebGL

### Fallbacks
- Error states for unsupported browsers
- Progressive enhancement
- Graceful degradation

## Security

### File Upload
- Client-side validation
- File type restrictions
- Size limitations
- Server-side processing

### Authentication
- JWT token validation
- Protected API endpoints
- User authorization checks

## Deployment

### Dependencies
```json
{
  "aframe": "^1.4.0",
  "aframe-react": "^1.0.0"
}
```

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Build Process
- TypeScript compilation
- Component bundling
- Asset optimization

## Future Enhancements

### Planned Features
- WebXR/VR support
- Advanced 360° controls
- Social sharing
- Real-time notifications
- Advanced search/filtering

### Performance Improvements
- Image CDN optimization
- Caching strategies
- Progressive loading
- Service worker integration

## Troubleshooting

### Common Issues
1. **A-Frame not loading**: Check browser WebGL support
2. **Images not displaying**: Verify CORS settings
3. **Authentication errors**: Check token validity
4. **Performance issues**: Monitor bundle size and optimize

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'posts:*');
```

## Support

For issues and questions:
- Check the API documentation in `docs/POST_API_ENDPOINTS.md`
- Review component examples in `docs/FRONTEND_INTEGRATION_EXAMPLES.md`
- Run tests to verify functionality
- Check browser console for errors
