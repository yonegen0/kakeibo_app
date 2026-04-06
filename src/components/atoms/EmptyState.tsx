/**
 * @file EmptyState.tsx
 * @description まだデータが無いときの案内（タイトル＋任意の説明）。
 */
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

/**
 * EmptyState の Props
 */
type EmptyStateProps = {
  /** 短い見出し */
  title: string;
  /** 詳しい説明（なくてもよい） */
  description?: string;
};

/** 空状態全体のコンテナ */
const StyledRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

/** 空状態アイコン */
const StyledIcon = styled(InboxOutlinedIcon)(({ theme }) => ({
  fontSize: 42,
  color: theme.palette.text.disabled,
}));

/**
 * 空状態を共通の見た目で表示する
 * @param props.title 空状態のタイトル
 * @param props.description 補足説明（任意）
 * @returns EmptyState 表示要素
 */
export const EmptyState = (props: EmptyStateProps) => {
  return (
    <StyledRoot>
      <StyledIcon />
      <Typography fontWeight={600}>{props.title}</Typography>
      {props.description ? (
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      ) : null}
    </StyledRoot>
  );
};

