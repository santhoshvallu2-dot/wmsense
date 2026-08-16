import React, { useMemo } from 'react';
import { PackageSearch, CheckCircle2, Loader2, Clock, AlertOctagon, Map, Target, TrendingUp } from 'lucide-react';
import { WarehouseService } from '../services/warehouseService';

export const PickingPage: React.FC = () => {
  const pickingTasks = WarehouseService.getPickingTasks();
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    const total = pickingTasks.length;
    const completed = pickingTasks.filter(t => t.status === 'PICKED').length;
    const inProgress = pickingTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const pending = pickingTasks.filter(t => t.status === 'NOT_STARTED').length;
    const exceptions = pickingTasks.filter(t => t.status === 'EXCEPTION').length;
    
    return { total, completed, inProgress, pending, exceptions, progress: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [pickingTasks]);

  const statusConfig = {
    PICKED: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2, label: 'Picked' },
    IN_PROGRESS: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Loader2, label: 'In Progress' },
    NOT_STARTED: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock, label: 'Pending' },
    EXCEPTION: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertOctagon, label: 'Exception' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-emerald-500" />
            Smart Picking Queue
          </h1>
          <p className="text-slate-400 mt-1">Optimized wave picking and routing</p>
        </div>
        <div className="bg-slate-950 px-6 py-3 rounded-xl border border-slate-800 flex items-center gap-4">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-xs text-slate-400">Wave Progress</p>
            <p className="text-lg font-bold text-white">{kpis.progress}%</p>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden ml-2">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${kpis.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Tasks', value: kpis.total, icon: PackageSearch, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Completed', value: kpis.completed, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'In Progress', value: kpis.inProgress, icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Pending', value: kpis.pending, icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10' },
          { label: 'Exceptions', value: kpis.exceptions, icon: AlertOctagon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-white">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
          <Map className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-semibold text-white">Active Picking Route</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Task ID</th>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Location</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium text-right">Qty</th>
                <th className="p-4 font-medium">Assigned To</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {pickingTasks.map((task) => {
                const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.NOT_STARTED;
                const StatusIcon = status.icon;

                return (
                  <tr key={task.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-white">{task.id}</td>
                    <td className="p-4 font-mono text-slate-300">{task.orderId}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-xs font-mono border border-emerald-500/20">{task.zone}</span>
                        <span className="text-slate-300 font-mono">{task.bin}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{task.sku}</td>
                    <td className="p-4 text-right font-medium text-white">{task.quantity}</td>
                    <td className="p-4 text-slate-400">{task.picker || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${status.color}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${task.status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {pickingTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No picking tasks available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
