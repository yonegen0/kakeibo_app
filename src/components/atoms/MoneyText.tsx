/**
 * @file MoneyText.tsx
 * @description 金額をアプリ共通の書式（桁区切り＋単位）で表示する。
 */
import { styled } from '@mui/material/styles';
import type { Amount } from '@/models/TransactionModel';

/* --- Types --- */
/**
 * MoneyText の Props
 */
type MoneyTextProps = {
  /** 数値と通貨単位 */
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
 * @param props.amount 表示する金額（数値と単位）
 * @returns 金額表示用の要素
 */
/* --- Component --- */
export const MoneyText = (props: MoneyTextProps) => {
  const { amount } = props;

  const formatted = `${amount.value.toLocaleString()} ${amount.unit}`;

  return <StyledMoney>{formatted}</StyledMoney>;
};

