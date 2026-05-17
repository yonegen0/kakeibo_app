/**
 * @file theme.ts
 * @description Slate × Cyan のグローバルテーマ。
 * 各コンポーネントが個別に breakpoint 分岐を書かなくても済むよう、
 * Container / Button / Paper など共通パーツの down('md') 〜 down('sm') 振る舞いを集約する。
 */
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
    fontFamily: 'var(--font-geist-sans), "Inter", "Helvetica Neue", Arial, sans-serif',
    // 見出しは clamp で xs 〜 lg を 1 式で吸収する
    h1: { fontWeight: 700, color: '#0F172A', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' },
    h2: { fontWeight: 700, color: '#0F172A', fontSize: 'clamp(1.5rem, 4vw, 2rem)' },
    h4: { fontWeight: 700, fontSize: 'clamp(1.5rem, 3.5vw, 2rem)' },
    h5: { fontWeight: 700, fontSize: 'clamp(1.25rem, 3vw, 1.5rem)' },
    h6: { fontWeight: 700, fontSize: 'clamp(1.05rem, 2.4vw, 1.25rem)' },
    subtitle1: { fontSize: 'clamp(0.95rem, 2vw, 1rem)' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // 装飾要素のはみ出しによる横スクロールを完全に抑止する
        html: { overflowX: 'hidden' },
        body: { overflowX: 'hidden', WebkitFontSmoothing: 'antialiased' },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }) => ({
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
          [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(1.5),
            paddingRight: theme.spacing(1.5),
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.1)',
          },
          [theme.breakpoints.up('md')]: {
            minWidth: 180,
          },
          [theme.breakpoints.down('sm')]: {
            minWidth: 'auto',
            padding: '8px 16px',
            fontSize: '0.875rem',
          },
        }),
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
        root: ({ theme }) => ({
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.03)',
          [theme.breakpoints.down('sm')]: {
            borderRadius: theme.spacing(2),
          },
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.8125rem',
            padding: theme.spacing(0.5, 1.5),
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('sm')]: {
            fontSize: '0.75rem',
            height: 24,
          },
        }),
      },
    },
  },
});
