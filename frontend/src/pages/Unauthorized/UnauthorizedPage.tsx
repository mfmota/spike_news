import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { valorantColors } from '../../theme/valorantTheme';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          p: 4,
          border: `1px solid ${valorantColors.red}`,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '30%',
            right: '30%',
            height: '3px',
            backgroundColor: valorantColors.red,
            boxShadow: `0 0 10px ${valorantColors.red}`,
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 70, 85, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <BlockIcon sx={{ color: valorantColors.red, fontSize: 36 }} />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: valorantColors.red,
              fontWeight: 800,
              letterSpacing: '0.2em',
              display: 'block',
              mb: 1,
            }}
          >
            ACESSO NEGADO // PROTOCOLO 403
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
            PERMISSÃO INSUFICIENTE
          </Typography>

          <Typography variant="body2" sx={{ color: valorantColors.textSecondary, mb: 4 }}>
            Seu nível de permissão (Role) atual não possui autorização para acessar este recurso da plataforma Spike News.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            RETORNAR AO DASHBOARD
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UnauthorizedPage;

