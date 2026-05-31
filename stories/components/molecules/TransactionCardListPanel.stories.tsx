/**
 * @file TransactionCardListPanel.stories.tsx
 * @description TransactionCardListPanel コンポーネントの表示確認用ストーリー。
 * Empty / Loading / FewRows / Paginated / WithToolbar / Mobile を網羅し、
 * Phase B で永続化検証の play() を追加する基盤も兼ねる。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '@mui/material';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { TransactionCardListPanel } from '@/components/molecules/TransactionCardListPanel';
import type { TransactionModel } from '@/models/TransactionModel';

/** ストーリー用のモック行を生成する */
const generateRows = (n: number): TransactionModel[] =>
  Array.from({ length: n }).map((_, i) => {
    const isIncome = i % 5 === 0;
    const day = String((i % 28) + 1).padStart(2, '0');
    return {
      id: `t-${i + 1}`,
      date: `2026/03/${day}`,
      content: isIncome ? '給与振込' : `取引 #${i + 1}`,
      amount: {
        value: isIncome ? 280000 : -(1000 + ((i * 137) % 4000)),
        unit: '円',
      },
      category: isIncome ? '収入' : '食費',
      subCategory: i % 3 === 0 ? 'ランチ' : '',
      isFixedCost: i % 7 === 0,
      memo: i % 4 === 0 ? '備考メモ' : '',
      source: 'moneyforward',
    };
  });

const meta: Meta<typeof TransactionCardListPanel> = {
  title: 'Molecules/TransactionCardListPanel',
  component: TransactionCardListPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    onToggleFixedCost: fn(),
    onUpdateRow: fn((row: TransactionModel) => row),
  },
};

export default meta;
type Story = StoryObj<typeof TransactionCardListPanel>;

/**
 * Empty: 0 件
 * EmptyState（インボックスアイコン + メッセージ）が表示される。
 */
export const Empty: Story = {
  args: { rows: [] },
};

/**
 * Loading: ローディング中
 * 高さ 104px のスケルトンが 3 枚表示される。
 */
export const Loading: Story = {
  args: { rows: [], loading: true },
};

/**
 * FewRows: 3 件
 * ページネーションは 1 ページ表示。
 */
export const FewRows: Story = {
  args: { rows: generateRows(3) },
};

/**
 * Paginated: 30 件
 * 10 件 / ページなので 3 ページ。Pagination 操作で切り替わる。
 */
export const Paginated: Story = {
  args: { rows: generateRows(30) },
};

/**
 * WithToolbar: ツールバー差し込み
 * リスト上部に任意の UI を出せる（自動仕訳ボタン等を想定）。
 */
export const WithToolbar: Story = {
  args: {
    rows: generateRows(5),
    toolbarNode: <Alert severity="info">ツールバー領域のサンプル</Alert>,
  },
};

/**
 * Mobile: xs viewport
 * 実運用と同じ幅でカードとページネーションの見え方を確認する。
 */
export const Mobile: Story = {
  args: { rows: generateRows(12) },
  parameters: { viewport: { defaultViewport: 'xs' } },
};

/* ---------- play() 検証ストーリー ---------- */

/**
 * PlayCardClickOpensDrawer: カードタップで編集ドロワーが開く
 * 取引 #2（支出）のカードをクリックして role=dialog が現れることを確認する。
 */
export const PlayCardClickOpensDrawer: Story = {
  args: { rows: generateRows(3) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 「取引 #2」のカード（aria-label に取引内容を含む）
    const card = await canvas.findByRole('button', { name: /取引 #2/ });
    await userEvent.click(card);
    // Drawer は body 直下に Portal されるので screen から取得
    const drawer = await screen.findByRole('dialog');
    expect(drawer).toBeInTheDocument();
  },
};

/**
 * PlayEditContentAndSave: 内容編集 → 保存で onUpdateRow が呼ばれる
 * カードリスト → ドロワー → 編集 → 保存 までの永続化経路を一気通貫で確認。
 */
export const PlayEditContentAndSave: Story = {
  args: { rows: generateRows(3) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /取引 #2/ }));

    const contentField = await screen.findByLabelText('内容');
    await userEvent.clear(contentField);
    await userEvent.type(contentField, 'テスト編集');

    await userEvent.click(screen.getByRole('button', { name: '保存' }));

    await waitFor(() => {
      expect(args.onUpdateRow).toHaveBeenCalledWith(
        expect.objectContaining({ id: 't-2', content: 'テスト編集' }),
      );
    });
  },
};

/**
 * PlayCancelKeepsOriginal: キャンセル時は onUpdateRow が呼ばれない
 */
export const PlayCancelKeepsOriginal: Story = {
  args: { rows: generateRows(3) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: /取引 #2/ }));

    const contentField = await screen.findByLabelText('内容');
    await userEvent.clear(contentField);
    await userEvent.type(contentField, '破棄予定');

    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));

    // 閉じた直後の onUpdateRow 不発を確認
    expect(args.onUpdateRow).not.toHaveBeenCalled();
  },
};

/**
 * PlayFixedCostToggleStaysOnCard: 固定費 Switch はカード click を発火させない
 * Switch の onClick で stopPropagation していることを担保する。
 */
export const PlayFixedCostToggleStaysOnCard: Story = {
  args: { rows: generateRows(3) },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const card = await canvas.findByRole('button', { name: /取引 #2/ });
    // MUI Switch は role="switch"（role="checkbox" ではない）
    const fixedCostSwitch = within(card).getByRole('switch');

    await userEvent.click(fixedCostSwitch);

    // Drawer は開いていない
    expect(screen.queryByRole('dialog')).toBeNull();
    // onToggleFixedCost が該当 id で呼ばれている
    expect(args.onToggleFixedCost).toHaveBeenCalledWith('t-2');
  },
};

/**
 * PlayPaginationChangesVisibleRows: ページ送りで表示行が切り替わる
 * generateRows の規約上、i % 5 === 0 は「給与振込」になるため、
 * 「取引 #12」（index 11、i % 5 !== 0）を 2 ページ目検出のキーに使う。
 */
export const PlayPaginationChangesVisibleRows: Story = {
  args: { rows: generateRows(15) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 1 ページ目（先頭 10 件 = #1〜#10）には #12 は存在しない
    expect(canvas.queryByRole('button', { name: /取引 #12/ })).toBeNull();

    // ページ 2 ボタンへ移動
    const page2 = await canvas.findByRole('button', { name: 'Go to page 2' });
    await userEvent.click(page2);

    // 2 ページ目で #12 が出現する
    await waitFor(async () => {
      const card = await canvas.findByRole('button', { name: /取引 #12/ });
      expect(card).toBeInTheDocument();
    });
  },
};
