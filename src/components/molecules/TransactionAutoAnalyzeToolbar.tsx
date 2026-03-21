/**
 * @file TransactionAutoAnalyzeToolbar.tsx
 * @description 取引プレビュー用 DataGrid ツールバー（AI 自動仕訳ボタン）を担う Molecule。
 */

import { Button, CircularProgress, Toolbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/* --- Types --- */
/**
 * TransactionAutoAnalyzeToolbar の Props
 */
type TransactionAutoAnalyzeToolbarProps = {
  /** 解析実行 */
  onAnalyze: () => void;
  /** 解析中 */
  isAnalyzing: boolean;
  /** データ有無 */
  hasData: boolean;
};

/* --- Styled Components --- */
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: 52,
  padding: theme.spacing(0.5, 1),
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/** AI 解析実行ボタン */
const StyledAIAnalyzeButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.25),
  fontWeight: 700,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(1.25),
  boxShadow: 'none',
}));

/**
 * AI 自動仕訳ツールバー
 * @param props.onAnalyze 解析実行ハンドラ
 * @param props.isAnalyzing 解析中フラグ
 * @param props.hasData テーブルにデータがあるか
 * @returns ツールバー表示用の要素
 */
/* --- Component --- */
export const TransactionAutoAnalyzeToolbar = (props: TransactionAutoAnalyzeToolbarProps) => {
  return (
    <StyledToolbar>
      <StyledAIAnalyzeButton
        variant="contained"
        color="secondary"
        startIcon={props.isAnalyzing ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
        onClick={props.onAnalyze}
        disabled={props.isAnalyzing || !props.hasData}
      >
        {props.isAnalyzing ? 'AI解析中...' : 'AIで仕訳を自動補完'}
      </StyledAIAnalyzeButton>
    </StyledToolbar>
  );
};
