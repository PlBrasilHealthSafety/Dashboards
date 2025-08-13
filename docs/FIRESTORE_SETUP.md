# Firestore Database Setup

This document explains how to configure and use Firestore Database in this React application.

## Configuration Files

### 1. Security Rules (`firestore.rules`)
Defines access control for Firestore collections:
- Users can only access their own user documents
- Posts and comments can be read by authenticated users
- Users can only create/update/delete their own posts and comments
- Categories are read-only for authenticated users

### 2. Database Indexes (`firestore.indexes.json`)
Optimizes query performance for:
- Posts by author and creation date
- Posts by category and creation date
- Comments by post ID and creation date

### 3. Firebase Configuration (`firebase.json`)
Configures Firebase services and emulators for local development.

## Services and Models

### Firestore Service (`src/lib/firestore-services.ts`)
Generic CRUD service class that provides:
- Create, read, update, delete operations
- Real-time listeners for documents and collections
- Query support with constraints

### Data Models (`src/lib/firestore-models.ts`)
TypeScript interfaces for:
- UserProfile
- Post
- Comment
- Category
- Analytics
- Notification

### Collection Services (`src/lib/firestore-collections.ts`)
Pre-configured services for each collection with helper functions.

## React Hooks

### `useFirestore.ts`
Custom hooks for Firestore operations:
- `useDocument<T>()` - Real-time document listener
- `useCollection<T>()` - Real-time collection listener
- `useFirestoreCRUD<T>()` - CRUD operations with loading states

## Usage Examples

### Basic CRUD Operations
```typescript
import { postService } from '@/lib/firestore-collections';

// Create
const postId = await postService.create({
  title: 'My Post',
  content: 'Post content...',
  authorId: user.uid,
  // ... other fields
});

// Read
const post = await postService.getById(postId);

// Update
await postService.update(postId, { title: 'Updated Title' });

// Delete
await postService.delete(postId);
```

### Real-time Data with Hooks
```typescript
import { useCollection } from '@/hooks/useFirestore';
import { queryConstraints } from '@/lib/firestore-services';

function PostsList() {
  const { data: posts, loading } = useCollection<Post>('posts', [
    queryConstraints.orderBy('createdAt', 'desc'),
    queryConstraints.limit(10)
  ]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

## Development Setup

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Project
```bash
firebase init firestore
```

### 4. Start Emulators (for local development)
```bash
npm run firebase:emulators
```

### 5. Deploy Rules and Indexes
```bash
npm run firebase:deploy
```

## Testing

The application includes a comprehensive Firestore example component (`FirestoreExample.tsx`) that:
- Tests all CRUD operations
- Demonstrates real-time data updates
- Shows proper error handling
- Includes cleanup procedures

To test Firestore operations:
1. Make sure you're authenticated
2. Navigate to the Firestore Example section
3. Click "Run Firestore Tests"
4. Watch the test results and real-time data updates

## Security Considerations

1. **Authentication Required**: All Firestore operations require user authentication
2. **User Isolation**: Users can only access their own data
3. **Input Validation**: All data should be validated before writing to Firestore
4. **Security Rules**: Comprehensive rules prevent unauthorized access

## Performance Tips

1. **Use Indexes**: Composite indexes are configured for common queries
2. **Limit Results**: Use `limit()` constraint for large collections
3. **Real-time Listeners**: Unsubscribe from listeners when components unmount
4. **Batch Operations**: Use batch writes for multiple operations

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Check Firestore security rules
2. **Missing Index**: Deploy firestore.indexes.json
3. **Emulator Connection**: Ensure emulators are running on correct ports
4. **Authentication**: Verify user is logged in before Firestore operations

### Debug Tools:
- Firebase Console: View data and monitor usage
- Browser DevTools: Check network requests and console logs
- Firebase Emulator UI: Local development and testing