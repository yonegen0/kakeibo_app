/**
 * @file MarkdownRenderer.stories.tsx
 * @description MarkdownRendererコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownRenderer } from '@/components/atoms/MarkdownRenderer';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Atoms/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

/**
 * Default: 基本的なMarkdown表示
 */
export const Default: Story = {
  args: {
    markdown: `# 見出し1
## 見出し2

これは**太字**と*斜体*のテキストです。

- リスト項目1
- リスト項目2

\`\`\`javascript
console.log('Hello, World!');
\`\`\`
`,
  },
};

/**
 * Empty: 空のMarkdown
 */
export const Empty: Story = {
  args: {
    markdown: '',
  },
};
