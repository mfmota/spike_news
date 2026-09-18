import { User } from '../types/auth.types';

const TOKEN_KEY = '@spike_news:token';
const USER_KEY = '@spike_news:user';

export const storageService = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (err) {
      console.error('Erro ao salvar token no localStorage:', err);
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (err) {
      console.error('Erro ao remover token do localStorage:', err);
    }
  },

  getUser(): User | null {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (err) {
      console.error('Erro ao salvar usuário no localStorage:', err);
    }
  },

  removeUser(): void {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Erro ao remover usuário do localStorage:', err);
    }
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },
};

