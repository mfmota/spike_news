import { storageService } from '../storage.service';
import { User } from '../../types/auth.types';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve armazenar e recuperar o token JWT corretamente', () => {
    const mockToken = 'mock-jwt-token-12345';
    storageService.setToken(mockToken);
    expect(storageService.getToken()).toBe(mockToken);
  });

  it('deve remover o token corretamente', () => {
    storageService.setToken('token-to-remove');
    storageService.removeToken();
    expect(storageService.getToken()).toBeNull();
  });

  it('deve armazenar e recuperar o objeto de usuário corretamente', () => {
    const mockUser: User = {
      idUsuario: 1,
      nome: 'Viper Sentinel',
      email: 'viper@spikenews.com',
      role: 'ADMIN',
    };

    storageService.setUser(mockUser);
    expect(storageService.getUser()).toEqual(mockUser);
  });

  it('deve limpar todas as informações de autenticação com clearAuth', () => {
    storageService.setToken('token');
    storageService.setUser({
      idUsuario: 2,
      nome: 'Jett Duelist',
      email: 'jett@spikenews.com',
      role: 'USER',
    });

    storageService.clearAuth();
    expect(storageService.getToken()).toBeNull();
    expect(storageService.getUser()).toBeNull();
  });
});

