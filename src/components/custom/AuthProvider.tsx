import React from 'react';
import { AuthContext, useAuthState, useAuthActions, type AuthContextType } from '../../hooks/useAuth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, loading } = useAuthState();
  const { signIn, signUp, signInWithGoogle, signOut } = useAuthActions();

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};