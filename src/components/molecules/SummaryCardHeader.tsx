/**
 * @file SummaryCardHeader.tsx
 * @description 月次サマリーカードのヘッダー（ラベル・タイトル・月選択）を担う Molecule。
 */
import { useId } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/* --- Types --- */
/**
 * SummaryCardHeader の Props
 */
type SummaryCardHeaderProps = {
  /** 上部の小さなラベル（例: Insights） */
  eyebrowText: string;
  /** メインタイトル */
  title: string;
  /** 選択可能な月（YYYY-MM） */
  monthOptions: string[];
  /** 現在選択中の月 */
  selectedMonth: string;
  /** 月変更ハンドラ */
  onMonthChange: (month: string) => void;
};

/* --- Styled Components --- */

/** カードヘッダー全体のコンテナ */
const StyledCardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

/** タイトル周りのブロック */
const StyledTitleBlock = styled(Box)(() => ({}));

/** 上部の小さいラベル（Eyebrow） */
const StyledEyebrow = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

/** メインタイトル */
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: theme.palette.text.primary,
}));

/** 月選択用のフォームコントロール */
const StyledMonthFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 168,
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.25),
    backgroundColor: theme.palette.background.paper,
  },
}));

/* --- Component --- */
/**
 * 月次サマリーカードのヘッダー
 * @param props.eyebrowText 上部のラベル文言
 * @param props.title メインタイトル
 * @param props.monthOptions 選択可能な月（YYYY-MM）
 * @param props.selectedMonth 現在選択中の月
 * @param props.onMonthChange 月変更時のハンドラ
 * @returns ヘッダー表示用の要素
 */
export const SummaryCardHeader = (props: SummaryCardHeaderProps) => {
  const baseId = useId();
  const labelId = `${baseId}-month-label`;

  return (
    <StyledCardHeader>
      <StyledTitleBlock>
        <StyledEyebrow>{props.eyebrowText}</StyledEyebrow>
        <StyledTitle variant="h6">{props.title}</StyledTitle>
      </StyledTitleBlock>

      <StyledMonthFormControl size="small">
        <InputLabel id={labelId}>表示月</InputLabel>
        <Select
          labelId={labelId}
          value={props.selectedMonth}
          label="表示月"
          onChange={(e) => props.onMonthChange(String(e.target.value))}
        >
          {props.monthOptions.map((m) => (
            <MenuItem value={m} key={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </StyledMonthFormControl>
    </StyledCardHeader>
  );
};

