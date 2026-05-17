/**
 * @file useIsMobile.ts
 * @description ビューポートが MUI の md ブレークポイント未満かを判定する共通フック。
 * 列の表示切替やコンポーネント差し替えなど、JS 側でレスポンシブ分岐が必要な箇所で使用する。
 */
'use client';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * ビューポートが md 未満（< 900px）かどうかを返す
 * @returns md 未満なら true
 */
export const useIsMobile = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
