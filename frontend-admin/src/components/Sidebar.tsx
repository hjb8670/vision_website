import { NavLink } from 'react-router-dom';
import { DashboardIcon, MarketsIcon, CategoriesIcon, UsersIcon } from './icons';
import visionLogo from '../assets/vision-logo.png';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon, end: true },
  { to: '/markets', label: 'Markets', icon: MarketsIcon, end: false },
  { to: '/categories', label: 'Categories', icon: CategoriesIcon, end: false },
  { to: '/users', label: 'Users', icon: UsersIcon, end: false },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-bg-sidebar border-r border-white/10 flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
        <img src={visionLogo} alt="Vision" className="w-8 h-8 rounded-lg object-cover" />
        <span className="font-bold tracking-tight">Vision Admin</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent-primary/15 text-accent-primary'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
