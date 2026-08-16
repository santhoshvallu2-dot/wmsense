import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WarehouseService } from '../services/warehouseService';
import { PriorityEngine } from '../services/priorityEngine';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Package,
  AlertTriangle,
  Boxes,
  Clock,
  Cpu,
  Truck,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const orders = WarehouseService.getOrders();
  const inventory = WarehouseService.getInventory();
  const alerts = WarehouseService.getAlerts();
  const pickingTasks = WarehouseService.getPickingTasks();

  // 1. Priority Engine Single Source of Truth
  const assessedOrders = orders.map((order) => ({
    order,
    assessment: PriorityEngine.assessOrder(order, inventory)
  }));

  // 2. KPI Calculations
  const totalOrders = orders.length;
  const ordersAtRisk = assessedOrders.filter(
    ({ assessment }) => assessment.riskLevel === 'CRITICAL' || assessment.riskLevel === 'HIGH'
  );
  const totalInventorySKUs = inventory.length;
  const lowStockItems = inventory.filter(
    (i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK'
  );
  const pickedTasksCount = pickingTasks.filter((t) => t.status === 'PICKED').length;
  const pickingProgress = pickingTasks.length > 0
    ? Math.round((pickedTasksCount / pickingTasks.length) * 100)
    : 0;
  const readyToDispatchCount = orders.filter((o) => o.status === 'READY').length;

  // 2. Pipeline Counts
  const pipelineStages = [
    { label: 'NEW', count: orders.filter((o) => o.status === 'NEW').length, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { label: 'PROCESSING', count: orders.filter((o) => o.status === 'PROCESSING').length, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    { label: 'ALLOCATED', count: orders.filter((o) => o.status === 'ALLOCATED').length, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { label: 'PICKING', count: orders.filter((o) => o.status === 'PICKING').length, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { label: 'PACKING', count: orders.filter((o) => o.status === 'PACKING').length, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { label: 'QUALITY CHECK', count: orders.filter((o) => o.status === 'QUALITY_CHECK' || o.status === 'EXCEPTION').length, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    { label: 'READY', count: orders.filter((o) => o.status === 'READY').length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { label: 'DISPATCHED', count: orders.filter((o) => o.status === 'DISPATCHED').length, color: 'text-slate-400 bg-slate-800 border-slate-700' },
  ];

  // 3. Inventory Health Chart Data
  const inventoryHealthData = [
    { name: 'In Stock', value: inventory.filter((i) => i.status === 'IN_STOCK').length, color: '#10b981' },
    { name: 'Low Stock', value: inventory.filter((i) => i.status === 'LOW_STOCK').length, color: '#f59e0b' },
    { name: 'Out of Stock', value: inventory.filter((i) => i.status === 'OUT_OF_STOCK').length, color: '#f43f5e' },
    { name: 'Damaged', value: inventory.filter((i) => i.status === 'DAMAGED').length, color: '#a855f7' },
    { name: 'Overstocked', value: inventory.filter((i) => i.status === 'OVERSTOCKED').length, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/70 via-slate-900 to-cyan-950/70 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Operational Control Center</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Warehouse Operations Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time visibility into inventory, orders, fulfillment, and warehouse performance.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">WAREHOUSE ONLINE</span>
          </div>
        </div>
      </div>

      {/* 6 Clickable KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div
          onClick={() => navigate('/orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Total Orders</span>
            <Package className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{totalOrders}</h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>View Queue</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </p>
        </div>

        {/* Orders At Risk */}
        <div
          onClick={() => navigate('/orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Orders At Risk</span>
            <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-amber-400 mt-2">{ordersAtRisk.length}</h3>
          <p className="text-[11px] text-amber-400/80 mt-1 flex items-center justify-between">
            <span>SLA Urgent</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </p>
        </div>

        {/* Inventory SKUs */}
        <div
          onClick={() => navigate('/inventory')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Inventory SKUs</span>
            <Boxes className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{totalInventorySKUs}</h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Active SKUs</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </p>
        </div>

        {/* Low Stock */}
        <div
          onClick={() => navigate('/inventory?status=LOW_STOCK')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-rose-400 mt-2">{lowStockItems.length}</h3>
          <p className="text-[11px] text-rose-400/80 mt-1 flex items-center justify-between">
            <span>Reorder Alert</span>
            <ArrowRight className="w-3 h-3 text-rose-400" />
          </p>
        </div>

        {/* Picking Progress */}
        <div
          onClick={() => navigate('/picking')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Picking Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2">{pickingProgress}%</h3>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{pickedTasksCount}/{pickingTasks.length} Picked</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </p>
        </div>

        {/* Ready to Dispatch */}
        <div
          onClick={() => navigate('/dispatch')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02] shadow-lg group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-slate-400">Ready Dispatch</span>
            <Truck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold text-white mt-2">{readyToDispatchCount}</h3>
          <p className="text-[11px] text-indigo-400 mt-1 flex items-center justify-between">
            <span>Staged Bays</span>
            <ArrowRight className="w-3 h-3 text-indigo-400" />
          </p>
        </div>
      </div>

      {/* REQUIRED HACKATHON DEMO CARD: WM-104 Shortage Detection */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border border-rose-500/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
              DEMO CRITICAL SCENARIO SEEDED
            </span>
            <span className="text-xs text-amber-300 font-mono">SKU: WM-104</span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Critical Inventory Shortage Detected
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Critical Order <span className="font-semibold text-white font-mono">ORD-1024</span> (Customer: Apex Logistics, Priority: CRITICAL) requires <span className="font-bold text-white">10 units</span> of Ergonomic Wireless Scanner Pro (<span className="font-mono text-cyan-300">WM-104</span>), but only <span className="font-bold text-rose-300">7 units</span> are available in stock. Normal Order <span className="font-semibold text-white font-mono">ORD-1025</span> also requires 5 units.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center w-full sm:w-auto px-5">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Stock vs Required</div>
            <div className="text-sm font-bold text-white mt-0.5">
              <span className="text-rose-400">7 Avail</span> / <span className="text-white">10 Req</span>
            </div>
            <div className="text-[10px] font-bold text-amber-400 mt-0.5">Shortage: 3 Units</div>
          </div>
          <button
            onClick={() => navigate('/allocation')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>INSPECT ALLOCATION ENGINE</span>
          </button>
        </div>
      </div>

      {/* Critical Alerts List Banner */}
      {alerts.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            System Alerts ({alerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3 text-xs"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-500 animate-pulse'
                      : alert.severity === 'HIGH'
                      ? 'bg-amber-400'
                      : 'bg-indigo-400'
                  }`}
                />
                <div>
                  <div className="font-bold text-slate-200">{alert.title}</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fulfillment Pipeline Progress Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Order Fulfillment Pipeline
          </h3>
          <span className="text-xs text-slate-400 font-mono">{totalOrders} Total Active Orders</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {pipelineStages.map((stage) => (
            <div
              key={stage.label}
              onClick={() => navigate('/orders')}
              className={`p-3 rounded-xl border text-center transition-all hover:scale-105 cursor-pointer ${stage.color}`}
            >
              <div className="text-xs font-semibold uppercase">{stage.label}</div>
              <div className="text-xl font-bold mt-1">{stage.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Orders at Risk + Inventory Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders At Risk */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Orders At Risk ({ordersAtRisk.length})
            </h3>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All Orders →
            </button>
          </div>

          <div className="space-y-3">
            {ordersAtRisk.map(({ order, assessment }) => (
              <div
                key={order.id}
                onClick={() => navigate('/orders')}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white font-mono">{order.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {assessment.priorityLevel} ({assessment.priorityScore}/100)
                    </span>
                    <span className="text-xs text-slate-400">({order.customer})</span>
                  </div>
                  <p className="text-xs text-amber-300/90">
                    {assessment.riskReasons[0] || assessment.priorityReasons[0] || order.priorityReason}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-semibold text-slate-300">{order.status}</span>
                  <div className="text-[10px] font-bold text-rose-400">Risk Score: {assessment.riskScore}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Health Visualization */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              Inventory Health Breakdown
            </h3>
            <button
              onClick={() => navigate('/inventory')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Manage Inventory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryHealthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {inventoryHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {inventoryHealthData.map((item) => (
                <div
                  key={item.name}
                  onClick={() => navigate(`/inventory?status=${item.name.toUpperCase().replace(/ /g, '_')}`)}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 hover:bg-slate-950 cursor-pointer text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-white">{item.value} SKUs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Low Stock Table + Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Items */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Low Stock & Out of Stock Items
            </h3>
            <button
              onClick={() => navigate('/inventory?status=LOW_STOCK')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All Low Stock →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase bg-slate-950/60 font-mono text-[10px]">
                <tr>
                  <th className="p-2.5 rounded-l-lg">SKU</th>
                  <th className="p-2.5">Product Name</th>
                  <th className="p-2.5 text-center">Available</th>
                  <th className="p-2.5 text-center">Reorder Level</th>
                  <th className="p-2.5 text-right rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/inventory?search=${item.sku}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-2.5 font-bold font-mono text-indigo-400">{item.sku}</td>
                    <td className="p-2.5 font-medium text-white">{item.productName}</td>
                    <td className="p-2.5 text-center font-bold text-rose-300">{item.availableQuantity}</td>
                    <td className="p-2.5 text-center font-mono text-slate-400">{item.reorderLevel}</td>
                    <td className="p-2.5 text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.status === 'OUT_OF_STOCK'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Operational Actions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Recommended Actions
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
              <div className="font-bold text-indigo-300">1. Run Smart Allocation for ORD-1024</div>
              <p className="text-slate-300 text-[11px]">
                Resolve 3 unit shortage for SKU WM-104 and protect inventory from ORD-1025.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-1">
              <div className="font-bold text-amber-300">2. Issue Purchase Order for WM-104</div>
              <p className="text-slate-300 text-[11px]">
                Available stock (7) is below reorder threshold (8). Order 15 units from Honeywell.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1">
              <div className="font-bold text-rose-300">3. Resolve Exception EXP-501</div>
              <p className="text-slate-300 text-[11px]">
                Physical casing damage reported on ORD-1028. Trigger replacement pick from Zone C.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
