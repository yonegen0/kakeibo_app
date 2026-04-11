/**
 * @file MarkdownRenderer.tsx
 * @description レポート本文など、Markdown をそのまま読みやすく表示する。
 */
import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

/* --- Types --- */

/**
 * MarkdownRenderer コンポーネントのプロップス定義
 */
/**
 * MarkdownRenderer の Props
 */
type MarkdownRendererProps = {
  /** 表示するソース文字列 */
  markdown: string;
};

/* --- Styled Components --- */

/** Markdown テキストのスタイルを適用するコンテナ */
const StyledMarkdown = styled(Box)(({ theme }) => ({
  lineHeight: 1.7,
  fontSize: '0.9rem',

  '& h1, & h2, & h3': {
    fontWeight: 700,
    letterSpacing: '-0.01em',
    marginTop: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
  },

  '& h1': {
    fontSize: '1.3rem',
  },
  '& h2': {
    fontSize: '1.15rem',
  },
  '& h3': {
    fontSize: '1rem',
  },

  '& p': {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
  },

  '& ul, & ol': {
    paddingLeft: theme.spacing(3),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  '& li': {
    marginBottom: theme.spacing(0.5),
  },

  '& blockquote': {
    margin: theme.spacing(1.5, 0),
    padding: theme.spacing(1, 2),
    borderLeft: `3px solid ${theme.palette.secondary.main}`,
    backgroundColor: 'rgba(15, 23, 42, 0.02)',
    color: theme.palette.text.secondary,
  },

  '& code': {
    fontFamily: theme.typography.fontFamily,
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
    padding: '0.1em 0.25em',
    borderRadius: 4,
  },

  '& pre code': {
    display: 'block',
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    backgroundColor: 'rgba(15, 23, 42, 0.06)',
    overflowX: 'auto',
  },
}));

/**
 * Markdown 本文をスタイル付きで描画する
 * @param props.markdown 描画する Markdown 本文
 * @returns Markdown 表示用の要素
 */
export const MarkdownRenderer = (props: MarkdownRendererProps) => (
  <StyledMarkdown>
    {/* 生HTMLは描画せず、安全な要素だけをレンダリングする */}
    <ReactMarkdown
      skipHtml
      allowedElements={[
        'h1',
        'h2',
        'h3',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'code',
        'pre',
        'strong',
        'em',
      ]}
    >
      {props.markdown}
    </ReactMarkdown>
  </StyledMarkdown>
);

