# プロジェクト概要

- 言語: TypeScript
- フレームワーク: Next.js (App Router) + React
- UI: MUI v5 / MUI X DataGrid（`styled` 中心）
- 開発運用: Storybook で表示パターン確認
- 主な機能領域:
  - CSV取り込み（検証 + 画面表示用ID付与）
  - 取引一覧表示（通常表示 / AI自動仕訳付きプレビュー）
  - 月次サマリー（収入・支出・残高・カテゴリ内訳）
  - AI家計レポート（要約 + Markdown本文）

## 現在の実装方針（要点）

- `src/components` は Atomic Design 構成（atoms / molecules / organisms / templates）
- `src/hooks` は UI から分離した責務で実装
- コンポーネント定義は `React.FC` ではなく `const X = (props: XProps) => {}` を使う
- コメントは「ファイルを辿らなくても意味が分かる説明」を優先する
- ただし Components では次の JSDoc 形式を維持する:
  - `/** X の Props */`
  - コンポーネント本体に `@param` / `@returns`

## 情報検索方針

- 外部情報が必要な場合は公式ドキュメントを最優先
- 推測で API 仕様を決めない
- Web 検索時は公式ドメインを優先（例: `site:nextjs.org`, `site:mui.com`, `site:docs.aws.amazon.com`）
