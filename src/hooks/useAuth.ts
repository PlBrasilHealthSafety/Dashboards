import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChange, signInUser, createUser, signOutUser, signInWithGoogle } from '../lib/firebase-utils';
import { UserProfileService } from '../lib/user-profile-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signInWithGoogle: () => Promise<User>;
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
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      setLoading(false);

      // Garantir perfil do usuário existente após autenticação
      if (authUser?.uid && authUser.email) {
        try {
          await UserProfileService.ensureUserProfile(
            authUser.uid,
            authUser.email,
            authUser.displayName || undefined,
          );
        } catch (err) {
          // Evitar quebrar a UI por erros de permissão/latência
          console.warn('Não foi possível garantir o perfil do usuário no carregamento:', err);
        }
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

export const useAuthActions = () => {
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const user = await signInUser(email, password);
      // Criar/garantir perfil imediatamente após login
      try {
        await UserProfileService.ensureUserProfile(user.uid, user.email || '', user.displayName || undefined);
      } catch (err) {
        console.warn('Falha ao garantir perfil após login:', err);
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      const user = await createUser(email, password);
      // Criar perfil padrão ao registrar
      try {
        await UserProfileService.ensureUserProfile(user.uid, user.email || '', user.displayName || undefined);
      } catch (err) {
        console.warn('Falha ao garantir perfil após registro:', err);
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  const handleSignInWithGoogle = async (): Promise<User> => {
    try {
      const user = await signInWithGoogle();
      // Garantir perfil para login via Google
      try {
        await UserProfileService.ensureUserProfile(user.uid, user.email || '', user.displayName || undefined);
      } catch (err) {
        console.warn('Falha ao garantir perfil após login com Google:', err);
      }
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

  return { signIn, signUp, signInWithGoogle: handleSignInWithGoogle, signOut };
};

export { AuthContext };
export type { AuthContextType };