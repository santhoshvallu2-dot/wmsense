import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, ShieldCheck, Search } from 'lucide-react';

interface TopHeaderProps {
  setMobileOpen: (open: boolean) => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Warehouse Control Center', subtitle: 'Real-time operational KPIs, alerts, and fulfillment pipelines' },
  '/orders': { title: 'Order Queue & Risk Scoring', subtitle: 'Customer orders, dispatch deadlines, and automated priority ranks' },
  '/inventory': { title: 'Smart Inventory Management', subtitle: 'Stock visibility, bin locations, SKU status, and damage tracking' },
  '/allocation': { title: 'Smart Priority & Allocation Engine', subtitle: 'Priority-based stock reservation & conflict resolution engine' },
  '/picking': { title: 'Picking & Route Optimization', subtitle: 'Zone-grouped picking queues and estimated travel times' },
  '/packing': { title: 'Packing & Quality Check', subtitle: 'Item verification, package assembly, and quality validation' },
  '/exceptions': { title: 'Exception Management Center', subtitle: 'Automated resolution tracking for shortages, damages, and delays' },
  '/dispatch': { title: 'Dispatch & Carrier Logistics', subtitle: 'Ready order staging, dispatch logging, and movement audits' },
  '/analytics': { title: 'Analytics & Bottleneck Detection', subtitle: 'Fulfillment throughput, stage duration, and process diagnostics' },
  '/decision-center': { title: 'WMSense Decision Center', subtitle: 'Explainable AI audit trail of autonomous warehouse decisions' },
};

export const TopHeader: React.FC<TopHeaderProps> = ({ setMobileOpen }) => {
  const location = useLocation();
  const pageMeta = pageTitles[location.pathname] || {
    title: 'WMSense Operations',
    subtitle: 'Smart Warehouse Operations Platform',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Left Area: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 lg:hidden transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg lg:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {pageMeta.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">{pageMeta.subtitle}</p>
        </div>
      </div>

      {/* Right Area: System Status & Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* System Online Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Warehouse Online</span>
        </div>

        {/* Quick Search shortcut placeholder */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs">
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Search SKU or Order...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-700 rounded text-slate-300 font-mono">⌘K</kbd>
        </div>

        {/* Notifications Icon with Alert Dot */}
        <button
          type="button"
          aria-label="System Notifications"
          className="relative p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-900" aria-hidden="true" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-xs">
            OP
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white leading-tight">Shift Supervisor</div>
            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400 inline" />
              <span>Zone A-1 Control</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
