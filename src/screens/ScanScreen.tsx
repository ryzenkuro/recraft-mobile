import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Keyboard,
  RefreshCw,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { type ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { scanService } from '@/services/scanService';
import { useScanStore } from '@/store/scanStore';
import { triggerHaptic } from '@/utils/haptics';

const SCAN_LOADING_STEPS = [
  'Mendeteksi tepi barang bekas...',
  'Mengkalibrasi skala dimensi cm...',
  'Mengidentifikasi jenis material...',
] as const;

export default function ScanScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    toast.success('Dimensi material disiapkan untuk penawaran Pasar.');
    navigate('/pasar?tab=bahan');
  };

  return (
    <div className="relative flex min-h-full flex-col bg-slate-950 text-white pt-[max(env(safe-area-inset-top),0.75rem)] pb-[max(env(safe-area-inset-bottom),1.25rem)]">
      <LoadingOverlay
        isVisible={scanState === 'PROCESSING'}
        steps={SCAN_LOADING_STEPS}
        subtitle="Mengkalibrasi ukuran dan material barang bekas..."
      />

      {/* Top Floating Bar */}
      <header className="z-20 flex items-center justify-between px-4 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          Kembali
        </button>

        <span className="rounded-full bg-navy/90 px-3 py-1 font-mono text-xs font-bold text-sky-light">
          RE-CRAFT Scan
        </span>
      </header>

      {/* STATE 1: IDLE VIEWFINDER + SMART SCALE-BOX */}
      {scanState === 'IDLE' && (
        <div className="flex flex-1 flex-col justify-between px-5 pt-2">
          <div className="mx-auto mt-2 rounded-full border border-sky/40 bg-slate-900/80 px-4 py-2 text-center text-xs font-medium text-sky-light backdrop-blur">
            Arahkan barang bekas ke dalam Smart Scale-Box & pastikan cahaya cukup
          </div>

          {/* Smart Scale-Box */}
          <div className="my-auto flex flex-col items-center justify-center py-6">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.03]">
              {/* Corner Brackets */}
              <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-2xl border-l-4 border-t-4 border-sky" />
              <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-2xl border-r-4 border-t-4 border-sky" />
              <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-2xl border-b-4 border-l-4 border-sky" />
              <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-2xl border-b-4 border-r-4 border-sky" />

              {/* Calibration Crosshair */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-10 w-10 rounded-full border border-dashed border-sky/70 p-2">
                  <div className="h-full w-full rounded-full bg-sky/30" />
                </div>
                <p className="px-6 text-xs text-slate-300">
                  Letakkan objek di tengah kotak untuk kalibrasi otomatis (cm)
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar: Galeri | Shutter | Input Manual */}
          <div className="grid grid-cols-3 items-center gap-3 pb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/15 active:scale-95"
            >
              <ImageIcon className="h-5 w-5 text-sky-light" strokeWidth={1.5} />
              Galeri
            </button>

            <div className="flex justify-center">
              <button
                type="button"
                aria-label="Jepret Barang Bekas"
                onClick={handleCameraCapture}
                className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-sky bg-white p-1 shadow-premium transition-transform active:scale-90"
              >
                <span className="h-full w-full rounded-full border-2 border-navy bg-white" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleManualInput}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/15 active:scale-95"
            >
              <Keyboard className="h-5 w-5 text-sky-light" strokeWidth={1.5} />
              Manual
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* STATE 2: CONFIRMATION SHEET */}
      {scanState === 'CONFIRMATION' && result && (
        <div className="mt-2 flex flex-1 flex-col justify-between rounded-t-3xl bg-surface px-5 pt-5 text-slate-900 shadow-up">
          <div className="space-y-4 overflow-y-auto pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-navy">Konfirmasi Dimensi</h1>
                <p className="text-xs text-text-secondary">
                  Periksa atau koreksi ukuran sebelum merancang arsitektur 3D
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  result.confidence >= 0.9
                    ? 'bg-success-light text-success'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                {Math.round(result.confidence * 100)}% Akurat
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
              <img
                src={result.photoUrl}
                alt={result.materialType}
                className="h-44 w-full object-cover"
              />
              <div className="p-3">
                <p className="text-sm font-bold text-navy">{result.materialType}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.detectedMaterials.map((mat) => (
                    <span
                      key={mat}
                      className="rounded-full bg-sky-lighter px-2.5 py-0.5 text-[11px] font-semibold text-sky"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Editable Dimensions P x L x T */}
            <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-navy">
                  Kalibrasi Dimensi (cm)
                </h2>
                <span className="font-mono text-[11px] text-text-secondary">
                  P × L × T
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <DimensionField
                  label="Panjang"
                  value={result.dimensions.panjang}
                  onChange={(val) => updateDimensions({ panjang: val })}
                />
                <DimensionField
                  label="Lebar"
                  value={result.dimensions.lebar}
                  onChange={(val) => updateDimensions({ lebar: val })}
                />
                <DimensionField
                  label="Tinggi"
                  value={result.dimensions.tinggi}
                  onChange={(val) => updateDimensions({ tinggi: val })}
                />
              </div>
            </div>
          </div>

          {/* Dual CTA Actions */}
          <div className="space-y-2.5 border-t border-border bg-surface pt-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleOfferToMarket}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-navy bg-white px-3 text-sm font-semibold text-navy active:scale-[0.98]"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                Tawarkan
              </button>
              <button
                type="button"
                onClick={() => navigate('/analisis')}
                className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-sky px-3 text-sm font-semibold text-white shadow-premium active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                Lanjut Rancang
              </button>
            </div>

            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-navy"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Pindai Ulang Barang
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: ERROR */}
      {scanState === 'ERROR' && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger/20 text-danger">
            <AlertCircle className="h-8 w-8" strokeWidth={1.5} />
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

interface DimensionFieldProps {
  label: string;
  value: number;
  onChange: (nextValue: number) => void;
}

function DimensionField({ label, value, onChange }: DimensionFieldProps) {
  return (
    <label className="flex flex-col rounded-xl bg-sky-lighter p-2.5">
      <span className="text-[11px] font-medium text-text-secondary">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={1}
        value={value}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          onChange(Number.isFinite(parsed) && parsed >= 0 ? parsed : 0);
        }}
        className="mt-1 w-full bg-transparent font-mono text-lg font-bold text-navy focus:outline-none"
      />
    </label>
  );
}
