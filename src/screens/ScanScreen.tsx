import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  AlertCircle,
  Box,
  CheckCircle2,
  Edit3,
  Image as ImageIcon,
  Pencil,
  PenTool,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  X,
  Zap,
} from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { SCAN_CAMERA_BG_URL } from '@/mocks';
import { scanService } from '@/services/scanService';
import { useScanStore } from '@/store/scanStore';
import { triggerHaptic } from '@/utils/haptics';

const SCAN_CALIBRATION_STEPS = [
  'Mendeteksi sudut objek...',
  'Mengkalibrasi skala cm...',
  'Mengidentifikasi bahan bekas...',
] as const;

export default function ScanScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scanMode, setScanMode] = useState<'OBJEK' | 'RUANG'>(
    searchParams.get('mode') === 'ruang' ? 'RUANG' : 'OBJEK'
  );
  const [flashOn, setFlashOn] = useState(false);

  const {
    scanState,
    result,
    error,
    setProcessing,
    setResult,
    updateDimensions,
    setError,
    reset,
  } = useScanStore();

  const handleCameraCapture = async () => {
    void triggerHaptic('MEDIUM');

    try {
      let capturedDataUrl: string | undefined;

      if (Capacitor.isNativePlatform()) {
        const photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
        });
        capturedDataUrl = photo.dataUrl;
      }

      setProcessing();
      const scanResult = await scanService.scanFromCamera(capturedDataUrl);
      setResult(scanResult);
      void triggerHaptic('LIGHT');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Kamera tidak dapat diakses.';
      if (message.toLowerCase().includes('cancel')) {
        reset();
        return;
      }
      setError(message);
      toast.error(message);
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setProcessing();
      const scanResult = await scanService.scanFromUpload(file);
      setResult(scanResult);
      void triggerHaptic('LIGHT');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal membaca foto dari galeri.';
      setError(message);
      toast.error(message);
    }
  };

  const handleManualInput = () => {
    void triggerHaptic('LIGHT');
    setResult(scanService.createManualScanDraft());
  };

  const handleOfferToMarket = () => {
    toast.success('Dimensi material disiapkan untuk ditawarkan di Pasar.');
    navigate('/pasar?tab=bahan');
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-900 text-white">
      <LoadingOverlay
        isVisible={scanState === 'PROCESSING'}
        steps={SCAN_CALIBRATION_STEPS}
      />

      {/* Background Simulated Camera Feed (Sesuai Prototipe HTML) */}
      <img
        src={result?.photoUrl || SCAN_CAMERA_BG_URL}
        alt="Camera Feed Background"
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-navy via-slate-800/80 to-sky/30 opacity-80 mix-blend-multiply" />
      <div className="absolute inset-0 z-0 bg-black/25" />

      {/* Top Bar (Transparent) */}
      <header className="z-20 flex shrink-0 items-center justify-between px-4 pb-4 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <button
          type="button"
          aria-label="Tutup kamera"
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors active:bg-black/60"
        >
          <X className="h-5 w-5" strokeWidth={1.8} />
        </button>

        {/* Mode Switcher: Objek | Ruang */}
        <div className="flex items-center rounded-full bg-black/40 p-1 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={() => setScanMode('OBJEK')}
            className={`rounded-full px-4 py-1.5 text-xs transition-all ${
              scanMode === 'OBJEK'
                ? 'bg-white font-semibold text-navy shadow-sm'
                : 'font-medium text-white/80 active:text-white'
            }`}
          >
            Objek
          </button>
          <button
            type="button"
            onClick={() => setScanMode('RUANG')}
            className={`rounded-full px-4 py-1.5 text-xs transition-all ${
              scanMode === 'RUANG'
                ? 'bg-white font-semibold text-navy shadow-sm'
                : 'font-medium text-white/80 active:text-white'
            }`}
          >
            Ruang
          </button>
        </div>

        <button
          type="button"
          aria-label="Flash"
          onClick={() => {
            setFlashOn((prev) => !prev);
            toast.info(flashOn ? 'Lampu kilat dimatikan' : 'Lampu kilat aktif (simulasi)');
          }}
          className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-colors ${
            flashOn
              ? 'bg-amber-400 text-slate-950'
              : 'bg-black/40 text-white active:bg-black/60'
          }`}
        >
          <Zap className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </header>

      {/* Camera Viewport & Smart Scale-Box */}
      {scanState !== 'ERROR' && (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6">
          {/* Static Guidance Badge */}
          <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full bg-success/90 px-4 py-2 text-white shadow-lg backdrop-blur-md">
            <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="whitespace-nowrap text-xs font-semibold">
              {scanMode === 'OBJEK'
                ? 'Sudut pas, siap jepret!'
                : 'Arahkan ke sudut ruang target'}
            </span>
          </div>

          {/* Smart Scale-Box (White Corner Brackets) */}
          <div className="relative aspect-[3/4] w-full max-w-[300px]">
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-2 border-t-2 border-white" />
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-2 border-t-2 border-white" />
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-2 border-l-2 border-white" />
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-2 border-r-2 border-white" />

            {/* Alignment Crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <div className="h-px w-full bg-white/50" />
              <div className="absolute h-full w-px bg-white/50" />
              <div className="z-10 h-4 w-4 rounded-full border border-white bg-white/20" />
            </div>
          </div>
        </main>
      )}

      {/* Bottom Camera Bar (IDLE) */}
      {scanState === 'IDLE' && (
        <footer className="z-20 flex shrink-0 items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-8 pt-6 pb-[max(env(safe-area-inset-bottom),1.75rem)]">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 transition-opacity active:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md">
              <ImageIcon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <span className="text-[10px] font-medium text-white/80">Galeri</span>
          </button>

          <button
            type="button"
            aria-label="Jepret"
            onClick={handleCameraCapture}
            className="h-20 w-20 rounded-full border-4 border-white p-1.5 transition-transform active:scale-95"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              <div className="h-14 w-14 rounded-full bg-white" />
            </div>
          </button>

          <button
            type="button"
            onClick={handleManualInput}
            className="flex flex-col items-center gap-1 transition-opacity active:opacity-70"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md">
              <Edit3 className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <span className="text-[10px] font-medium text-white/80">Manual</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryUpload}
            className="hidden"
          />
        </footer>
      )}

      {/* LAYER 2: POST-CAPTURE CONFIRMATION BOTTOM SHEET */}
      {scanState === 'CONFIRMATION' && result && (
        <div className="absolute inset-x-0 bottom-0 z-30">
          <div className="flex h-6 w-full items-end justify-center pb-2">
            <div className="h-1.5 w-10 rounded-full bg-white/40" />
          </div>

          <div className="relative rounded-t-3xl bg-surface px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.75rem)] text-slate-900 shadow-up">
            {/* Retake button */}
            <button
              type="button"
              aria-label="Pindai ulang"
              onClick={reset}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-navy active:bg-slate-200"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.8} />
            </button>

            {/* Detection Header */}
            <div className="mb-6 pr-10">
              <div className="mb-1 flex items-center gap-2">
                <Box className="h-5 w-5 text-sky" strokeWidth={1.8} />
                <h2 className="text-lg font-bold text-navy">
                  {result.materialType}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-sm bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                  <ShieldCheck className="h-3 w-3" />
                  Akurasi Tinggi ({Math.round(result.confidence * 100)}%)
                </span>
                <span className="text-xs text-text-secondary">Bisa diedit</span>
              </div>
            </div>

            {/* Dimension Inputs Grid (3 Kotak Putih P/L/T) */}
            <div className="mb-8 grid grid-cols-3 gap-3">
              <HtmlDimensionInput
                label="Panjang (P)"
                value={result.dimensions.panjang}
                onChange={(val) => updateDimensions({ panjang: val })}
              />
              <HtmlDimensionInput
                label="Lebar (L)"
                value={result.dimensions.lebar}
                onChange={(val) => updateDimensions({ lebar: val })}
              />
              <HtmlDimensionInput
                label="Tinggi (T)"
                value={result.dimensions.tinggi}
                onChange={(val) => updateDimensions({ tinggi: val })}
              />
            </div>

            {/* Stacked Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/analisis')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3.5 text-sm font-semibold text-white shadow-premium transition-transform active:scale-[0.98]"
              >
                <PenTool className="h-[18px] w-[18px]" strokeWidth={1.8} />
                Lanjut Rancang
              </button>

              <button
                type="button"
                onClick={handleOfferToMarket}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-sky bg-transparent py-3 text-sm font-semibold text-sky transition-colors active:bg-sky-light"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
                Tawarkan ke Pasar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {scanState === 'ERROR' && (
        <div className="z-20 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/20 text-danger">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Pemindaian Gagal</h2>
          <p className="mt-1.5 max-w-xs text-sm text-slate-300">
            {error ?? 'Terjadi kendala saat memproses gambar.'}
          </p>
          <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
            <button
              type="button"
              onClick={handleCameraCapture}
              className="min-h-12 w-full rounded-xl bg-sky font-semibold text-white shadow-premium"
            >
              Coba Pindai Lagi
            </button>
            <button
              type="button"
              onClick={reset}
              className="min-h-12 w-full rounded-xl border border-white/20 font-semibold text-white/90"
            >
              Kembali ke Kamera
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function HtmlDimensionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <label className="group relative rounded-xl border border-border bg-white p-3 shadow-sm transition-all focus-within:border-sky focus-within:ring-1 focus-within:ring-sky">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </span>
      <div className="flex items-end gap-1">
        <input
          type="number"
          inputMode="decimal"
          min={1}
          value={value}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
          }}
          className="m-0 w-full appearance-none border-none bg-transparent p-0 font-mono text-xl font-bold text-navy outline-none"
        />
        <span className="pb-1 text-xs font-medium text-text-secondary">cm</span>
      </div>
      <Pencil className="absolute right-2.5 top-2.5 h-3 w-3 text-slate-300 opacity-0 transition-opacity group-focus-within:opacity-100" />
    </label>
  );
}
