export type Role = 'ADMIN' | 'JORNALISTA' | 'USER';

export interface User {
  idUsuario: number;
  nome: string;
  email: string;
  role: Role;
}

export interface AuthResponseDTO {
  token: string;
  tipo: string;
  idUsuario: number;
  nome: string;
  email: string;
  role: Role;
}

export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface RegisterRequestDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequestDTO) => Promise<AuthResponseDTO>;
  register: (data: RegisterRequestDTO) => Promise<AuthResponseDTO>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  isAdmin: boolean;
  isJournalist: boolean;
  isUser: boolean;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  status?: number;
  errors?: Record<string, string>;
}

