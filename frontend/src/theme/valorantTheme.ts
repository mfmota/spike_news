import { createTheme, alpha } from '@mui/material/styles';

export const valorantColors = {
  red: '#FF4655',
  redHover: '#E03E4C',
  redDark: '#BD2C39',
  navyDark: '#0B1118',
  navyMain: '#0F1923',
  navyLight: '#17222D',
  surfaceCard: '#151F2B',
  surfaceCardHover: '#1C2938',
  border: 'rgba(236, 232, 225, 0.12)',
  borderActive: 'rgba(255, 70, 85, 0.5)',
  textPrimary: '#ECE8E1',
  textSecondary: '#8B978F',
  accentCyan: '#00F0FF',
  accentGold: '#FFE853',
  accentGreen: '#0AE2BF',
};

export const valorantTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: valorantColors.red,
      dark: valorantColors.redDark,
      light: '#FF707D',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: valorantColors.accentCyan,
      light: '#5EFBFF',
      dark: '#00B4C2',
      contrastText: '#0B1118',
    },
    background: {
      default: valorantColors.navyDark,
      paper: valorantColors.surfaceCard,
    },
    text: {
      primary: valorantColors.textPrimary,
      secondary: valorantColors.textSecondary,
    },
    error: {
      main: valorantColors.red,
    },
    success: {
      main: valorantColors.accentGreen,
    },
    warning: {
      main: valorantColors.accentGold,
    },
    info: {
      main: valorantColors.accentCyan,
    },
    divider: valorantColors.border,
  },
  typography: {
    fontFamily: '"Montserrat", "DIN Next LT Pro", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: valorantColors.textPrimary,
    },
    h2: {
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: valorantColors.textPrimary,
    },
    h3: {
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      color: valorantColors.textPrimary,
    },
    h4: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: valorantColors.textPrimary,
    },
    h5: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      color: valorantColors.textPrimary,
    },
    h6: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      color: valorantColors.textPrimary,
    },
    subtitle1: {
      letterSpacing: '0.02em',
      color: valorantColors.textSecondary,
    },
    subtitle2: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    button: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: valorantColors.navyDark,
          color: valorantColors.textPrimary,
          scrollbarColor: `${valorantColors.red} ${valorantColors.navyMain}`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: valorantColors.navyDark,
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#2A3644',
            borderRadius: '2px',
            border: `1px solid ${valorantColors.navyDark}`,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: valorantColors.red,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0px',
          padding: '10px 24px',
          fontWeight: 700,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 0 6px 6px',
            borderColor: 'transparent transparent rgba(255,255,255,0.4) transparent',
          },
        },
        contained: {
          backgroundColor: valorantColors.red,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: valorantColors.redHover,
            transform: 'translateY(-1px)',
            boxShadow: `0 4px 16px ${alpha(valorantColors.red, 0.4)}`,
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          borderColor: valorantColors.red,
          color: valorantColors.red,
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: '#FFFFFF',
            backgroundColor: alpha(valorantColors.red, 0.1),
            color: '#FFFFFF',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: valorantColors.surfaceCard,
          border: `1px solid ${valorantColors.border}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: valorantColors.surfaceCard,
          border: `1px solid ${valorantColors.border}`,
          borderRadius: '2px',
          transition: 'border-color 0.2s ease, transform 0.2s ease',
          '&:hover': {
            borderColor: valorantColors.borderActive,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: alpha(valorantColors.navyMain, 0.6),
            borderRadius: '2px',
            '& fieldset': {
              borderColor: valorantColors.border,
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(236, 232, 225, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: valorantColors.red,
              borderWidth: '1.5px',
            },
          },
          '& .MuiInputLabel-root': {
            color: valorantColors.textSecondary,
            '&.Mui-focused': {
              color: valorantColors.red,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(valorantColors.navyMain, 0.95),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${valorantColors.border}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
          fontWeight: 700,
          letterSpacing: '0.04em',
        },
      },
    },
  },
});

export default valorantTheme;

