import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChange, signInUser, createUser, signOutUser } from '../lib/firebase-utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

export const useAuthActions = () => {
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const user = await signInUser(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      const user = await createUser(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  };


  const signOut = async (): Promise<void> => {
    try {
      await signOutUser();
    } catch (error) {
      throw error;
    }
  };

  return { signIn, signUp, signOut };
};

export { AuthContext };
export type { AuthContextType };