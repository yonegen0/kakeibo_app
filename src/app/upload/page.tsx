/**
 * @file page.tsx
 * @description アップロード編集ページ。CSVファイルのアップロードと取引データの確認を行う最初のステップ。
 */
'use client';

import { Container } from '@mui/material';
import { StyledPage } from '@/components/atoms/PageShell';
import { TransactionImportTemplate } from '@/components/templates/TransactionImportTemplate';

/**
 * アップロード編集ページコンポーネント
 * CSVファイルのアップロードを受け付け、取引データを表示・編集するページ
 * @returns アップロード編集ページの JSX 要素
 */
export default function UploadPage() {
  return (
    <StyledPage>
      <Container maxWidth="lg">
        <TransactionImportTemplate height={500} />
      </Container>
    </StyledPage>
  );
}
