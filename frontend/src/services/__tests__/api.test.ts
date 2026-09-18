import api from '../api';
import { storageService } from '../storage.service';

describe('Axios API Interceptors', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve injetar o token Bearer no cabeçalho de requisição quando o token existir', async () => {
    storageService.setToken('test-bearer-token');

    // Executa o interceptor de requisição configurado
    const requestConfig = { headers: {} as Record<string, string> };
    const interceptorHandler = (api.interceptors.request as any).handlers[0];

    const resultConfig = interceptorHandler.fulfilled(requestConfig);
    expect(resultConfig.headers.Authorization).toBe('Bearer test-bearer-token');
  });

  it('não deve injetar o cabeçalho Authorization se não houver token armazenado', () => {
    storageService.removeToken();

    const requestConfig = { headers: {} as Record<string, string> };
    const interceptorHandler = (api.interceptors.request as any).handlers[0];

    const resultConfig = interceptorHandler.fulfilled(requestConfig);
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });
});

