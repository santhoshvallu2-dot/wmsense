import React from 'react';
import type { InventoryItem } from '../../types/warehouse';
import { WarehouseService } from '../../services/warehouseService';
import {
  X,
  Boxes,
  MapPin,
  Tag,
  Truck,
  History,
  AlertTriangle
} from 'lucide-react';

interface InventoryDetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export const InventoryDetailModal: React.FC<InventoryDetailModalProps> = ({
  item,
  onClose,
}) => {
  if (!item) return null;

  const movements = WarehouseService.getMovements().filter(
    (m) => m.sku === item.sku
  );

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'LOW_STOCK':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'OUT_OF_STOCK':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'DAMAGED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'OVERSTOCKED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{item.productName}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                SKU: <span className="text-indigo-400 font-semibold">{item.sku}</span> | Supplier: {item.supplier}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Location & Category Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Zone
              </span>
              <p className="text-sm font-bold text-white mt-1">{item.zone}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Bin Location
              </span>
              <p className="text-sm font-bold text-white mt-1">{item.bin}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3 text-indigo-400" /> Category
              </span>
              <p className="text-sm font-bold text-white mt-1 truncate">{item.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-400" /> Reorder Level
              </span>
              <p className="text-sm font-bold text-amber-300 mt-1">{item.reorderLevel} units</p>
            </div>
          </div>

          {/* Quantities Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quantity Allocation Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">Total Stock</p>
                <p className="text-xl font-bold text-white mt-0.5">{item.totalQuantity}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <p className="text-xs text-emerald-400">Available</p>
                <p className="text-xl font-bold text-emerald-300 mt-0.5">{item.availableQuantity}</p>
              </div>
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                <p className="text-xs text-indigo-400">Reserved</p>
                <p className="text-xl font-bold text-indigo-300 mt-0.5">{item.reservedQuantity}</p>
              </div>
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30">
                <p className="text-xs text-rose-400">Damaged</p>
                <p className="text-xl font-bold text-rose-300 mt-0.5">{item.damagedQuantity}</p>
              </div>
            </div>
          </div>

          {/* Demo Alert notice if WM-104 */}
          {item.sku === 'WM-104' && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/40 space-y-1 text-xs">
              <div className="flex items-center space-x-2 font-bold text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Critical Order Conflict Detected (Demo Scenario)</span>
              </div>
              <p className="text-slate-300">
                Critical Order <span className="font-mono text-white">ORD-1024</span> requires 10 units, but only 7 units are available in stock. Shortage = 3 units.
              </p>
            </div>
          )}

          {/* Recent Inventory Movements */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              <span>SKU Movement History</span>
            </h4>

            {movements.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 rounded-lg bg-slate-950/40 text-center">
                No recent inventory movements recorded for this SKU.
              </p>
            ) : (
              <div className="space-y-2">
                {movements.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-indigo-300 font-mono">{m.type}</span>
                      <span className="text-slate-400 ml-2">Qty: {m.quantity}</span>
                      <p className="text-slate-500 text-[11px] mt-0.5">{m.reason}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <div>{m.performedBy}</div>
                      <div>{new Date(m.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
