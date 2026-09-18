import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../../hooks/useAuth';
import { valorantColors } from '../../theme/valorantTheme';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redireciona para onde o usuário tentava acessar ou para o dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !senha.trim()) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), senha });
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErrorMsg('Credenciais inválidas. Verifique seu e-mail e senha.');
      } else if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg('Falha ao conectar com o servidor. Verifique se o backend está ativo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: valorantColors.navyDark,
        position: 'relative',
        px: 2,
        py: 6,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 70, 85, 0.08) 1px, transparent 1px), radial-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          pointerEvents: 'none',
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 460,
          width: '100%',
          backgroundColor: valorantColors.surfaceCard,
          border: `1px solid ${valorantColors.border}`,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: '20%',
            right: '20%',
            height: '3px',
            backgroundColor: valorantColors.red,
            boxShadow: `0 0 10px ${valorantColors.red}`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Header Brand */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                backgroundColor: valorantColors.red,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                boxShadow: `0 0 16px ${valorantColors.red}`,
                mb: 2,
              }}
            >
              <SportsEsportsIcon sx={{ color: '#FFFFFF', fontSize: 32 }} />
            </Box>

            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                letterSpacing: '0.12em',
                lineHeight: 1.1,
              }}
            >
              SPIKE <span style={{ color: valorantColors.red }}>{'//'}</span> NEWS
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{
                color: valorantColors.textSecondary,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                mt: 0.5,
              }}
            >
              AUTENTICAÇÃO DE PROTOCOLO VLR
            </Typography>
          </Box>

          {/* Feedback de Erro */}
          {errorMsg && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 70, 85, 0.15)',
                color: valorantColors.textPrimary,
                border: `1px solid ${valorantColors.red}`,
                borderRadius: '2px',
                '& .MuiAlert-icon': {
                  color: valorantColors.red,
                },
              }}
            >
              {errorMsg}
            </Alert>
          )}

          {/* Formulário de Login */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box sx={{ mb: 2.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: valorantColors.textSecondary,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'block',
                  mb: 0.8,
                }}
              >
                E-MAIL DE AGENTE
              </Typography>
              <TextField
                fullWidth
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: valorantColors.textSecondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: valorantColors.textSecondary,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'block',
                  mb: 0.8,
                }}
              >
                CHAVE DE ACESSO (SENHA)
              </Typography>
              <TextField
                fullWidth
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: valorantColors.textSecondary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: valorantColors.textSecondary }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
              ) : (
                'INICIAR SESSÃO'
              )}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: valorantColors.border }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: valorantColors.textSecondary }}>
              Spike News &bull; Sistema com Controle de Acesso Baseado em Funções (RBAC)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

