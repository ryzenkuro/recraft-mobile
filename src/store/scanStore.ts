import { create } from 'zustand';
import type { ScanDimensionsCm, ScanFlowState, ScanResult } from '@/types';

interface ScanStoreState {
  scanState: ScanFlowState;
  result: ScanResult | null;
  error: string | null;
  selectedToolIds: string[];
  selectedTargetId: string | null;

  setProcessing: () => void;
  setResult: (result: ScanResult) => void;
  updateDimensions: (patch: Partial<ScanDimensionsCm>) => void;
  setError: (error: string) => void;
  toggleTool: (toolId: string) => void;
  setSelectedToolIds: (toolIds: string[]) => void;
  setSelectedTargetId: (targetId: string | null) => void;
  reset: () => void;
}

export const useScanStore = create<ScanStoreState>((set) => ({
  scanState: 'IDLE',
  result: null,
  error: null,
  selectedToolIds: ['T1', 'T2', 'T3'],
  selectedTargetId: 'TARGET_01',

  setProcessing: () => set({ scanState: 'PROCESSING', error: null }),

  setResult: (result) => set({ scanState: 'CONFIRMATION', result, error: null }),

  updateDimensions: (patch) =>
    set((state) => {
      if (!state.result) return state;
      return {
        result: {
          ...state.result,
          dimensions: { ...state.result.dimensions, ...patch },
        },
      };
    }),

  setError: (error) => set({ scanState: 'ERROR', error, result: null }),

  toggleTool: (toolId) =>
    set((state) => ({
      selectedToolIds: state.selectedToolIds.includes(toolId)
        ? state.selectedToolIds.filter((id) => id !== toolId)
        : [...state.selectedToolIds, toolId],
    })),

  setSelectedToolIds: (toolIds) => set({ selectedToolIds: toolIds }),

  setSelectedTargetId: (targetId) => set({ selectedTargetId: targetId }),

  reset: () =>
    set({
      scanState: 'IDLE',
      result: null,
      error: null,
      selectedToolIds: ['T1', 'T2', 'T3'],
      selectedTargetId: 'TARGET_01',
    }),
}));
