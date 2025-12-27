import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // Property IDs
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  clearFavorites: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      
      addFavorite: (propertyId: string) => {
        set((state) => ({
          favorites: [...state.favorites, propertyId],
        }));
      },
      
      removeFavorite: (propertyId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== propertyId),
        }));
      },
      
      isFavorite: (propertyId: string) => {
        return get().favorites.includes(propertyId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
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
