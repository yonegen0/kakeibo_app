/**
 * @file AIReportHeader.tsx
 * @description AI家計レポートカード共通の見出し行（アイコン・タイトル・補足テキスト）  
 */
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InsightsIcon from '@mui/icons-material/Insights';

/** ヘッダー行全体（左右配置・下線・下余白）  */
const StyledHeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

/** 左側のアイコンとタイトル塊を横並びにするラッパー  */
const StyledTitleCluster = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

/**  レポート種別を示す主アイコン（サイズとプライマリ色）   */
const StyledInsightsIcon = styled(InsightsIcon)(({ theme }) => ({
  fontSize: 32,
  color: theme.palette.primary.main,
}));

/** 見出しテキスト（アイキャッチ＋見出し）を縦積みにするラッパー  */
const StyledTitleStack = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

/**  「AI Insights」などの小見出し（プライマリ色・太字）  */
const StyledEyebrowText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

/**  カード主題「家計レポート」の太字見出し   */
const StyledMainHeading = styled(Typography)(() => ({
  fontWeight: 800,
}));

/** 右側の補足説明（セカンダリテキスト色）   */
const StyledSideCaption = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

/** AIReportHeader の Props */
export type AIReportHeaderProps = {
  /** アイキャッチ行（例: AI Insights） */
  eyebrowText: string;
  /** メイン見出し（例: 家計レポート） */
  headingText: string;
  /** 右側の補足説明 */
  sideCaption: string;
};

/**
 * AI家計レポートカードの共通ヘッダーを表示する 
 * @param props.eyebrowText アイキャッチ文言
 * @param props.headingText メイン見出し文言
 * @param props.sideCaption 右側の補足文言
 * @returns ヘッダー行
 */
export const AIReportHeader = (props: AIReportHeaderProps) => {
  return (
    <StyledHeaderRow>
      <StyledTitleCluster>
        <StyledInsightsIcon aria-hidden />
        <StyledTitleStack>
          <StyledEyebrowText variant="overline">{props.eyebrowText}</StyledEyebrowText>
          <StyledMainHeading variant="h6">{props.headingText}</StyledMainHeading>
        </StyledTitleStack>
      </StyledTitleCluster>
      <StyledSideCaption variant="body2">{props.sideCaption}</StyledSideCaption>
    </StyledHeaderRow>
  );
};
