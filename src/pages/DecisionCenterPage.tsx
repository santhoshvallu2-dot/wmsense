import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

export const DecisionCenterPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Showcase Feature</span>
          </div>
          <h2 className="text-xl font-bold text-white">WMSense Decision Center</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Human-readable explainable decision audit log showing Decision → Reason → Impact → Recommended Action.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Brain className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Explainable Decision Audit Trail</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Every autonomous system decision (allocation, stock protection, route priority, exception resolutions) will be logged here in Phase 15.
        </p>
      </div>
    </div>
  );
};
