import { Bug, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMockControlsStore } from '@/config/mockControls';
import {
  DEFAULT_STUDIO_PROJECT_ID,
  getMockStudioPayload,
  mockMarketProducts,
  mockProjects,
  mockScanResults,
} from '@/mocks';
import { useMarketStore } from '@/store/marketStore';
import { useProjectStore } from '@/store/projectStore';
import { useScanStore } from '@/store/scanStore';
import { useStudioStore } from '@/store/studioStore';
import { useUserStore } from '@/store/userStore';
import type { UserRole } from '@/types';

export function StateDebugger() {
  const [open, setOpen] = useState(false);

  const scanStore = useScanStore();
  const studioStore = useStudioStore();
  const projectStore = useProjectStore();
  const marketStore = useMarketStore();
  const userStore = useUserStore();
  const mockControls = useMockControlsStore();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-50 inline-flex items-center gap-1.5 rounded-full border border-sky bg-slate-900/90 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-premium backdrop-blur"
      >
        <Bug className="h-3.5 w-3.5 text-sky" strokeWidth={1.8} />
        Debug
      </button>
    );
  }

  return (
    <aside className="fixed right-3 top-[max(env(safe-area-inset-top),0.75rem)] z-50 max-h-[75vh] w-72 overflow-y-auto rounded-2xl border border-sky bg-slate-900/95 p-3 font-mono text-[11px] text-slate-100 shadow-premium backdrop-blur">
      <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
        <span className="font-bold text-sky">StateDebugger (Mock Mode)</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Scan Controls */}
      <section className="mb-3 space-y-1.5 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-bold uppercase text-slate-400">
          Scan ({scanStore.scanState})
        </p>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              scanStore.reset();
              toast.info('Scan state → IDLE');
            }}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            IDLE
          </button>
          <button
            type="button"
            onClick={() => scanStore.setProcessing()}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            PROCESSING
          </button>
          <button
            type="button"
            onClick={() => scanStore.setResult(mockScanResults[0])}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            CONFIRM
          </button>
          <button
            type="button"
            onClick={() => {
              scanStore.setError('Foto terlalu buram. Pastikan cahaya cukup.');
              toast.error('Simulasi error scan dipicu');
            }}
            className="rounded bg-danger/80 px-2 py-1 text-white hover:bg-danger"
          >
            ERROR
          </button>
        </div>
      </section>

      {/* Studio 3D Controls */}
      <section className="mb-3 space-y-1.5 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-bold uppercase text-slate-400">
          Studio 3D (Z: {studioStore.zoomLevel.toFixed(2)}x | {studioStore.selectedComponentCode ?? 'Overview'})
        </p>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              studioStore.setPayload(getMockStudioPayload(DEFAULT_STUDIO_PROJECT_ID));
              toast.success('Studio P1 dimuat');
            }}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Load P1
          </button>
          <button
            type="button"
            onClick={() => studioStore.setZoomAndExplode(1.45)}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Zoom 1.45x
          </button>
          <button
            type="button"
            onClick={() => studioStore.selectComponent('C04')}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Pilih C04
          </button>
          <button
            type="button"
            onClick={() => studioStore.resetView()}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Reset 3D
          </button>
        </div>
      </section>

      {/* Network Chaos */}
      <section className="mb-3 space-y-1.5 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-bold uppercase text-slate-400">
          Simulasi Jaringan
        </p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              const next = !mockControls.simulateSlowNetwork;
              mockControls.setSimulateSlowNetwork(next);
              toast.info(next ? 'Slow Network 3x AKTIF' : 'Slow Network NONAKTIF');
            }}
            className={`rounded px-2 py-1 text-left ${
              mockControls.simulateSlowNetwork
                ? 'bg-warning text-slate-950 font-bold'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            Slow Network (3x): {mockControls.simulateSlowNetwork ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => {
              mockControls.setForceNextError('Koneksi simulasi gagal (Error Injector)');
              toast.warning('Request berikutnya akan melempar error');
            }}
            className="rounded bg-slate-800 px-2 py-1 text-left hover:bg-slate-700"
          >
            Paksa Error Next Request
          </button>
        </div>
      </section>

      {/* Projects & Market Empty/Reload */}
      <section className="mb-3 space-y-1.5 border-b border-slate-800 pb-2">
        <p className="text-[10px] font-bold uppercase text-slate-400">
          Proyek ({projectStore.projects.length}) & Pasar ({marketStore.products.length})
        </p>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => projectStore.setProjects([])}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Empty Proyek
          </button>
          <button
            type="button"
            onClick={() => projectStore.setProjects(mockProjects)}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Reload Proyek
          </button>
          <button
            type="button"
            onClick={() => marketStore.setProducts([])}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Empty Pasar
          </button>
          <button
            type="button"
            onClick={() => marketStore.setProducts(mockMarketProducts)}
            className="rounded bg-slate-800 px-2 py-1 hover:bg-slate-700"
          >
            Reload Pasar
          </button>
        </div>
      </section>

      {/* User Role */}
      <section className="space-y-1.5">
        <p className="text-[10px] font-bold uppercase text-slate-400">
          Peran Aktif: {userStore.profile.activeRole}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {(['PEMBELI', 'PENYEDIA', 'PERAJIN'] as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                userStore.switchRole(role);
                toast.success(`Peran aktif: ${role}`);
              }}
              className={`rounded px-1.5 py-1 text-[10px] ${
                userStore.profile.activeRole === role
                  ? 'bg-sky font-bold text-white'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}
