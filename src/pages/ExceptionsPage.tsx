import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ExceptionsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Exception Management Center</h2>
          <p className="text-xs text-slate-400">Shortages, damaged stock, quality failures, missing items, and resolution tracking.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Exception Resolution Hub</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Automated resolution recommendations (FOUND, REPLACED, BACKORDERED, CANCELLED) will be implemented in Phase 11.
        </p>
      </div>
    </div>
  );
};
