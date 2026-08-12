import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Sparkles, Compass, LineChart, PieChart, 
  Briefcase, Target, Calculator, Bookmark, GraduationCap, 
  Newspaper, UserCheck, ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const sidebarLinks = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Personal Planner', path: '/ai-planner', icon: Sparkles, highlight: true },
    { name: 'Portfolio Tracker', path: '/portfolio', icon: Briefcase },
    { name: 'Goal Planner', path: '/goals', icon: Target },
    { name: 'Stock Explorer', path: '/stocks', icon: LineChart },
    { name: 'Mutual Funds', path: '/mutual-funds', icon: PieChart },
    { name: 'World Financial News', path: '/news', icon: Newspaper },
    { name: 'Calculators & Scenarios', path: '/calculators', icon: Calculator },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
    { name: 'Financial Profile', path: '/profile', icon: UserCheck },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-800/80 bg-[#0E1420] min-h-[calc(100vh-4rem)] p-4 space-y-6">
      <div>
        <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Fintech Core Apps</h3>
        <nav className="space-y-1">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  } ${item.highlight && !location.pathname.includes(item.path) ? 'text-emerald-400 font-semibold' : ''}`
                }
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-emerald-400 animate-pulse' : ''}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Safety Badge in Sidebar */}
      <div className="pt-4 border-t border-slate-800/60 px-3">
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3 text-[11px] text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            AI Guardrails Active
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            InvestAI provides educational intelligence. Always cross-verify before committing capital.
          </p>
        </div>
      </div>
    </aside>
  );
};
