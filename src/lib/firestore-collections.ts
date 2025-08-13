import { FirestoreService } from './firestore-services';
import type { 
  Post, 
  Comment, 
  Category, 
  Analytics, 
  Notification 
} from './firestore-models';
import type { UserProfile } from './types';

// Collection services - pre-configured for each data model
export const userProfileService = new FirestoreService<UserProfile>('users');
export const postService = new FirestoreService<Post>('posts');
export const commentService = new FirestoreService<Comment>('comments');
export const categoryService = new FirestoreService<Category>('categories');
export const analyticsService = new FirestoreService<Analytics>('analytics');
export const notificationService = new FirestoreService<Notification>('notifications');

// Collection names constants
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  CATEGORIES: 'categories',
  ANALYTICS: 'analytics',
  NOTIFICATIONS: 'notifications'
} as const;

// Helper functions for common operations
export const firestoreHelpers = {
  // Create user profile when user registers
  async createUserProfile(uid: string, email: string, displayName: string) {
    const userData = {
      uid,
      email,
      displayName,
      bio: '',
      photoURL: '',
      role: 'user' as const
    };
    
    return await userProfileService.create(userData);
  },

  // Get user's posts
  async getUserPosts(authorId: string) {
    const { queryConstraints } = await import('./firestore-services');
    return await postService.getAll([
      queryConstraints.where('authorId', '==', authorId),
      queryConstraints.orderBy('createdAt', 'desc')
    ]);
  },

  // Get post comments
  async getPostComments(postId: string) {
    const { queryConstraints } = await import('./firestore-services');
    return await commentService.getAll([
      queryConstraints.where('postId', '==', postId),
      queryConstraints.orderBy('createdAt', 'asc')
    ]);
  },

  // Get posts by category
  async getPostsByCategory(category: string) {
    const { queryConstraints } = await import('./firestore-services');
    return await postService.getAll([
      queryConstraints.where('category', '==', category),
      queryConstraints.where('published', '==', true),
      queryConstraints.orderBy('createdAt', 'desc')
    ]);
  },

  // Get user notifications
  async getUserNotifications(userId: string) {
    const { queryConstraints } = await import('./firestore-services');
    return await notificationService.getAll([
      queryConstraints.where('userId', '==', userId),
      queryConstraints.orderBy('createdAt', 'desc'),
      queryConstraints.limit(50)
    ]);
  },

  // Mark notification as read
  async markNotificationAsRead(notificationId: string) {
    return await notificationService.update(notificationId, { read: true });
  },

  // Increment post views
  async incrementPostViews(postId: string) {
    const post = await postService.getById(postId);
    if (post) {
      return await postService.update(postId, { views: post.views + 1 });
    }
  },

  // Increment post likes
  async incrementPostLikes(postId: string) {
    const post = await postService.getById(postId);
    if (post) {
      return await postService.update(postId, { likes: post.likes + 1 });
    }
  }
};