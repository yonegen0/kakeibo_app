/**
 * @file useComponentsPreviewStore.ts
 * @description コンポーネント組み合わせ確認ページの状態管理を担当するストア。
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/* 
  useComponentsPreviewStore の状態
*/
type ComponentsPreviewState = {
  /* 最後のPSV ID */
  lastPsvId: string;
  /* 最後のレポート ID */
  lastReportId: string;
  /* 最後のPSV IDを設定する */
  setLastPsvId: (psvId: string) => void;
  /* 最後のレポート IDを設定する */
  setLastReportId: (reportId: string) => void;
  /* 最後のPSV IDとレポート IDをクリアする */
  clear: () => void;
};

/**
 * コンポーネント組み合わせ確認ページの状態管理を担当するストア。
 * @returns コンポーネント組み合わせ確認ページの状態管理を担当するストア。
 */
export const useComponentsPreviewStore = create<ComponentsPreviewState>()(
  // 永続化
  persist(
    // 状態管理
    (set) => ({
      lastPsvId: '',
      lastReportId: '',
      setLastPsvId: (psvId) => {
        if (!psvId) return;
        set({ lastPsvId: psvId });
      },
      setLastReportId: (reportId) => {
        if (!reportId) return;
        set({ lastReportId: reportId });
      },
      clear: () => set({ lastPsvId: '', lastReportId: '' }),
    }),
    {
      name: 'components-preview-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
