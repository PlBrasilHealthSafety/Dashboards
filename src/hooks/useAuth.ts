import { useState, useEffect, createContext, useContext } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChange, signInUser, signInUserWithPersistence, createUser, signOutUser } from '../lib/firebase-utils';
import { userProfileService } from '../lib/firestore-collections';
import { Timestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
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

  // Função para determinar o role baseado no email
  const getUserRole = (email: string): 'diretoria' | 'medicina' | 'comercial' => {
    const emailPrefix = email.split('@')[0].toLowerCase();
    switch (emailPrefix) {
      case 'direcao':
        return 'diretoria';
      case 'medicina':
        return 'medicina';
      case 'comercial':
        return 'comercial';
      default:
        return 'diretoria'; // fallback
    }
  };

  // Função para criar ou atualizar perfil do usuário
  const ensureUserProfile = async (user: User) => {
    try {
      // Verificar se o perfil já existe
      const existingProfile = await userProfileService.getById(user.uid);
      
      if (!existingProfile && user.email) {
        // Criar perfil se não existir
        const role = getUserRole(user.email);
        const userProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || role.charAt(0).toUpperCase() + role.slice(1),
          photoURL: user.photoURL || '',
          role,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await userProfileService.create(userProfile);
        console.log(`✅ Perfil criado para ${user.email} com role ${role}`);
      }
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Garantir que o perfil do usuário existe
        await ensureUserProfile(user);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

export const useAuthActions = () => {
  const signIn = async (email: string, password: string, rememberMe: boolean = false): Promise<User> => {
    try {
      const user = await signInUserWithPersistence(email, password, rememberMe);
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