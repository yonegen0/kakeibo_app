/**
 * @file CsvUploadMonitor.stories.tsx
 * @description CsvUploadMonitor コンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { CsvUploadMonitor } from '@/components/organisms/CsvUploadMonitor';

const meta: Meta<typeof CsvUploadMonitor> = {
  title: 'Organisms/CsvUploadMonitor',
  component: CsvUploadMonitor,
  parameters: {
    layout: 'centered',
  },
  args: {
    handleFileSelect: fn(),
    dataLength: 0,
    isParsing: false,
    error: null,
  },
};

export default meta;
type Story = StoryObj<typeof CsvUploadMonitor>;

/**
 * Default: 初期状態
 * ファイルが選択される前の、アップロードエリアが表示されている状態。
 */
export const Default: Story = {};

/**
 * Processing: 解析中状態
 * ファイル選択後、バックエンド（またはWorker）で解析を行っている最中の表示。
 */
export const Processing: Story = {
  args: {
    isParsing: true,
  },
};

/**
 * Success: 解析成功状態
 * CSVデータのバリデーションが完了し、件数などのサマリーが表示されている状態。
 */
export const Success: Story = {
  args: {
    dataLength: 50,
  },
};

/**
 * ValidationError: エラー発生状態
 * ファイル形式やバリデーションエラーが発生し、ユーザーに通知されている状態。
 */
export const ValidationError: Story = {
  args: {
    error: 'CSVの列名が不足しています。正しいテンプレートを使用してください。',
  },
};
