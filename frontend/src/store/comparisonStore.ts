import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ComparisonState {
  comparisonIds: string[]; // Property IDs to compare
  addToComparison: (propertyId: string) => void;
  removeFromComparison: (propertyId: string) => void;
  isInComparison: (propertyId: string) => boolean;
  clearComparison: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      comparisonIds: [],
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      
      addToComparison: (propertyId: string) => {
        const current = get().comparisonIds;
        if (current.length >= 4) {
          if (typeof window !== 'undefined') {
            alert('You can only compare up to 4 properties at once');
          }
          return;
        }
        if (!current.includes(propertyId)) {
          set((state) => ({
            comparisonIds: [...state.comparisonIds, propertyId],
          }));
        }
      },
      
      removeFromComparison: (propertyId: string) => {
        set((state) => ({
          comparisonIds: state.comparisonIds.filter((id) => id !== propertyId),
        }));
      },
      
      isInComparison: (propertyId: string) => {
        return get().comparisonIds.includes(propertyId);
      },
      
      clearComparison: () => {
        set({ comparisonIds: [] });
      },
    }),
    {
      name: 'comparison-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a dummy storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
