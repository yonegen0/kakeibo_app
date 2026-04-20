/**
 * @file page.tsx
 * @description アップロード編集ページ。CSVファイルのアップロードと取引データの確認を行う最初のステップ。
 */
'use client';

import { Container } from '@mui/material';
import { TransactionImportTemplate } from '@/components/templates/TransactionImportTemplate';

/**
 * アップロード編集ページコンポーネント
 * CSVファイルのアップロードを受け付け、取引データを表示・編集するページ
 * @returns アップロード編集ページの JSX 要素
 */
export default function UploadPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* TransactionImportTemplate に高さを指定してテーブル表示領域を確保 */}
      <TransactionImportTemplate height={500} />
    </Container>
  );
}
