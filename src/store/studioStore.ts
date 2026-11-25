import { create } from 'zustand';
import { studioService } from '@/services/studioService';
import type { Studio3DPayload } from '@/types/studio';

export type SheetSnapPoint = 0.25 | 0.5 | 0.8;

interface StudioStoreState {
  payload: Studio3DPayload | null;
  isLoading: boolean;
  error: string | null;
  zoomLevel: number;
  explodeFactor: number;
  selectedComponentCode: string | null;
  sheetSnap: SheetSnapPoint;
  hasAutoExpandedExplode: boolean;

  setPayload: (payload: Studio3DPayload) => void;
  loadStudio: (projectId: string) => Promise<void>;
  setZoomAndExplode: (zoomRatio: number) => void;
  setManualExplode: (factor: number) => void;
  selectComponent: (code: string | null) => void;
  setSheetSnap: (snap: SheetSnapPoint) => void;
  resetView: () => void;
}

export const useStudioStore = create<StudioStoreState>((set, get) => ({
  payload: null,
  isLoading: false,
  error: null,
  zoomLevel: 1.0,
  explodeFactor: 0,
  selectedComponentCode: null,
  sheetSnap: 0.25,
  hasAutoExpandedExplode: false,

  setPayload: (payload) =>
    set({
      payload,
      isLoading: false,
      error: null,
      zoomLevel: 1.0,
      explodeFactor: 0,
      selectedComponentCode: null,
      sheetSnap: 0.25,
      hasAutoExpandedExplode: false,
    }),

  loadStudio: async (projectId) => {
    set({ isLoading: true, error: null });
    try {
      const payload = await studioService.getStudio3D(projectId);
      set({
        payload,
        isLoading: false,
        zoomLevel: 1.0,
        explodeFactor: 0,
        selectedComponentCode: null,
        sheetSnap: 0.25,
        hasAutoExpandedExplode: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Gagal memuat Studio 3D.',
      });
    }
  },

  setZoomAndExplode: (zoomRatio) => {
    const clampedZoom = Math.max(0.5, Math.min(3.5, zoomRatio));
    const isExploding = clampedZoom >= 1.3;
    const explodeFactor = isExploding
      ? Math.min(1, (clampedZoom - 1.3) / 0.6)
      : 0;

    const { hasAutoExpandedExplode, selectedComponentCode } = get();

    if (isExploding && !hasAutoExpandedExplode && !selectedComponentCode) {
      set({
        zoomLevel: clampedZoom,
        explodeFactor,
        sheetSnap: 0.5,
        hasAutoExpandedExplode: true,
      });
      return;
    }

    if (!isExploding && hasAutoExpandedExplode && !selectedComponentCode) {
      set({
        zoomLevel: clampedZoom,
        explodeFactor: 0,
        sheetSnap: 0.25,
        hasAutoExpandedExplode: false,
      });
      return;
    }

    set({ zoomLevel: clampedZoom, explodeFactor });
  },

  setManualExplode: (factor) => {
    const clamped = Math.max(0, Math.min(1, factor));
    set((state) => ({
      explodeFactor: clamped,
      sheetSnap:
        clamped > 0.15 && state.sheetSnap === 0.25 ? 0.5 : state.sheetSnap,
    }));
  },

  selectComponent: (code) =>
    set((state) => ({
      selectedComponentCode: code,
      sheetSnap: code ? (state.sheetSnap < 0.5 ? 0.5 : state.sheetSnap) : 0.5,
    })),

  setSheetSnap: (snap) => set({ sheetSnap: snap }),

  resetView: () =>
    set({
      zoomLevel: 1.0,
      explodeFactor: 0,
      selectedComponentCode: null,
      sheetSnap: 0.25,
      hasAutoExpandedExplode: false,
    }),
}));
