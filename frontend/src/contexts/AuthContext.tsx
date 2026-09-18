import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  User,
  Role,
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  AuthContextType,
} from '../types/auth.types';
import { authService } from '../services/auth.service';
import { storageService } from '../services/storage.service';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Inicializa o estado a partir do LocalStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = storageService.getToken();
        const storedUser = storageService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        storageService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listener para o evento disparado pelo interceptor do Axios em caso de 401
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequestDTO): Promise<AuthResponseDTO> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setToken(response.token);
      const newUser: User = {
        idUsuario: response.idUsuario,
        nome: response.nome,
        email: response.email,
        role: response.role,
      };
      setUser(newUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterRequestDTO): Promise<AuthResponseDTO> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setToken(response.token);
      const newUser: User = {
        idUsuario: response.idUsuario,
        nome: response.nome,
        email: response.email,
        role: response.role,
      };
      setUser(newUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback((roles: Role | Role[]): boolean => {
    if (!user) return false;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    return requiredRoles.includes(user.role);
  }, [user]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    isAdmin: user?.role === 'ADMIN',
    isJournalist: user?.role === 'JORNALISTA',
    isUser: user?.role === 'USER',
  }), [user, token, isLoading, login, register, logout, hasRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

