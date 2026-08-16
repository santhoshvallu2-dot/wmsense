import React from 'react';
import { Boxes } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Smart Inventory Management</h2>
          <p className="text-xs text-slate-400">SKU tracking across warehouse zones, bin locations, reserved stock, and damage logs.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Boxes className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Inventory Control Module</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Stock levels, safety thresholds, SKU statuses (IN STOCK, LOW STOCK, OUT OF STOCK), and zone bins will load in Phase 3 & 5.
        </p>
      </div>
    </div>
  );
};
