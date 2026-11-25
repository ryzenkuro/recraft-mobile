import {
  ArrowLeft,
  ChevronRight,
  FoldHorizontal,
  Layers,
  Puzzle,
  Scissors,
  Sparkles,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { CuttingMapSvg } from '@/components/studio/CuttingMapSvg';
import type { SheetSnapPoint } from '@/store/studioStore';
import type {
  MaterialStrength,
  Studio3DPayload,
  StudioComponentSpec,
} from '@/types/studio';
import { triggerHaptic } from '@/utils/haptics';

interface StudioSheetContentProps {
  payload: Studio3DPayload;
  selectedCode: string | null;
  isPeekOnly?: boolean;
  onSelectComponent: (code: string | null) => void;
  onExpandSheet?: (snap: SheetSnapPoint) => void;
}

const STRENGTH_LABEL: Record<MaterialStrength, string> = {
  LIGHT: 'Beban Ringan',
  MEDIUM: 'Beban Sedang',
  HEAVY: 'Struktur Kuat',
};

export function StudioSheetContent({
  payload,
  selectedCode,
  isPeekOnly = false,
  onSelectComponent,
  onExpandSheet,
}: StudioSheetContentProps) {
  const selectedComponent = selectedCode
    ? payload.components.find((c) => c.code === selectedCode) ?? null
    : null;

  const valueRangeText = `Rp ${payload.estimatedValueRangeIdr[0].toLocaleString('id-ID')} – Rp ${payload.estimatedValueRangeIdr[1].toLocaleString('id-ID')}`;

  // STATE 3: COMPONENT INSPECTOR VIEW (4 Kartu Penjelasan Eksplanatif)
  if (selectedComponent) {
    return (
      <ComponentInspectorView
        payload={payload}
        component={selectedComponent}
        onSelectComponent={onSelectComponent}
      />
    );
  }

  // STATE 1: PEEK VIEW (Ringkas ~25% saat zoom 1.0x di mobile)
  if (isPeekOnly) {
    return (
      <div className="space-y-2.5 px-4 pb-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold text-navy">{payload.title}</h2>
          <button
            type="button"
            onClick={() => onExpandSheet?.(0.5)}
            className="shrink-0 rounded-full bg-sky-lighter px-2.5 py-1 text-[11px] font-semibold text-sky"
          >
            Lihat Detail
          </button>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-text-secondary">
          {payload.architectureSummary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-success-light px-3 py-1 text-xs font-semibold text-success">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
            Potensi Nilai Jual: {valueRangeText}
          </span>
        </div>

        <p className="text-[11px] font-medium text-text-secondary">
          Zoom in atau ketuk komponen 3D untuk melihat detail potongan
        </p>
      </div>
    );
  }

  // STATE 2: ZOOM-IN EXPLODED VIEW / DESKTOP INSPECTOR
  return (
    <div className="space-y-4 px-4 pb-8">
      {/* Card 1: Ringkasan Karya & Potensi Nilai Jual */}
      <section className="rounded-2xl border border-border bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-sky-lighter px-2.5 py-0.5 text-[11px] font-semibold text-navy">
            {STRENGTH_LABEL[payload.strengthCategory]}
          </span>
          <span className="rounded-full bg-success-light px-2.5 py-0.5 text-[11px] font-semibold text-success">
            Nilai Jual: {valueRangeText}
          </span>
        </div>

        <h2 className="mt-2.5 text-lg font-bold text-navy">{payload.title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-text-secondary">
          {payload.architectureSummary}
        </p>
        <p className="mt-2.5 text-xs font-medium text-navy">
          Bahan Utama:{' '}
          <span className="font-normal text-text-secondary">
            {payload.primaryScrapMaterial}
          </span>
        </p>
      </section>

      {/* Card 2: Denah Potongan Bahan Bekas */}
      <section className="rounded-2xl border border-border bg-white p-4 shadow-soft">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy">
            Denah Potongan Bahan Bekas
          </h3>
          <span className="font-mono text-[11px] text-text-secondary">
            Ketuk kode C0X
          </span>
        </div>
        <CuttingMapSvg
          cuttingMapSvg={payload.cuttingMapSvg}
          components={payload.components}
          selectedCode={null}
          onSelectComponent={(code) => onSelectComponent(code)}
        />
      </section>

      {/* Daftar Card Komponen Penyusun */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy">
            Komponen Penyusun ({payload.components.length})
          </h3>
          <span className="text-[11px] text-text-secondary">
            Ketuk untuk penjelasan lengkap
          </span>
        </div>

        <div className="space-y-2">
          {payload.components.map((comp) => (
            <button
              key={comp.code}
              type="button"
              onClick={() => {
                void triggerHaptic('LIGHT');
                onSelectComponent(comp.code);
              }}
              className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3.5 text-left shadow-soft transition-colors hover:border-sky active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-11 shrink-0 items-center justify-center rounded-xl bg-navy font-mono text-xs font-bold text-white">
                  {comp.code}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">{comp.name}</p>
                  <p className="font-mono text-[11px] text-text-secondary">
                    {(comp.dimensionsMm[0] / 10).toFixed(1)} ×{' '}
                    {(comp.dimensionsMm[1] / 10).toFixed(1)} cm • Qty {comp.qty}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-sky" strokeWidth={1.6} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ComponentInspectorView({
  payload,
  component,
  onSelectComponent,
}: {
  payload: Studio3DPayload;
  component: StudioComponentSpec;
  onSelectComponent: (code: string | null) => void;
}) {
  return (
    <div className="space-y-3.5 px-4 pb-8">
      {/* Header Komponen + Tombol Kembali */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelectComponent(null)}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-sky-lighter px-3 text-xs font-semibold text-navy hover:bg-sky-light"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
          Semua Komponen
        </button>

        <span className="font-mono text-xs font-semibold text-text-secondary">
          Qty: {component.qty}
        </span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-sky/40 bg-white p-3.5 shadow-soft">
        <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-navy font-mono text-sm font-bold text-white">
          {component.code}
        </span>
        <div>
          <h2 className="text-base font-bold text-navy">{component.name}</h2>
          <p className="font-mono text-xs text-sky">
            {(component.dimensionsMm[0] / 10).toFixed(1)} ×{' '}
            {(component.dimensionsMm[1] / 10).toFixed(1)} cm (tebal{' '}
            {component.dimensionsMm[2]} mm)
          </p>
        </div>
      </div>

      {/* Mini Peta Letak Komponen di Bahan Asal */}
      <CuttingMapSvg
        cuttingMapSvg={payload.cuttingMapSvg}
        components={payload.components}
        selectedCode={component.code}
        onSelectComponent={(code) => onSelectComponent(code)}
      />

      {/* 4 Card Penjelasan Eksplanatif (Tanpa Checkbox Selesai) */}
      <DetailExplainCard
        icon={<Layers className="h-4 w-4 text-navy" strokeWidth={1.6} />}
        title="1. Bahan"
        body={component.materialNote}
      />

      <DetailExplainCard
        icon={<Scissors className="h-4 w-4 text-tech-cut" strokeWidth={1.6} />}
        title="2. Potongan"
        body={component.cuttingNote}
      />

      <DetailExplainCard
        icon={
          <FoldHorizontal
            className="h-4 w-4 text-tech-fold"
            strokeWidth={1.6}
          />
        }
        title="3. Lipatan / Pembentukan"
        body={component.foldingNote}
      />

      <DetailExplainCard
        icon={<Puzzle className="h-4 w-4 text-tech-joint" strokeWidth={1.6} />}
        title="4. Perakitan & Arsitektur Sambungan"
        body={component.assemblyNote}
      >
        {component.connectedCodes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-text-secondary">
              Terhubung ke:
            </span>
            {component.connectedCodes.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => onSelectComponent(code)}
                className="rounded-lg bg-sky-lighter px-2 py-0.5 font-mono text-[11px] font-bold text-navy hover:bg-sky hover:text-white"
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </DetailExplainCard>
    </div>
  );
}

function DetailExplainCard({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-white p-3.5 shadow-soft">
      <div className="mb-1.5 flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-bold uppercase tracking-wide text-navy">
          {title}
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{body}</p>
      {children}
    </section>
  );
}
