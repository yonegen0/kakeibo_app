/**
 * @file page.tsx
 * @description 開発者向け: ReportTemplate の統合確認（パス reportId と同一ルーター文脈）。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { ReportTemplate } from '@/components/templates/ReportTemplate';

export default function ComponentsPreviewReportPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={null}>
        <ReportTemplate />
      </Suspense>
    </Container>
  );
}
