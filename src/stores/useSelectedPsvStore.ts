import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SelectedPsvState = {
  selectedPsvId: string;
  setSelectedPsvId: (psvId: string) => void;
  clearSelectedPsvId: () => void;
};

export const useSelectedPsvStore = create<SelectedPsvState>()(
  persist(
    (set) => ({
      selectedPsvId: '',
      setSelectedPsvId: (psvId) => {
        if (!psvId) return;
        set({ selectedPsvId: psvId });
      },
      clearSelectedPsvId: () => set({ selectedPsvId: '' }),
    }),
    {
      name: 'selected-psv-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
