/**
 * @file TransactionPreviewTable.tsx
 * @description AI解析機能（自動仕訳）を備えた、取引明細データ表示用の DataGrid コンポーネント。
 */
import React from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, Toolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { Amount, TransactionModel } from '@/models/TransactionModel';
import { useAIAnalyzer } from '@/hooks/useAIAnalyzer';

/**
 * TransactionPreviewTableのプロップス定義
 */
type TransactionPreviewTableProps = {
  /** 表示対象の取引データ（配列） */
  rows: TransactionModel[];
  /** データ更新時のコールバック（AI解析結果の反映用） */
  onDataUpdate: (newRows: TransactionModel[]) => void;
  /** テーブル全体の高さ (デフォルト 600) */
  height?: number | string;
};

/* --- Styled Components --- */

/** コンポーネントのルートコンテナ */
const StyledRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(4),
}));

/** セクションタイトル */
const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginLeft: theme.spacing(1),
}));

/** DataGridを内包するカード型のコンテナ */
const StyledTableContainer = styled(Paper)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

/** 高さ制御用のラッパー */
const DataGridWrapper = styled('div')<Pick<TransactionPreviewTableProps, 'height'>>(({ height }) => ({
  height: height ?? 600,
  width: '100%',
}));

/** AI解析実行ボタン：ツールバー内での視認性を高めるスタイル */
const AIAnalyzeButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  fontWeight: 'bold',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(1),
}));

/** カスタムツールバーのルート（MUI X の推奨構成に準拠） */
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/* --- Column Definitions --- */

/**
 * テーブルのカラム定義
 * TransactionModel のプロパティに基づき構成
 */
const columns: GridColDef<TransactionModel>[] = [
  { field: 'date', headerName: '計算日', width: 120 },
  { field: 'content', headerName: '内容', flex: 1, minWidth: 200 },
  { 
    field: 'amount', 
    headerName: '金額 (円)', 
    type: 'number', 
    width: 120,
    valueGetter: (value: Amount) => value?.value,
    valueFormatter: (value: number) => value?.toLocaleString() ?? '0',
  },
  { field: 'category', headerName: '大項目', width: 150, editable: true },
  { field: 'subCategory', headerName: '中項目', width: 150, editable: true },
  { field: 'memo', headerName: '解析理由/メモ', width: 250, editable: true },
];
/* --- Main Component --- */

/**
 * AI解析ボタンを含むカスタムツールバーコンポーネント
 */
const CustomToolbar = ({ 
  onAnalyze, 
  isAnalyzing, 
  hasData 
}: { 
  onAnalyze: () => void; 
  isAnalyzing: boolean; 
  hasData: boolean;
}) => (
  <StyledToolbar>
    <AIAnalyzeButton
      variant="contained"
      color="secondary"
      startIcon={isAnalyzing ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
      onClick={onAnalyze}
      disabled={isAnalyzing || !hasData}
    >
      {isAnalyzing ? 'AI解析中...' : 'AIで仕訳を自動補完'}
    </AIAnalyzeButton>
  </StyledToolbar>
);

/**
 * 検証済みデータを一覧表示し、AI解析による補完機能を提供するテーブルコンポーネント。
 */
export const TransactionPreviewTable: React.FC<TransactionPreviewTableProps> = (props) => {
  const { analyzeTransactions, isAnalyzing } = useAIAnalyzer();

  /**
   * AI解析ボタン押下時の実行ロジック
   */
  const handleAIAnalyze = async () => {
    const updatedData = await analyzeTransactions(props.rows);
    props.onDataUpdate(updatedData);
  };

  return (
    <StyledRoot>
      <StyledTitle variant="h6" fontWeight="bold">
        取り込みデータプレビュー
      </StyledTitle>
      
      <StyledTableContainer>
        <DataGridWrapper height={props.height}>
          <DataGrid
            rows={props.rows}
            columns={columns}
            slots={{ 
              toolbar: () => (
                <CustomToolbar 
                  onAnalyze={handleAIAnalyze} 
                  isAnalyzing={isAnalyzing} 
                  hasData={props.rows.length > 0} 
                />
              ) 
            }}
            loading={isAnalyzing}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </DataGridWrapper>
      </StyledTableContainer>
    </StyledRoot>
  );
};