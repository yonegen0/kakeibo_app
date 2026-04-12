import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A',
      light: '#334155',
      dark: '#020617',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#06B6D4',
      light: '#67E8F9',
      dark: '#0891B2',
    },
    success: {
      main: '#10B981',
    },
    error: {
      main: '#F43F5E',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "JetBrains Mono", "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, color: '#0F172A' },
    h2: { fontWeight: 700, color: '#0F172A' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#0F172A',
          '&:hover': {
            backgroundColor: '#1E293B',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)',
        },
      },
    },
  },
});