/**
 * @file page.tsx
 * @description 家計簿アプリのホームページ。3ステップの分析フローの入口となるランディングページ。
 */
'use client';

import Link from 'next/link';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/* --- Styled Components --- */

/** ページ全体のレイアウトコンテナ */
const StyledPage = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(8),
}));

/** ヒーローセクション：アプリの概要とナビゲーション */
const StyledHero = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  border: `1px solid ${theme.palette.primary.light}`,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: `linear-gradient(140deg, ${theme.palette.background.paper} 0%, ${theme.palette.primary.light}22 100%)`,
  backdropFilter: 'blur(6px)',
  boxShadow: '0 20px 45px rgba(28, 52, 133, 0.14)',
}));

/** ヒーロー内の上段レイアウト：タイトルとリンクを横並びに */
const StyledTopRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

/** コンポーネント確認ページへのリンク */
const StyledPreviewLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.dark,
  fontWeight: 700,
  textDecoration: 'none',
  padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(1.5),
  backgroundColor: `${theme.palette.primary.light}26`,
  '&:hover': {
    backgroundColor: `${theme.palette.primary.light}40`,
  },
}));

const StyledSteps = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: theme.spacing(1.25),
  marginTop: theme.spacing(3),
}));

const StyledStepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: `${theme.palette.background.paper}cc`,
}));

/**
 * ホームページコンポーネント
 * 家計簿アプリのランディングページとして、3ステップの分析フローを案内する
 * @returns ホームページの JSX 要素
 */
export default function Home() {
  return (
    <StyledPage>
      {/* メインコンテンツを中央に配置 */}
      <Container maxWidth="lg">
        {/* ヒーローセクション：アプリ概要とナビゲーション */}
        <StyledHero elevation={0}>
          <StyledTopRow>
            {/* 左側：アプリタイトルと説明、ナビゲーションボタン */}
            <Box>
              <Typography variant="overline" color="primary" fontWeight={700}>
                Kakeibo App
              </Typography>
              <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: '-0.02em' }}>
                家計分析フロー（3ステップ）
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 660, mt: 0.5 }}>
                新しい詳細設計書に合わせて、アップロード・分析・レポートを画面分離しています。
              </Typography>
              {/* 3ステップのナビゲーションボタン */}
              <Stack direction="row" spacing={1.5} sx={{ mt: 2.5, flexWrap: 'wrap' }}>
                <Button component={Link} href="/upload" variant="contained">
                  1. アップロード編集へ
                </Button>
                <Button component={Link} href="/analysis" variant="outlined">
                  2. 分析実行へ
                </Button>
                <Button component={Link} href="/report" variant="outlined">
                  3. レポート表示へ
                </Button>
              </Stack>

              <StyledSteps>
                <StyledStepCard elevation={0}>
                  <Typography variant="caption" color="primary" fontWeight={700}>
                    STEP 1
                  </Typography>
                  <Typography fontWeight={700}>CSVアップロード</Typography>
                  <Typography variant="body2" color="text.secondary">
                    MoneyForward CSVを取り込み、取引を確認します。
                  </Typography>
                </StyledStepCard>
                <StyledStepCard elevation={0}>
                  <Typography variant="caption" color="primary" fontWeight={700}>
                    STEP 2
                  </Typography>
                  <Typography fontWeight={700}>AI分析実行</Typography>
                  <Typography variant="body2" color="text.secondary">
                    集計結果をもとに分析を実行し、所見を生成します。
                  </Typography>
                </StyledStepCard>
                <StyledStepCard elevation={0}>
                  <Typography variant="caption" color="primary" fontWeight={700}>
                    STEP 3
                  </Typography>
                  <Typography fontWeight={700}>レポート閲覧</Typography>
                  <Typography variant="body2" color="text.secondary">
                    保存済みの分析レポートをいつでも再表示できます。
                  </Typography>
                </StyledStepCard>
              </StyledSteps>
            </Box>
            {/* 右側：開発者向けコンポーネント確認ページへのリンク */}
            <StyledPreviewLink href="/components-preview">
              コンポーネント確認ページへ
            </StyledPreviewLink>
          </StyledTopRow>
        </StyledHero>
      </Container>
    </StyledPage>
  );
}
