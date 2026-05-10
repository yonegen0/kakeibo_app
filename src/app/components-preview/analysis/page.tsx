/**
 * @file page.tsx
 * @description 開発者向け: AnalysisTemplate の統合確認（URL の psvId と同一ルーター文脈）。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { StyledPage } from '@/components/atoms/PageShell';
import { AnalysisTemplate } from '@/components/templates/AnalysisTemplate';

/**
 * @returns AnalysisTemplate 統合確認ページの JSX 要素
 */
export default function ComponentsPreviewAnalysisPage() {
  return (
    <StyledPage>
      <Container maxWidth="lg">
        <Suspense fallback={null}>
          <AnalysisTemplate />
        </Suspense>
      </Container>
    </StyledPage>
  );
}
