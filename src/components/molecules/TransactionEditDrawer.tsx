/**
 * @file TransactionEditDrawer.tsx
 * @description xs/sm 用の取引編集ドロワー。
 * カードリスト経由で開かれ、内容・大項目・中項目・メモ・固定費を編集できる。
 * 日付と金額は読み取り専用。
 */
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Switch,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import type { Category, TransactionModel } from '@/models/TransactionModel';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { MoneyText } from '@/components/atoms/MoneyText';
import { CONTENT_MAX_LENGTH } from '@/lib/contentValidation';
import { isValidCategory } from '@/lib/categoryValidation';
import { getSelectableCategories } from '@/lib/selectableCategories';

/* --- Types --- */

/** TransactionEditDrawer の Props */
export type TransactionEditDrawerProps = {
  /** 編集対象（null なら閉じる） */
  row: TransactionModel | null;
  /** 閉じる時のハンドラ（キャンセル含む） */
  onClose: () => void;
  /** 保存ボタン押下時のハンドラ。返り値の TransactionModel が一覧に反映される */
  onSave: (newRow: TransactionModel) => TransactionModel;
};

/* --- Styled --- */

/** ドロワーの本体 Paper（ボトムシート風） */
const StyledDrawerPaper = styled(Paper)(({ theme }) => ({
  borderTopLeftRadius: theme.spacing(2.5),
  borderTopRightRadius: theme.spacing(2.5),
  padding: theme.spacing(2.5),
  paddingBottom: `calc(${theme.spacing(2.5)} + env(safe-area-inset-bottom))`,
  background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: '0 -10px 30px rgba(15, 23, 42, 0.18)',
}));

/** ドラッグハンドル風の摘み */
const StyledHandle = styled('div')(({ theme }) => ({
  width: 40,
  height: 4,
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.text.primary, 0.18),
  margin: '0 auto',
  marginBottom: theme.spacing(2),
}));

/** タイトル行（日付＋金額） */
const StyledTitleRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTitleDate = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  letterSpacing: '0.04em',
}));

const StyledTitleAmount = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '1.1rem',
  color: theme.palette.text.primary,
}));

/** フォームフィールドの縦積み */
const StyledFieldStack = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/** 文字数カウンタ */
const StyledCounter = styled(Typography, {
  shouldForwardProp: (prop) => prop !== '$isOver',
})<{ $isOver: boolean }>(({ theme, $isOver }) => ({
  marginTop: theme.spacing(0.5),
  textAlign: 'right',
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.7rem',
  fontWeight: $isOver ? 700 : 500,
  color: $isOver ? theme.palette.error.main : theme.palette.text.secondary,
  letterSpacing: '0.04em',
}));

/** フッターのボタン行 */
const StyledFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  marginTop: theme.spacing(2.5),
  '& > button': {
    flex: 1,
  },
}));

/* --- Component --- */

/**
 * 取引編集ドロワー
 * @param props.row 編集対象（null なら閉じる）
 * @param props.onClose 閉じる時のハンドラ
 * @param props.onSave 保存ボタン押下時のハンドラ
 * @returns 編集ドロワーの JSX 要素
 */
export const TransactionEditDrawer = (props: TransactionEditDrawerProps) => {
  const { row, onClose, onSave } = props;
  const open = row !== null;

  // 編集途中の値を保持するローカルステート
  const [draft, setDraft] = useState<TransactionModel | null>(row);

  // 開閉のたびに draft を初期化
  useEffect(() => {
    setDraft(row);
  }, [row]);

  if (!draft) {
    return <Drawer anchor="bottom" open={open} onClose={onClose} PaperProps={{ component: StyledDrawerPaper }} />;
  }

  const selectableCategories = getSelectableCategories(draft.amount.value);
  const contentOver = draft.content.length > CONTENT_MAX_LENGTH;
  const categoryInvalid = !isValidCategory(draft.category);

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ component: StyledDrawerPaper }}
    >
      <StyledHandle />

      <StyledTitleRow>
        <StyledTitleDate>{draft.date}</StyledTitleDate>
        <StyledTitleAmount>
          <MoneyText amount={draft.amount} />
        </StyledTitleAmount>
      </StyledTitleRow>

      <StyledFieldStack>
        <Box>
          <Input
            label="内容"
            value={draft.content}
            onChange={(e) =>
              setDraft({ ...draft, content: e.target.value.replace(/\n/g, ' ') })
            }
            error={contentOver}
            multiline
            minRows={2}
            maxRows={4}
          />
          <StyledCounter $isOver={contentOver}>
            {draft.content.length} / {CONTENT_MAX_LENGTH}
          </StyledCounter>
        </Box>

        <FormControl fullWidth error={categoryInvalid}>
          <InputLabel id="transaction-edit-category-label">大項目</InputLabel>
          <Select
            labelId="transaction-edit-category-label"
            label="大項目"
            value={isValidCategory(draft.category) ? draft.category : ''}
            onChange={(e) =>
              setDraft({ ...draft, category: e.target.value as Category })
            }
            displayEmpty
          >
            <MenuItem value="" disabled>
              （未選択）
            </MenuItem>
            {selectableCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Input
          label="中項目"
          value={draft.subCategory}
          onChange={(e) => setDraft({ ...draft, subCategory: e.target.value })}
        />

        <Input
          label="解析理由 / メモ"
          value={draft.memo}
          onChange={(e) => setDraft({ ...draft, memo: e.target.value })}
          multiline
          minRows={3}
        />

        <FormControlLabel
          control={
            <Switch
              checked={draft.isFixedCost}
              onChange={(_, checked) =>
                setDraft({ ...draft, isFixedCost: checked })
              }
            />
          }
          label="固定費として扱う"
        />
      </StyledFieldStack>

      <StyledFooter>
        <Button variant="outlined" onClick={onClose}>
          キャンセル
        </Button>
        <Button variant="contained" color="secondary" onClick={handleSave}>
          保存
        </Button>
      </StyledFooter>
    </Drawer>
  );
};
