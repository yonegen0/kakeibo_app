/**
 * @file aiReportAnimations.ts
 * @description AI家計レポートカードで共有する keyframes（フェードイン・成功時のパルス）。
 */
import { keyframes } from '@mui/material/styles';

/** カードやチップが下から浮かび上がるフェードイン */
export const aiReportFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/** 成功状態の軽いスケールパルス */
export const aiReportSuccessPulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;
