/**
 * @file S3UploadMonitor.tsx
 * @description ファイル入力の受け付け、および解析状況に応じた視覚的フィードバックを提供するモニターコンポーネント。
 */
import { Box, Typography, Paper, LinearProgress, Alert, AlertTitle, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled, keyframes } from '@mui/material/styles';
import { useMFUploader } from '@/hooks/useMFUploader';

/* --- Types --- */

/**
 * コンポーネントのプロップス定義
 */
type S3UploadMonitorProps = {
  /** コンテナの幅 */
  width?: string | number;
  /** コンテナの高さ */
  height?: string | number;
};

/* --- Animations --- */

/** 解析中であることを示す鼓動のようなアニメーション */
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

/* --- Styled Components --- */

/** ルートコンテナ：外部からの指定がない場合はデフォルト幅600pxを適用 */
const StyledRootContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<S3UploadMonitorProps>(({ theme, width, height }) => ({
  width: width ?? '100%',
  maxWidth: width ? 'none' : 600,
  height: height ?? 'auto',
  mx: 'auto',
  mt: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
}));

/** 状態に応じたベースカード（共通スタイル） */
const StatusCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

/** 入力待機用の点線ボーダー付きドロップエリア */
const StyledUploadBox = styled(StatusCard)(({ theme }) => ({
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    borderColor: theme.palette.secondary.main,
    backgroundColor: 'rgba(6, 182, 212, 0.04)',
  },
}));

/** 解析中のコンテナ（アニメーションを付与） */
const StyledProcessingBox = styled(StatusCard)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  animation: `${pulse} 2s infinite ease-in-out`,
  backgroundColor: 'rgba(6, 182, 212, 0.02)',
}));

/** アップロードアイコン */
const StyledUploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

/** 進行状況を示すバー */
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(3),
  width: '100%',
}));

/** カード下部のボタン配置エリア */
const StyledActionArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

/**
 * データの取り込みから検証結果までを可視化するモニターコンポーネント。
 */
export const S3UploadMonitor = ({ width, height }: S3UploadMonitorProps) => {
  const { handleFileSelect, data, error, isParsing } = useMFUploader();

  /** 非表示のファイルインプットを擬似的にクリックするハンドラー */
  const onButtonClick = () => {
    document.getElementById('csv-upload-input')?.click();
  };

  /** ファイルが選択された際の処理：Hooksの解析ロジックを呼び出す */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  /** 画面をリロードして状態を初期化する */
  const onReset = () => {
    window.location.reload();
  };

  return (
    <StyledRootContainer width={width} height={height}>
      {/* 隠し要素：ファイル選択をプログラムから制御するために配置 */}
      <input id="csv-upload-input" type="file" accept=".csv" hidden onChange={onFileChange} />

      {/* 初期状態：入力待ちエリア */}
      {!data && !isParsing && !error && (
        <StyledUploadBox elevation={0} onClick={onButtonClick}>
          <StyledUploadIcon />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            明細ファイルをアップロード
          </Typography>
          <Typography variant="body2" color="textSecondary">
            クリックまたはファイルをここにドロップして解析を開始
          </Typography>
        </StyledUploadBox>
      )}

      {/* 解析中：ローディングとメッセージを表示 */}
      {isParsing && (
        <StyledProcessingBox elevation={2}>
          <CircularProgress color="secondary" size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="secondary" fontWeight="bold">
            データを解析しています...
          </Typography>
          <Typography variant="body2" color="textSecondary">
            システムが取引内容を精査中です。少々お待ちください。
          </Typography>
          <StyledLinearProgress color="secondary" />
        </StyledProcessingBox>
      )}

      {/* 成功：検証完了メッセージと次アクションへのボタンを表示 */}
      {data && (
        <StatusCard elevation={1}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            読み込みが完了しました
          </Typography>
          <Typography variant="body1" color="textSecondary">
            合計 <strong>{data.length}</strong> 件のデータが正常に検証されました。
          </Typography>
          <StyledActionArea>
            <Button variant="contained" color="primary">
              プレビューを表示
            </Button>
            <Button variant="outlined" onClick={onReset}>
              別のファイル
            </Button>
          </StyledActionArea>
        </StatusCard>
      )}

      {/* エラー：詳細メッセージと再試行手段を提示 */}
      {error && (
        <StatusCard elevation={1} sx={{ borderLeft: '6px solid #d32f2f' }}>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
            解析に失敗しました
          </Typography>
          <Alert severity="error" variant="outlined" sx={{ mb: 3, textAlign: 'left', width: '100%' }}>
            <AlertTitle>エラー詳細</AlertTitle>
            {error}
          </Alert>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            ファイルの形式が正しいか確認し、もう一度お試しください。
          </Typography>
          <Button variant="contained" color="error" onClick={onReset}>
            再試行する
          </Button>
        </StatusCard>
      )}
    </StyledRootContainer>
  );
};