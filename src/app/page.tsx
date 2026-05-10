/**
 * @file page.tsx
 * @description 家計簿アプリのホームページ。3ステップの分析フローの入口となるランディングページ。
 */
'use client';

import Link from 'next/link';
import { Box, Container, Stack, Typography } from '@mui/material';
import { Button } from '@/components/atoms/Button';
import { styled } from '@mui/material/styles';
import { StyledPage, StyledHeroCard } from '@/components/atoms/PageShell';

/* --- Styled Components --- */

/** ヒーロー上段：バッジ + プレビューリンクを横並びに */
const StyledHeroHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
}));

/** アプリ名バッジ内テキスト */
const StyledBadgeText = styled('span')(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: theme.palette.secondary.dark,
}));

/** アプリ名バッジ */
const StyledHeroBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.25)}`,
  borderRadius: theme.spacing(6),
  border: `1px solid ${theme.palette.secondary.main}50`,
  backgroundColor: `${theme.palette.secondary.main}10`,
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
  },
}));

/** メインタイトル */
const StyledHeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
}));

/** 説明文 */
const StyledHeroLead = styled(Typography)(({ theme }) => ({
  maxWidth: 620,
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  lineHeight: 1.65,
}));

/** CTA ボタン行 */
const StyledCtaRow = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  flexWrap: 'wrap',
}));

/** コンポーネント確認ページへのリンク */
const StyledPreviewLink = styled(Link)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.8125rem',
  textDecoration: 'none',
  padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`,
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.primary.light}20`,
  transition: 'all .18s ease',
  '&:hover': {
    color: theme.palette.secondary.dark,
    borderColor: theme.palette.secondary.main,
    backgroundColor: `${theme.palette.secondary.main}0C`,
  },
  '&::after': {
    content: '"→"',
    display: 'inline-block',
    transition: 'transform .18s ease',
  },
  '&:hover::after': {
    transform: 'translateX(3px)',
  },
}));

/** ステップカードグリッド */
const StyledSteps = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(3.5),
}));

/** 各ステップカード（クリックで該当ページへ遷移） */
const StyledStepCard = styled(Link)(({ theme }) => ({
  display: 'block',
  position: 'relative',
  overflow: 'hidden',
  padding: `${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2.5)}`,
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  borderLeft: `3px solid ${theme.palette.secondary.main}`,
  color: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    borderLeftColor: theme.palette.secondary.light,
    boxShadow: '0 8px 24px -6px rgba(6, 182, 212, 0.2), 0 2px 6px rgba(15, 23, 42, 0.06)',
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.secondary.main}`,
    outlineOffset: '2px',
  },
}));

/** ステップカード背景の大きな番号（装飾） */
const StyledStepNumber = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-0.5),
  right: theme.spacing(1.25),
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '3.5rem',
  fontWeight: 700,
  lineHeight: 1,
  color: theme.palette.secondary.main,
  opacity: 0.1,
  userSelect: 'none',
  pointerEvents: 'none',
  letterSpacing: '-0.04em',
}));

/** STEP ラベル */
const StyledStepLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  color: theme.palette.secondary.dark,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(0.5),
}));

/** ステップタイトル */
const StyledStepTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '0.9375rem',
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(0.5),
}));

/** ステップ説明文 */
const StyledStepDesc = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

/* --- Page Component --- */

const steps = [
  {
    num: '01',
    label: 'Step 1',
    title: 'CSVアップロード',
    desc: 'MoneyForward CSVを取り込み、取引を確認します。',
    href: '/upload',
    cta: '1. アップロード編集へ',
    variant: 'contained' as const,
  },
  {
    num: '02',
    label: 'Step 2',
    title: 'AI分析実行',
    desc: '集計結果をもとに分析を実行し、所見を生成します。',
    href: '/analysis',
    cta: '2. 分析実行へ',
    variant: 'outlined' as const,
  },
  {
    num: '03',
    label: 'Step 3',
    title: 'レポート閲覧',
    desc: '保存済みの分析レポートをいつでも再表示できます。',
    href: '/report',
    cta: '3. レポート表示へ',
    variant: 'outlined' as const,
  },
];

/**
 * ホームページコンポーネント
 * 家計簿アプリのランディングページとして、3ステップの分析フローを案内する
 * @returns ホームページの JSX 要素
 */
export default function Home() {
  return (
    <StyledPage>
      <Container maxWidth="lg">
        <StyledHeroCard elevation={0}>
          {/* ヘッダー行：バッジ + プレビューリンク */}
          <StyledHeroHeader>
            <StyledHeroBadge>
              <StyledBadgeText>KAKEIBO APP</StyledBadgeText>
            </StyledHeroBadge>
            <StyledPreviewLink href="/components-preview">
              コンポーネント確認ページ
            </StyledPreviewLink>
          </StyledHeroHeader>

          {/* タイトル・説明 */}
          <StyledHeroTitle variant="h4">
            家計分析フロー
            <br />
            3ステップで完結
          </StyledHeroTitle>
          <StyledHeroLead variant="body1">
            CSV取り込みからAI分析、レポート閲覧まで。
            新しい詳細設計書に合わせて画面を分離しています。
          </StyledHeroLead>

          {/* CTA ボタン */}
          <StyledCtaRow direction="row" spacing={1.5}>
            {steps.map((step) => (
              <Button
                key={step.num}
                component={Link}
                href={step.href}
                variant={step.variant}
              >
                {step.cta}
              </Button>
            ))}
          </StyledCtaRow>

          {/* ステップカード */}
          <StyledSteps>
            {steps.map((step) => (
              <StyledStepCard key={step.num} href={step.href}>
                <StyledStepNumber>{step.num}</StyledStepNumber>
                <StyledStepLabel>{step.label}</StyledStepLabel>
                <StyledStepTitle>{step.title}</StyledStepTitle>
                <StyledStepDesc>{step.desc}</StyledStepDesc>
              </StyledStepCard>
            ))}
          </StyledSteps>
        </StyledHeroCard>
      </Container>
    </StyledPage>
  );
}
