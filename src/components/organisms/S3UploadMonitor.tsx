/**
 * @file S3UploadMonitor.tsx
 * @description ファイル入力の受け付けおよび処理ステータスの表示を制御するコンポーネント。
 */
import { Box, Typography, Paper, LinearProgress, Alert, AlertTitle, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { styled } from '@mui/material/styles';
import { useMFUploader } from '@/hooks/useMFUploader';

/** コンテナ全体のレイアウト */
const StyledRootContainer = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: theme.spacing(4),
}));

/** 視覚的なドロップエリアを形成するコンテナ */
const StyledUploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(6, 182, 212, 0.04)', 
  },
}));

/** アップロードアイコンのスタイル */
const StyledUploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

/** 処理中ステータスの表示エリア */
const StyledProcessingContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  textAlign: 'center',
}));

/** プログレスバーのカスタマイズ */
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
}));

/** アラートコンポーネントのベーススタイル */
const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  marginTop: theme.spacing(2),
}));

/** アラート内のアクションボタンエリア */
const StyledActionArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

/**
 * データの取り込みから検証結果のフィードバックまでを管理するモニター画面を構築します。
 */
export const S3UploadMonitor = () => {
  const { handleFileSelect, data, error, isParsing } = useMFUploader();

  /**
   * 標準のファイル選択インターフェースを呼び出します。
   */
  const onButtonClick = () => {
    document.getElementById('csv-upload-input')?.click();
  };

  /**
   * 選択されたファイルをハンドラーへ渡します。
   */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <StyledRootContainer>
      <input
        id="csv-upload-input"
        type="file"
        accept=".csv"
        hidden
        onChange={onFileChange}
      />

      {/* 初期：データの入力待機状態 */}
      {!data && !isParsing && (
        <StyledUploadBox elevation={0} onClick={onButtonClick}>
          <StyledUploadIcon />
          <Typography variant="h6" gutterBottom>
            ファイルを選択
          </Typography>
          <Typography variant="body2" color="textSecondary">
            取引明細のデータをここにドロップ
          </Typography>
        </StyledUploadBox>
      )}

      {/* 実行中：データの解析および検証中 */}
      {isParsing && (
        <StyledProcessingContainer>
          <Typography variant="h6" color="secondary" gutterBottom>
            処理中...
          </Typography>
          <StyledLinearProgress color="secondary" />
        </StyledProcessingContainer>
      )}

      {/* 成功：すべての検証を通過した状態 */}
      {data && (
        <StyledAlert 
          icon={<CheckCircleOutlineIcon fontSize="inherit" />} 
          severity="success"
        >
          <AlertTitle>読み込み完了</AlertTitle>
          {data.length} 件のデータが正常に確認されました。
          <StyledActionArea>
            <Button size="small" variant="outlined" onClick={() => window.location.reload()}>
              別のデータを読み込む
            </Button>
          </StyledActionArea>
        </StyledAlert>
      )}

      {/* 異常：不適切な形式または読み込みエラー */}
      {error && (
        <StyledAlert severity="error">
          <AlertTitle>エラー</AlertTitle>
          {error}
        </StyledAlert>
      )}
    </StyledRootContainer>
  );
};