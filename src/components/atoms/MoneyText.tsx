/**
 * @file MoneyText.tsx
 * @description 金額（Amount）を表示用の文字列へ整形して描画する Atom。
 */
import { styled } from '@mui/material/styles';
import type { Amount } from '@/models/TransactionModel';

/* --- Types --- */
/**
 * MoneyText の Props
 */
type MoneyTextProps = {
  /** 表示対象の金額 */
  amount: Amount;
};

/* --- Styled --- */
/** 金額表示用のテキスト */
const StyledMoney = styled('span')(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

/**
 * 金額の表示を統一する
 * @param props.amount 表示対象の金額
 * @returns 表示用の要素
 */
/* --- Component --- */
export const MoneyText = (props: MoneyTextProps) => {
  const { amount } = props;

  const formatted = `${amount.value.toLocaleString()} ${amount.unit}`;

  return <StyledMoney>{formatted}</StyledMoney>;
};

