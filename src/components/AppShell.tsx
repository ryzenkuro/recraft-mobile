import { Folder, Home, Scan, ShoppingBag, User } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const desktopLinks = [
  { to: '/', label: 'Beranda' },
  { to: '/proyek', label: 'Proyek' },
  { to: '/pasar', label: 'Pasar' },
  { to: '/profil', label: 'Profil' },
];

export default function AppShell() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface">
      {/* Desktop Top Navigation Bar */}
      <header className="hidden items-center justify-between border-b border-border bg-white px-6 py-3 md:flex">
        <NavLink to="/" className="text-xl font-bold tracking-tight text-navy">
          RE-CRAFT
        </NavLink>

        <nav className="flex items-center gap-6">
          {desktopLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-navy' : 'text-text-secondary hover:text-navy'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/scan"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-navy px-4 text-sm font-semibold text-white shadow-premium hover:bg-navy-light"
        >
          <Scan className="h-4 w-4" strokeWidth={1.5} />
          Scan
        </NavLink>
      </header>

      {/* Main Content */}
      <main className="hide-scrollbar flex-1 overflow-y-auto pb-28 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Sesuai Prototipe HTML: titik aktif Sky + Center FAB polos) */}
      <nav className="fixed bottom-0 left-0 z-40 w-full rounded-t-2xl border-t border-slate-100 bg-white px-2 pt-2 pb-[max(env(safe-area-inset-bottom),1.25rem)] shadow-nav md:hidden">
        <div className="relative flex items-center justify-between">
          <MobileTab to="/" icon={Home} label="Beranda" end />
          <MobileTab to="/proyek" icon={Folder} label="Proyek" />

          {/* Center FAB Spacer */}
          <div className="flex flex-1 justify-center" aria-hidden="true" />

          <MobileTab to="/pasar" icon={ShoppingBag} label="Pasar" />
          <MobileTab to="/profil" icon={User} label="Profil" />

          {/* Center Elevated FAB: SCAN */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <NavLink
              to="/scan"
              aria-label="Scan Barang Bekas"
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-navy text-white shadow-premium transition-transform active:scale-95"
            >
              <Scan className="h-6 w-6" strokeWidth={2} />
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface MobileTabProps {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

function MobileTab({ to, label, icon: Icon, end }: MobileTabProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex flex-1 flex-col items-center justify-center gap-1 py-1.5 transition-colors ${
          isActive ? 'text-navy' : 'text-slate-400 active:text-navy'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
            {isActive && (
              <span className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sky" />
            )}
          </div>
          <span
            className={`mt-1 text-[10px] ${
              isActive ? 'font-semibold text-navy' : 'font-medium'
            }`}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
