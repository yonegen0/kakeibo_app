/**
 * @file CsvUploadMonitor.tsx
 * @description CSV の選択と、取込・検証の進み具合（待ち／処理中／成功／失敗）を見せる。
 */
import { Box, Typography, Paper, LinearProgress, Alert, AlertTitle, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled, keyframes } from '@mui/material/styles';
import { Button } from '@/components/atoms/Button';

/* --- Types --- */

/**
 * CsvUploadMonitor の Props
 */
export type CsvUploadMonitorProps = {
  /** 枠の幅 */
  width?: string | number;
  /** 枠の高さ */
  height?: string | number;
  /** ファイル選択時に呼び出すハンドラ */
  handleFileSelect: (file: File) => void;
  /** パース済み行数（0 = 未読込） */
  dataLength: number;
  /** パース・検証中フラグ */
  isParsing: boolean;
  /** エラーメッセージ（null = エラーなし） */
  error: string | null;
};

/* --- Animations --- */

/** 処理中であることを示す鼓動アニメーション */
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

/* --- Styled Components --- */

type StyledRootProps = Pick<CsvUploadMonitorProps, 'width' | 'height'>;

/** ルートコンテナ：外部からの指定がない場合はデフォルト幅600pxを適用 */
const StyledRootContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<StyledRootProps>(({ theme, width, height }) => ({
  width: width ?? '100%',
  maxWidth: width ? 'none' : 600,
  height: height ?? 'auto',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
  },
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
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

/** エラー状態用カード（左ボーダーアクセント付き） */
const StyledErrorStatusCard = styled(StatusCard)(({ theme }) => ({
  borderLeft: `6px solid ${theme.palette.error.dark}`,
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

/** 状態カード内で使う大きめアイコンの共通スタイル（fontSize と下余白） */
const styledLargeIconStyle = (theme: import('@mui/material/styles').Theme) => ({
  fontSize: 64,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    fontSize: 48,
    marginBottom: theme.spacing(1.5),
  },
});

/** アップロードアイコン（テキスト色） */
const StyledUploadIcon = styled(CloudUploadIcon)(({ theme }) => ({
  ...styledLargeIconStyle(theme),
  color: theme.palette.text.secondary,
}));

/** 成功アイコン（緑） */
const StyledSuccessIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
  ...styledLargeIconStyle(theme),
  color: theme.palette.success.main,
}));

/** エラーアイコン（赤） */
const StyledErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  ...styledLargeIconStyle(theme),
  color: theme.palette.error.main,
}));

/** 解析中スピナー（下余白を持たせる） */
const StyledProcessingSpinner = styled(CircularProgress)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

/** 進行状況を示すバー */
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  marginTop: theme.spacing(3),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    height: 8,
    marginTop: theme.spacing(2),
  },
}));

/** エラー Alert（左寄せテキスト・全幅・下余白） */
const StyledDetailAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  textAlign: 'left',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(2),
  },
}));

/** 「ファイル形式を確認」の注意書き（下余白） */
const StyledErrorHint = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

/** カード下部のボタン配置エリア */
const StyledActionArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(2),
    flexDirection: 'column',
    width: '100%',
    '& > *': {
      width: '100%',
    },
  },
}));

/**
 * データの取り込みから検証結果までを可視化するモニターコンポーネント。
 * @param props.width コンテナの幅
 * @param props.height コンテナの高さ
 * @returns アップロード状態表示用の要素
 */
export const CsvUploadMonitor = (props: CsvUploadMonitorProps) => {
  const { handleFileSelect, dataLength, error, isParsing } = props;

  /** 隠したファイル選択を開く */
  const onButtonClick = () => {
    document.getElementById('csv-upload-input')?.click();
  };

  /** 選ばれたファイルで取込を開始 */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  /** 画面を最初からやり直す */
  const onReset = () => {
    window.location.reload();
  };

  return (
    <StyledRootContainer width={props.width} height={props.height}>
      {/* 隠し要素：ファイル選択をプログラムから制御するために配置 */}
      <input id="csv-upload-input" type="file" accept=".csv" hidden onChange={onFileChange} />

      {/* 初期状態：入力待ちエリア */}
      {dataLength === 0 && !isParsing && !error && (
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
          <StyledProcessingSpinner color="secondary" size={60} thickness={4} />
          <Typography variant="h6" color="secondary" fontWeight="bold">
            データを解析しています...
          </Typography>
          <Typography variant="body2" color="textSecondary">
            システムが取引内容を精査中です。少々お待ちください。
          </Typography>
          <StyledLinearProgress color="secondary" />
        </StyledProcessingBox>
      )}

      {/* 成功：検証完了メッセージと再選択ボタンを表示 */}
      {dataLength > 0 && (
        <StatusCard elevation={1}>
          <StyledSuccessIcon />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            読み込みが完了しました
          </Typography>
          <Typography variant="body1" color="textSecondary">
            合計 <strong>{dataLength}</strong> 件のデータが正常に検証されました。
          </Typography>
          <StyledActionArea>
            <Button variant="outlined" onClick={onReset}>
              別のファイル
            </Button>
          </StyledActionArea>
        </StatusCard>
      )}

      {/* エラー：詳細メッセージと再試行手段を提示 */}
      {error && (
        <StyledErrorStatusCard elevation={1}>
          <StyledErrorIcon />
          <Typography variant="h5" color="error" fontWeight="bold" gutterBottom>
            解析に失敗しました
          </Typography>
          <StyledDetailAlert severity="error" variant="outlined">
            <AlertTitle>エラー詳細</AlertTitle>
            {error}
          </StyledDetailAlert>
          <StyledErrorHint variant="body2" color="textSecondary">
            ファイルの形式が正しいか確認し、もう一度お試しください。
          </StyledErrorHint>
          <Button variant="contained" color="error" onClick={onReset}>
            再試行する
          </Button>
        </StyledErrorStatusCard>
      )}
    </StyledRootContainer>
  );
};

/**
 * @deprecated CsvUploadMonitor を利用してください。
 */
export const S3UploadMonitor = CsvUploadMonitor;
