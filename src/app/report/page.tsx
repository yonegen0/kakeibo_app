/**
 * @file page.tsx
 * @description レポート表示ページ。AI分析結果をMarkdown形式で表示する最終ステップ。
 */
'use client';

import { Suspense } from 'react';
import { Container } from '@mui/material';
import { StyledPage } from '@/components/atoms/PageShell';
import { ReportTemplate } from '@/components/templates/ReportTemplate';

/**
 * レポート表示ページコンポーネント
 * 分析結果のレポート ID を基に AI 生成レポートを表示するページ
 * @returns レポート表示ページの JSX 要素
 */
export default function ReportPage() {
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
