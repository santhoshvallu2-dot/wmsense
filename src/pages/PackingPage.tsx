import React, { useMemo } from 'react';
import { Box, CheckSquare, XSquare, ShieldCheck, ClipboardCheck, BoxSelect, AlertCircle } from 'lucide-react';
import { WarehouseService } from '../services/warehouseService';

export const PackingPage: React.FC = () => {
  const packingTasks = WarehouseService.getPackingTasks();
  const qcChecks = WarehouseService.getQualityChecks();

  // Calculate KPIs
  const kpis = useMemo(() => {
    return {
      packingTotal: packingTasks.length,
      packed: packingTasks.filter(t => t.status === 'PACKED').length,
      packingInProgress: packingTasks.filter(t => t.status === 'IN_PROGRESS').length,
      qcPassed: qcChecks.filter(q => q.status === 'PASS').length,
      qcFailed: qcChecks.filter(q => q.status === 'FAIL').length,
    };
  }, [packingTasks, qcChecks]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BoxSelect className="w-8 h-8 text-cyan-500" />
            Packing & Quality Check
          </h1>
          <p className="text-slate-400 mt-1">Order verification, packaging, and dispatch prep</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Packing Tasks', value: kpis.packingTotal, icon: Box, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Packed', value: kpis.packed, icon: CheckSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'In Progress', value: kpis.packingInProgress, icon: BoxSelect, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'QC Passed', value: kpis.qcPassed, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'QC Failed', value: kpis.qcFailed, icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Packing Tasks Table */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
            <Box className="w-5 h-5 text-cyan-500" />
            <h2 className="text-lg font-semibold text-white">Packing Queue</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Task ID</th>
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">Station</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {packingTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-white">{task.id}</td>
                    <td className="p-4 font-mono text-slate-300">{task.orderId}</td>
                    <td className="p-4 text-slate-300 font-mono">{task.packingStation || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${
                        task.status === 'PACKED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {packingTasks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No packing tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Checks Table */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900/80">
            <ClipboardCheck className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-white">Quality Control (QC)</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">QC ID</th>
                  <th className="p-4 font-medium">Order</th>
                  <th className="p-4 font-medium">Checks</th>
                  <th className="p-4 font-medium">Inspector</th>
                  <th className="p-4 font-medium">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {qcChecks.map((qc) => (
                  <tr key={qc.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-white">{qc.id}</td>
                    <td className="p-4 font-mono text-slate-300">{qc.orderId}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-full ${qc.skuCheck ? 'bg-emerald-500' : 'bg-rose-500'}`} title="SKU Match"></div>
                        <div className={`w-2 h-2 rounded-full ${qc.quantityCheck ? 'bg-emerald-500' : 'bg-rose-500'}`} title="Qty Match"></div>
                        <div className={`w-2 h-2 rounded-full ${qc.damageCheck ? 'bg-emerald-500' : 'bg-rose-500'}`} title="Condition"></div>
                        <div className={`w-2 h-2 rounded-full ${qc.packagingCheck ? 'bg-emerald-500' : 'bg-rose-500'}`} title="Packaging"></div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{qc.inspector}</td>
                    <td className="p-4">
                      {qc.status === 'PASS' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium">
                          <ShieldCheck className="w-3 h-3" /> PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md text-xs font-medium">
                          <XSquare className="w-3 h-3" /> FAIL
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {qcChecks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">No QC checks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
