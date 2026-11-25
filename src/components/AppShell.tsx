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
    <div className="flex h-full flex-col bg-surface">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 pb-3 pt-[max(env(safe-area-inset-top),0.75rem)] md:hidden">
        <div>
          <span className="text-lg font-bold tracking-tight text-navy">RE-CRAFT</span>
          <p className="text-[11px] text-text-secondary">Pindai Bekas, Rakit Presisi</p>
        </div>
        <span className="rounded-full bg-sky-lighter px-2.5 py-1 font-mono text-[11px] font-bold text-sky">
          V0
        </span>
      </header>

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
      <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (4 Menu + Elevated Center FAB Scan) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl border-t border-border bg-white px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-up md:hidden">
        <div className="grid grid-cols-5 items-end">
          <MobileTab to="/" icon={Home} label="Beranda" end />
          <MobileTab to="/proyek" icon={Folder} label="Proyek" />

          <div className="flex flex-col items-center justify-center pb-1">
            <NavLink
              to="/scan"
              aria-label="Scan"
              className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-navy text-white shadow-premium transition-transform active:scale-95"
            >
              <Scan className="h-6 w-6" strokeWidth={1.8} />
            </NavLink>
            <span className="mt-0.5 text-[10px] font-semibold text-navy">Scan</span>
          </div>

          <MobileTab to="/pasar" icon={ShoppingBag} label="Pasar" />
          <MobileTab to="/profil" icon={User} label="Profil" />
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
        `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl py-1 transition-colors ${
          isActive ? 'text-navy' : 'text-slate-400'
        }`
      }
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
      <span className="text-[11px] font-medium">{label}</span>
    </NavLink>
  );
}
