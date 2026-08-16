import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export const AllocationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Competitive Demo Feature</span>
          </div>
          <h2 className="text-xl font-bold text-white">Smart Inventory Allocation Engine</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Priority-based inventory reservation, shortage detection, and lower-priority order stock protection.
          </p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5">
          <Cpu className="w-4 h-4" /> RUN SMART ALLOCATION
        </button>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Cpu className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Smart Allocation Workstation</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The required hackathon demo scenario (SKU WM-104 conflict between ORD-1024 and ORD-1025) will be executed here in Phase 8.
        </p>
      </div>
    </div>
  );
};
