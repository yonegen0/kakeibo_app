/**
 * @file TransactionImportTemplate.tsx
 * @description CSVアップロードとPSV保存を行うテンプレートコンポーネント
 * ワークフローの最初のステップとして、MoneyForward CSVをアップロードし、
 * 取引データを変換・集計してPSV形式で保存する
 */

import { Alert, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledHeroCard, StepHeader } from '@/components/atoms/PageShell';
import { CsvUploadMonitor } from '@/components/organisms/CsvUploadMonitor';
import { TransactionTable } from '@/components/organisms/TransactionTable';
import { SummaryCard } from '@/components/organisms/SummaryCard';
import { useTransactionImportTemplate } from '@/hooks/useTransactionImportTemplate';
import { Button } from '@/components/atoms/Button';

/* --- Types --- */
/**
 * TransactionImportTemplate の Props
 */
type TransactionImportTemplateProps = {
  /** 取引表の高さ */
  height?: number | string;
};

/* --- Styled --- */

/** セクション間余白を調整するラッパー */
const StyledSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

/** レポート生成ボタン用の余白 */
const StyledActionArea = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

/** エラー表示スロット */
const StyledErrorSlot = styled(Box)(() => ({
  flex: 1,
}));

/* --- Component --- */
/**
 * CSVアップロードの結果に応じて、取引テーブルを表示するテンプレートコンポーネント
 *
 * ワークフローのStep 1として機能し、MoneyForward CSVのアップロードを受け付け、
 * データを取引モデルに変換して集計・表示する。PSV保存後は分析画面へ遷移する。
 *
 * @param props.height テーブル表示用の高さ（任意）
 * @returns アップロード/取引一覧表示用の要素
 */
export const TransactionImportTemplate = (props: TransactionImportTemplateProps) => {
  const {
    transactions,
    summaries,
    isParsing,
    isAnalyzing,
    error,
    saveError,
    validationError,
    handleSavePsv,
    handleFileSelect,
    dataLength,
    handleToggleFixedCost,
    handleUpdateRow,
  } = useTransactionImportTemplate();

  return (
    <StyledHeroCard elevation={0}>
      <StepHeader
        step="01"
        title="CSVアップロード"
        desc="MoneyForward CSVを取り込み、取引データを確認してPSVを保存します。"
      />

      <CsvUploadMonitor
        handleFileSelect={handleFileSelect}
        dataLength={dataLength}
        isParsing={isParsing}
        error={error}
      />

      {!isParsing && transactions.length > 0 && (
        <>
          <StyledSection>
            <SummaryCard summaries={summaries} />
          </StyledSection>

          <StyledSection>
            <StyledActionArea>
              <StyledErrorSlot>
                {error && <Alert severity="error">{error}</Alert>}
                {saveError && <Alert severity="error">{saveError}</Alert>}
                {validationError && <Alert severity="warning">{validationError}</Alert>}
              </StyledErrorSlot>
              <Button
                variant="contained"
                color="secondary"
                disabled={isAnalyzing || summaries.length === 0}
                onClick={handleSavePsv}
              >
                {isAnalyzing ? 'PSV保存中...' : 'PSV保存して分析画面へ'}
              </Button>
            </StyledActionArea>
          </StyledSection>

          <StyledSection>
            <TransactionTable rows={transactions} height={props.height} onToggleFixedCost={handleToggleFixedCost} onUpdateRow={handleUpdateRow} />
          </StyledSection>
        </>
      )}
    </StyledHeroCard>
  );
};
