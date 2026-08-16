import React from 'react';
import { ClipboardList, ArrowUpDown, Filter } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Order Queue & Priority Ranking</h2>
          <p className="text-xs text-slate-400">Deterministic priority scoring considering customer SLA, deadline risk, and order value.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by Priority
          </button>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Order Management Queue</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Order priority calculations, SLA deadline risk tracking, and order list view will be populated with mock data in Phase 3 & 6.
        </p>
      </div>
    </div>
  );
};
