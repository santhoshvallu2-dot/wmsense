import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Boxes,
  Cpu,
  PackageCheck,
  AlertTriangle,
  Truck,
  BarChart3,
  Sparkles,
  Zap,
  ChevronRight,
  Warehouse,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ClipboardList, badge: '15 Active', badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { name: 'Inventory', path: '/inventory', icon: Boxes, badge: '20 SKUs', badgeColor: 'bg-slate-800 text-slate-400 border-slate-700' },
  { name: 'Smart Allocation', path: '/allocation', icon: Cpu, badge: 'DEMO SCENARIO', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold' },
  { name: 'Picking', path: '/picking', icon: PackageCheck },
  { name: 'Packing & QC', path: '/packing', icon: ShieldCheck },
  { name: 'Exceptions', path: '/exceptions', icon: AlertTriangle, badge: '3 Open', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { name: 'Dispatch', path: '/dispatch', icon: Truck },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Decision Center', path: '/decision-center', icon: Sparkles, badge: 'AI Engine', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Warehouse className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">WMSense</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Warehouse Operations</p>
            </div>
          </div>
        </div>

        {/* Tagline Banner */}
        <div className="px-4 py-2.5 mx-3 mt-3 rounded-lg bg-gradient-to-r from-indigo-950/50 via-slate-900 to-cyan-950/40 border border-indigo-500/20 flex items-center space-x-2">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-medium text-slate-300 italic">"Smart Decisions. Faster Fulfillment."</span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Operational Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3 min-w-0">
                      <Icon
                        className={`w-5 h-5 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/30'
                              : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {!item.badge && (
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${
                            isActive ? 'opacity-100 text-white' : 'text-slate-500'
                          }`}
                        />
                      )}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Demo Footer Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-slate-300">Deterministic Engine Active</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">P0 Ready</span>
          </div>
        </div>
      </aside>
    </>
  );
};
