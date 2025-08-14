import type { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

// Firebase Auth types
export interface AuthUser extends User {}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Firestore document types
export interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User profile document for PLBrasil Health&Safety
export interface UserProfile extends FirestoreDocument {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'diretoria' | 'medicina' | 'comercial';
}

// Example collection document types
export interface ExampleDocument extends FirestoreDocument {
  title: string;
  description: string;
  userId: string;
  status: 'active' | 'inactive';
}

// Firebase configuration type
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}