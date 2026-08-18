import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { WarehouseService } from '../services/warehouseService';
import type { RiskLevel, ExceptionStatus } from '../types/warehouse';

export const ExceptionsPage: React.FC = () => {
  const exceptions = useMemo(() => WarehouseService.getExceptions() || [], []);

  const kpis = useMemo(() => {
    return {
      total: exceptions.length,
      open: exceptions.filter(e => e.status === 'OPEN').length,
      investigating: exceptions.filter(e => e.status === 'INVESTIGATING').length,
      resolved: exceptions.filter(e => e.status === 'RESOLVED').length,
      criticalHigh: exceptions.filter(e => e.severity === 'CRITICAL' || e.severity === 'HIGH').length,
    };
  }, [exceptions]);

  const getSeverityColor = (severity: RiskLevel) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'HIGH': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'LOW': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusColor = (status: ExceptionStatus) => {
    switch (status) {
      case 'OPEN': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'INVESTIGATING': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'RESOLVED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-500" />
            Exception Management Center
          </h1>
          <p className="text-slate-400 mt-1">Monitor and resolve warehouse operational exceptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Total Exceptions</p>
            <AlertTriangle className="w-5 h-5 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.total}</p>
        </div>
        
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Open</p>
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">{kpis.open}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Investigating</p>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">{kpis.investigating}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Resolved</p>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">{kpis.resolved}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Critical / High</p>
            <ShieldAlert className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-orange-400 mt-2">{kpis.criticalHigh}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Exception Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="sr-only">Warehouse operational exceptions and corrective action logs</caption>
            <thead className="text-xs text-slate-400 bg-slate-900/80 border-b border-slate-800 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Exception ID</th>
                <th scope="col" className="px-4 py-3 font-medium">Order</th>
                <th scope="col" className="px-4 py-3 font-medium">SKU</th>
                <th scope="col" className="px-4 py-3 font-medium">Type</th>
                <th scope="col" className="px-4 py-3 font-medium">Severity</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Description & Action</th>
                <th scope="col" className="px-4 py-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {exceptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No exceptions found
                  </td>
                </tr>
              ) : (
                exceptions.map((exc) => (
                  <tr key={exc.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">{exc.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{exc.orderId}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{exc.sku || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="capitalize">{formatType(exc.type).toLowerCase()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md border ${getSeverityColor(exc.severity)}`}>
                        {exc.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md border ${getStatusColor(exc.status)}`}>
                        {exc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 min-w-[250px]">
                      <div className="text-slate-300 mb-1">{exc.description}</div>
                      <div className="text-xs text-slate-500"><span className="text-slate-400">Action:</span> {exc.recommendedAction}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(exc.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExceptionsPage;
