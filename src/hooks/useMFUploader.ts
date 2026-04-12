/**
 * @file useMFUploader.ts
 * @description 家計用 CSV の読み込み・形式チェックと、一覧で行を識別するための一意キー付け。
 */
import { useCallback, useRef, useState } from 'react';
import Papa from 'papaparse';
import { buildMfCsvTransactionsFromRows, type MfCsvTransactionWithId } from '@/lib/mfCsvTransactions';
import { logClientError } from '@/lib/clientLog';

/**
 * MoneyForward エクスポート行に一覧用 ID を付けた形。
 * アプリ内ドメインの `TransactionModel` とは別レイヤ（取込アダプタ側の型）。
 */
export type Transaction = MfCsvTransactionWithId;

/* 
  useMFUploader の戻り値
*/
export type UseMFUploaderReturn = {
  /* ファイル選択時の処理 */
  handleFileSelect: (file: File) => void;
  /* 一覧表示用（行 ID 付与済み）の取引明細データ */
  data: Transaction[] | null;
  /* エラー内容 */
  error: string | null;
  /* 読み取り・検証中フラグ */
  isParsing: boolean;
};

/**
 * CSV 取込の入口。パース後に定義済みルールで検証し、一覧用キーを各行に付ける。
 * @returns 開始用の関数と、データ・エラー・処理中フラグ
 */
export const useMFUploader = (): UseMFUploaderReturn => {
  /* データを管理 */
  const [data, setData] = useState<Transaction[] | null>(null);
  /* エラーを管理 */
  const [error, setError] = useState<string | null>(null);
  /* 読み取り・検証中フラグ */
  const [isParsing, setIsParsing] = useState(false);
  /* 読み取り世代を管理 */
  const loadGenerationRef = useRef(0);

  /* ファイル選択時の処理 */
  const handleFileSelect = useCallback((file: File) => {
    // 読み取り世代を管理
    const generation = ++loadGenerationRef.current;
    // バッチトークンを管理
    const batchToken = `${generation}-${Date.now()}-${globalThis.crypto?.randomUUID?.() ?? ''}`;

    setIsParsing(true);
    setError(null);

    // FileReader でテキストとして読み込んでから PapaParse で解析する
    // （ブラウザ上で Shift_JIS 等の文字コードを扱うため）
    const reader = new FileReader();

    // 古い読み込み処理を無視するためのチェック
    const isStale = () => generation !== loadGenerationRef.current;

    // ファイル読み込み完了時の処理
    reader.onload = () => {
      if (isStale()) return;

      try {
        const text = typeof reader.result === 'string' ? reader.result : '';

        // PapaParse で CSV を解析
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (isStale()) return;

            // データを検証
            const built = buildMfCsvTransactionsFromRows(results.data, {
              fileName: file.name,
              batchToken,
            });

            // 検証成功の場合
            if (built.ok) {
              // データを設定
              setData(built.data);
              setError(null);
            } else {
              setError(built.error);
              logClientError('useMFUploader', 'CSV schema validation failed', built.zodError);
            }
            if (!isStale()) {
              setIsParsing(false);
            }
          },
          error: (err: unknown) => {
            if (isStale()) return;
            setError('ファイルの読み込み中に問題が発生しました。');
            logClientError('useMFUploader', 'PapaParse failed', err);
            setIsParsing(false);
          },
        });
      } catch (err) {
        if (isStale()) return;
        const message = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(`ファイルの読み込みに失敗しました: ${message}`);
        logClientError('useMFUploader', 'FileReader / parse handler failed', err);
        setIsParsing(false);
      }
    };

    // ファイル読み込みエラー時の処理
    reader.onerror = () => {
      if (isStale()) return;
      setError('ファイルの読み込みに失敗しました。');
      logClientError('useMFUploader', 'FileReader failed', reader.error);
      setIsParsing(false);
    };

    reader.readAsText(file, 'Shift_JIS');
  }, []);

  return { handleFileSelect, data, error, isParsing };
};
