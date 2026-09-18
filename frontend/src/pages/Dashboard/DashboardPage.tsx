import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../../hooks/useAuth';
import { valorantColors } from '../../theme/valorantTheme';

export const DashboardPage: React.FC = () => {
  const { user, isAdmin, isJournalist } = useAuth();

  const getRoleBadgeInfo = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          label: 'ADMINISTRADOR',
          color: valorantColors.red,
          bg: 'rgba(255, 70, 85, 0.15)',
          description: 'Acesso total ao sistema, gestão de jornalistas, usuários e configurações globais.',
        };
      case 'JORNALISTA':
        return {
          label: 'JORNALISTA / EDITOR',
          color: valorantColors.accentCyan,
          bg: 'rgba(0, 240, 255, 0.15)',
          description: 'Criação e publicação de notícias, cobertura de campeonatos e revisão editorial.',
        };
      default:
        return {
          label: 'USUÁRIO REGULAR',
          color: valorantColors.accentGold,
          bg: 'rgba(255, 232, 83, 0.15)',
          description: 'Acompanhamento de partidas ao vivo, catálogo de assets, notícias e preferências.',
        };
    }
  };

  const roleInfo = getRoleBadgeInfo(user?.role);

  return (
    <Box sx={{ py: 2 }}>
      {/* Header Banner */}
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          backgroundColor: valorantColors.surfaceCard,
          border: `1px solid ${valorantColors.border}`,
          borderRadius: '2px',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            backgroundColor: valorantColors.red,
          },
        }}
      >
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: valorantColors.red,
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                CENTRAL DE OPERAÇÕES // AGENTE ATIVO
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mb: 1, fontWeight: 900 }}>
              BEM-VINDO, {user?.nome?.toUpperCase()}
            </Typography>
            <Typography variant="body1" sx={{ color: valorantColors.textSecondary }}>
              Plataforma centralizada de dados de E-sports de VALORANT com captura híbrida e notícias.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Chip
              icon={<SecurityIcon style={{ color: roleInfo.color }} />}
              label={roleInfo.label}
              sx={{
                backgroundColor: roleInfo.bg,
                color: roleInfo.color,
                border: `1px solid ${roleInfo.color}`,
                fontWeight: 800,
                fontSize: '0.85rem',
                py: 2.5,
                px: 1,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Grid de Cards & Informações */}
      <Grid container spacing={3}>
        {/* Card de Perfil & Permissões */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <PersonIcon sx={{ color: valorantColors.red }} />
                <Typography variant="h6">Credenciais do Agente</Typography>
              </Box>
              <Divider sx={{ mb: 2.5 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: valorantColors.textSecondary, display: 'block' }}>
                  NOME COMPLETO
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user?.nome}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: valorantColors.textSecondary, display: 'block' }}>
                  E-MAIL CADASTRADO
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user?.email}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: valorantColors.textSecondary, display: 'block' }}>
                  NÍVEL DE PERMISSÃO (ROLE)
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: roleInfo.color }}>
                  {user?.role} — {roleInfo.description}
                </Typography>
              </Box>

              <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '2px' }}>
                <Typography variant="caption" sx={{ color: valorantColors.accentGreen, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon fontSize="small" /> Sessão Ativa com Token JWT injetado via Interceptor
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Módulos do Sistema */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <SportsEsportsIcon sx={{ color: valorantColors.red }} />
                    <Typography variant="h6">Partidas VLR</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: valorantColors.textSecondary, mb: 2 }}>
                    Resultados e estatísticas ao vivo extraídos por web scraping do ecossistema profissional.
                  </Typography>
                </Box>
                <Button variant="outlined" color="primary" size="small" fullWidth>
                  Ver Partidas
                </Button>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <ShieldIcon sx={{ color: valorantColors.accentCyan }} />
                    <Typography variant="h6">Catálogo de Assets</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: valorantColors.textSecondary, mb: 2 }}>
                    Agentes, habilidades, mapas e escudos sincronizados da API oficial de VALORANT.
                  </Typography>
                </Box>
                <Button variant="outlined" color="secondary" size="small" fullWidth>
                  Explorar Assets
                </Button>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <NewspaperIcon sx={{ color: valorantColors.accentGold }} />
                    <Typography variant="h6">Portal de Notícias</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: valorantColors.textSecondary, mb: 2 }}>
                    Artigos, coberturas de torneios e análises táticas da comunidade de e-sports.
                  </Typography>
                </Box>
                <Button variant="outlined" color="warning" size="small" fullWidth>
                  Acessar Notícias
                </Button>
              </Card>
            </Grid>

            {(isAdmin || isJournalist) && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: valorantColors.red }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <SecurityIcon sx={{ color: valorantColors.red }} />
                      <Typography variant="h6">Painel {isAdmin ? 'Admin' : 'Editorial'}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: valorantColors.textSecondary, mb: 2 }}>
                      {isAdmin ? 'Gerenciamento de jornalistas, RBAC e moderação.' : 'Publicação e edição de matérias e análises.'}
                    </Typography>
                  </Box>
                  <Button variant="contained" color="primary" size="small" fullWidth>
                    Acessar Gestão
                  </Button>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

