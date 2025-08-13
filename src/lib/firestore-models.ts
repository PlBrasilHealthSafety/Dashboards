import { type Timestamp } from 'firebase/firestore';

// Post model
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  published: boolean;
  likes: number;
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Comment model
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  parentCommentId?: string; // For nested comments
  likes: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Category model
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: string;
  postCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Analytics/Metrics model
export interface Analytics {
  id: string;
  type: 'page_view' | 'post_view' | 'user_action';
  entityId?: string; // ID of the related entity (post, user, etc.)
  userId?: string;
  metadata: Record<string, any>;
  timestamp: Timestamp;
}

// Notification model
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  relatedEntityId?: string;
  createdAt: Timestamp;
}