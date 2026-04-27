/**
 * @file page.tsx
 * @description 開発者向け: AnalysisTemplate の統合確認（URL の psvId と同一ルーター文脈）。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { AnalysisTemplate } from '@/components/templates/AnalysisTemplate';

export default function ComponentsPreviewAnalysisPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={null}>
        <AnalysisTemplate />
      </Suspense>
    </Container>
  );
}
