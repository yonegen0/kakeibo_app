/**
 * @file TransactionContentEditCell.tsx
 * @description 取引「内容」セル編集用コンポーネント。列幅を超える Popper で textarea を表示し、長文編集を改善する。
 */
import { useRef } from 'react';
import { Box, Fade, Paper, Popper } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useGridApiContext, type GridRenderEditCellParams } from '@mui/x-data-grid';
import type { TransactionModel } from '@/models/TransactionModel';
import { CONTENT_MAX_LENGTH } from '@/lib/contentValidation';

/* --- Styled Components --- */

/** 編集用のアンカー */
const StyledAnchor = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
});

/** 編集用の Popper Paper（ガラスカード） */
const StyledPopperPaper = styled(Paper)(({ theme }) => ({
  width: 420,
  maxWidth: '50vw',
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  background: `
    radial-gradient(ellipse at 0% 0%, ${alpha(theme.palette.secondary.main, 0.08)}, transparent 60%),
    ${theme.palette.background.paper}
  `,
  backgroundColor: theme.palette.common.white,
  border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
  backdropFilter: 'blur(10px)',
  boxShadow: `
    0 4px 12px rgba(15, 23, 42, 0.08),
    0 24px 48px -16px rgba(15, 23, 42, 0.2),
    0 0 0 1px ${alpha(theme.palette.secondary.main, 0.06)}
  `,
}));

/** 文字数カウンタ */
const StyledCounter = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isOver',
})<{ $isOver: boolean }>(({ theme, $isOver }) => ({
  marginTop: theme.spacing(0.5),
  textAlign: 'right',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.7rem',
  fontWeight: $isOver ? 700 : 400,
  letterSpacing: '0.04em',
  color: $isOver ? theme.palette.error.main : theme.palette.text.secondary,
  transition: theme.transitions.create(['color', 'font-weight']),
}));

/** 編集用の textarea */
const StyledTextarea = styled('textarea', {
  shouldForwardProp: (prop) => prop !== '$isOver',
})<{ $isOver: boolean }>(({ theme, $isOver }) => ({
  width: '100%',
  minHeight: 96,
  padding: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.common.white,
  backdropFilter: 'blur(10px)',
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  lineHeight: 1.6,
  color: $isOver ? theme.palette.error.main : 'inherit',
  fontWeight: $isOver ? 600 : 'inherit',
  transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color']),
  '&:hover': {
    borderColor: theme.palette.grey[400],
  },
  '&:focus': {
    backgroundColor: theme.palette.common.white,
    borderColor: $isOver ? theme.palette.error.main : theme.palette.secondary.main,
    boxShadow: $isOver
      ? `0 0 15px ${alpha(theme.palette.error.main, 0.3)}, inset 0 0 10px ${alpha(theme.palette.error.main, 0.08)}`
      : `0 0 15px ${alpha(theme.palette.secondary.main, 0.3)}, inset 0 0 10px ${alpha(theme.palette.secondary.main, 0.08)}`,
  },
}));

/**
 * 取引「内容」セルの編集 UI
 * Popper で列幅を超えた textarea を表示し、長文編集を改善する
 * @param params DataGrid の renderEditCell パラメータ
 * @returns 編集用のアンカー＋Popper 要素
 */
export const TransactionContentEditCell = (params: GridRenderEditCellParams<TransactionModel, string>) => {
  /** DataGrid API 参照 */
  const apiRef = useGridApiContext();
  /** 編集用のアンカー参照 */
  const anchorRef = useRef<HTMLDivElement | null>(null);
  /** 編集内容 */
  const value = (params.value as string) ?? '';
  const isOver = value.length > CONTENT_MAX_LENGTH;

  /** 編集内容変更時のハンドラ */
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value.replace(/\n/g, ' ');
    apiRef.current.setEditCellValue({ id: params.id, field: params.field, value: next });
  };

  return (
    <StyledAnchor ref={anchorRef}>
      <span>{value}</span>
      <Popper open anchorEl={anchorRef.current} placement="bottom-start" disablePortal transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <StyledPopperPaper elevation={0}>
              <StyledTextarea
                $isOver={isOver}
                value={value}
                onChange={handleChange}
                // biome-ignore lint/a11y/noAutofocus: 編集開始時にフォーカスを当てる必要がある
                autoFocus
                rows={4}
              />
              <StyledCounter $isOver={isOver}>
                {value.length} / {CONTENT_MAX_LENGTH}
              </StyledCounter>
            </StyledPopperPaper>
          </Fade>
        )}
      </Popper>
    </StyledAnchor>
  );
};
