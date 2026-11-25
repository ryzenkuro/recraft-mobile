import { Link } from 'react-router-dom';
import { DEFAULT_STUDIO_PROJECT_ID } from '@/mocks';

export default function BerandaScreen() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4">
      <section className="rounded-2xl border border-border bg-gradient-to-b from-sky-lighter to-white p-5 shadow-soft">
        <span className="inline-block rounded-full bg-sky-light px-3 py-1 text-xs font-semibold text-navy">
          RE-CRAFT Studio • V0 Shell
        </span>
        <h1 className="mt-3 text-2xl font-bold text-navy">
          Pindai Bekasnya, Rakit Karyanya.
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Placeholder Beranda. Gunakan menu bawah atau tombol Scan untuk menguji navigasi 8 layar.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/scan"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-sky px-5 font-semibold text-white shadow-premium active:scale-[0.98]"
          >
            Buka Scan
          </Link>
          <Link
            to={`/studio/${DEFAULT_STUDIO_PROJECT_ID}`}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-border bg-white px-5 font-semibold text-navy shadow-soft active:scale-[0.98]"
          >
            Pratinjau Studio 3D
          </Link>
        </div>
      </section>
    </div>
  );
}
