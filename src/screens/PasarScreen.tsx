import { Link } from 'react-router-dom';
import { DEFAULT_PRODUCT_ID } from '@/mocks';

export default function PasarScreen() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <h1 className="text-xl font-bold text-navy">Pasar</h1>
      <p className="text-sm text-text-secondary">
        Placeholder RE-CRAFT Pasar (Produk, Bahan, Kolab).
      </p>
      <Link
        to={`/produk/${DEFAULT_PRODUCT_ID}`}
        className="inline-flex min-h-12 w-fit items-center rounded-xl border border-border bg-white px-4 font-semibold text-sky shadow-soft"
      >
        Lihat Contoh Detail Produk →
      </Link>
    </div>
  );
}
