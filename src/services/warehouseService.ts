import type {
  Product,
  InventoryItem,
  Order,
  Allocation,
  PickingTask,
  PackingTask,
  QualityCheck,
  WarehouseException,
  Dispatch,
  InventoryMovement,
  Decision,
  Alert
} from '../types/warehouse';

import {
  initialProducts,
  initialInventory,
  initialOrders,
  initialAllocations,
  initialPickingTasks,
  initialPackingTasks,
  initialQualityChecks,
  initialExceptions,
  initialDispatches,
  initialMovements,
  initialDecisions,
  initialAlerts
} from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'wmsense_products',
  INVENTORY: 'wmsense_inventory',
  ORDERS: 'wmsense_orders',
  ALLOCATIONS: 'wmsense_allocations',
  PICKING: 'wmsense_picking',
  PACKING: 'wmsense_packing',
  QC: 'wmsense_qc',
  EXCEPTIONS: 'wmsense_exceptions',
  DISPATCH: 'wmsense_dispatch',
  MOVEMENTS: 'wmsense_movements',
  DECISIONS: 'wmsense_decisions',
  ALERTS: 'wmsense_alerts',
};

// Helper for local storage reading with fallback and prototype pollution protection
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item, (k, v) => {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') {
        return undefined;
      }
      return v;
    });

    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return (parsed as T) ?? fallback;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return fallback;
  }
}

// Helper for local storage writing
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
}

export class WarehouseService {
  // Reset all state back to initial mock data
  static resetAllData(): void {
    saveToStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
    saveToStorage(STORAGE_KEYS.INVENTORY, initialInventory);
    saveToStorage(STORAGE_KEYS.ORDERS, initialOrders);
    saveToStorage(STORAGE_KEYS.ALLOCATIONS, initialAllocations);
    saveToStorage(STORAGE_KEYS.PICKING, initialPickingTasks);
    saveToStorage(STORAGE_KEYS.PACKING, initialPackingTasks);
    saveToStorage(STORAGE_KEYS.QC, initialQualityChecks);
    saveToStorage(STORAGE_KEYS.EXCEPTIONS, initialExceptions);
    saveToStorage(STORAGE_KEYS.DISPATCH, initialDispatches);
    saveToStorage(STORAGE_KEYS.MOVEMENTS, initialMovements);
    saveToStorage(STORAGE_KEYS.DECISIONS, initialDecisions);
    saveToStorage(STORAGE_KEYS.ALERTS, initialAlerts);
  }

  // Getters
  static getProducts(): Product[] {
    return loadFromStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
  }

  static getInventory(): InventoryItem[] {
    return loadFromStorage(STORAGE_KEYS.INVENTORY, initialInventory);
  }

  static getOrders(): Order[] {
    return loadFromStorage(STORAGE_KEYS.ORDERS, initialOrders);
  }

  static getAllocations(): Allocation[] {
    return loadFromStorage(STORAGE_KEYS.ALLOCATIONS, initialAllocations);
  }

  static getPickingTasks(): PickingTask[] {
    return loadFromStorage(STORAGE_KEYS.PICKING, initialPickingTasks);
  }

  static getPackingTasks(): PackingTask[] {
    return loadFromStorage(STORAGE_KEYS.PACKING, initialPackingTasks);
  }

  static getQualityChecks(): QualityCheck[] {
    return loadFromStorage(STORAGE_KEYS.QC, initialQualityChecks);
  }

  static getExceptions(): WarehouseException[] {
    return loadFromStorage(STORAGE_KEYS.EXCEPTIONS, initialExceptions);
  }

  static getDispatches(): Dispatch[] {
    return loadFromStorage(STORAGE_KEYS.DISPATCH, initialDispatches);
  }

  static getMovements(): InventoryMovement[] {
    return loadFromStorage(STORAGE_KEYS.MOVEMENTS, initialMovements);
  }

  static getDecisions(): Decision[] {
    return loadFromStorage(STORAGE_KEYS.DECISIONS, initialDecisions);
  }

  static getAlerts(): Alert[] {
    return loadFromStorage(STORAGE_KEYS.ALERTS, initialAlerts);
  }

  // Setters / Updaters
  static saveInventory(items: InventoryItem[]): void {
    saveToStorage(STORAGE_KEYS.INVENTORY, items);
  }

  static saveOrders(orders: Order[]): void {
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }

  static saveAllocations(allocations: Allocation[]): void {
    saveToStorage(STORAGE_KEYS.ALLOCATIONS, allocations);
  }

  static saveExceptions(exceptions: WarehouseException[]): void {
    saveToStorage(STORAGE_KEYS.EXCEPTIONS, exceptions);
  }

  static saveDecisions(decisions: Decision[]): void {
    saveToStorage(STORAGE_KEYS.DECISIONS, decisions);
  }

  static saveAlerts(alerts: Alert[]): void {
    saveToStorage(STORAGE_KEYS.ALERTS, alerts);
  }

  static saveMovements(movements: InventoryMovement[]): void {
    saveToStorage(STORAGE_KEYS.MOVEMENTS, movements);
  }

  static savePickingTasks(tasks: PickingTask[]): void {
    saveToStorage(STORAGE_KEYS.PICKING, tasks);
  }

  static savePackingTasks(tasks: PackingTask[]): void {
    saveToStorage(STORAGE_KEYS.PACKING, tasks);
  }

  static saveDispatches(dispatches: Dispatch[]): void {
    saveToStorage(STORAGE_KEYS.DISPATCH, dispatches);
  }

  // Data Consistency Integrity Validator
  static validateConsistency(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const inventory = this.getInventory();
    const orders = this.getOrders();
    const products = this.getProducts();

    // 1. Check WM-104 available stock == 7
    const wm104 = inventory.find((i) => i.sku === 'WM-104');
    if (!wm104) {
      errors.push('SKU WM-104 missing from inventory');
    } else if (wm104.availableQuantity !== 7) {
      errors.push(`WM-104 available quantity is ${wm104.availableQuantity}, expected exactly 7`);
    }

    // 2. Check ORD-1024 requires 10 of WM-104
    const ord1024 = orders.find((o) => o.id === 'ORD-1024');
    if (!ord1024) {
      errors.push('Order ORD-1024 missing');
    } else {
      if (ord1024.priority !== 'CRITICAL') {
        errors.push(`ORD-1024 priority is ${ord1024.priority}, expected CRITICAL`);
      }
      const item = ord1024.items.find((i) => i.sku === 'WM-104');
      if (!item || item.quantity !== 10) {
        errors.push(`ORD-1024 does not require 10 units of WM-104`);
      }
    }

    // 3. Check ORD-1025 requires 5 of WM-104
    const ord1025 = orders.find((o) => o.id === 'ORD-1025');
    if (!ord1025) {
      errors.push('Order ORD-1025 missing');
    } else {
      if (ord1025.priority !== 'NORMAL') {
        errors.push(`ORD-1025 priority is ${ord1025.priority}, expected NORMAL`);
      }
      const item = ord1025.items.find((i) => i.sku === 'WM-104');
      if (!item || item.quantity !== 5) {
        errors.push(`ORD-1025 does not require 5 units of WM-104`);
      }
    }

    // 4. Ensure no negative quantities
    inventory.forEach((item) => {
      if (item.availableQuantity < 0 || item.totalQuantity < 0 || item.reservedQuantity < 0 || item.damagedQuantity < 0) {
        errors.push(`Inventory item ${item.sku} has negative quantity values`);
      }
    });

    // 5. Ensure valid product references
    const validSkus = new Set(products.map((p) => p.sku));
    inventory.forEach((item) => {
      if (!validSkus.has(item.sku)) {
        errors.push(`Inventory SKU ${item.sku} not found in products list`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
