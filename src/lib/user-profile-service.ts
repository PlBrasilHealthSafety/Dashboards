import { doc, getDoc, setDoc, updateDoc, serverTimestamp, type FieldValue } from 'firebase/firestore';
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
      
      const profileData: {
        uid: string
        email: string
        displayName?: string
        photoURL?: string
        role: 'diretoria' | 'medicina' | 'comercial'
        createdAt: FieldValue
        updatedAt: FieldValue
      } = {
        uid,
        email,
        displayName: displayName ?? undefined,
        photoURL: undefined,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
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
        updatedAt: serverTimestamp(),
      } as any);
      
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
      let profile: UserProfile | null = null;

      // Primeiro tenta buscar; se falhar por permissão, vamos criar e buscar novamente
      try {
        profile = await this.getUserProfile(uid);
      } catch (err: any) {
        const maybeCode = (err && (err.code || err?.name)) as string | undefined;
        if (!maybeCode || (maybeCode && maybeCode.includes('permission'))) {
          // Ignora para tentar criar abaixo
          console.warn('Leitura do perfil falhou, tentando criar e refazer leitura...', err);
        } else {
          throw err;
        }
      }

      if (!profile) {
        // Se não existe (ou leitura falhou), criar com role padrão 'diretoria'
        await this.createUserProfile(uid, email, displayName, 'diretoria');
        // Tentar buscar novamente, se ainda falhar apenas retorna objeto mínimo
        try {
          profile = await this.getUserProfile(uid);
        } catch (err) {
          console.warn('Releitura do perfil após criação falhou. Retornando perfil mínimo.', err);
          profile = {
            id: uid,
            uid,
            email,
            displayName,
            role: 'diretoria',
          } as UserProfile;
        }
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
