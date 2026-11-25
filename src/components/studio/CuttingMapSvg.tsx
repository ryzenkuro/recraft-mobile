import type { StudioComponentSpec } from '@/types/studio';
import { triggerHaptic } from '@/utils/haptics';

interface CuttingMapSvgProps {
  cuttingMapSvg: string;
  components: StudioComponentSpec[];
  selectedCode: string | null;
  onSelectComponent: (code: string) => void;
}

export function CuttingMapSvg({
  cuttingMapSvg,
  components,
  selectedCode,
  onSelectComponent,
}: CuttingMapSvgProps) {
  const handleSelect = (code: string) => {
    void triggerHaptic('LIGHT');
    onSelectComponent(code);
  };

  return (
    <div className="space-y-2.5">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-2">
        {/* Lapisan SVG denah teknik dari payload */}
        <div
          className="w-full [&>svg]:h-auto [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: cuttingMapSvg }}
        />

        {/* Overlay interaktif untuk sinkronisasi klik komponen */}
        <svg
          viewBox="0 0 320 200"
          className="pointer-events-auto absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
          aria-label="Peta interaktif denah potongan"
        >
          {components.map((comp) => {
            const isSelected = selectedCode === comp.code;
            const isDimmed = selectedCode !== null && !isSelected;

            return (
              <rect
                key={comp.code}
                x={comp.svgRect.x}
                y={comp.svgRect.y}
                width={comp.svgRect.w}
                height={comp.svgRect.h}
                rx={2}
                fill={
                  isSelected
                    ? 'rgba(59, 159, 217, 0.22)'
                    : isDimmed
                      ? 'rgba(248, 250, 252, 0.55)'
                      : 'transparent'
                }
                stroke={isSelected ? '#3B9FD9' : 'transparent'}
                strokeWidth={isSelected ? 3 : 0}
                className="cursor-pointer transition-all"
                onClick={() => handleSelect(comp.code)}
              />
            );
          })}
        </svg>
      </div>

      {/* Legenda Garis Teknik SRS v2.2 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 bg-tech-cut" />
          Potong Penuh
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 border-t-2 border-dashed border-tech-fold" />
          Garis Lipat
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-tech-joint" />
          Titik Sambungan
        </span>
      </div>
    </div>
  );
}
