import React from 'react';
import { PackageCheck } from 'lucide-react';

export const PickingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Picking Queue & Route Optimization</h2>
          <p className="text-xs text-slate-400">Zone-grouped task batching, bin route sequencing, and item confirmation.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <PackageCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Picking Route Workstation</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Zone A → Zone B optimized picking routes, travel time estimates, and exception reporting (missing/damaged) load in Phase 9.
        </p>
      </div>
    </div>
  );
};
