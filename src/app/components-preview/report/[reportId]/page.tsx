/**
 * @file page.tsx
 * @description 開発者向け: ReportTemplate の統合確認（パス reportId と同一ルーター文脈）。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { StyledPage } from '@/components/atoms/PageShell';
import { ReportTemplate } from '@/components/templates/ReportTemplate';

/**
 * @returns ReportTemplate 統合確認ページの JSX 要素
 */
export default function ComponentsPreviewReportPage() {
  return (
    <StyledPage>
      <Container maxWidth="lg">
        <Suspense fallback={null}>
          <ReportTemplate />
        </Suspense>
      </Container>
    </StyledPage>
  );
}
