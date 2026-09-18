import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextType } from '../types/auth.types';

/**
 * Hook customizado para acesso ao estado de autenticação e RBAC do usuário.
 * 
 * @example
 * const { user, isAuthenticated, isAdmin, login, logout, hasRole } = useAuth();
 * 
 * if (isAdmin) {
 *   // Renderiza painel administrativo
 * }
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um <AuthProvider>');
  }

  return context;
};

export default useAuth;

