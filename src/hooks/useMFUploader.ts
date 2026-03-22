/**
 * @file useMFUploader.ts
 * @description 取引明細ファイルの読み込み、バリデーション、および表示用IDの付与を一括管理するカスタムフック。
 */
import { useState } from 'react';
import Papa from 'papaparse';
import { mfCsvFileSchema, type MfCsvData } from '@/schemas/mfCsvFileSchema';

/** * テーブル表示用にIDを付与した取引データの型 
 */
export type Transaction = MfCsvData[number] & {
  id: string;
};

/** ファイルアップロード処理の実行状態と結果を定義する型 */
export type MFUploaderResult = {
  /** 指定されたファイルの読み込み処理を開始するハンドラー */
  handleFileSelect: (file: File) => void;
  /** DataGridでの表示に適した（ID付与済み）取引明細データ */
  data: Transaction[] | null;
  /** エラー内容 */
  error: string | null;
  /** 解析および検証中フラグ */
  isParsing: boolean;
};

/**
 * 外部から取り込まれる取引データのパース、スキーマ検証、およびUI向け整形を提供します。
 * @returns `handleFileSelect`（ファイル選択）と、検証結果 `data`/`error`、解析中フラグ `isParsing`
 */
export const useMFUploader = (): MFUploaderResult => {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  /**
   * CSVをパースし、Zodによる検証を経て、各行に一意のIDを付与します。
   */
  const handleFileSelect = (file: File) => {
    setIsParsing(true);
    setError(null);

    // FileReader でテキストとして読み込んでから PapaParse で解析する
    // （ブラウザ上で Shift_JIS 等の文字コードを扱うため）
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = typeof reader.result === 'string' ? reader.result : '';

        // CSV解析
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // 構造検証
            const validated = mfCsvFileSchema.safeParse(results.data);

            if (validated.success) {
              // DataGrid用に各行へIDを付与してステートを更新
              const formattedData: Transaction[] = validated.data.map((row, index) => ({
                ...row,
                // ファイル名、インデックス、タイムスタンプを組み合わせて一意性を確保
                id: `${file.name}-${index}-${Date.now()}`,
              }));

              setData(formattedData);
              setError(null);
            } else {
              // バリデーション失敗時の処理
              setError('CSVの形式が正しくありません。カラム名などを確認してください。');
              console.error('[Schema Validation Error]:', validated.error);
            }
            setIsParsing(false);
          },
          error: (err: unknown) => {
            setError('ファイルの読み込み中に問題が発生しました。');
            console.error('[PapaParse Error]:', err);
            setIsParsing(false);
          },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`ファイルの読み込みに失敗しました: ${message}`);
        console.error('[FileReader/Parse Error]:', err);
        setIsParsing(false);
      }
    };

    reader.onerror = () => {
      setError('ファイルの読み込みに失敗しました。');
      console.error('[FileReader Error]:', reader.error);
      setIsParsing(false);
    };

    reader.readAsText(file, 'Shift_JIS');
  };

  return { handleFileSelect, data, error, isParsing };
};