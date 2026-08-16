import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WarehouseService } from '../services/warehouseService';
import type { Order, PriorityLevel, OrderStatus } from '../types/warehouse';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';
import {
  ClipboardList,
  Search,
  XCircle,
  ArrowUpDown,
  AlertTriangle,
  Eye,
  Clock,
  CheckCircle2,
  Package,
  Layers,
  ShieldAlert,
  SlidersHorizontal,
  CheckSquare,
  Square
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priorityFilter, setPriorityFilter] = useState<string>(searchParams.get('priority') || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'ALL');
  const [riskFilter, setRiskFilter] = useState<string>(searchParams.get('risk') || 'ALL');
  const [sortField, setSortField] = useState<'id' | 'orderDate' | 'priority' | 'dispatchDeadline' | 'status' | 'riskLevel'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected Order Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Bulk Selection state
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Fetch orders & inventory
  const orders = WarehouseService.getOrders();
  const inventory = WarehouseService.getInventory();

  // Dynamic KPI counts
  const totalOrders = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const ordersAtRiskCount = orders.filter(
    (o) => o.riskLevel === 'CRITICAL' || o.riskLevel === 'HIGH'
  ).length;
  const inProgressCount = orders.filter((o) =>
    ['PROCESSING', 'ALLOCATED', 'PARTIALLY_ALLOCATED', 'PICKING', 'PACKING', 'QUALITY_CHECK'].includes(o.status)
  ).length;
  const readyToDispatchCount = orders.filter((o) => o.status === 'READY').length;
  const exceptionCount = orders.filter((o) => o.status === 'EXCEPTION').length;

  // Pipeline stages for quick filter bar
  const pipelineStages = [
    { label: 'ALL', count: totalOrders },
    { label: 'NEW', count: newOrdersCount },
    { label: 'PROCESSING', count: orders.filter((o) => o.status === 'PROCESSING').length },
    { label: 'ALLOCATED', count: orders.filter((o) => o.status === 'ALLOCATED' || o.status === 'PARTIALLY_ALLOCATED').length },
    { label: 'PICKING', count: orders.filter((o) => o.status === 'PICKING').length },
    { label: 'PACKING', count: orders.filter((o) => o.status === 'PACKING').length },
    { label: 'QUALITY_CHECK', count: orders.filter((o) => o.status === 'QUALITY_CHECK').length },
    { label: 'READY', count: readyToDispatchCount },
    { label: 'EXCEPTION', count: exceptionCount },
  ];

  // Priority Rank map for custom sorting
  const priorityRank: Record<PriorityLevel, number> = {
    CRITICAL: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
  };

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        // Search filter (ID, Customer, or SKU)
        const matchesSearch =
          searchTerm === '' ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((i) => i.sku.toLowerCase().includes(searchTerm.toLowerCase()));

        // Priority filter
        const matchesPriority =
          priorityFilter === 'ALL' || order.priority === priorityFilter;

        // Status filter
        const matchesStatus =
          statusFilter === 'ALL' || order.status === statusFilter;

        // Risk filter
        const matchesRisk =
          riskFilter === 'ALL' || order.riskLevel === riskFilter;

        return matchesSearch && matchesPriority && matchesStatus && matchesRisk;
      })
      .sort((a, b) => {
        if (sortField === 'priority') {
          const rankA = priorityRank[a.priority];
          const rankB = priorityRank[b.priority];
          return sortOrder === 'asc' ? rankA - rankB : rankB - rankA;
        }

        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [orders, searchTerm, priorityFilter, statusFilter, riskFilter, sortField, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('ALL');
    setStatusFilter('ALL');
    setRiskFilter('ALL');
    setSearchParams({});
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'NORMAL':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'LOW':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
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

  // Helper for shortage check
  const checkOrderShortage = (order: Order) => {
    for (const item of order.items) {
      const inv = inventory.find((i) => i.sku === item.sku);
      const avail = inv ? inv.availableQuantity : 0;
      if (item.quantity > avail) {
        return { sku: item.sku, req: item.quantity, avail, shortage: item.quantity - avail };
      }
    }
    return null;
  };

  const ord1024 = orders.find((o) => o.id === 'ORD-1024');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Order Management & Priority Queue</h2>
          <p className="text-xs text-slate-400">
            Monitor, prioritize, and track warehouse orders throughout the fulfillment lifecycle.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">WAREHOUSE ONLINE</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalOrders}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Order Queue</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">New Orders</p>
            <h3 className="text-2xl font-bold text-blue-400 mt-1">{newOrdersCount}</h3>
            <p className="text-[11px] text-blue-400/80 mt-1">Pending Allocation</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Orders At Risk</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{ordersAtRiskCount}</h3>
            <p className="text-[11px] text-amber-400/80 mt-1">High SLA Risk</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">In Progress</p>
            <h3 className="text-2xl font-bold text-cyan-400 mt-1">{inProgressCount}</h3>
            <p className="text-[11px] text-cyan-400/80 mt-1">Active Processing</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Ready Dispatch</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">{readyToDispatchCount}</h3>
            <p className="text-[11px] text-emerald-400/80 mt-1">Staged at Bay</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Exceptions</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{exceptionCount}</h3>
            <p className="text-[11px] text-rose-400/80 mt-1">QC / Stock Holds</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* REQUIRED CRITICAL DEMO ORDER BANNER (ORD-1024 & ORD-1025) */}
      {ord1024 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border border-rose-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Critical Shortage Order Highlighted</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold">
                  ORD-1024 (CRITICAL)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Order <span className="font-mono font-bold text-white">ORD-1024</span> (Customer: Apex Logistics Corp) requires <span className="font-bold text-white">10 units</span> of Ergonomic Wireless Scanner Pro (<span className="font-mono text-cyan-300">WM-104</span>), but stock has only <span className="font-bold text-rose-300">7 units available</span>. Normal order <span className="font-mono text-white">ORD-1025</span> also requires 5 units.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedOrder(ord1024)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" /> Inspect ORD-1024 Shortage
          </button>
        </div>
      )}

      {/* Fulfillment Stage Filter Pipeline */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Fulfillment Stage Pipeline Filter</span>
        </div>
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 px-1">
          {pipelineStages.map((stage) => {
            const isActive =
              (stage.label === 'ALL' && statusFilter === 'ALL') ||
              statusFilter === stage.label;

            return (
              <button
                key={stage.label}
                onClick={() => setStatusFilter(stage.label)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                <span>{stage.label.replace('_', ' ')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID (e.g. ORD-1024), Customer, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="NORMAL">Normal Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(searchTerm || priorityFilter !== 'ALL' || statusFilter !== 'ALL' || riskFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-white">{filteredOrders.length}</span> of {totalOrders} orders
            </div>
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Action Bar if Selected */}
      {selectedOrderIds.length > 0 && (
        <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center space-x-2 text-indigo-300">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            <span><strong className="text-white">{selectedOrderIds.length}</strong> orders selected for bulk inspection</span>
          </div>
          <button
            onClick={() => setSelectedOrderIds([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Deselect All
          </button>
        </div>
      )}

      {/* Main Order Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400 uppercase bg-slate-950/80 font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 w-8">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white">
                    {selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => handleSort('id')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Order ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3">Customer</th>
                <th
                  onClick={() => handleSort('priority')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center">Items (SKUs)</th>
                <th
                  onClick={() => handleSort('dispatchDeadline')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Dispatch Deadline</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-center">Allocation</th>
                <th
                  onClick={() => handleSort('riskLevel')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 italic">
                    No orders matched your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const shortage = checkOrderShortage(order);
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${
                        shortage ? 'bg-rose-950/10 hover:bg-rose-950/20' : ''
                      } ${isSelected ? 'bg-indigo-950/30' : ''}`}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelectOrder(order.id)} className="text-slate-400 hover:text-white">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </button>
                      </td>
                      <td className="p-3 font-bold font-mono text-indigo-400 flex items-center space-x-2">
                        <span>{order.id}</span>
                        {shortage && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            SHORTAGE ({shortage.shortage})
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-medium text-white">{order.customer}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityBadge(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="font-bold text-white">{order.items.length} items</span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {order.items[0]?.sku}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-300">
                        {new Date(order.dispatchDeadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            order.allocationStatus === 'FULL'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {order.allocationStatus}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-xs">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded ${
                            order.riskLevel === 'CRITICAL' || order.riskLevel === 'HIGH'
                              ? 'text-rose-400 font-bold'
                              : 'text-slate-400'
                          }`}
                        >
                          {order.riskLevel}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};
