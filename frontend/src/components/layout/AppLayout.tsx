import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Navbar from './Navbar';
import { valorantColors } from '../../theme/valorantTheme';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: valorantColors.navyDark,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 70, 85, 0.03) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: 4, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          backgroundColor: valorantColors.navyMain,
          borderTop: `1px solid ${valorantColors.border}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: valorantColors.textSecondary, letterSpacing: '0.05em' }}>
              SPIKE NEWS &copy; 2026 — Plataforma de E-sports & Cobertura VLR
            </Typography>
            <Typography variant="caption" sx={{ color: '#55606B', letterSpacing: '0.1em' }}>
              POWERED BY HYBRID SCRAPING & RIOT DATA APIs
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;

