import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailProdukScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-full flex-col bg-surface pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex min-h-12 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-navy"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          Kembali
        </button>
        <span className="font-mono text-xs text-text-secondary">Produk • {id}</span>
      </header>

      <main className="mx-auto w-full max-w-2xl p-4">
        <h1 className="text-xl font-bold text-navy">Detail Produk Pasar</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Placeholder galeri foto, spesifikasi material bekas, dan pembayaran PJP resmi.
        </p>
      </main>
    </div>
  );
}
