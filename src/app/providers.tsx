/**
 * @file providers.tsx
 * @description アプリ全体のクライアント側プロバイダ群。Emotion キャッシュ・MUI テーマ・CssBaseline を一括で適用する。
 */
'use client';

import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';

/** Providers の Props */
type ProvidersProps = {
  /** プロバイダで包む子要素 */
  children: ReactNode;
};

/**
 * App Router 向けの共通プロバイダ
 * @param props.children 包む対象の子要素
 * @returns Emotion キャッシュ・MUI テーマ・CssBaseline を適用した子要素
 */
export const Providers = (props: ProvidersProps) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
