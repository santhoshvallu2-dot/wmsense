import { describe, it, expect } from 'vitest';
import { PriorityEngine } from '../priorityEngine';
import { initialOrders, initialInventory } from '../../data/mockData';
import type { Order } from '../../types/warehouse';

describe('PriorityEngine', () => {
  it('should compute base priority score based on customer tier', () => {
    const baseOrder: Order = {
      id: 'TEST-1',
      customer: 'Test Customer',
      orderDate: new Date().toISOString(),
      dispatchDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      items: [
        {
          id: 'TI-1',
          orderId: 'TEST-1',
          sku: 'WM-101',
          productId: 'PROD-101',
          productName: 'Test Product',
          quantity: 1,
          allocatedQuantity: 1,
          pickedQuantity: 0,
          unitPrice: 100,
        },
      ],
      priority: 'CRITICAL',
      priorityScore: 0,
      priorityReason: '',
      status: 'NEW',
      riskLevel: 'LOW',
      allocationStatus: 'FULL',
      totalAmount: 100,
    };

    const criticalAssessment = PriorityEngine.assessOrder(baseOrder, initialInventory);
    // Base 40 (CRITICAL) + 5 (NEW) = 45
    expect(criticalAssessment.priorityScore).toBe(45);
    expect(criticalAssessment.priorityLevel).toBe('NORMAL');

    const highOrder: Order = { ...baseOrder, priority: 'HIGH' };
    const highAssessment = PriorityEngine.assessOrder(highOrder, initialInventory);
    // Base 30 (HIGH) + 5 (NEW) = 35
    expect(highAssessment.priorityScore).toBe(35);

    const normalOrder: Order = { ...baseOrder, priority: 'NORMAL' };
    const normalAssessment = PriorityEngine.assessOrder(normalOrder, initialInventory);
    // Base 20 (NORMAL) + 5 (NEW) = 25
    expect(normalAssessment.priorityScore).toBe(25);

    const lowOrder: Order = { ...baseOrder, priority: 'LOW' };
    const lowAssessment = PriorityEngine.assessOrder(lowOrder, initialInventory);
    // Base 10 (LOW) + 5 (NEW) = 15
    expect(lowAssessment.priorityScore).toBe(15);
  });

  it('should elevate risk and priority score when deadline is overdue or urgent (<3h, <6h, <12h)', () => {
    const now = Date.now();
    const overdueOrder: Order = {
      ...initialOrders[0],
      dispatchDeadline: new Date(now - 3600 * 1000).toISOString(),
    };
    const overdueAssessment = PriorityEngine.assessOrder(overdueOrder, initialInventory);
    expect(overdueAssessment.priorityReasons.some((r) => r.includes('OVERDUE'))).toBe(true);
    expect(overdueAssessment.riskReasons.some((r) => r.includes('SLA breach'))).toBe(true);

    const urgentOrder: Order = {
      ...initialOrders[0],
      dispatchDeadline: new Date(now + 2 * 3600 * 1000).toISOString(),
    };
    const urgentAssessment = PriorityEngine.assessOrder(urgentOrder, initialInventory);
    expect(urgentAssessment.priorityReasons.some((r) => r.includes('Urgent dispatch deadline'))).toBe(true);
    expect(urgentAssessment.riskReasons.some((r) => r.includes('Critical SLA window'))).toBe(true);

    const soonOrder: Order = {
      ...initialOrders[0],
      dispatchDeadline: new Date(now + 5 * 3600 * 1000).toISOString(),
    };
    const soonAssessment = PriorityEngine.assessOrder(soonOrder, initialInventory);
    expect(soonAssessment.priorityReasons.some((r) => r.includes('approaching in'))).toBe(true);
  });

  it('should detect stock shortage and accurately report required, available, and shortage numbers', () => {
    const shortageOrder: Order = {
      id: 'ORD-SHORTAGE',
      customer: 'Shortage Corp',
      orderDate: new Date().toISOString(),
      dispatchDeadline: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
      items: [
        {
          id: 'ITEM-1',
          orderId: 'ORD-SHORTAGE',
          sku: 'WM-104',
          productId: 'PROD-104',
          productName: 'Ergonomic Wireless Scanner Pro',
          quantity: 15,
          allocatedQuantity: 0,
          pickedQuantity: 0,
          unitPrice: 349.0,
        },
      ],
      priority: 'CRITICAL',
      priorityScore: 0,
      priorityReason: '',
      status: 'PROCESSING',
      riskLevel: 'CRITICAL',
      allocationStatus: 'WAITING',
      totalAmount: 5235,
    };

    const assessment = PriorityEngine.assessOrder(shortageOrder, initialInventory);
    expect(assessment.shortageInfo).toBeDefined();
    expect(assessment.shortageInfo?.sku).toBe('WM-104');
    expect(assessment.shortageInfo?.requested).toBe(15);
    expect(assessment.shortageInfo?.available).toBe(7);
    expect(assessment.shortageInfo?.shortage).toBe(8);
    expect(assessment.riskReasons.some((r) => r.includes('Fulfillment blocked by stock shortage'))).toBe(true);
    expect(assessment.recommendedAction).toContain('Smart Allocation Engine');
  });

  it('should assess ORD-1024 as CRITICAL priority and high risk due to shortage and deadline', () => {
    const ord1024 = initialOrders.find((o) => o.id === 'ORD-1024')!;
    const assessment = PriorityEngine.assessOrder(ord1024, initialInventory);
    expect(assessment.priorityLevel).toBe('CRITICAL');
    expect(['CRITICAL', 'HIGH']).toContain(assessment.riskLevel);
    expect(assessment.priorityScore).toBeGreaterThanOrEqual(80);
    expect(assessment.shortageInfo?.sku).toBe('WM-104');
    expect(assessment.shortageInfo?.shortage).toBe(3);
  });

  it('should clamp scores between 0 and 100', () => {
    const dispatchedOrder: Order = {
      ...initialOrders[0],
      status: 'DISPATCHED',
    };
    const assessment = PriorityEngine.assessOrder(dispatchedOrder, initialInventory);
    expect(assessment.riskScore).toBeGreaterThanOrEqual(0);
    expect(assessment.riskScore).toBeLessThanOrEqual(100);
    expect(assessment.priorityScore).toBeGreaterThanOrEqual(0);
    expect(assessment.priorityScore).toBeLessThanOrEqual(100);
  });

  it('should sort orders correctly with assessAndSortOrders descending by priority score', () => {
    const sorted = PriorityEngine.assessAndSortOrders(initialOrders, initialInventory);
    expect(sorted.length).toBe(initialOrders.length);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].assessment.priorityScore).toBeGreaterThanOrEqual(
        sorted[i + 1].assessment.priorityScore
      );
    }
  });

  it('should recommend appropriate actions for EXCEPTION, READY, and standard states', () => {
    const exceptionOrder: Order = {
      id: 'ORD-EXC',
      customer: 'Exception Customer',
      orderDate: new Date().toISOString(),
      dispatchDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      items: [
        {
          id: 'I-EXC',
          orderId: 'ORD-EXC',
          sku: 'WM-101',
          productId: 'PROD-101',
          productName: 'Item',
          quantity: 1,
          allocatedQuantity: 1,
          pickedQuantity: 1,
          unitPrice: 10,
        },
      ],
      priority: 'NORMAL',
      priorityScore: 50,
      priorityReason: '',
      status: 'EXCEPTION',
      riskLevel: 'HIGH',
      allocationStatus: 'FULL',
      totalAmount: 10,
    };
    const excAssessment = PriorityEngine.assessOrder(exceptionOrder, initialInventory);
    expect(excAssessment.recommendedAction).toContain('Exception Management');

    const readyOrder: Order = {
      ...exceptionOrder,
      status: 'READY',
    };
    const readyAssessment = PriorityEngine.assessOrder(readyOrder, initialInventory);
    expect(readyAssessment.recommendedAction).toContain('outbound shipping bay');
  });
});
