/**
 * @file .storybook/preview.tsx
 * @description Storybookのプレビュー画面におけるグローバル設定。
 * MUI のテーマ・CssBaseline 適用、ブレークポイントごとの viewports プリセット、
 * ページ全体の見え方を再現するための opt-in な pageShell decorator を提供する。
 */
import type { Decorator, Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../src/lib/theme';
import { StyledPage } from '../src/components/atoms/PageShell';
import { sb } from 'storybook/test';

sb.mock(import('../src/hooks/useAIAnalyzer.ts'), { spy: true });
sb.mock(import('../src/hooks/useAnalysisTemplate.ts'), { spy: true });
sb.mock(import('../src/hooks/useMFUploader.ts'), { spy: true });
sb.mock(import('../src/hooks/useReportTemplate.ts'), { spy: true });
sb.mock(import('../src/hooks/useTransactionAutoAnalyzer.ts'), { spy: true });
sb.mock(import('../src/hooks/useTransactionImportTemplate.ts'), { spy: true });
sb.mock(import('../src/hooks/useTransactionSummary.ts'), { spy: true });

/**
 * MUI ブレークポイントに合わせた viewports プリセット。
 * ストーリー側で `parameters.viewport.defaultViewport: 'xs'` などを指定すると
 * 初期表示時にその幅で開く。defaultViewport を未指定にしておけば従来通り
 * パネルサイズ追従になるため、既存ストーリーの見え方を壊さない。
 */
const muiViewports = {
  xs: {
    name: 'xs / iPhone SE (375)',
    styles: { width: '375px', height: '720px' },
    type: 'mobile' as const,
  },
  sm: {
    name: 'sm / 折り境界直前 (599)',
    styles: { width: '599px', height: '900px' },
    type: 'mobile' as const,
  },
  md: {
    name: 'md / カード→Grid 境界 (900)',
    styles: { width: '900px', height: '900px' },
    type: 'tablet' as const,
  },
  lg: {
    name: 'lg / デスクトップ (1280)',
    styles: { width: '1280px', height: '900px' },
    type: 'desktop' as const,
  },
};

/**
 * 全ストーリー共通の decorator。
 * MUI テーマと CssBaseline を必ず適用し、ストーリー側で
 * `parameters.pageShell: true` を指定した場合のみ StyledPage で包む。
 */
const decorator: Decorator = (Story, context) => {
  const usePageShell = context.parameters?.pageShell === true;
  const body = usePageShell ? (
    <StyledPage>
      <Story />
    </StyledPage>
  ) : (
    <Story />
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {body}
    </ThemeProvider>
  );
};

/**
 * Storybook全体に適用されるレンダリング設定。
 */
const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: muiViewports,
      // defaultViewport は未指定。各ストーリーで指定された場合のみ固定幅で開く。
    },
  },
  decorators: [decorator],
};

export default preview;
