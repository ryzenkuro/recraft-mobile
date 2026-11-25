import {
  ArrowRight,
  Bell,
  Box,
  Clock,
  Compass,
  Image as ImageIcon,
  Package,
  Ruler,
  ScanLine,
  UploadCloud,
} from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DEFAULT_STUDIO_PROJECT_ID } from '@/mocks';
import { scanService } from '@/services/scanService';
import { useProjectStore } from '@/store/projectStore';
import { useScanStore } from '@/store/scanStore';
import { useUserStore } from '@/store/userStore';
import type { CraftTargetOption } from '@/types';

export default function BerandaScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = useUserStore((state) => state.profile);
  const projects = useProjectStore((state) => state.projects);
  const { setProcessing, setResult, setError } = useScanStore();

  const [inspirations, setInspirations] = useState<CraftTargetOption[]>([]);

  useEffect(() => {
    let active = true;
    void scanService.getCraftTargets().then((items) => {
      if (active) setInspirations(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const lastProject = projects[0] ?? null;

  const handleQuickUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setProcessing();
      navigate('/scan');
      const result = await scanService.scanFromUpload(file);
      setResult(result);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Gagal membaca foto yang diunggah.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col bg-surface">
      {/* Header (Sesuai HTML: Selamat pagi, Kreator + Bell dot biru) */}
      <header className="z-10 flex shrink-0 items-center justify-between bg-surface px-4 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)] md:pt-6">
        <div>
          <p className="text-sm text-text-secondary">Selamat pagi,</p>
          <h1 className="text-lg font-bold text-navy">
            {profile.name.split(' ')[0]}
          </h1>
        </div>
        <button
          type="button"
          aria-label="Notifikasi"
          onClick={() => toast.info('Belum ada notifikasi baru.')}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-soft active:scale-95"
        >
          <Bell className="h-5 w-5" strokeWidth={1.6} />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-sky" />
        </button>
      </header>

      {/* Hero CTA Card */}
      <section className="mt-4 px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-light to-sky-lighter p-5 shadow-soft">
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-white/40 blur-2xl" />

          <div className="relative z-10">
            <h2 className="mb-1 text-xl font-bold leading-tight text-navy">
              Punya kardus atau
              <br />
              botol bekas?
            </h2>
            <p className="mb-5 max-w-[82%] text-sm text-text-secondary">
              Pindai barang bekas dan ubah menjadi produk unik
            </p>

            <div className="flex flex-col items-start gap-3">
              <Link
                to="/scan"
                className="flex items-center gap-2 rounded-xl bg-sky px-5 py-3 text-sm font-medium text-white shadow-premium transition-transform active:scale-95"
              >
                <ScanLine className="h-[18px] w-[18px]" strokeWidth={1.8} />
                Scan Barang Bekas
              </Link>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-sky underline underline-offset-2 active:opacity-70"
              >
                atau Unggah Foto
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleQuickUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts (4 Ikon Bulat 1 Baris Sesuai HTML) */}
      <section className="mt-6 px-4">
        <div className="grid grid-cols-4 gap-2">
          <CircleShortcut to="/scan" icon={Ruler} line1="Ukur" line2="Bahan" />
          <CircleShortcut
            to="/scan?mode=ruang"
            icon={Box}
            line1="Ukur"
            line2="Ruang"
          />
          <CircleShortcut
            to="/pasar?tab=bahan"
            icon={UploadCloud}
            line1="Tawar"
            line2="Bahan"
          />
          <CircleShortcut
            to="/pasar"
            icon={Compass}
            line1="Jelajah"
            line2="Pasar"
          />
        </div>
      </section>

      {/* Resume Active Project (Desain HTML + Direct-to-3D SRS v2.2) */}
      <section className="mt-8 px-4">
        {lastProject ? (
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
              <Package className="h-7 w-7 text-slate-400" strokeWidth={1.5} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between">
                <h3 className="truncate text-base font-bold leading-tight text-navy">
                  {lastProject.name}
                </h3>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-sky-light px-2 py-0.5 text-[10px] font-semibold text-navy">
                  {lastProject.componentCount} Komponen
                </span>
                <span className="rounded-full bg-success-light px-2 py-0.5 text-[10px] font-semibold text-success">
                  Rp {(lastProject.estimatedValueRangeIdr[0] / 1000).toFixed(0)}rb–
                  {(lastProject.estimatedValueRangeIdr[1] / 1000).toFixed(0)}rb
                </span>
              </div>

              <Link
                to={`/studio/${lastProject.id}`}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-sky py-2 text-xs font-semibold text-navy transition-colors active:bg-sky-light"
              >
                Buka 3D
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white p-5 text-center shadow-soft">
            <p className="text-xs text-text-secondary">
              Belum ada proyek tersimpan. Pindai barang bekas untuk mulai merancang 3D.
            </p>
            <Link
              to={`/studio/${DEFAULT_STUDIO_PROJECT_ID}`}
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-sky px-4 py-2 text-xs font-semibold text-navy"
            >
              Coba Demo Studio 3D
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Inspiration Carousel */}
      {inspirations.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-end justify-between px-4">
            <h3 className="text-lg font-bold text-navy">Inspirasi Karya</h3>
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              Geser
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          <div className="hide-scrollbar flex gap-3 overflow-x-auto px-4 pb-2">
            {inspirations.map((item) => (
              <Link
                key={item.id}
                to={`/studio/${item.studioProjectId}`}
                className="w-[160px] shrink-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-transform active:scale-[0.98]"
              >
                <div className="flex h-24 items-center justify-center bg-slate-100">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div className="p-3">
                  <h4 className="truncate text-sm font-semibold text-navy">
                    {item.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-sky" />
                    <span className="text-xs font-medium text-sky">
                      {item.durationLabel}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Impact Stats */}
      <section className="mb-6 mt-6 px-4">
        <div className="rounded-2xl bg-gradient-to-r from-[#F0F4FF] to-sky-light p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy">Dampak Positifmu</h3>
            <span className="text-xs font-medium italic text-sky">
              Terus semangat!
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 divide-x divide-sky/20">
            <div className="text-center">
              <p className="text-xl font-bold text-navy">
                {profile.impactStats.projectsCompleted}
              </p>
              <p className="mt-1 text-[10px] leading-tight text-text-secondary">
                Proyek
                <br />
                Selesai
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy">
                {profile.impactStats.itemsManaged}
              </p>
              <p className="mt-1 text-[10px] leading-tight text-text-secondary">
                Barang
                <br />
                Terkelola
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-navy">
                {profile.impactStats.co2SavedKg}
                <span className="text-xs">kg</span>
              </p>
              <p className="mt-1 text-[10px] leading-tight text-text-secondary">
                Hemat
                <br />
                CO2
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CircleShortcut({
  to,
  icon: Icon,
  line1,
  line2,
}: {
  to: string;
  icon: typeof Ruler;
  line1: string;
  line2: string;
}) {
  return (
    <Link to={to} className="group flex flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white text-navy shadow-soft transition-colors group-active:border-sky group-active:bg-sky group-active:text-white">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <span className="text-center text-xs font-medium leading-tight text-navy">
        {line1}
        <br />
        {line2}
      </span>
    </Link>
  );
}
