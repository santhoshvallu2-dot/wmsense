import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WarehouseService } from '../services/warehouseService';
import type { InventoryItem, InventoryStatus } from '../types/warehouse';
import { InventoryDetailModal } from '../components/inventory/InventoryDetailModal';
import {
  Boxes,
  Search,
  XCircle,
  ArrowUpDown,
  AlertTriangle,
  Eye,
  Layers
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || 'ALL');
  const [zoneFilter, setZoneFilter] = useState<string>(searchParams.get('zone') || 'ALL');
  const [sortField, setSortField] = useState<'sku' | 'availableQuantity' | 'reservedQuantity' | 'reorderLevel' | 'status'>('sku');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Fetch Inventory from Service
  const inventory = WarehouseService.getInventory();

  // Categories & Zones list for dropdowns
  const categories = useMemo(() => {
    return Array.from(new Set(inventory.map((i) => i.category)));
  }, [inventory]);

  const zones = useMemo(() => {
    return Array.from(new Set(inventory.map((i) => i.zone)));
  }, [inventory]);

  // Dynamic Summary Counts
  const totalSKUs = inventory.length;
  const lowStockCount = inventory.filter((i) => i.status === 'LOW_STOCK').length;
  const outOfStockCount = inventory.filter((i) => i.status === 'OUT_OF_STOCK').length;
  const damagedCount = inventory.filter((i) => i.status === 'DAMAGED').length;

  // Filter & Sort Logic
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        // Search term filter
        const matchesSearch =
          searchTerm === '' ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
          statusFilter === 'ALL' || item.status === statusFilter;

        // Category filter
        const matchesCategory =
          categoryFilter === 'ALL' || item.category === categoryFilter;

        // Zone filter
        const matchesZone =
          zoneFilter === 'ALL' || item.zone === zoneFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesZone;
      })
      .sort((a, b) => {
        const valA = String(a[sortField] ?? '');
        const valB = String(b[sortField] ?? '');
        const comp = valA.localeCompare(valB, undefined, { numeric: true });
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [inventory, searchTerm, statusFilter, categoryFilter, zoneFilter, sortField, sortOrder]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setZoneFilter('ALL');
    setSearchParams({});
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: InventoryStatus) => {
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

  const wm104Item = inventory.find((i) => i.sku === 'WM-104');

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Smart Inventory Management</h2>
          <p className="text-xs text-slate-400">
            Real-time SKU visibility, bin locations, safety stock thresholds, and damage logs.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total SKUs</p>
            <h3 className="text-2xl font-bold text-white mt-1">{totalSKUs}</h3>
            <p className="text-[11px] text-slate-400 mt-1">Active Catalog Items</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center" aria-hidden="true">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Low Stock</p>
            <h3 className="text-2xl font-bold text-amber-400 mt-1">{lowStockCount}</h3>
            <p className="text-[11px] text-amber-400/80 mt-1">Below Reorder Level</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center" aria-hidden="true">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Out of Stock</p>
            <h3 className="text-2xl font-bold text-rose-400 mt-1">{outOfStockCount}</h3>
            <p className="text-[11px] text-rose-400/80 mt-1">Immediate Stockout</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center" aria-hidden="true">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Damaged Stock</p>
            <h3 className="text-2xl font-bold text-purple-400 mt-1">{damagedCount}</h3>
            <p className="text-[11px] text-purple-400/80 mt-1">Quarantine Inspection</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center" aria-hidden="true">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* CRITICAL INVENTORY CARD: WM-104 Demo Shortage */}
      {wm104Item && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-amber-950/60 border border-rose-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5" aria-hidden="true">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Critical Stock Shortage (Demo Target)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold">
                  SKU: WM-104
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {wm104Item.productName} has <span className="font-bold text-white">7 available units</span> in Bin {wm104Item.bin}, but Critical Order <span className="font-mono text-cyan-300">ORD-1024</span> requires <span className="font-bold text-white">10 units</span> (Shortage = 3).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedItem(wm104Item)}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            <Eye className="w-4 h-4" aria-hidden="true" /> View WM-104 Detail
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
            <input
              type="text"
              aria-label="Search inventory by SKU, product name, or category"
              placeholder="Search by SKU, Product Name, Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              aria-label="Filter inventory by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DAMAGED">Damaged</option>
              <option value="OVERSTOCKED">Overstocked</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              aria-label="Filter inventory by category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Zone Filter */}
          <div>
            <select
              aria-label="Filter inventory by warehouse zone"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              <option value="ALL">All Zones</option>
              {zones.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & Clear Button */}
        {(searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL' || zoneFilter !== 'ALL') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              Showing <span className="font-bold text-white">{filteredInventory.length}</span> of {inventory.length} items
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            >
              <XCircle className="w-3.5 h-3.5" aria-hidden="true" /> Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Inventory Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Warehouse inventory catalog with stock levels, bin locations, and status</caption>
            <thead className="text-slate-400 uppercase bg-slate-950/80 font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th
                  scope="col"
                  onClick={() => handleSort('sku')}
                  className="p-3 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  </div>
                </th>
                <th scope="col" className="p-3">Product Name</th>
                <th scope="col" className="p-3">Category</th>
                <th scope="col" className="p-3 text-center">Zone / Bin</th>
                <th scope="col" className="p-3 text-center">Total</th>
                <th
                  scope="col"
                  onClick={() => handleSort('availableQuantity')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Available</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('reservedQuantity')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Reserved</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  </div>
                </th>
                <th scope="col" className="p-3 text-center">Damaged</th>
                <th
                  scope="col"
                  onClick={() => handleSort('reorderLevel')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Reorder</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  </div>
                </th>
                <th
                  scope="col"
                  onClick={() => handleSort('status')}
                  className="p-3 text-center cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" aria-hidden="true" />
                  </div>
                </th>
                <th scope="col" className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 italic">
                    No inventory SKUs matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold font-mono text-indigo-400">{item.sku}</td>
                    <td className="p-3 font-semibold text-white max-w-xs truncate">{item.productName}</td>
                    <td className="p-3 text-slate-400">{item.category}</td>
                    <td className="p-3 text-center font-mono text-slate-300">
                      <span className="text-cyan-400 font-bold">{item.zone}</span> / {item.bin}
                    </td>
                    <td className="p-3 text-center font-bold text-white">{item.totalQuantity}</td>
                    <td className="p-3 text-center font-bold text-emerald-400">{item.availableQuantity}</td>
                    <td className="p-3 text-center font-mono text-indigo-300">{item.reservedQuantity}</td>
                    <td className="p-3 text-center font-mono text-rose-300">{item.damagedQuantity}</td>
                    <td className="p-3 text-center font-mono text-amber-300/90">{item.reorderLevel}</td>
                    <td className="p-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <InventoryDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
