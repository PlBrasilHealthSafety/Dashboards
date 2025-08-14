import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from './types';

export class UserProfileService {
  // Criar perfil de usuário após registro/login
  static async createUserProfile(
    uid: string, 
    email: string, 
    displayName?: string,
    role: 'diretoria' | 'medicina' | 'comercial' = 'diretoria'
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      
      const profileData: Omit<UserProfile, 'id'> = {
        uid,
        email,
        displayName: displayName || null,
        photoURL: null,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await setDoc(userRef, profileData, { merge: true });
      console.log('Perfil de usuário criado/atualizado:', uid);
    } catch (error) {
      console.error('Erro ao criar perfil de usuário:', error);
      throw error;
    }
  }

  // Buscar perfil de usuário
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar perfil de usuário:', error);
      throw error;
    }
  }

  // Atualizar perfil de usuário
  static async updateUserProfile(
    uid: string, 
    updates: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'role'>>
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      console.log('Perfil de usuário atualizado:', uid);
    } catch (error) {
      console.error('Erro ao atualizar perfil de usuário:', error);
      throw error;
    }
  }

  // Verificar se perfil existe e criar se necessário
  static async ensureUserProfile(
    uid: string, 
    email: string, 
    displayName?: string
  ): Promise<UserProfile> {
    try {
      let profile = await this.getUserProfile(uid);
      
      if (!profile) {
        // Se não existe, criar com role padrão 'diretoria'
        await this.createUserProfile(uid, email, displayName, 'diretoria');
        profile = await this.getUserProfile(uid);
      }
      
      if (!profile) {
        throw new Error('Não foi possível criar ou recuperar perfil de usuário');
      }
      
      return profile;
    } catch (error) {
      console.error('Erro ao garantir perfil de usuário:', error);
      throw error;
    }
  }
}
