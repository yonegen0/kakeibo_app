/**
 * @file TransactionCard.tsx
 * @description xs/sm 用の取引 1 件カード。
 * 上段に日付＋金額、中段に内容、下段にカテゴリ pill と固定費 Switch を並べる。
 * カード全体タップで編集ドロワーを開く想定で、Switch のみ stopPropagation する。
 */
'use client';

import { Box, Paper, Switch, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import type { TransactionModel } from '@/models/TransactionModel';
import { MoneyText } from '@/components/atoms/MoneyText';
import { isValidCategory } from '@/lib/categoryValidation';

/* --- Types --- */

/** 金額の符号から導かれる種別 */
type TransactionKind = 'income' | 'expense' | 'zero';

/** TransactionCard の Props */
export type TransactionCardProps = {
  /** 表示する取引 1 件 */
  row: TransactionModel;
  /** カード全体クリックで呼ばれる（編集ドロワー起動） */
  onClick: (id: string) => void;
  /** 固定費フラグの切替（未指定なら Switch は disabled） */
  onToggleFixedCost?: (id: string) => void;
};

/* --- Helpers --- */

/** 金額値から種別を導出する */
const getKind = (value: number): TransactionKind => {
  if (value > 0) return 'income';
  if (value < 0) return 'expense';
  return 'zero';
};

/** 種別に対応するアクセント色を返す */
const getAccent = (theme: import('@mui/material/styles').Theme, kind: TransactionKind): string => {
  if (kind === 'income') return theme.palette.success.main;
  if (kind === 'expense') return theme.palette.error.main;
  return theme.palette.secondary.main;
};

/* --- Styled --- */

/** カードのルート Paper */
const StyledCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== '$kind',
})<{ $kind: TransactionKind }>(({ theme, $kind }) => {
  const accent = getAccent(theme, $kind);
  return {
    padding: theme.spacing(1.75),
    borderRadius: theme.spacing(1.5),
    border: `1px solid ${theme.palette.divider}`,
    borderLeft: `3px solid ${accent}`,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    cursor: 'pointer',
    transition: 'border-color .15s ease, transform .15s ease, box-shadow .15s ease',
    '@media (hover: hover)': {
      '&:hover': {
        borderColor: alpha(accent, 0.5),
        boxShadow: `0 4px 12px ${alpha(accent, 0.12)}`,
      },
    },
    '&:active': { transform: 'scale(0.99)' },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.secondary.main}`,
      outlineOffset: 2,
    },
  };
});

/** 上段（日付・金額） */
const StyledTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: theme.spacing(1),
}));

/** 日付テキスト（モノスペース） */
const StyledDate = styled('span')(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
}));

/** 金額表示（種別で色を切替） */
const StyledAmountWrap = styled('span', {
  shouldForwardProp: (prop) => prop !== '$kind',
})<{ $kind: TransactionKind }>(({ theme, $kind }) => ({
  fontWeight: 800,
  color:
    $kind === 'income'
      ? theme.palette.success.dark
      : $kind === 'expense'
        ? theme.palette.error.dark
        : theme.palette.text.primary,
  '& > span': {
    color: 'inherit',
    fontSize: '1.05rem',
  },
}));

/** 中段：取引内容（最大 2 行で省略） */
const StyledContent = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  wordBreak: 'break-word',
  fontSize: '0.9rem',
  lineHeight: 1.4,
  minHeight: '2.52em',
  margin: 0,
  // メモがあれば下に出すのでマージンは StyledMemo 側で持つ
}));

/** 解析理由・メモ（あれば 1 行で省略表示） */
const StyledMemo = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginTop: theme.spacing(-0.25),
}));

/** 下段（カテゴリ pill + 固定費スイッチ） */
const StyledMetaRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  marginTop: theme.spacing(0.25),
}));

/** 大項目 pill */
const StyledCategoryPill = styled('span', {
  shouldForwardProp: (prop) => prop !== '$invalid',
})<{ $invalid: boolean }>(({ theme, $invalid }) => ({
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  padding: theme.spacing(0.25, 0.875),
  borderRadius: 999,
  color: $invalid ? theme.palette.error.dark : theme.palette.secondary.dark,
  backgroundColor: $invalid
    ? alpha(theme.palette.error.main, 0.12)
    : alpha(theme.palette.secondary.main, 0.12),
  border: `1px solid ${
    $invalid
      ? alpha(theme.palette.error.main, 0.3)
      : alpha(theme.palette.secondary.main, 0.25)
  }`,
}));

/** 中項目 pill（控えめな slate） */
const StyledSubPill = styled('span')(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 600,
  padding: theme.spacing(0.25, 0.75),
  borderRadius: 999,
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.primary.main, 0.06),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
}));

/** 固定費ラベル＋スイッチ */
const StyledFixedCostBlock = styled(Box)(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
}));

/** 「固定費」のラベル */
const StyledFixedCostLabel = styled('span')(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 600,
  color: theme.palette.text.secondary,
}));

/* --- Component --- */

/**
 * 取引 1 件のカード
 * @param props.row 表示対象の取引
 * @param props.onClick カード全体クリック時のハンドラ（編集ドロワー起動）
 * @param props.onToggleFixedCost 固定費フラグ切替ハンドラ
 * @returns 取引カードの JSX 要素
 */
export const TransactionCard = (props: TransactionCardProps) => {
  const { row, onClick, onToggleFixedCost } = props;
  const kind = getKind(row.amount.value);
  const categoryValid = isValidCategory(row.category);

  const handleClick = () => onClick(row.id);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(row.id);
    }
  };

  return (
    <StyledCard
      elevation={0}
      $kind={kind}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${row.date} ${row.content} ${row.amount.value} ${row.amount.unit}`}
    >
      <StyledTopRow>
        <StyledDate>{row.date}</StyledDate>
        <StyledAmountWrap $kind={kind}>
          <MoneyText amount={row.amount} />
        </StyledAmountWrap>
      </StyledTopRow>

      <StyledContent>{row.content || '（内容なし）'}</StyledContent>

      {row.memo ? <StyledMemo>{row.memo}</StyledMemo> : null}

      <StyledMetaRow>
        <StyledCategoryPill $invalid={!categoryValid}>
          {row.category || '（未選択）'}
        </StyledCategoryPill>
        {row.subCategory ? <StyledSubPill>{row.subCategory}</StyledSubPill> : null}
        <StyledFixedCostBlock onClick={(e) => e.stopPropagation()}>
          <StyledFixedCostLabel>固定費</StyledFixedCostLabel>
          <Switch
            size="small"
            checked={row.isFixedCost}
            onChange={() => onToggleFixedCost?.(row.id)}
            disabled={!onToggleFixedCost}
            inputProps={{ 'aria-label': `${row.content} を固定費にする` }}
          />
        </StyledFixedCostBlock>
      </StyledMetaRow>
    </StyledCard>
  );
};
