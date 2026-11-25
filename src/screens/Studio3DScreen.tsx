import { ArrowLeft, Layers, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Drawer } from 'vaul';
import { StudioCanvas3D } from '@/components/studio/StudioCanvas3D';
import { StudioSheetContent } from '@/components/studio/StudioSheetContent';
import { DEFAULT_STUDIO_PROJECT_ID } from '@/mocks';
import { type SheetSnapPoint, useStudioStore } from '@/store/studioStore';

const SNAP_POINTS: SheetSnapPoint[] = [0.25, 0.5, 0.8];

export default function Studio3DScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const projectId = id ?? DEFAULT_STUDIO_PROJECT_ID;

  const {
    payload,
    isLoading,
    error,
    zoomLevel,
    explodeFactor,
    selectedComponentCode,
    sheetSnap,
    loadStudio,
    setManualExplode,
    selectComponent,
    setSheetSnap,
    resetView,
  } = useStudioStore();

  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    if (!payload || payload.projectId !== projectId) {
      void loadStudio(projectId);
    }
  }, [payload, projectId, loadStudio]);

  const handleResetCamera = () => {
    resetView();
    setResetSignal((n) => n + 1);
  };

  if (isLoading || !payload) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface p-6 text-center">
        {error ? (
          <>
            <p className="text-sm font-semibold text-danger">{error}</p>
            <button
              type="button"
              onClick={() => void loadStudio(projectId)}
              className="mt-4 min-h-11 rounded-xl bg-navy px-5 text-sm font-semibold text-white"
            >
              Muat Ulang Studio 3D
            </button>
          </>
        ) : (
          <p className="text-sm font-medium text-text-secondary">
            Menyiapkan kanvas 3D Studio...
          </p>
        )}
      </div>
    );
  }

  const activeComp = selectedComponentCode
    ? payload.components.find((c) => c.code === selectedComponentCode)
    : null;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface md:flex-row">
      {/* KIRI / UTAMA: Kanvas 3D Interaktif dengan Grid Teknik HTML */}
      <div className="relative h-full w-full md:w-[60%]">
        <div className="bg-engineering-grid pointer-events-none absolute inset-0 opacity-70" />
        <StudioCanvas3D payload={payload} resetSignal={resetSignal} />

        {/* FLOATING TOP BAR (Sesuai Prototipe HTML Visualisasi 3D) */}
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
          <div className="flex items-start justify-between gap-2">
            <button
              type="button"
              aria-label="Kembali"
              onClick={() => navigate(-1)}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/90 text-navy shadow-soft backdrop-blur-md transition-colors active:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <div className="flex flex-col items-center gap-1.5">
              <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-navy-light bg-navy px-4 py-2 text-xs font-semibold text-white shadow-premium">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky" />
                <span className="max-w-[190px] truncate">
                  {activeComp
                    ? `Menyorot: ${activeComp.code} ${activeComp.name}`
                    : payload.title}
                </span>
              </div>

              <div className="pointer-events-auto rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[10px] font-bold text-navy shadow-soft backdrop-blur-md">
                {payload.components.length} Komponen • {zoomLevel.toFixed(1)}x
              </div>
            </div>

            <button
              type="button"
              aria-label="Reset Kamera 3D"
              onClick={handleResetCamera}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/90 text-slate-500 shadow-soft backdrop-blur-md transition-colors active:text-navy"
            >
              <RefreshCw className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </header>

        {/* Kontrol Sisi Kanan: Explode Slider */}
        <aside className="absolute right-3 top-28 z-20 flex flex-col items-center gap-2 rounded-full border border-white/60 bg-white/90 px-2 py-3.5 shadow-soft backdrop-blur-md">
          <Layers className="h-4 w-4 text-sky" strokeWidth={1.7} />
          <span className="font-mono text-[10px] font-bold text-navy">
            {Math.round(explodeFactor * 100)}%
          </span>
          <input
            type="range"
            aria-label="Atur pecah komponen 3D"
            min={0}
            max={100}
            value={Math.round(explodeFactor * 100)}
            onChange={(e) => setManualExplode(Number(e.target.value) / 100)}
            className="h-24 w-2 cursor-pointer accent-navy [writing-mode:vertical-lr] [direction:rtl]"
          />
        </aside>
      </div>

      {/* DESKTOP SIDE INSPECTOR PANEL (40% Kanan) */}
      <aside className="hidden h-full flex-col overflow-y-auto border-l border-border bg-surface pt-4 md:flex md:w-[40%]">
        <StudioSheetContent
          payload={payload}
          selectedCode={selectedComponentCode}
          onSelectComponent={selectComponent}
        />
      </aside>

      {/* MOBILE DYNAMIC BOTTOM SHEET (vaul: 25% Peek / 50% Explode / 80% Detail) */}
      <div className="md:hidden">
        <Drawer.Root
          modal={false}
          dismissible={false}
          open={true}
          snapPoints={SNAP_POINTS}
          activeSnapPoint={sheetSnap}
          setActiveSnapPoint={(next) => {
            if (next === 0.25 || next === 0.5 || next === 0.8) {
              setSheetSnap(next);
            }
          }}
        >
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 flex h-[92vh] flex-col rounded-t-[24px] border-t border-border bg-surface shadow-up outline-none">
              <Drawer.Title className="sr-only">
                Inspector Arsitektur 3D {payload.title}
              </Drawer.Title>
              <Drawer.Description className="sr-only">
                Ringkasan karya, denah potongan, dan detail komponen
              </Drawer.Description>

              <div className="flex shrink-0 justify-center py-3">
                <div className="h-1.5 w-12 rounded-full bg-slate-300" />
              </div>

              <div className="flex-1 overflow-y-auto pb-[max(env(safe-area-inset-bottom),1.5rem)]">
                <StudioSheetContent
                  payload={payload}
                  selectedCode={selectedComponentCode}
                  isPeekOnly={sheetSnap === 0.25 && !selectedComponentCode}
                  onSelectComponent={selectComponent}
                  onExpandSheet={setSheetSnap}
                />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  );
}
