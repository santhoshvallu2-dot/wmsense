import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PackingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Packing & Quality Check (QC)</h2>
          <p className="text-xs text-slate-400">Item quantity validation, damage inspection, packaging checks, and QC Pass/Fail signoff.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Packing & Quality Station</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Packing workflow and QC validation triggers (PASS → Ready to Dispatch, FAIL → Exception created) will be implemented in Phase 10.
        </p>
      </div>
    </div>
  );
};
