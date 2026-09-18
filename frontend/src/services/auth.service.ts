import api from './api';
import { storageService } from './storage.service';
import { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO, User } from '../types/auth.types';

export const authService = {
  /**
   * Realiza login do usuário com e-mail e senha
   */
  async login(credentials: LoginRequestDTO): Promise<AuthResponseDTO> {
    const response = await api.post<AuthResponseDTO>('/auth/login', credentials);
    const data = response.data;

    if (data.token) {
      storageService.setToken(data.token);
      const user: User = {
        idUsuario: data.idUsuario,
        nome: data.nome,
        email: data.email,
        role: data.role,
      };
      storageService.setUser(user);
    }

    return data;
  },

  /**
   * Realiza cadastro de novo usuário padrão
   */
  async register(registerData: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const response = await api.post<AuthResponseDTO>('/auth/register', registerData);
    const data = response.data;

    if (data.token) {
      storageService.setToken(data.token);
      const user: User = {
        idUsuario: data.idUsuario,
        nome: data.nome,
        email: data.email,
        role: data.role,
      };
      storageService.setUser(user);
    }

    return data;
  },

  /**
   * Encerra a sessão local do usuário
   */
  logout(): void {
    storageService.clearAuth();
  },

  /**
   * Recupera o usuário salvo no storage
   */
  getStoredUser(): User | null {
    return storageService.getUser();
  },

  /**
   * Recupera o token salvo no storage
   */
  getStoredToken(): string | null {
    return storageService.getToken();
  },
};

