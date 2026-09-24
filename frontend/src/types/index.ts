export type Role = 'ADMIN' | 'JORNALISTA' | 'USER';

export type AlertType = 'JOGOS' | 'NOTICIAS' | 'AMBOS';

export type MatchStatus = 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO';

export interface User {
  id: number;
  nome: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  nome: string;
  email: string;
  role: Role;
}

export interface Team {
  id: number;
  nome: string;
  urlLogo?: string;
  idApiExterna?: string;
}

export interface Match {
  idPartida?: number;
  idTimeCasa?: number;
  timeCasa: string;
  logoTimeCasa?: string;
  idTimeFora?: number;
  timeFora: string;
  logoTimeFora?: string;
  pontuacaoCasa: number;
  pontuacaoFora: number;
  status: MatchStatus;
  evento?: string;
  dataPartida?: string;
  updatedAt?: string;
}

export interface News {
  id: number;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  autorId: number;
  autorNome: string;
  timeId?: number;
  timeNome?: string;
  timeLogo?: string;
}

export interface Preference {
  id?: number;
  teamId: number;
  teamName: string;
  teamLogo?: string;
  tipoAlerta: AlertType;
}

export interface Agent {
  uuid: string;
  displayName: string;
  description: string;
  developerName: string;
  displayIcon: string;
  fullPortrait: string;
  roleName?: string;
  roleIcon?: string;
}

export interface MapData {
  uuid: string;
  displayName: string;
  coordinates: string;
  displayIcon: string;
  splash: string;
}

export interface Weapon {
  uuid: string;
  displayName: string;
  category: string;
  displayIcon: string;
  cost?: number;
  magazineSize?: number;
  fireRate?: number;
}
