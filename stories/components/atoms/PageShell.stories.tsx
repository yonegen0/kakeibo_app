/**
 * @file PageShell.stories.tsx
 * @description PageShell コンポーネント群（StepBadge / StepHeader / StyledHeroCard / StyledNavRow）の表示確認用ストーリー。
 */
import type { Meta, StoryObj } from '@storybook/react';
import { Box, Typography } from '@mui/material';
import { StepBadge, StepHeader, StyledHeroCard, StyledNavRow } from '@/components/atoms/PageShell';
import { Button } from '@/components/atoms/Button';

const meta: Meta<typeof StepBadge> = {
  title: 'Atoms/PageShell',
  component: StepBadge,
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof StepBadge>;

/**
 * BadgeStep01: ステップ1番バッジ
 */
export const BadgeStep01: Story = {
  args: { step: '01' },
};

/**
 * BadgeStep02: ステップ2番バッジ
 */
export const BadgeStep02: Story = {
  args: { step: '02' },
};

/**
 * BadgeStep03: ステップ3番バッジ
 */
export const BadgeStep03: Story = {
  args: { step: '03' },
};

/**
 * Header: StepHeader（バッジ + タイトル + 説明文）
 */
export const Header: StoryObj = {
  render: () => (
    <StepHeader
      step="01"
      title="CSVアップロード"
      desc="MoneyForward CSVを取り込み、取引データを確認してPSVを保存します。"
    />
  ),
};

/**
 * HeaderWithoutDesc: StepHeader（説明文なし）
 */
export const HeaderWithoutDesc: StoryObj = {
  render: () => <StepHeader step="02" title="分析実行" />,
};

/**
 * HeroCard: StyledHeroCard（cyan glow + 多層 shadow カード）
 */
export const HeroCard: StoryObj = {
  render: () => (
    <Box sx={{ width: 480 }}>
      <StyledHeroCard elevation={0}>
        <StepHeader
          step="02"
          title="分析実行"
          desc="保存済みPSVを集計し、AI分析を実行します。"
        />
        <Typography color="text.secondary">カードコンテンツがここに入ります。</Typography>
        <StyledNavRow>
          <Button variant="outlined">戻る</Button>
          <Button variant="contained">次へ</Button>
        </StyledNavRow>
      </StyledHeroCard>
    </Box>
  ),
};
