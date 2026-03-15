/**
 * @file S3UploadMonitor.stories.tsx
 * @description S3UploadMonitorコンポーネントの表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { S3UploadMonitor } from '@/components/organisms/S3UploadMonitor';
import { mocked, fn } from 'storybook/test';
import * as MFUploaderModule from '@/hooks/useMFUploader';

const meta: Meta<typeof S3UploadMonitor> = {
  title: 'Organisms/S3UploadMonitor',
  component: S3UploadMonitor,
  parameters: {
    // コンポーネントが画面端に寄らないよう中央配置
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof S3UploadMonitor>;

/**
 * 💡 Default: 初期状態
 * ファイルが選択される前の、アップロードエリアが表示されている状態。
 */
export const Default: Story = {
  beforeEach: () => {
    // Hooksが返す初期値をモック定義
    mocked(MFUploaderModule.useMFUploader).mockReturnValue({
      handleFileSelect: fn(),
      data: null,
      error: null,
      isParsing: false,
    });
  },
};

/**
 * 💡 Processing: 解析中状態
 * ファイル選択後、バックエンド（またはWorker）で解析を行っている最中の表示。
 */
export const Processing: Story = {
  beforeEach: () => {
    mocked(MFUploaderModule.useMFUploader).mockReturnValue({
      handleFileSelect: fn(),
      data: null,
      error: null,
      isParsing: true, // プログレスバーが表示される
    });
  },
};

/**
 * 💡 Success: 解析成功状態
 * CSVデータのバリデーションが完了し、件数などのサマリーが表示されている状態。
 */
export const Success: Story = {
  beforeEach: () => {
    mocked(MFUploaderModule.useMFUploader).mockReturnValue({
      handleFileSelect: fn(),
      data: Array(50).fill({}), // 50件のデータが読み込まれたと仮定
      error: null,
      isParsing: false,
    });
  },
};

/**
 * 💡 ValidationError: エラー発生状態
 * ファイル形式やバリデーションエラーが発生し、ユーザーに通知されている状態。
 */
export const ValidationError: Story = {
  beforeEach: () => {
    mocked(MFUploaderModule.useMFUploader).mockReturnValue({
      handleFileSelect: fn(),
      data: null,
      error: "CSVの列名が不足しています。正しいテンプレートを使用してください。",
      isParsing: false,
    });
  },
};