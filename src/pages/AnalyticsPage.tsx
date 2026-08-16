import React from 'react';
import { BarChart3 } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Operational Analytics & Bottlenecks</h2>
          <p className="text-xs text-slate-400 font-medium">Stage-by-stage throughput analytics and real-time bottleneck detection.</p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Analytics & Recharts Dashboard</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Fulfillment rates, order breakdown charts, picking efficiency, and automated bottleneck diagnostic alerts will be built in Phase 14.
        </p>
      </div>
    </div>
  );
};
