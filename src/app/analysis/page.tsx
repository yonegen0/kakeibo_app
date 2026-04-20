/**
 * @file page.tsx
 * @description 分析実行ページ。PSVデータを基にAI分析を実行し、サマリー生成を行う。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { AnalysisTemplate } from '@/components/templates/AnalysisTemplate';

/**
 * 分析実行ページコンポーネント
 * PSV ID を基に AI 分析を実行し、集計データを生成するページ
 * @returns 分析実行ページの JSX 要素
 */
export default function AnalysisPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* AnalysisTemplate を Suspense でラップして非同期処理をハンドリング */}
      <Suspense fallback={null}>
        <AnalysisTemplate />
      </Suspense>
    </Container>
  );
}
