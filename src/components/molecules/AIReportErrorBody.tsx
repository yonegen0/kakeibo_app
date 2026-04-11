/**
 * @file AIReportErrorBody.tsx
 * @description AI家計レポート生成失敗時のアラート表示。
 */
import { Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/* 
 * AIReportErrorBody の Props
 */
export type AIReportErrorBodyProps = {
  /** API やフックから渡されたエラー内容（ユーザー向け短文） */
  errorDetail: string;
};

/** レポート生成失敗時のエラー表示（角丸とメッセージの字重）。 */
const StyledErrorAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  '& .MuiAlert-message': {
    fontWeight: 500,
  },
}));

/**
 * 家計レポートの生成に失敗した旨と理由を表示する。
 * @param props.errorDetail 表示するエラー内容
 * @returns アラート要素
 */
export const AIReportErrorBody = (props: AIReportErrorBodyProps) => {
  return (
    <StyledErrorAlert severity="error" icon={<ErrorOutlineIcon />}>
      レポート生成に失敗しました：{props.errorDetail}
    </StyledErrorAlert>
  );
};
