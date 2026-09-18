import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../../hooks/useAuth';
import { valorantColors } from '../../theme/valorantTheme';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isJournalist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return {
          bg: 'rgba(255, 70, 85, 0.2)',
          color: valorantColors.red,
          border: valorantColors.red,
        };
      case 'JORNALISTA':
        return {
          bg: 'rgba(0, 240, 255, 0.15)',
          color: valorantColors.accentCyan,
          border: valorantColors.accentCyan,
        };
      default:
        return {
          bg: 'rgba(255, 232, 83, 0.15)',
          color: valorantColors.accentGold,
          border: valorantColors.accentGold,
        };
    }
  };

  const badgeStyle = getRoleBadgeColor(user?.role);

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: 70 }}>
          {/* Logo Brand */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                backgroundColor: valorantColors.red,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                boxShadow: `0 0 12px ${valorantColors.red}`,
              }}
            >
              <SportsEsportsIcon sx={{ color: '#FFFFFF', fontSize: 24 }} />
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                SPIKE <span style={{ color: valorantColors.red }}>{'//'}</span> NEWS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: valorantColors.textSecondary,
                  letterSpacing: '0.2em',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                }}
              >
                VLR ESPORTS HUB
              </Typography>
            </Box>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Button
              startIcon={<NewspaperIcon fontSize="small" />}
              onClick={() => navigate('/')}
              sx={{
                color: location.pathname === '/' ? valorantColors.red : valorantColors.textPrimary,
                borderBottom: location.pathname === '/' ? `2px solid ${valorantColors.red}` : 'none',
              }}
            >
              Notícias
            </Button>
            <Button
              startIcon={<SportsEsportsIcon fontSize="small" />}
              onClick={() => navigate('/matches')}
              sx={{
                color: location.pathname === '/matches' ? valorantColors.red : valorantColors.textPrimary,
              }}
            >
              Partidas
            </Button>
            <Button
              startIcon={<ShieldOutlinedIcon fontSize="small" />}
              onClick={() => navigate('/catalog')}
              sx={{
                color: location.pathname === '/catalog' ? valorantColors.red : valorantColors.textPrimary,
              }}
            >
              Catálogo
            </Button>

            {(isAdmin || isJournalist) && (
              <Button
                startIcon={<AdminPanelSettingsIcon fontSize="small" />}
                onClick={() => navigate('/admin')}
                sx={{
                  color: valorantColors.accentCyan,
                }}
              >
                Painel
              </Button>
            )}
          </Box>

          {/* User Auth Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated && user ? (
              <>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: valorantColors.textPrimary, lineHeight: 1.2 }}
                  >
                    {user.nome}
                  </Typography>
                  <Typography variant="caption" sx={{ color: valorantColors.textSecondary }}>
                    {user.email}
                  </Typography>
                </Box>

                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    backgroundColor: badgeStyle.bg,
                    color: badgeStyle.color,
                    border: `1px solid ${badgeStyle.border}`,
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />

                <Tooltip title="Encerrar Sessão">
                  <IconButton
                    onClick={handleLogout}
                    sx={{
                      color: valorantColors.textSecondary,
                      border: `1px solid ${valorantColors.border}`,
                      borderRadius: '2px',
                      '&:hover': {
                        color: valorantColors.red,
                        borderColor: valorantColors.red,
                        backgroundColor: 'rgba(255, 70, 85, 0.1)',
                      },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/login')}
                sx={{ px: 3 }}
              >
                ENTRAR
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;

