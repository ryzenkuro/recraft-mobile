import {
  ArrowLeft,
  Check,
  Droplets,
  Layers,
  PenTool,
  Ruler,
  Scissors,
  Sparkles,
  Spline,
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

function ToolIcon({ iconName }: { iconName: ToolOption['iconName'] }) {
  switch (iconName) {
    case 'pen-tool':
      return <PenTool className="h-5 w-5" strokeWidth={1.5} />;
    case 'ruler':
      return <Ruler className="h-5 w-5" strokeWidth={1.5} />;
    case 'scissors':
      return <Scissors className="h-5 w-5" strokeWidth={1.5} />;
    case 'droplets':
      return <Droplets className="h-5 w-5" strokeWidth={1.5} />;
    case 'spline':
      return <Spline className="h-5 w-5" strokeWidth={1.5} />;
    case 'layers':
      return <Layers className="h-5 w-5" strokeWidth={1.5} />;
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

    if (!result) {
      setResult(activeScan);
    }

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
        thumbnail:
          chosenTarget?.thumbnail ??
          activeScan.photoUrl,
        materialLabel: payload.primaryScrapMaterial,
        dimensionsCm: activeScan.dimensions,
        componentCount: payload.components.length,
        estimatedValueRangeIdr: payload.estimatedValueRangeIdr,
        offlineAvailable: true,
        inProduction: false,
        lastUpdatedLabel: 'Baru saja',
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
    <div className="flex min-h-full flex-col bg-surface pt-[max(env(safe-area-inset-top),0.75rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)]">
      <LoadingOverlay
        isVisible={isGenerating}
        steps={scanService.getAnalysisSteps()}
        subtitle="Menyusun stabilitas struktur & model 3D Direct-to-Studio..."
      />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-navy"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          Kembali
        </button>
        <span className="font-mono text-xs font-semibold text-text-secondary">
          Validasi Studio
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-4">
        {/* Ringkasan Bahan Terdeteksi */}
        <section className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-soft">
          <div>
            <span className="text-xs font-semibold text-sky">
              Material Terkalibrasi
            </span>
            <h1 className="text-base font-bold text-navy">
              {activeScan.materialType}
            </h1>
          </div>
          <span className="rounded-xl bg-sky-lighter px-3 py-1.5 font-mono text-xs font-bold text-navy">
            {activeScan.dimensions.panjang} × {activeScan.dimensions.lebar} ×{' '}
            {activeScan.dimensions.tinggi} cm
          </span>
        </section>

        {/* Grid 2x3 Alat & Bahan Pendukung */}
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-base font-bold text-navy">
              Alat & Bahan yang Dimiliki
            </h2>
            <span className="font-mono text-xs text-text-secondary">
              {selectedToolIds.length} dipilih
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => {
              const selected = selectedToolIds.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToggleTool(tool.id)}
                  className={`relative flex min-h-16 items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98] ${
                    selected
                      ? 'border-success bg-success-light/40 shadow-soft'
                      : 'border-border bg-white hover:border-sky/50'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? 'bg-success text-white'
                        : 'bg-sky-lighter text-navy'
                    }`}
                  >
                    <ToolIcon iconName={tool.iconName} />
                  </div>
                  <span className="text-sm font-semibold text-navy">
                    {tool.name}
                  </span>
                  {selected && (
                    <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Carousel Pilihan Target Karya */}
        <section>
          <div className="mb-3">
            <h2 className="text-base font-bold text-navy">
              Pilih Target Karya Inovasi
            </h2>
            <p className="text-xs text-text-secondary">
              Rekomendasi struktur yang cocok dengan dimensi bahan Anda
            </p>
          </div>

          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
            {targets.map((target) => {
              const isSelected = selectedTargetId === target.id;
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => handleSelectTarget(target.id)}
                  className={`w-64 shrink-0 snap-start overflow-hidden rounded-2xl border bg-white text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'border-sky ring-2 ring-sky/30 shadow-premium'
                      : 'border-border shadow-soft'
                  }`}
                >
                  <img
                    src={target.thumbnail}
                    alt={target.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-navy">
                        {target.name}
                      </h3>
                      <span className="rounded-full bg-sky-lighter px-2 py-0.5 font-mono text-[10px] font-bold text-navy">
                        {target.componentCount} part
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                      {target.subtitle}
                    </p>
                    <div className="mt-2.5 inline-block rounded-full bg-success-light px-2.5 py-0.5 text-[11px] font-semibold text-success">
                      Potensi: Rp {target.estimatedValueRangeIdr[0].toLocaleString('id-ID')} – Rp{' '}
                      {target.estimatedValueRangeIdr[1].toLocaleString('id-ID')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* Bottom Primary CTA */}
      <footer className="mx-auto w-full max-w-2xl border-t border-border bg-white px-4 pt-3">
        <button
          type="button"
          disabled={!canGenerate || isGenerating}
          onClick={handleGenerate3D}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 font-semibold text-white shadow-premium transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Sparkles className="h-5 w-5" strokeWidth={1.8} />
          Generate Desain 3D
        </button>
      </footer>
    </div>
  );
}
