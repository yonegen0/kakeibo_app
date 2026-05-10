/**
 * @file page.tsx
 * @description レポートIDをパスパラメータで受け取るレポート表示ページ。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { StyledPage } from '@/components/atoms/PageShell';
import { ReportTemplate } from '@/components/templates/ReportTemplate';

/**
 * レポート表示ページコンポーネント（パスパラメータ版）
 * @returns レポート表示ページの JSX 要素
 */
export default function ReportByIdPage() {
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
