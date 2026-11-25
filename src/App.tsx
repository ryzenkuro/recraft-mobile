import { App as CapApp } from '@capacitor/app';
import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppShell from '@/components/AppShell';
import { StateDebugger } from '@/components/StateDebugger';
import { isDev } from '@/config/environment';
import BerandaScreen from '@/screens/BerandaScreen';
import { useMarketStore } from '@/store/marketStore';
import { useProjectStore } from '@/store/projectStore';

const AnalisisValidasiScreen = lazy(
  () => import('@/screens/AnalisisValidasiScreen')
);
const DetailProdukScreen = lazy(() => import('@/screens/DetailProdukScreen'));
const PasarScreen = lazy(() => import('@/screens/PasarScreen'));
const ProfilScreen = lazy(() => import('@/screens/ProfilScreen'));
const ProyekScreen = lazy(() => import('@/screens/ProyekScreen'));
const ScanScreen = lazy(() => import('@/screens/ScanScreen'));
const Studio3DScreen = lazy(() => import('@/screens/Studio3DScreen'));

function RouteLoadingFallback() {
  return (
    <div className="flex h-full min-h-[40vh] flex-col items-center justify-center gap-3 bg-surface p-6">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-sky-light border-t-navy" />
      <p className="text-xs font-medium text-text-secondary">
        Memuat halaman...
      </p>
    </div>
  );
}

export default function App() {
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const fetchMarketData = useMarketStore((state) => state.fetchMarketData);

  useEffect(() => {
    void fetchProjects();
    void fetchMarketData();
  }, [fetchProjects, fetchMarketData]);

  useEffect(() => {
    const handle = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        void CapApp.exitApp();
      }
    });

    return () => {
      void handle.then((listener) => listener.remove());
    };
  }, []);

  return (
    <>
      <Toaster position="top-center" richColors />
      {isDev && <StateDebugger />}

      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<BerandaScreen />} />
            <Route path="proyek" element={<ProyekScreen />} />
            <Route path="pasar" element={<PasarScreen />} />
            <Route path="profil" element={<ProfilScreen />} />
          </Route>

          {/* Layar fokus penuh tanpa bottom navigation */}
          <Route path="scan" element={<ScanScreen />} />
          <Route path="analisis" element={<AnalisisValidasiScreen />} />
          <Route path="studio/:id" element={<Studio3DScreen />} />
          <Route path="produk/:id" element={<DetailProdukScreen />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
