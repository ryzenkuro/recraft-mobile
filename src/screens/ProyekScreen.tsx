import { FolderOpen, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjectStore } from '@/store/projectStore';
import type { ProjectCategory } from '@/types';

const PROJECT_TABS: { id: ProjectCategory; label: string }[] = [
  { id: 'KARYA', label: 'Karya' },
  { id: 'OFFLINE', label: 'Offline' },
  { id: 'PRODUKSI', label: 'Produksi' },
];

export default function ProyekScreen() {
  const {
    activeTab,
    searchQuery,
    isLoading,
    setActiveTab,
    setSearchQuery,
    toggleOffline,
    getFilteredProjects,
  } = useProjectStore();

  const filteredProjects = getFilteredProjects();

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-sky-lighter to-surface">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {/* Header & Search */}
        <header className="z-10 shrink-0 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] md:pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-navy">Proyek</h1>
            <Link
              to="/scan"
              aria-label="Buat proyek baru"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-soft transition-transform active:scale-95"
            >
              <Plus className="h-5 w-5" strokeWidth={1.8} />
            </Link>
          </div>

          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-slate-400"
              strokeWidth={1.6}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari cetak biru..."
              className="w-full rounded-2xl border border-border bg-white py-3 pl-11 pr-12 text-sm text-navy shadow-soft transition-all placeholder:text-slate-400 focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky"
            />
            {searchQuery ? (
              <button
                type="button"
                aria-label="Hapus pencarian"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 flex h-8 w-8 items-center justify-center text-slate-400 active:text-navy"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            ) : (
              <button
                type="button"
                aria-label="Filter proyek"
                onClick={() =>
                  setActiveTab(activeTab === 'OFFLINE' ? 'KARYA' : 'OFFLINE')
                }
                className="absolute right-3 flex h-8 w-8 items-center justify-center text-slate-400 transition-colors active:text-navy"
              >
                <SlidersHorizontal className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>
        </header>

        {/* 3 Sub-Tabs (Kaca Transparan Sesuai HTML) */}
        <div className="z-10 shrink-0 px-4 pb-2">
          <div className="flex rounded-xl border border-white bg-white/60 p-1 shadow-sm backdrop-blur-md">
            {PROJECT_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 rounded-lg py-2 text-xs transition-all ${
                    isActive
                      ? 'bg-navy font-semibold text-white shadow-sm'
                      : 'font-medium text-text-secondary active:bg-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project List */}
        <main className="hide-scrollbar flex-1 px-4 pt-2 pb-6">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-32 animate-pulse rounded-2xl border border-border bg-white"
                />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onToggleOffline={toggleOffline}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center shadow-soft">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-lighter text-sky">
                <FolderOpen className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <h2 className="text-sm font-bold text-navy">
                {activeTab === 'OFFLINE'
                  ? 'Belum Ada Proyek Offline'
                  : activeTab === 'PRODUKSI'
                    ? 'Belum Ada Produksi Aktif'
                    : 'Proyek Tidak Ditemukan'}
              </h2>
              <p className="mt-1 max-w-xs text-xs text-text-secondary">
                {searchQuery
                  ? 'Coba kata kunci lain atau hapus filter pencarian Anda.'
                  : 'Ketuk tombol titik tiga di kartu proyek untuk menyimpan akses offline, atau buat karya baru.'}
              </p>
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy"
                >
                  Reset Pencarian
                </button>
              ) : (
                <Link
                  to="/scan"
                  className="mt-4 rounded-xl bg-sky px-5 py-2.5 text-xs font-semibold text-white shadow-premium"
                >
                  Pindai Barang Bekas
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
