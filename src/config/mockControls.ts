import { create } from 'zustand';

interface MockControlsState {
  simulateSlowNetwork: boolean;
  forceNextError: string | null;
  setSimulateSlowNetwork: (enabled: boolean) => void;
  setForceNextError: (message: string | null) => void;
  consumeForcedError: () => string | null;
}

export const useMockControlsStore = create<MockControlsState>((set, get) => ({
  simulateSlowNetwork: false,
  forceNextError: null,

  setSimulateSlowNetwork: (enabled) => set({ simulateSlowNetwork: enabled }),
  setForceNextError: (message) => set({ forceNextError: message }),
  consumeForcedError: () => {
    const err = get().forceNextError;
    if (err) {
      set({ forceNextError: null });
    }
    return err;
  },
}));
