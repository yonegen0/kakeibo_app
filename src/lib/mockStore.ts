import type { AIReportModel } from '@/models/AIReportModel';
import type { PsvMetaModel, SummaryModel, TransactionModel } from '@/models/TransactionModel';

/* PSV レコードの型（メタデータと取引明細） */
type PsvRecord = {
  meta: PsvMetaModel;
  transactions: TransactionModel[];
  summary?: SummaryModel;
};

/* PSV レコードのマップ */
const psvStore = new Map<string, PsvRecord>();
/* AI レポートのマップ */
const reportStore = new Map<string, AIReportModel>();

/* 月範囲を抽出する純粋関数 */
const extractMonth = (date: string): string | null => {
  const match = date.match(/^(\d{4})[/-](\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}`;
};

/* 月範囲を抽出する純粋関数 */
const toMonthRange = (transactions: TransactionModel[]) => {
  const months = transactions
    .map((t) => extractMonth(t.date))
    .filter((m): m is string => Boolean(m))
    .sort();

  if (months.length === 0) {
    return { from: '', to: '' };
  }

  return { from: months[0], to: months[months.length - 1] };
};

/* PSV レコードを作成する関数 */
export const createPsvRecord = (params: {
  userId: string;
  fileName: string;
  transactions: TransactionModel[];
}) => {
  const psvId = `psv_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  /* 既存の PSV レコードを更新 */
  for (const [id, record] of psvStore.entries()) {
    psvStore.set(id, {
      ...record,
      meta: {
        ...record.meta,
        isLatest: false,
      },
    });
  }

  /* 新しい PSV レコードを作成 */
  const meta: PsvMetaModel = {
    psvId,
    userId: params.userId,
    fileName: params.fileName,
    rowCount: params.transactions.length,
    monthRange: toMonthRange(params.transactions),
    createdAt: now,
    updatedAt: now,
    isLatest: true,
  };

  /* PSV レコードを作成 */
  const record: PsvRecord = {
    meta,
    transactions: params.transactions,
  };
  /* PSV レコードを保存 */
  psvStore.set(psvId, record);
  return record;
};

/* PSV レコードを取得する関数 */
export const getPsvRecord = (psvId: string) => psvStore.get(psvId) ?? null;

/* PSV レコードを一覧表示する関数 */
export const listPsvRecords = () =>
  Array.from(psvStore.values()).sort((a, b) => b.meta.createdAt.localeCompare(a.meta.createdAt));

/* サマリーを保存する関数 */
export const saveSummary = (psvId: string, summary: SummaryModel) => {
  const record = psvStore.get(psvId);
  if (!record) return null;

  /* 新しい PSV レコードを作成 */
  const next: PsvRecord = {
    ...record,
    summary,
    meta: {
      ...record.meta,
      updatedAt: new Date().toISOString(),
    },
  };
  /* PSV レコードを保存 */
  psvStore.set(psvId, next);
  return next;
};

/* AI レポートを保存する関数 */
export const saveReport = (report: AIReportModel) => {
  reportStore.set(report.reportId, report);
};

/* AI レポートを取得する関数 */
export const getReport = (reportId: string) => reportStore.get(reportId) ?? null;

/* AI レポートを一覧表示する関数 */
export const listReports = (psvId?: string) =>
  Array.from(reportStore.values())
    .filter((report) => (psvId ? report.psvId === psvId : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
