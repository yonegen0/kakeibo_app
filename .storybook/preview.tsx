/**
 * @file .storybook/preview.ts
 * @description Storybookのプレビュー画面におけるグローバル設定。
 */
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '../src/lib/theme';
import { sb } from 'storybook/test';

sb.mock(import('../src/hooks/useMFUploader.ts'), { spy: true });

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
  },
  
  /**
   * 各ストーリーに MUI のテーマとベーススタイルを適用するためのデコレーター。
   */
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;