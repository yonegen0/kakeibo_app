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
 * RichText: 引用やリストを含む表示
 */
export const RichText: Story = {
  args: {
    markdown: `## 収支の傾向

> 支出が増えた主因は食費と交通費です。

- 食費の上振れを抑える
- サブスクを整理する
- 固定費を月1で見直す`,
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
