import { Archive, Box, Clock, CloudOff, Lamp, MoreVertical, Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import type { ProjectSummary } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

interface ProjectCardProps {
  project: ProjectSummary;
  onToggleOffline: (projectId: string) => void;
}

function ProjectThumbIcon({ hint }: { hint: ProjectSummary['iconHint'] }) {
  const cls = 'h-8 w-8 text-sky/45';
  switch (hint) {
    case 'lamp':
      return <Lamp className={cls} strokeWidth={1.5} />;
    case 'archive':
      return <Archive className={cls} strokeWidth={1.5} />;
    default:
      return <Box className={cls} strokeWidth={1.5} />;
  }
}

export function ProjectCard({ project, onToggleOffline }: ProjectCardProps) {
  const handleToggleOffline = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void triggerHaptic('LIGHT');
    onToggleOffline(project.id);
    toast.success(
      project.offlineAvailable
        ? `"${project.name}" dihapus dari penyimpanan offline`
        : `"${project.name}" disimpan untuk akses offline`
    );
  };

  return (
    <Link
      to={`/studio/${project.id}`}
      className="block rounded-2xl border border-border bg-white p-4 shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="flex gap-4">
        {/* Thumbnail Minimalis (96x96) Sesuai HTML + Badge Cloud-Off */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <ProjectThumbIcon hint={project.iconHint} />
          {project.offlineAvailable && (
            <div className="absolute left-1.5 top-1.5 rounded-md bg-white/90 p-1 shadow-sm backdrop-blur-sm">
              <CloudOff className="h-3 w-3 text-success" strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Info (Tanpa Progress Bar Langkah sesuai Opsi A SRS v2.2) */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <div className="mb-1 flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-bold leading-tight text-navy">
                {project.name}
              </h3>
              <button
                type="button"
                aria-label="Simpan atau hapus akses offline"
                onClick={handleToggleOffline}
                className="shrink-0 rounded-md p-0.5 text-slate-400 active:text-navy"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-1 flex items-center gap-1 font-mono text-[10px] text-text-secondary">
              <Ruler className="h-2.5 w-2.5 shrink-0" />
              {project.dimensionsCm.panjang} × {project.dimensionsCm.lebar} ×{' '}
              {project.dimensionsCm.tinggi} cm
            </p>
            <p className="flex items-center gap-1 text-[10px] text-text-secondary">
              <Clock className="h-2.5 w-2.5 shrink-0" />
              {project.lastUpdatedLabel}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-sky-light px-2.5 py-0.5 text-[10px] font-semibold text-navy">
              {project.componentCount} Komponen
            </span>
            <span className="rounded-full bg-success-light px-2.5 py-0.5 text-[10px] font-semibold text-success">
              Rp {(project.estimatedValueRangeIdr[0] / 1000).toFixed(0)}rb–
              {(project.estimatedValueRangeIdr[1] / 1000).toFixed(0)}rb
            </span>
          </div>

          {project.inProduction && project.productionNote && (
            <p className="mt-1.5 rounded-lg bg-sky-lighter px-2 py-1 text-[10px] font-medium text-navy">
              {project.productionNote}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
