import {
  ArrowLeft,
  CheckCircle2,
  Heart,
  Leaf,
  MapPin,
  MessageSquare,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';
import { useMarketStore } from '@/store/marketStore';
import { triggerHaptic } from '@/utils/haptics';

type DetailTab = 'DESKRIPSI' | 'SPESIFIKASI' | 'TERKAIT';

const PJP_CHANNELS = [
  'QRIS Nasional (PJP Berizin BI)',
  'Virtual Account Bank Lokal',
  'Dompet Digital Terintegrasi',
] as const;

export default function DetailProdukScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const products = useMarketStore((state) => state.products);
  const product = products.find((p) => p.id === id) ?? products[0] ?? null;

  const [activeTab, setActiveTab] = useState<DetailTab>('DESKRIPSI');
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>(PJP_CHANNELS[0]);

  if (!product) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface p-6 text-center">
        <p className="text-sm font-medium text-text-secondary">
          Produk belum dimuat atau tidak tersedia.
        </p>
        <Link
          to="/pasar"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-navy px-5 text-xs font-semibold text-white"
        >
          Kembali ke Pasar
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .slice(0, 2);

  const totalPrice = product.priceIdr * quantity;

  const handleConfirmOrder = () => {
    void triggerHaptic('MEDIUM');
    setShowCheckout(false);
    toast.success(
      `Pesanan ${quantity}× ${product.name} diproses melalui ${selectedChannel}.`
    );
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface">
      {/* Transparent Floating Header (Sesuai HTML) */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pb-2 pt-[max(env(safe-area-inset-top),1.25rem)]">
        <button
          type="button"
          aria-label="Kembali"
          onClick={() => navigate(-1)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft backdrop-blur-md transition-colors active:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
        </button>

        <button
          type="button"
          aria-label="Bagikan produk"
          onClick={() => toast.info('Tautan produk disalin (simulasi).')}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft backdrop-blur-md transition-colors active:bg-slate-50"
        >
          <Share2 className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </header>

      {/* Main Content */}
      <main className="hide-scrollbar z-10 flex-1 overflow-y-auto pb-28">
        <div className="mx-auto max-w-2xl">
          {/* Image Carousel */}
          <section className="relative aspect-square w-full bg-slate-100">
            <div
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
                setActiveSlide(idx);
              }}
              className="hide-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            >
              {product.images.map((src, idx) => (
                <img
                  key={`${product.id}-img-${idx}`}
                  src={src}
                  alt={`${product.name} ${idx + 1}`}
                  className="h-full w-full shrink-0 snap-center object-cover"
                />
              ))}
            </div>
            <div className="absolute bottom-4 right-4 rounded-md bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
              {activeSlide + 1} / {product.images.length}
            </div>
          </section>

          {/* Product Info Header */}
          <section className="border-b border-border bg-white px-4 pb-5 pt-4">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h1 className="text-xl font-bold leading-tight text-navy">
                {product.name}
              </h1>
              <button
                type="button"
                aria-label="Sukai produk"
                onClick={() => {
                  void triggerHaptic('LIGHT');
                  setLiked((prev) => !prev);
                }}
                className={`transition-colors ${
                  liked ? 'text-red-500' : 'text-slate-400 active:text-red-500'
                }`}
              >
                <Heart
                  className={`h-6 w-6 ${liked ? 'fill-red-500' : ''}`}
                  strokeWidth={1.6}
                />
              </button>
            </div>

            <h2 className="mb-3 text-2xl font-bold text-sky">
              Rp {product.priceIdr.toLocaleString('id-ID')}
            </h2>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-navy">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-text-secondary">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-text-secondary">
                <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
                <span>{product.soldCountLabel}</span>
              </div>
            </div>
          </section>

          {/* Seller Card */}
          <section className="flex items-center justify-between border-b border-border bg-white px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-slate-100">
                <img
                  src={product.seller.avatarUrl}
                  alt={product.seller.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="flex items-center gap-1 text-sm font-bold text-navy">
                  {product.seller.name}
                  {product.seller.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky" />
                  )}
                </h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
                  <MapPin className="h-2.5 w-2.5" />
                  {product.seller.location}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                toast.info(`Membuka chat dengan ${product.seller.name} (simulasi)`)
              }
              className="flex items-center gap-1 rounded-xl border border-navy px-4 py-2 text-xs font-semibold text-navy transition-colors active:bg-slate-50"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Chat
            </button>
          </section>

          {/* Underline Tabs Section */}
          <section className="mt-2 bg-white">
            <div className="flex border-b border-border px-4">
              {(
                [
                  { id: 'DESKRIPSI', label: 'Deskripsi' },
                  { id: 'SPESIFIKASI', label: 'Spesifikasi' },
                  { id: 'TERKAIT', label: 'Terkait' },
                ] as { id: DetailTab; label: string }[]
              ).map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 border-b-2 py-3 text-sm transition-colors ${
                      isActive
                        ? 'border-navy font-bold text-navy'
                        : 'border-transparent font-medium text-text-secondary active:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === 'DESKRIPSI' && (
              <div className="p-4">
                <p className="mb-4 text-sm leading-relaxed text-text-secondary">
                  {product.description}
                </p>

                <div className="mb-4 flex items-start gap-3 rounded-xl bg-sky-lighter p-3">
                  <Leaf className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <div>
                    <h4 className="text-xs font-semibold text-navy">
                      Dampak Keberlanjutan
                    </h4>
                    <p className="mt-0.5 text-[10px] text-text-secondary">
                      {product.sustainabilityNote}
                    </p>
                  </div>
                </div>

                <h4 className="mb-2 text-xs font-semibold text-navy">
                  Instruksi Perawatan
                </h4>
                <ul className="list-disc space-y-1 pl-4 text-sm text-text-secondary marker:text-sky">
                  {product.careInstructions.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'SPESIFIKASI' && (
              <div className="space-y-2.5 p-4">
                <SpecRow
                  label="Dimensi Karya"
                  value={product.dimensionsText}
                  mono
                />
                <SpecRow
                  label="Berat Estimasi"
                  value={`${product.weightGrams} gram`}
                  mono
                />
                <SpecRow
                  label="Asal Material"
                  value={product.originMaterialBadge}
                />
                <SpecRow label="Studio Perajin" value={product.seller.name} />
              </div>
            )}

            {activeTab === 'TERKAIT' && (
              <div className="grid grid-cols-2 gap-3 p-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="absolute bottom-0 z-20 w-full shrink-0 border-t border-border bg-white px-4 pt-3 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-up">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          {/* Quantity Spinner */}
          <div className="flex h-12 items-center rounded-xl border border-border bg-slate-50">
            <button
              type="button"
              aria-label="Kurangi jumlah"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-full w-10 items-center justify-center rounded-l-xl text-navy active:bg-slate-100"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-navy">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Tambah jumlah"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-full w-10 items-center justify-center rounded-r-xl text-navy active:bg-slate-100"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowCheckout(true)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-navy text-sm font-bold text-white shadow-premium transition-transform active:scale-[0.98]"
          >
            <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.8} />
            + Keranjang (Rp {totalPrice.toLocaleString('id-ID')})
          </button>
        </div>
      </footer>

      {/* Modal Checkout PJP Resmi */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-premium">
            <h2 className="text-base font-bold text-navy">
              Pembayaran via PJP Resmi (Simulasi)
            </h2>
            <p className="text-xs text-text-secondary">
              Total untuk {quantity}× {product.name}:{' '}
              <strong className="font-mono text-sky">
                Rp {totalPrice.toLocaleString('id-ID')}
              </strong>
            </p>

            <div className="space-y-2">
              {PJP_CHANNELS.map((channel) => (
                <button
                  key={channel}
                  type="button"
                  onClick={() => setSelectedChannel(channel)}
                  className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-3 text-left text-xs font-semibold ${
                    selectedChannel === channel
                      ? 'border-sky bg-sky-lighter text-navy'
                      : 'border-border bg-white text-text-secondary'
                  }`}
                >
                  {channel}
                  {selectedChannel === channel && (
                    <span className="h-2.5 w-2.5 rounded-full bg-sky" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="min-h-11 rounded-xl border border-border font-semibold text-navy"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="min-h-11 rounded-xl bg-sky font-semibold text-white"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 text-xs last:border-none last:pb-0">
      <span className="text-text-secondary">{label}</span>
      <span className={`font-semibold text-navy ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
