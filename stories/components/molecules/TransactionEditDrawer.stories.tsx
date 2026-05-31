/**
 * @file TransactionEditDrawer.stories.tsx
 * @description TransactionEditDrawer コンポーネントの表示確認用ストーリー。
 * Drawer は document.body へ Portal される性質上、背景の placeholder と
 * 一緒に表示することで開閉状態の見え方を確認できるようにする。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Box, Typography } from '@mui/material';
import { TransactionEditDrawer } from '@/components/molecules/TransactionEditDrawer';
import type { TransactionModel } from '@/models/TransactionModel';

const baseRow: TransactionModel = {
  id: 't-1',
  date: '2026/03/01',
  content: 'スターバックス渋谷店',
  amount: { value: -650, unit: '円' },
  category: '食費',
  subCategory: 'カフェ',
  isFixedCost: false,
  memo: 'ラテ',
  source: 'moneyforward',
};

const meta: Meta<typeof TransactionEditDrawer> = {
  title: 'Molecules/TransactionEditDrawer',
  component: TransactionEditDrawer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    row: baseRow,
    onClose: fn(),
    onSave: fn((row: TransactionModel) => row),
  },
  // Drawer は body 直下に Portal されるため、ストーリー canvas には
  // 背景説明だけ置いておく。
  render: (args) => (
    <Box sx={{ p: 4, minHeight: '70vh' }}>
      <Typography variant="body2" color="text.secondary">
        背景コンテンツ（Drawer は画面下部に出現します）
      </Typography>
      <TransactionEditDrawer {...args} />
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof TransactionEditDrawer>;

/**
 * Closed: row を null にして Drawer を閉じた状態
 */
export const Closed: Story = {
  args: { row: null },
};

/**
 * OpenExpense: 支出（食費）で開いた状態
 * 大項目 Select の候補は「収入」を含まないことが目視確認のポイント。
 */
export const OpenExpense: Story = {};

/**
 * OpenIncome: 収入（給与）で開いた状態
 * 大項目 Select の候補は「収入」のみに絞られる。
 */
export const OpenIncome: Story = {
  args: {
    row: {
      ...baseRow,
      content: '給与振込',
      amount: { value: 280000, unit: '円' },
      category: '収入',
      subCategory: '給与',
    },
  },
};

/**
 * OpenInvalidCategory: 未選択カテゴリで開いた状態
 * 大項目 FormControl がエラー表示（赤縁）になる。
 */
export const OpenInvalidCategory: Story = {
  args: {
    row: { ...baseRow, category: '' as TransactionModel['category'] },
  },
};

/**
 * OpenContentOverLimit: 内容が文字数制限を超える状態
 * 内容フィールドが error 表示・カウンタが赤太字になる。
 */
export const OpenContentOverLimit: Story = {
  args: {
    row: {
      ...baseRow,
      content: 'アマゾンジャパン (キンドル) 月額プレミアム自動更新の長文サンプル',
    },
  },
};

/**
 * Mobile: xs viewport でボトムシート挙動を確認
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'xs' } },
};

/* ---------- play() 検証ストーリー ---------- */

/**
 * PlayManualSave: 保存ボタン押下で onSave / onClose が両方呼ばれる
 */
export const PlayManualSave: Story = {
  play: async ({ args }) => {
    const contentField = await screen.findByLabelText('内容');
    await userEvent.clear(contentField);
    await userEvent.type(contentField, '直接保存テスト');

    await userEvent.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(args.onSave).toHaveBeenCalledWith(
        expect.objectContaining({ content: '直接保存テスト' }),
      );
      expect(args.onClose).toHaveBeenCalled();
    });
  },
};

/**
 * PlayExpenseCannotPickIncome: 支出の編集では大項目「収入」が候補に出ない
 * getSelectableCategories の絞り込みがドロワーに反映されていることを確認。
 */
export const PlayExpenseCannotPickIncome: Story = {
  play: async () => {
    // 大項目 Select を開く
    const select = await screen.findByLabelText('大項目');
    await userEvent.click(select);

    const listbox = await screen.findByRole('listbox');
    expect(within(listbox).queryByRole('option', { name: '収入' })).toBeNull();
    // 食費は候補に存在する
    expect(within(listbox).getByRole('option', { name: '食費' })).toBeInTheDocument();
  },
};
