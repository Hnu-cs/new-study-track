import { create } from 'zustand';

// Simple test store to check if Zustand works correctly
interface TestState {
  isLoading: boolean;
  count: number;
  increment: () => void;
  setLoading: (loading: boolean) => void;
}

export const useTestStore = create<TestState>((set) => ({
  isLoading: true,
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
