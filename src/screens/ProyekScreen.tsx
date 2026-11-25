import { Link } from 'react-router-dom';
import { DEFAULT_STUDIO_PROJECT_ID } from '@/mocks';

export default function ProyekScreen() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 p-4">
      <h1 className="text-xl font-bold text-navy">Proyek</h1>
      <p className="text-sm text-text-secondary">
        Placeholder daftar karya 3D (Karya, Offline, Produksi).
      </p>
      <Link
        to={`/studio/${DEFAULT_STUDIO_PROJECT_ID}`}
        className="inline-flex min-h-12 w-fit items-center rounded-xl border border-border bg-white px-4 font-semibold text-navy shadow-soft"
      >
        Buka Contoh Studio 3D (<span className="ml-1 font-mono text-sky">{DEFAULT_STUDIO_PROJECT_ID}</span>)
      </Link>
    </div>
  );
}
