import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,

} from 'firebase/firestore';
import { db } from './firebase';

// Generic CRUD service class
export class FirestoreService<T extends DocumentData> {
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  // Create a new document
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, this.collectionName), docData);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Read a single document by ID
  async getById(id: string): Promise<(T & { id: string }) | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
      }
      return null;
    } catch (error) {
      console.error(`Error getting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Read all documents with optional constraints
  async getAll(constraints: QueryConstraint[] = []): Promise<(T & { id: string })[]> {
    try {
      const q = query(collection(db, this.collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
    } catch (error) {
      console.error(`Error getting documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error(`Error updating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document from ${this.collectionName}:`, error);
      throw error;
    }
  }

  // Query documents with custom constraints
  async query(constraints: QueryConstraint[]): Promise<(T & { id: string })[]> {
    return this.getAll(constraints);
  }

  // Real-time listener for a single document
  onDocumentSnapshot(id: string, callback: (doc: (T & { id: string }) | null) => void): Unsubscribe {
    const docRef = doc(db, this.collectionName, id);
    
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T & { id: string });
      } else {
        callback(null);
      }
    }, (error) => {
      console.error(`Error in document snapshot listener for ${this.collectionName}:`, error);
    });
  }

  // Real-time listener for collection queries
  onCollectionSnapshot(
    constraints: QueryConstraint[],
    callback: (docs: (T & { id: string })[]) => void
  ): Unsubscribe {
    const q = query(collection(db, this.collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
      
      callback(docs);
    }, (error) => {
      console.error(`Error in collection snapshot listener for ${this.collectionName}:`, error);
    });
  }
}

// Helper functions for common query constraints
export const queryConstraints = {
  where: (field: string, operator: any, value: any) => where(field, operator, value),
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => orderBy(field, direction),
  limit: (limitCount: number) => limit(limitCount)
};