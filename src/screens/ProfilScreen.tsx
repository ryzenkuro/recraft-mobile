import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Database,
  Hammer,
  History,
  LifeBuoy,
  LogOut,
  MapPin,
  Package,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore } from '@/store/userStore';
import type { UserRole } from '@/types';
import { triggerHaptic } from '@/utils/haptics';

const ROLE_OPTIONS: {
  id: UserRole;
  label: string;
  icon: typeof ShoppingBag;
}[] = [
  { id: 'PEMBELI', label: 'Pembeli', icon: ShoppingBag },
  { id: 'PENYEDIA', label: 'Penyedia', icon: Package },
  { id: 'PERAJIN', label: 'Perajin', icon: Hammer },
];

export default function ProfilScreen() {
  const { profile, switchRole, resetProfile } = useUserStore();
  const { projects, clearOfflineCache } = useProjectStore();

  const offlineCount = projects.filter((p) => p.offlineAvailable).length;

  const handleSwitchRole = (role: UserRole) => {
    void triggerHaptic('LIGHT');
    switchRole(role);
    toast.success(`Peran aktif diubah ke ${role}`);
  };

  const handleClearOffline = () => {
    clearOfflineCache();
    void triggerHaptic('MEDIUM');
    toast.success('Penyimpanan offline berhasil dibersihkan.');
  };

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-sky-lighter to-surface">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
        {/* Header */}
        <header className="z-10 shrink-0 px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)] md:pt-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-navy">Profil</h1>
            <button
              type="button"
              aria-label="Pengaturan"
              onClick={() => toast.info('Pengaturan akun & aplikasi.')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy shadow-soft transition-transform active:scale-95"
            >
              <Settings className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="hide-scrollbar z-0 flex-1 px-4 pb-6">
          {/* User Identity Card (Avatar Inisial KR Sesuai HTML) */}
          <section className="mb-6 flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-xl font-bold text-white shadow-premium">
              {profile.initials}
            </div>
            <div className="flex-1">
              <h2 className="flex items-center gap-1 text-lg font-bold leading-tight text-navy">
                {profile.name}
                {profile.verified && <CheckCircle2 className="h-4 w-4 text-sky" />}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </p>
            </div>
          </section>

          {/* Role Switcher (Pills Sesuai HTML) */}
          <section className="mb-6">
            <h3 className="mb-3 text-sm font-bold text-navy">Peran Aktif</h3>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => {
                const Icon = role.icon;
                const isActive = profile.activeRole === role.id;
                const activeClasses =
                  role.id === 'PERAJIN'
                    ? 'bg-sky text-white font-semibold'
                    : 'bg-navy text-white font-semibold';

                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSwitchRole(role.id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs shadow-sm transition-colors ${
                      isActive
                        ? activeClasses
                        : 'border border-border bg-white font-medium text-text-secondary active:bg-sky-light active:text-navy'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Balance & Revenue Card */}
          <section className="mb-6 rounded-2xl border border-sky/20 bg-gradient-to-br from-sky-light to-white p-5 shadow-soft">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs text-text-secondary">
                  Saldo &amp; Bagi Hasil
                </p>
                <h3 className="text-2xl font-bold text-navy">
                  Rp {profile.balanceIdr.toLocaleString('id-ID')}
                </h3>
              </div>
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-navy shadow-sm">
                <ShieldCheck className="h-3 w-3 text-success" />
                PJP Verified
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  toast.success('Permintaan tarik dana dikirim ke PJP (simulasi).')
                }
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-navy py-2.5 text-xs font-semibold text-white shadow-premium transition-transform active:scale-95"
              >
                <ArrowUpRight className="h-4 w-4" />
                Tarik Dana
              </button>
              <button
                type="button"
                onClick={() => {
                  const latest = profile.revenueHistory[0];
                  toast.info(
                    latest
                      ? `Terakhir: ${latest.title} (+Rp ${latest.amountIdr.toLocaleString('id-ID')})`
                      : 'Belum ada riwayat transaksi.'
                  );
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white py-2.5 text-xs font-semibold text-navy shadow-sm transition-transform active:scale-95"
              >
                <History className="h-4 w-4" />
                Riwayat
              </button>
            </div>
          </section>

          {/* Settings Menu (4 Menu Sesuai HTML) */}
          <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <div className="flex flex-col divide-y divide-border">
              <button
                type="button"
                onClick={() =>
                  toast.info('Riwayat pesanan & kolaborasi tersedia di tab Pasar.')
                }
                className="flex items-center justify-between p-4 transition-colors active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-lighter text-sky">
                    <ShoppingBag className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-navy">
                      Pesanan &amp; Transaksi Saya
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Lacak pembelian &amp; penjualan
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={handleClearOffline}
                className="flex items-center justify-between p-4 transition-colors active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-lighter text-sky">
                    <Database className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-navy">
                      Penyimpanan Offline
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {offlineCount} proyek tersimpan lokal
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-sky-lighter px-2 py-1 text-xs font-semibold text-sky">
                    Bersihkan
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Gunakan penggaris besi dan potong di luar garis merah (offset 1mm).'
                  )
                }
                className="flex items-center justify-between p-4 transition-colors active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-lighter text-sky">
                    <LifeBuoy className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-navy">
                      Panduan Keselamatan &amp; Bantuan
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Tips perakitan aman
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() =>
                  toast.info(
                    'Kolaborasi dilindungi perjanjian digital & PJP resmi berizin BI.'
                  )
                }
                className="flex items-center justify-between p-4 transition-colors active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-lighter text-sky">
                    <Shield className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-semibold text-navy">
                      Kebijakan Privasi &amp; Ketentuan
                    </h4>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      Aturan kolaborasi &amp; data
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>
            </div>
          </section>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              resetProfile();
              toast.info('Sesi profil dikembalikan ke default.');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white py-3.5 text-sm font-semibold text-red-500 shadow-sm transition-colors active:bg-red-50"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
            Keluar Akun
          </button>
        </main>
      </div>
    </div>
  );
}
