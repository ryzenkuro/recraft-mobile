import { ArrowLeft, Layers, RotateCcw } from 'lucide-react';
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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-sky-lighter md:flex-row">
      {/* KIRI / UTAMA: Kanvas 3D Interaktif */}
      <div className="relative h-full w-full md:w-[60%]">
        <StudioCanvas3D payload={payload} resetSignal={resetSignal} />

        {/* Top Floating Bar */}
        <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-center justify-between gap-2 px-3 pt-[max(env(safe-area-inset-top),0.75rem)]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="pointer-events-auto inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-white/90 px-3 text-xs font-semibold text-navy shadow-soft backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
            Kembali
          </button>

          <div className="pointer-events-auto truncate rounded-full bg-navy/95 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft backdrop-blur">
            {activeComp ? (
              <span>
                <span className="font-mono text-sky-light">{activeComp.code}</span>{' '}
                • {activeComp.name}
              </span>
            ) : (
              payload.title
            )}
          </div>

          <button
            type="button"
            aria-label="Reset Kamera 3D"
            onClick={handleResetCamera}
            className="pointer-events-auto inline-flex min-h-11 items-center gap-1 rounded-xl bg-white/90 px-3 text-xs font-semibold text-navy shadow-soft backdrop-blur"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </header>

        {/* Kontrol Sisi Kanan: Zoom & Explode Halus */}
        <aside className="absolute right-3 top-24 z-20 flex flex-col items-center gap-2 rounded-2xl border border-border bg-white/90 px-2.5 py-3 shadow-soft backdrop-blur">
          <Layers className="h-4 w-4 text-navy" strokeWidth={1.5} />
          <span className="font-mono text-[10px] font-bold text-sky">
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
          <span className="font-mono text-[10px] text-text-secondary">
            {zoomLevel.toFixed(1)}x
          </span>
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

              {/* Drag Handle */}
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
