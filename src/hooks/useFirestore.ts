import { useState, useEffect, useCallback } from 'react';
import { type QueryConstraint, type DocumentData } from 'firebase/firestore';
import { FirestoreService } from '../lib/firestore-services';

// Hook for real-time document listening
export function useDocument<T extends DocumentData>(
  collectionName: string,
  documentId: string | null
) {
  const [data, setData] = useState<(T & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!documentId) {
      setData(null);
      setLoading(false);
      return;
    }

    const service = new FirestoreService<T>(collectionName);
    setLoading(true);
    setError(null);

    const unsubscribe = service.onDocumentSnapshot(
      documentId,
      (doc) => {
        setData(doc);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// Hook for real-time collection listening
export function useCollection<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const service = new FirestoreService<T>(collectionName);
    setLoading(true);
    setError(null);

    const unsubscribe = service.onCollectionSnapshot(
      constraints,
      (docs) => {
        setData(docs);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [collectionName, JSON.stringify(constraints)]);

  return { data, loading, error };
}

// Hook for CRUD operations
export function useFirestoreCRUD<T extends DocumentData>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = new FirestoreService<T>(collectionName);

  const create = useCallback(async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const id = await service.create(data);
      return id;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const update = useCallback(async (id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>) => {
    try {
      setLoading(true);
      setError(null);
      await service.update(id, data);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const remove = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await service.delete(id);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const getById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const doc = await service.getById(id);
      return doc;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  const getAll = useCallback(async (constraints: QueryConstraint[] = []) => {
    try {
      setLoading(true);
      setError(null);
      const docs = await service.getAll(constraints);
      return docs;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  return {
    create,
    update,
    remove,
    getById,
    getAll,
    loading,
    error
  };
}