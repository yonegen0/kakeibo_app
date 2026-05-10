/**
 * @file SummaryCardHeader.tsx
 * @description サマリーカード上部のラベル・見出し・月の切り替え。
 */
import { useId } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

/* --- Types --- */
/**
 * SummaryCardHeader の Props
 */
type SummaryCardHeaderProps = {
  /** 見出しの上の小さなラベル */
  eyebrowText: string;
  /** ブロックのタイトル */
  title: string;
  /** 選べる月の一覧（年月の文字列） */
  monthOptions: string[];
  /** いま選んでいる月 */
  selectedMonth: string;
  /** 月が変わったとき */
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
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2.5),
  borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.15)}`,
}));

/** タイトル周りのブロック */
const StyledTitleBlock = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.75),
}));

/** 上段の小ラベル（バッジ風） */
const StyledEyebrow = styled(Typography)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  padding: `${theme.spacing(0.375)} ${theme.spacing(1)}`,
  borderRadius: theme.spacing(6),
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
  backgroundColor: alpha(theme.palette.secondary.main, 0.06),
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.6875rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: theme.palette.secondary.dark,
  alignSelf: 'flex-start',
  '&::before': {
    content: '""',
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: theme.palette.secondary.main,
    flexShrink: 0,
  },
}));

/** メインタイトル */
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  letterSpacing: '-0.02em',
  lineHeight: 1.15,
  color: theme.palette.primary.main,
}));

/** ドロップダウンメニューの Paper */
const StyledMenuPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
}));

/** ドロップダウンの選択肢 */
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.08),
  },
  '&.Mui-selected': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.14),
    fontWeight: 600,
  },
  '&.Mui-selected:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.2),
  },
}));

/** 月プルダウン */
const StyledMonthFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 168,
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: alpha(theme.palette.secondary.main, 0.25),
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.secondary.main,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.secondary.main,
      borderWidth: 2,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.secondary.main, 0.12)}`,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    '&.Mui-focused': {
      color: theme.palette.secondary.dark,
    },
  },
  '& .MuiSelect-select': {
    fontWeight: 600,
    fontSize: '0.875rem',
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
          MenuProps={{ PaperProps: { component: StyledMenuPaper } }}
        >
          {props.monthOptions.map((m) => (
            <StyledMenuItem value={m} key={m}>
              {m}
            </StyledMenuItem>
          ))}
        </Select>
      </StyledMonthFormControl>
    </StyledCardHeader>
  );
};

