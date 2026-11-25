import { Box, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MarketProduct } from '@/types';

interface ProductCardProps {
  product: MarketProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/produk/${product.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition-transform active:scale-[0.98]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-slate-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
          <Box className="h-2.5 w-2.5 text-sky" strokeWidth={2} />
          <span className="text-[8px] font-bold uppercase tracking-wide text-navy">
            {product.originMaterialBadge}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="mb-1 truncate text-sm font-bold leading-tight text-navy">
          {product.name}
        </h3>
        <p className="mb-2 text-sm font-bold text-sky">
          Rp {product.priceIdr.toLocaleString('id-ID')}
        </p>
        <div className="mt-auto flex items-center gap-1 text-text-secondary">
          <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.8} />
          <span className="truncate text-[10px] font-medium">
            {product.seller.location}
          </span>
        </div>
      </div>
    </Link>
  );
}
