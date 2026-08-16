import React from 'react';
import {
  Package,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Clock,
  CheckCircle2,
  Cpu,
  ArrowUpRight
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-cyan-900/50 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            <span>Deterministic Smart Engine Ready</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Warehouse Control Center</h2>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            WMSense active monitoring: Order urgency, fulfillment risk, stock levels, and automated exception detection.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300">
            Shift: <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-bold text-white mt-1">15</h3>
            <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 84% on schedule
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Orders At Risk</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">3</h3>
            <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Critical deadline approach
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Low Stock SKUs</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">2</h3>
            <p className="text-xs text-rose-400/80 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> WM-104 below threshold
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ready to Dispatch</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">4</h3>
            <p className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Quality checks passed
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Module Ready Notice */}
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ArrowUpRight className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Phase 2 Dashboard Structure Loaded</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          The layout and navigation structure is fully established. Data models and business logic will be initialized in Phase 3.
        </p>
      </div>
    </div>
  );
};
