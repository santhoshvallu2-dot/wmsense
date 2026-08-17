import React, { useState, useMemo } from 'react';
import { Play, CheckCircle2, AlertTriangle, XCircle, Activity, Zap, Layers, Beaker, ShieldAlert, Database } from 'lucide-react';
import { WarehouseService } from '../services/warehouseService';

export const AllocationPage: React.FC = () => {
  const [hasRunAllocation, setHasRunAllocation] = useState(false);
  const [isAllocating, setIsAllocating] = useState(false);
  
  const allocations = WarehouseService.getAllocations();
  const orders = WarehouseService.getOrders();
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    return {
      total: allocations.length,
      full: allocations.filter(a => a.status === 'FULL').length,
      partial: allocations.filter(a => a.status === 'PARTIAL').length,
      blocked: allocations.filter(a => a.status === 'BLOCKED').length,
    };
  }, [allocations]);

  const handleRunAllocation = () => {
    setIsAllocating(true);
    setTimeout(() => {
      setHasRunAllocation(true);
      setIsAllocating(false);
    }, 1500);
  };

  const statusColors: Record<string, string> = {
    FULL: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    PARTIAL: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    BLOCKED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-8 h-8 text-amber-500" />
            Smart Allocation Engine
          </h1>
          <p className="text-slate-400 mt-1">Priority-based inventory distribution and shortage resolution</p>
        </div>
        <button 
          onClick={handleRunAllocation}
          disabled={isAllocating || hasRunAllocation}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            isAllocating 
              ? 'bg-amber-500/50 text-white cursor-wait'
              : hasRunAllocation 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
          }`}
        >
          {isAllocating ? (
            <><Activity className="w-5 h-5 animate-spin" /> Processing...</>
          ) : hasRunAllocation ? (
            <><CheckCircle2 className="w-5 h-5" /> Allocation Complete</>
          ) : (
            <><Play className="w-5 h-5" /> Run Smart Allocation</>
          )}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Allocations', value: kpis.total, icon: Layers, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Fully Allocated', value: kpis.full, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Partial Allocations', value: kpis.partial, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Blocked / Shortage', value: kpis.blocked, icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">{kpi.label}</p>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900/60 rounded-2xl border border-amber-500/20 overflow-hidden flex flex-col">
          <div className="bg-amber-500/10 border-b border-amber-500/20 p-4 flex items-center gap-3">
            <Beaker className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-amber-400">Conflict Scenario (WM-104)</h2>
          </div>
          <div className="p-5 flex-1 space-y-4">
            <p className="text-slate-300 text-sm">
              Two orders are requesting the same SKU (WM-104) but inventory is insufficient to fulfill both.
            </p>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Available Inventory:</span>
                <span className="font-mono font-bold text-white">7 units</span>
              </div>
              <div className="h-px w-full bg-slate-800"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-rose-400 font-mono">ORD-1024 (CRITICAL)</span>
                <span className="font-mono text-white">Needs 10</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400 font-mono">ORD-1025 (NORMAL)</span>
                <span className="font-mono text-white">Needs 5</span>
              </div>
            </div>

            {hasRunAllocation && (
              <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-emerald-400 text-sm font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Resolution Applied
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Priority Engine identified ORD-1024 as CRITICAL. All 7 available units allocated to ORD-1024 (Partial). ORD-1025 receives 0 units (Blocked).
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Allocations Table */}
        <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Database className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Active Allocations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-medium">Order ID</th>
                  <th className="p-4 font-medium">SKU</th>
                  <th className="p-4 font-medium text-right">Requested</th>
                  <th className="p-4 font-medium text-right">Allocated</th>
                  <th className="p-4 font-medium text-right">Shortage</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {allocations.map((alloc) => {
                  const order = orders.find(o => o.id === alloc.orderId);
                  
                  // Scenario override if simulation ran
                  let displayAlloc = { ...alloc };
                  if (hasRunAllocation && alloc.orderId === 'ORD-1024') {
                    displayAlloc.allocatedQuantity = 7;
                    displayAlloc.shortageQuantity = 3;
                    displayAlloc.status = 'PARTIAL';
                    displayAlloc.reason = 'Insufficient inventory - Priority allocation';
                  } else if (hasRunAllocation && alloc.orderId === 'ORD-1025') {
                    displayAlloc.allocatedQuantity = 0;
                    displayAlloc.shortageQuantity = 5;
                    displayAlloc.status = 'BLOCKED';
                    displayAlloc.reason = 'Yielded to CRITICAL order';
                  }

                  return (
                    <tr key={alloc.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-mono text-white">
                        <div className="flex flex-col">
                          <span>{displayAlloc.orderId}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded w-max mt-1 ${
                            order?.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                            order?.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {order?.priority || 'NORMAL'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-mono">{displayAlloc.sku}</td>
                      <td className="p-4 text-right text-slate-300">{displayAlloc.requestedQuantity}</td>
                      <td className={`p-4 text-right font-medium ${displayAlloc.allocatedQuantity > 0 ? 'text-white' : 'text-slate-500'}`}>
                        {displayAlloc.allocatedQuantity}
                      </td>
                      <td className={`p-4 text-right font-medium ${displayAlloc.shortageQuantity > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                        {displayAlloc.shortageQuantity}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${statusColors[displayAlloc.status] || statusColors.PENDING}`}>
                          {displayAlloc.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400 text-xs max-w-[200px] truncate" title={displayAlloc.reason || undefined}>
                        {displayAlloc.reason || '-'}
                      </td>
                    </tr>
                  );
                })}
                {allocations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No allocations found.
                    </td>
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
