import React, { useMemo } from 'react';
import { 
  Truck, 
  PackageCheck, 
  PackageSearch,
  CheckCircle
} from 'lucide-react';
import { WarehouseService } from '../services/warehouseService';

export const DispatchPage: React.FC = () => {
  const dispatches = useMemo(() => WarehouseService.getDispatches() || [], []);
  const orders = useMemo(() => WarehouseService.getOrders() || [], []);

  const kpis = useMemo(() => {
    const dispatched = dispatches.filter(d => d.status === 'DISPATCHED').length;
    const delivered = dispatches.filter(d => d.status === 'DELIVERED').length;
    const readyInDispatch = dispatches.filter(d => d.status === 'READY').length;
    
    const dispatchedOrderIds = new Set(dispatches.map(d => d.orderId));
    const readyOrdersWithoutDispatch = orders.filter(o => o.status === 'READY' && !dispatchedOrderIds.has(o.id));
    
    const totalReady = readyInDispatch + readyOrdersWithoutDispatch.length;
    const totalShipments = dispatches.length + readyOrdersWithoutDispatch.length;

    return {
      ready: totalReady,
      dispatched,
      delivered,
      totalShipments,
      readyOrdersWithoutDispatch
    };
  }, [dispatches, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'DISPATCHED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'DELIVERED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-400" />
            Dispatch & Carrier Staging
          </h1>
          <p className="text-slate-400 mt-1">Manage outbound shipments and carrier assignments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Ready for Dispatch</p>
            <PackageSearch className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 mt-2">{kpis.ready}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Dispatched</p>
            <Truck className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400 mt-2">{kpis.dispatched}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Delivered</p>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">{kpis.delivered}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">Total Shipments</p>
            <PackageCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">{kpis.totalShipments}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Shipment Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="sr-only">Outbound shipments and carrier tracking status</caption>
            <thead className="text-xs text-slate-400 bg-slate-900/80 border-b border-slate-800 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Dispatch ID</th>
                <th scope="col" className="px-4 py-3 font-medium">Order</th>
                <th scope="col" className="px-4 py-3 font-medium">Customer</th>
                <th scope="col" className="px-4 py-3 font-medium">Carrier & Tracking</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 font-medium">Items</th>
                <th scope="col" className="px-4 py-3 font-medium">Ready At</th>
                <th scope="col" className="px-4 py-3 font-medium">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {kpis.readyOrdersWithoutDispatch.map(order => (
                <tr key={`order-${order.id}`} className="hover:bg-slate-800/20 transition-colors bg-blue-900/5">
                  <td className="px-4 py-3 font-mono text-slate-500">Pending Assignment</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.customer}</td>
                  <td className="px-4 py-3 text-slate-500">-</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md border ${getStatusColor('READY')}`}>
                      READY
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td className="px-4 py-3 text-slate-400">-</td>
                  <td className="px-4 py-3 text-slate-500">-</td>
                </tr>
              ))}
              {dispatches.length === 0 && kpis.readyOrdersWithoutDispatch.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No shipments found
                  </td>
                </tr>
              ) : (
                dispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">{dispatch.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{dispatch.orderId}</td>
                    <td className="px-4 py-3 text-slate-300">{dispatch.customerName}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-300">{dispatch.carrier || 'Unassigned'}</div>
                      <div className="text-xs text-slate-500 font-mono">{dispatch.trackingNumber || '-'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-[10px] font-bold tracking-wider rounded-md border ${getStatusColor(dispatch.status)}`}>
                        {dispatch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{dispatch.itemsCount}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(dispatch.readyAt)}</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(dispatch.dispatchedAt)}</td>
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

export default DispatchPage;
