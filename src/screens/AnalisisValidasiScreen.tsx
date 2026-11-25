import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  GitCommit,
  Paperclip,
  PenTool,
  Ruler,
  Scissors,
  Settings2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { scanService } from '@/services/scanService';
import { studioService } from '@/services/studioService';
import { useProjectStore } from '@/store/projectStore';
import { useScanStore } from '@/store/scanStore';
import { useStudioStore } from '@/store/studioStore';
import type { CraftTargetOption, ToolOption } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

function ToolIcon({
  iconName,
  selected,
}: {
  iconName: ToolOption['iconName'];
  selected: boolean;
}) {
  const cls = `h-10 w-10 transition-colors duration-300 ${
    selected ? 'text-success' : 'text-slate-400'
  }`;

  switch (iconName) {
    case 'pen-tool':
      return <PenTool className={cls} strokeWidth={1.5} />;
    case 'ruler':
      return <Ruler className={cls} strokeWidth={1.5} />;
    case 'scissors':
      return <Scissors className={cls} strokeWidth={1.5} />;
    case 'droplets':
      return <Droplets className={cls} strokeWidth={1.5} />;
    case 'git-commit':
      return <GitCommit className={cls} strokeWidth={1.5} />;
    case 'paperclip':
      return <Paperclip className={cls} strokeWidth={1.5} />;
  }
}

export default function AnalisisValidasiScreen() {
  const navigate = useNavigate();

  const {
    result,
    selectedToolIds,
    selectedTargetId,
    setResult,
    toggleTool,
    setSelectedTargetId,
  } = useScanStore();

  const setStudioPayload = useStudioStore((state) => state.setPayload);
  const addProject = useProjectStore((state) => state.addProject);

  const [tools, setTools] = useState<ToolOption[]>([]);
  const [targets, setTargets] = useState<CraftTargetOption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOptions() {
      try {
        const [toolList, targetList] = await Promise.all([
          scanService.getTools(),
          scanService.getCraftTargets(),
        ]);
        if (!active) return;
        setTools(toolList);
        setTargets(targetList);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Gagal memuat opsi validasi.'
        );
      }
    }

    void loadOptions();
    return () => {
      active = false;
    };
  }, []);

  const fallbackScan = useMemo(() => scanService.createManualScanDraft(), []);
  const activeScan = result ?? fallbackScan;

  const handleToggleTool = (toolId: string) => {
    void triggerHaptic('LIGHT');
    toggleTool(toolId);
  };

  const handleSelectTarget = (targetId: string) => {
    void triggerHaptic('LIGHT');
    setSelectedTargetId(targetId);
  };

  const handleGenerate3D = async () => {
    if (!selectedTargetId || selectedToolIds.length === 0) return;
    if (!result) setResult(activeScan);

    setIsGenerating(true);
    try {
      const payload = await studioService.generateStudio3D({
        scan: activeScan,
        toolIds: selectedToolIds,
        targetId: selectedTargetId,
      });

      setStudioPayload(payload);

      const chosenTarget = targets.find((t) => t.id === selectedTargetId);
      addProject({
        id: payload.projectId,
        name: payload.title,
        thumbnail: chosenTarget?.thumbnail ?? activeScan.photoUrl,
        iconHint: 'box',
        materialLabel: payload.primaryScrapMaterial,
        dimensionsCm: activeScan.dimensions,
        componentCount: payload.components.length,
        estimatedValueRangeIdr: payload.estimatedValueRangeIdr,
        offlineAvailable: true,
        inProduction: false,
        lastUpdatedLabel: 'Baru saja dibuat',
      });

      void triggerHaptic('MEDIUM');
      navigate(`/studio/${payload.projectId}`, { replace: true });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Gagal menghasilkan desain 3D.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = selectedToolIds.length > 0 && selectedTargetId !== null;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-gradient-to-b from-sky-lighter to-surface">
      <LoadingOverlay
        isVisible={isGenerating}
        steps={scanService.getAnalysisSteps()}
      />

      {/* Header (Sesuai HTML: Tombol bulat + Badge + Cek Alat & Bahan) */}
      <header className="z-20 shrink-0 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Kembali"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy shadow-soft transition-colors active:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div>
            <span className="rounded-sm bg-sky-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
              Validasi Studio
            </span>
            <h1 className="mt-1 text-xl font-bold leading-tight text-navy">
              Cek Alat &amp; Bahan
            </h1>
            <p className="mt-0.5 text-xs text-text-secondary">
              Mana saja yang tersedia di dekatmu? (
              <span className="font-mono font-semibold text-navy">
                {activeScan.dimensions.panjang}×{activeScan.dimensions.lebar}×
                {activeScan.dimensions.tinggi} cm
              </span>
              )
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="hide-scrollbar z-10 mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-4 pb-28">
        {/* Grid 2x3 Kartu Tinggi h-36 (Sesuai HTML) */}
        <div className="mt-2 grid grid-cols-2 gap-4">
          {tools.map((tool) => {
            const selected = selectedToolIds.includes(tool.id);
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleToggleTool(tool.id)}
                className={`relative flex h-36 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300 active:scale-95 ${
                  selected
                    ? 'border-success bg-[#F0FDF4] shadow-[0_0_20px_rgba(22,163,74,0.2)]'
                    : 'border-border bg-white shadow-soft'
                }`}
              >
                <ToolIcon iconName={tool.iconName} selected={selected} />
                <span
                  className={`text-center text-sm font-semibold leading-tight transition-colors duration-300 ${
                    selected ? 'text-success' : 'text-slate-500'
                  }`}
                >
                  {tool.name}
                </span>
                <div
                  className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 ${
                    selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Pilihan Target Karya (Untuk Direct-to-3D Opsi A) */}
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-navy">
            Pilih Target Karya 3D
          </h2>
          <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
            {targets.map((target) => {
              const isSelected = selectedTargetId === target.id;
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => handleSelectTarget(target.id)}
                  className={`w-56 shrink-0 overflow-hidden rounded-2xl border-2 bg-white text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-sky shadow-premium'
                      : 'border-border shadow-soft'
                  }`}
                >
                  <img
                    src={target.thumbnail}
                    alt={target.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="p-3">
                    <h3 className="truncate text-sm font-bold text-navy">
                      {target.name}
                    </h3>
                    <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                      {target.subtitle}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-success-light px-2 py-0.5 text-[10px] font-semibold text-success">
                      Potensi Rp {(target.estimatedValueRangeIdr[0] / 1000).toFixed(0)}rb–
                      {(target.estimatedValueRangeIdr[1] / 1000).toFixed(0)}rb
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Sticky Footer */}
      <footer className="absolute bottom-0 z-20 w-full shrink-0 border-t border-border bg-white/90 px-4 pt-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-up backdrop-blur-md">
        <button
          type="button"
          disabled={!canGenerate || isGenerating}
          onClick={handleGenerate3D}
          className="mx-auto flex w-full max-w-2xl items-center justify-center gap-2 rounded-[12px] bg-navy py-4 text-sm font-bold text-white shadow-premium transition-transform active:scale-[0.98] disabled:opacity-45"
        >
          <Settings2 className="h-[18px] w-[18px]" strokeWidth={1.8} />
          Generate Desain 3D
        </button>
      </footer>
    </div>
  );
}
