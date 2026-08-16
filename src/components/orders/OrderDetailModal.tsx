import React from 'react';
import type { Order } from '../../types/warehouse';
import { WarehouseService } from '../../services/warehouseService';
import { PriorityEngine } from '../../services/priorityEngine';
import {
  X,
  ClipboardList,
  Clock,
  AlertTriangle,
  Boxes,
  ShieldCheck,
  Package,
  Cpu,
  User,
  Calendar,
  Zap,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  const inventory = WarehouseService.getInventory();

  // Run PriorityEngine evaluation on current order
  const assessment = PriorityEngine.assessOrder(order, inventory);

  // Helper for priority badges
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'NORMAL':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'LOW':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // Helper for status badges
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'PROCESSING':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'ALLOCATED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'PARTIALLY_ALLOCATED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PICKING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'PACKING':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'QUALITY_CHECK':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'READY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'DISPATCHED':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      case 'EXCEPTION':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold';
    }
  };

  // Fulfillment steps for visual timeline
  const fulfillmentSteps = [
    { key: 'NEW', label: 'Order Created' },
    { key: 'PROCESSING', label: 'Priority Scored' },
    { key: 'ALLOCATED', label: 'Stock Allocated' },
    { key: 'PICKING', label: 'Picking Queue' },
    { key: 'PACKING', label: 'Packing Station' },
    { key: 'QUALITY_CHECK', label: 'Quality Verification' },
    { key: 'READY', label: 'Ready Staging' },
    { key: 'DISPATCHED', label: 'Dispatched' },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'NEW': return 0;
      case 'PROCESSING': return 1;
      case 'ALLOCATED': return 2;
      case 'PARTIALLY_ALLOCATED': return 2;
      case 'PICKING': return 3;
      case 'PACKING': return 4;
      case 'QUALITY_CHECK': return 5;
      case 'EXCEPTION': return 5;
      case 'READY': return 6;
      case 'DISPATCHED': return 7;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // SLA Deadline calculation
  const deadlineDate = new Date(order.dispatchDeadline);
  const now = new Date();
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600);

  let slaStatus = { text: 'On Track', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
  if (diffHours < 0) {
    slaStatus = { text: 'Overdue SLA', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40 font-bold' };
  } else if (diffHours <= 3) {
    slaStatus = { text: 'Critical (Due < 3h)', color: 'text-rose-300 bg-rose-500/20 border-rose-500/30' };
  } else if (diffHours <= 6) {
    slaStatus = { text: 'Due Soon (< 6h)', color: 'text-amber-300 bg-amber-500/20 border-amber-500/30' };
  }

  // Shortage check for items
  const itemShortages = order.items.map((item) => {
    const inv = inventory.find((i) => i.sku === item.sku);
    const available = inv ? inv.availableQuantity : 0;
    const shortage = Math.max(0, item.quantity - available);
    return { ...item, available, shortage };
  });

  const hasShortage = itemShortages.some((i) => i.shortage > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white font-mono tracking-tight">{order.id}</h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getPriorityBadge(assessment.priorityLevel)}`}>
                  {assessment.priorityLevel}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Customer: <strong className="text-white">{order.customer}</strong></span>
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
          {/* Order Meta Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-cyan-400" /> Order Date
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {new Date(order.orderDate).toLocaleDateString()} {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Dispatch Deadline
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {new Date(order.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" /> Priority Score
              </span>
              <p className="text-xs font-bold text-indigo-300 mt-1">{assessment.priorityScore} / 100</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-semibold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> SLA Deadline Status
              </span>
              <div className="mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${slaStatus.color}`}>
                  {slaStatus.text}
                </span>
              </div>
            </div>
          </div>

          {/* Shortage Warning Banner if applicable */}
          {hasShortage && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Inventory Shortage Alert (Requires Smart Allocation)</span>
              </div>
              {itemShortages
                .filter((i) => i.shortage > 0)
                .map((item) => (
                  <p key={item.sku} className="text-xs text-slate-300">
                    SKU <span className="font-mono font-bold text-white">{item.sku}</span> requires{' '}
                    <span className="font-bold text-white">{item.quantity} units</span>, but only{' '}
                    <span className="font-bold text-rose-300">{item.available} units</span> are available in stock. Shortage ={' '}
                    <span className="font-bold text-amber-300">{item.shortage} units</span>.
                  </p>
                ))}
            </div>
          )}

          {/* SMART PRIORITY & RISK ASSESSMENT PANEL */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/70 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white tracking-tight">Smart Priority & Risk Assessment</h4>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Score: <strong className="text-indigo-300 font-mono">{assessment.priorityScore}/100</strong></span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityBadge(assessment.riskLevel)}`}>
                  Risk: {assessment.riskLevel} ({assessment.riskScore}/100)
                </span>
              </div>
            </div>

            {/* Reasons Explanation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Priority Drivers */}
              <div className="space-y-2">
                <span className="font-semibold text-indigo-300 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-indigo-400" /> Priority Rationale
                </span>
                <ul className="space-y-1 text-slate-300 pl-2">
                  {assessment.priorityReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Drivers */}
              <div className="space-y-2">
                <span className="font-semibold text-rose-300 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-400" /> Risk Factors
                </span>
                {assessment.riskReasons.length === 0 ? (
                  <p className="text-[11px] text-emerald-400 italic">No operational risks identified for this order.</p>
                ) : (
                  <ul className="space-y-1 text-slate-300 pl-2">
                    {assessment.riskReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Recommended Action Box */}
            <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between text-xs pt-3">
              <span className="text-slate-400 font-medium">Recommended Action:</span>
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-400" />
                {assessment.recommendedAction}
              </span>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-indigo-400" />
              <span>Requested Order Items</span>
            </h4>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2 text-center">Req Qty</th>
                    <th className="pb-2 text-center">Avail Stock</th>
                    <th className="pb-2 text-center">Allocated</th>
                    <th className="pb-2 text-center">Picked</th>
                    <th className="pb-2 text-right">Unit Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {itemShortages.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 font-bold font-mono text-indigo-400">{item.sku}</td>
                      <td className="py-2.5 font-medium text-white">{item.productName}</td>
                      <td className="py-2.5 text-center font-bold text-white">{item.quantity}</td>
                      <td
                        className={`py-2.5 text-center font-bold ${
                          item.shortage > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.available}
                      </td>
                      <td className="py-2.5 text-center font-mono text-cyan-300">{item.allocatedQuantity}</td>
                      <td className="py-2.5 text-center font-mono text-emerald-300">{item.pickedQuantity}</td>
                      <td className="py-2.5 text-right font-mono text-slate-300">${item.unitPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fulfillment Pipeline Progress Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Fulfillment Lifecycle Progress</span>
            </h4>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {fulfillmentSteps.map((step, idx) => {
                  const isCompleted = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="text-center space-y-1.5">
                      <div
                        className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-[10px] font-bold border transition-colors ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/40 ring-2 ring-indigo-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div
                        className={`text-[10px] font-medium leading-tight ${
                          isCurrent
                            ? 'text-white font-bold'
                            : isCompleted
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
