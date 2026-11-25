import {
  Bell,
  Box,
  CheckCircle2,
  Handshake,
  MapPin,
  PackagePlus,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { type MarketTab, useMarketStore } from '@/store/marketStore';
import { useProjectStore } from '@/store/projectStore';
import { useScanStore } from '@/store/scanStore';
import { useUserStore } from '@/store/userStore';
import type { MaterialListing } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

const MARKET_TABS: { id: MarketTab; label: string }[] = [
  { id: 'PRODUK', label: 'Produk' },
  { id: 'BAHAN', label: 'Bahan' },
  { id: 'KOLAB', label: 'Kolab' },
];

export default function PasarScreen() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    products,
    filteredProducts,
    materialListings,
    collabProposals,
    activeTab,
    searchQuery,
    locationFilter,
    isLoading,
    setActiveTab,
    setSearchQuery,
    setLocationFilter,
    addMaterialListing,
    submitProposal,
    updateProposalStatus,
  } = useMarketStore();

  const projects = useProjectStore((state) => state.projects);
  const scanResult = useScanStore((state) => state.result);
  const profile = useUserStore((state) => state.profile);

  const [showLocationChips, setShowLocationChips] = useState(false);
  const [proposalTarget, setProposalTarget] = useState<MaterialListing | null>(
    null
  );
  const [selectedStudioId, setSelectedStudioId] = useState<string>('');
  const [revenueSplit, setRevenueSplit] = useState('70% Perajin : 30% Penyedia');
  const [showPostMaterial, setShowPostMaterial] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get('tab')?.toUpperCase();
    if (tabParam === 'BAHAN' || tabParam === 'KOLAB' || tabParam === 'PRODUK') {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const locationOptions = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((p) => unique.add(p.seller.location));
    materialListings.forEach((m) => unique.add(m.location));
    return ['', ...Array.from(unique)];
  }, [products, materialListings]);

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return materialListings.filter((item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.materialType.toLowerCase().includes(q);
      const matchLoc =
        !locationFilter || item.location.includes(locationFilter);
      return matchQuery && matchLoc;
    });
  }, [materialListings, searchQuery, locationFilter]);

  const handleTabSelect = (tab: MarketTab) => {
    setActiveTab(tab);
    setSearchParams({ tab: tab.toLowerCase() }, { replace: true });
  };

  const handleOpenProposalModal = (item: MaterialListing) => {
    setProposalTarget(item);
    setSelectedStudioId(projects[0]?.id ?? '');
  };

  const handleSubmitProposal = async () => {
    if (!proposalTarget) return;
    const chosenProject = projects.find((p) => p.id === selectedStudioId);
    if (!chosenProject) {
      toast.error('Pilih rancangan 3D terlebih dahulu.');
      return;
    }

    await submitProposal({
      materialListingId: proposalTarget.id,
      materialTitle: proposalTarget.title,
      artisanName: profile.name,
      linkedStudioId: chosenProject.id,
      linkedStudioTitle: chosenProject.name,
      revenueSplitLabel: revenueSplit,
    });

    void triggerHaptic('MEDIUM');
    toast.success('Proposal dengan model 3D berhasil dikirim!');
    setProposalTarget(null);
    setSearchParams({ tab: 'kolab' }, { replace: true });
  };

  const handleCreateMaterialFromScan = () => {
    if (!scanResult) return;
    addMaterialListing({
      title: `${scanResult.materialType} (${scanResult.dimensions.panjang}×${scanResult.dimensions.lebar} cm)`,
      materialType: scanResult.materialType,
      dimensionsText: `${scanResult.dimensions.panjang},0 × ${scanResult.dimensions.lebar},0 × ${scanResult.dimensions.tinggi},0 cm`,
      quantityLabel: '1 paket hasil pindai',
      location: profile.location,
      providerName: profile.name,
      schemeLabel: 'Bagi Hasil 30% / Negosiasi',
      image: scanResult.photoUrl,
    });
    void triggerHaptic('MEDIUM');
    toast.success('Bahan hasil scan berhasil ditawarkan ke Pasar!');
    setShowPostMaterial(false);
  };

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-sky-lighter to-surface">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {/* Header & Search (Sesuai HTML) */}
        <header className="z-10 shrink-0 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] md:pt-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-navy">Pasar</h1>
            <button
              type="button"
              aria-label="Notifikasi Pasar"
              onClick={() => toast.info('Belum ada pembaruan pesanan baru.')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-soft transition-transform active:scale-95"
            >
              <Bell className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex flex-1 items-center">
              <Search
                className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-slate-400"
                strokeWidth={1.6}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk atau bahan..."
                className="w-full rounded-2xl border border-border bg-white py-3 pl-11 pr-9 text-sm text-navy shadow-soft transition-all placeholder:text-slate-400 focus:border-sky focus:outline-none focus:ring-1 focus:ring-sky"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              aria-label="Filter lokasi"
              onClick={() => setShowLocationChips((prev) => !prev)}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-soft transition-colors ${
                showLocationChips || locationFilter
                  ? 'border-sky bg-sky-lighter text-navy'
                  : 'border-border bg-white text-slate-500 active:border-sky active:text-navy'
              }`}
            >
              <MapPin className="h-[18px] w-[18px]" strokeWidth={1.6} />
            </button>
          </div>

          {(showLocationChips || locationFilter) && (
            <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {locationOptions.map((loc) => {
                const isSelected = locationFilter === loc;
                return (
                  <button
                    key={loc || 'ALL'}
                    type="button"
                    onClick={() => setLocationFilter(loc)}
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'border-navy bg-navy text-white'
                        : 'border-border bg-white text-text-secondary'
                    }`}
                  >
                    {loc || 'Semua Lokasi'}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* 3 Sub-Tabs (Kaca Transparan Sesuai HTML) */}
        <div className="z-10 shrink-0 px-4 pb-2">
          <div className="flex rounded-xl border border-white bg-white/60 p-1 shadow-sm backdrop-blur-md">
            {MARKET_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabSelect(tab.id)}
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

        {/* Main Content */}
        <main className="hide-scrollbar relative z-0 flex-1 px-4 pt-2 pb-6">
          {activeTab === 'PRODUK' && (
            <>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="h-52 animate-pulse rounded-2xl border border-border bg-white"
                    />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <EmptyMarketState
                  title="Produk Tidak Ditemukan"
                  subtitle="Belum ada karya yang cocok dengan pencarian atau filter lokasi Anda."
                  onReset={() => {
                    setSearchQuery('');
                    setLocationFilter('');
                  }}
                />
              )}
            </>
          )}

          {activeTab === 'BAHAN' && (
            <div className="space-y-3">
              {scanResult && (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-sky/40 bg-white p-3.5 shadow-soft">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-navy">
                      Tawarkan Hasil Scan Terakhir?
                    </p>
                    <p className="truncate font-mono text-[11px] text-text-secondary">
                      {scanResult.materialType} ({scanResult.dimensions.panjang}×
                      {scanResult.dimensions.lebar}×
                      {scanResult.dimensions.tinggi} cm)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPostMaterial(true)}
                    className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-navy px-3 text-xs font-semibold text-white"
                  >
                    <PackagePlus className="h-4 w-4" strokeWidth={1.6} />
                    Posting
                  </button>
                </div>
              )}

              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((mat) => (
                  <article
                    key={mat.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-3.5 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={mat.image}
                        alt={mat.title}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-navy">
                          {mat.title}
                        </h3>
                        <p className="mt-0.5 font-mono text-[11px] text-sky">
                          {mat.dimensionsText} • {mat.quantityLabel}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-text-secondary">
                          <MapPin className="h-3 w-3" strokeWidth={1.6} />
                          {mat.providerName} • {mat.location}
                        </p>
                        <span className="mt-1.5 inline-block rounded-full bg-success-light px-2.5 py-0.5 text-[10px] font-semibold text-success">
                          {mat.schemeLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenProposalModal(mat)}
                      className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-sky px-4 text-xs font-semibold text-white shadow-soft active:scale-[0.98]"
                    >
                      <Handshake className="h-4 w-4" strokeWidth={1.6} />
                      Ajukan Proposal 3D
                    </button>
                  </article>
                ))
              ) : (
                <EmptyMarketState
                  title="Belum Ada Bahan Cocok"
                  subtitle="Coba ubah lokasi atau kata kunci pencarian bahan bekas."
                  onReset={() => {
                    setSearchQuery('');
                    setLocationFilter('');
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'KOLAB' && (
            <div className="space-y-3">
              {collabProposals.map((prop) => (
                <article
                  key={prop.id}
                  className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-text-secondary">
                        Perajin: {prop.artisanName}
                      </span>
                      <h3 className="text-sm font-bold text-navy">
                        {prop.materialTitle}
                      </h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        prop.status === 'DISETUJUI'
                          ? 'bg-success-light text-success'
                          : prop.status === 'PRODUKSI'
                            ? 'bg-sky-light text-navy'
                            : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3">
                    <div>
                      <p className="text-[11px] text-text-secondary">
                        Rancangan 3D Tertaut
                      </p>
                      <p className="text-xs font-bold text-navy">
                        {prop.linkedStudioTitle}
                      </p>
                      <p className="font-mono text-[11px] text-sky">
                        {prop.revenueSplitLabel}
                      </p>
                    </div>

                    <Link
                      to={`/studio/${prop.linkedStudioId}`}
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-navy shadow-soft"
                    >
                      <Box className="h-3.5 w-3.5 text-sky" strokeWidth={1.6} />
                      Buka 3D
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prop.status === 'MENUNGGU' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateProposalStatus(prop.id, 'DISETUJUI');
                          toast.success('Perjanjian bagi hasil digital disetujui');
                        }}
                        className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-success px-3.5 text-xs font-semibold text-white"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Setujui Perjanjian
                      </button>
                    )}
                    {prop.status === 'DISETUJUI' && (
                      <button
                        type="button"
                        onClick={() => {
                          updateProposalStatus(prop.id, 'PRODUKSI');
                          toast.info('Status diperbarui menjadi PRODUKSI');
                        }}
                        className="inline-flex min-h-10 items-center gap-1 rounded-xl bg-navy px-3.5 text-xs font-semibold text-white"
                      >
                        Mulai Produksi
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL: Ajukan Proposal 3D */}
      {proposalTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-premium">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-navy">
                  Ajukan Proposal Kolaborasi 3D
                </h2>
                <p className="text-xs text-text-secondary">
                  {proposalTarget.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProposalTarget(null)}
                className="rounded-lg p-1 text-text-secondary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block space-y-1">
                <span className="text-xs font-semibold text-navy">
                  Tautkan Model 3D dari Studio
                </span>
                <select
                  value={selectedStudioId}
                  onChange={(e) => setSelectedStudioId(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-navy"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.componentCount} komponen)
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="text-xs font-semibold text-navy">
                  Skema Bagi Hasil Digital
                </span>
                <input
                  type="text"
                  value={revenueSplit}
                  onChange={(e) => setRevenueSplit(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-navy"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleSubmitProposal}
              className="min-h-12 w-full rounded-xl bg-navy font-semibold text-white shadow-premium"
            >
              Kirim Proposal ke Penyedia
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Posting Bahan Hasil Scan */}
      {showPostMaterial && scanResult && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-premium">
            <h2 className="text-base font-bold text-navy">
              Tawarkan Bahan Hasil Scan
            </h2>
            <p className="text-xs text-text-secondary">
              Bahan <strong className="text-navy">{scanResult.materialType}</strong>{' '}
              ({scanResult.dimensions.panjang}×{scanResult.dimensions.lebar}×
              {scanResult.dimensions.tinggi} cm) akan dipublikasikan ke tab{' '}
              <strong>Bahan</strong> untuk menerima proposal perajin.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowPostMaterial(false)}
                className="min-h-11 rounded-xl border border-border font-semibold text-navy"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateMaterialFromScan}
                className="min-h-11 rounded-xl bg-sky font-semibold text-white"
              >
                Publikasikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyMarketState({
  title,
  subtitle,
  onReset,
}: {
  title: string;
  subtitle: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-lighter text-sky">
        <ShoppingBag className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-sm font-bold text-navy">{title}</h2>
      <p className="mt-1 max-w-xs text-xs text-text-secondary">{subtitle}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-navy"
      >
        Reset Filter
      </button>
    </div>
  );
}
