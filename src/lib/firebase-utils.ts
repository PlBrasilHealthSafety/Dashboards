import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User,
    type NextOrObserver
} from 'firebase/auth';
import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    type DocumentData,
    type QueryConstraint
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Authentication utilities
export const createUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const signInUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};


export const onAuthStateChange = (callback: NextOrObserver<User>) => {
    return onAuthStateChanged(auth, callback);
};

// Firestore utilities
export const createDocument = async (collectionName: string, data: DocumentData) => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};

export const getDocument = async (collectionName: string, docId: string) => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
};

export const updateDocument = async (collectionName: string, docId: string, data: Partial<DocumentData>) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};

export const queryDocuments = async (collectionName: string, constraints: QueryConstraint[] = []) => {
    try {
        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error querying documents:', error);
        throw error;
    }
};

// Helper function to create Firestore query constraints
export const createQueryConstraints = {
    where: (field: string, operator: any, value: any) => where(field, operator, value),
    orderBy: (field: string, direction?: 'asc' | 'desc') => orderBy(field, direction),
    limit: (limitCount: number) => limit(limitCount)
};