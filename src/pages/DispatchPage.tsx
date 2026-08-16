import React from 'react';
import { Truck } from 'lucide-react';

export const DispatchPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Dispatch & Carrier Staging</h2>
          <p className="text-xs text-slate-400">Order handover to carriers, inventory ledger update, and shipping logs.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Truck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Dispatch Logistics Bay</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Final order dispatch verification, stock deduction, and movement history will load in Phase 12.
        </p>
      </div>
    </div>
  );
};
