import { describe, it, expect, beforeEach } from 'vitest';
import { WarehouseService } from '../warehouseService';

describe('WarehouseService', () => {
  beforeEach(() => {
    localStorage.clear();
    WarehouseService.resetAllData();
  });

  it('should retrieve initial products, inventory, and orders', () => {
    const products = WarehouseService.getProducts();
    const inventory = WarehouseService.getInventory();
    const orders = WarehouseService.getOrders();

    expect(products.length).toBe(20);
    expect(inventory.length).toBe(20);
    expect(orders.length).toBe(15);
  });

  it('should validate dataset consistency and integrity without errors', () => {
    const integrity = WarehouseService.validateConsistency();
    expect(integrity.valid).toBe(true);
    expect(integrity.errors).toEqual([]);
  });

  it('should detect WM-104 inventory count violations', () => {
    const inventory = WarehouseService.getInventory();
    const modified = inventory.map((item) =>
      item.sku === 'WM-104' ? { ...item, availableQuantity: 99 } : item
    );
    WarehouseService.saveInventory(modified);

    const integrity = WarehouseService.validateConsistency();
    expect(integrity.valid).toBe(false);
    expect(integrity.errors.some((e) => e.includes('WM-104'))).toBe(true);
  });

  it('should persist and retrieve modified orders correctly in storage', () => {
    const orders = WarehouseService.getOrders();
    const updated = orders.map((o) =>
      o.id === 'ORD-1024' ? { ...o, customer: 'Updated Apex Logistics' } : o
    );
    WarehouseService.saveOrders(updated);

    const retrieved = WarehouseService.getOrders();
    const found = retrieved.find((o) => o.id === 'ORD-1024');
    expect(found?.customer).toBe('Updated Apex Logistics');
  });

  it('should gracefully handle corrupt JSON data in localStorage without throwing', () => {
    localStorage.setItem('wmsense_orders', 'INVALID_JSON{{{');
    const orders = WarehouseService.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBe(15);
  });

  it('should retrieve and save allocations, picking tasks, packing tasks, exceptions, dispatches, decisions, and alerts', () => {
    expect(WarehouseService.getAllocations().length).toBeGreaterThan(0);
    expect(WarehouseService.getPickingTasks().length).toBeGreaterThan(0);
    expect(WarehouseService.getPackingTasks().length).toBeGreaterThan(0);
    expect(WarehouseService.getQualityChecks().length).toBeGreaterThan(0);
    expect(WarehouseService.getExceptions().length).toBeGreaterThan(0);
    expect(WarehouseService.getDispatches().length).toBeGreaterThan(0);
    expect(WarehouseService.getMovements().length).toBeGreaterThan(0);
    expect(WarehouseService.getDecisions().length).toBeGreaterThan(0);
    expect(WarehouseService.getAlerts().length).toBeGreaterThan(0);
  });
});
