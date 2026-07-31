import { create } from 'zustand';

interface DepositModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useDepositModalStore = create<DepositModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
