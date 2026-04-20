/**
 * @file page.tsx
 * @description レポートIDをパスパラメータで受け取るレポート表示ページ。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { ReportTemplate } from '@/components/templates/ReportTemplate';

export default function ReportByIdPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Suspense fallback={null}>
        <ReportTemplate />
      </Suspense>
    </Container>
  );
}
