/**
 * @file TransactionAutoAnalyzeToolbar.tsx
 * @description 取引表の上に出す一行。AI による一括仕訳ボタンを置く。
 */

import { Button, CircularProgress, Toolbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/* --- Types --- */
/**
 * TransactionAutoAnalyzeToolbar の Props
 */
type TransactionAutoAnalyzeToolbarProps = {
  /** ボタン押下で仕訳を走らせる */
  onAnalyze: () => void;
  /** 通信中は無効化などに使う */
  isAnalyzing: boolean;
  /** 行が無いときは押せないようにする */
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

/** 一括仕訳ボタン */
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
 * @param props.onAnalyze 自動仕訳実行ハンドラ
 * @param props.isAnalyzing 処理中フラグ
 * @param props.hasData 取引明細があるか
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
