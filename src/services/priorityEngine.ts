import type { Order, InventoryItem, PriorityLevel, RiskLevel } from '../types/warehouse';

export interface PriorityAssessment {
  orderId: string;
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  priorityReasons: string[];
  riskReasons: string[];
  recommendedAction: string;
  shortageInfo?: {
    sku: string;
    requested: number;
    available: number;
    shortage: number;
  };
}

export class PriorityEngine {
  /**
   * Pure deterministic function to assess an order's priority score, risk score, and human-readable reasoning
   */
  static assessOrder(order: Order, inventory: InventoryItem[]): PriorityAssessment {
    let priorityScore = 0;
    let riskScore = 0;
    const priorityReasons: string[] = [];
    const riskReasons: string[] = [];

    // 1. Base Customer Priority Factor (Max 40 pts)
    switch (order.priority) {
      case 'CRITICAL':
        priorityScore += 40;
        priorityReasons.push('Base customer contract tier: CRITICAL priority (+40 pts)');
        break;
      case 'HIGH':
        priorityScore += 30;
        priorityReasons.push('Base customer contract tier: HIGH priority (+30 pts)');
        break;
      case 'NORMAL':
        priorityScore += 20;
        priorityReasons.push('Base customer contract tier: NORMAL priority (+20 pts)');
        break;
      case 'LOW':
        priorityScore += 10;
        priorityReasons.push('Base customer contract tier: LOW priority (+10 pts)');
        break;
    }

    // 2. Dispatch Deadline SLA Urgency Factor (Max 25 pts)
    const deadlineDate = new Date(order.dispatchDeadline);
    const now = new Date();
    const hoursLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600);

    if (hoursLeft < 0) {
      priorityScore += 25;
      riskScore += 35;
      priorityReasons.push('Dispatch deadline is OVERDUE (+25 pts)');
      riskReasons.push('SLA breach: Dispatch deadline has passed');
    } else if (hoursLeft <= 3) {
      priorityScore += 25;
      riskScore += 30;
      priorityReasons.push(`Urgent dispatch deadline within ${hoursLeft.toFixed(1)} hours (+25 pts)`);
      riskReasons.push(`Critical SLA window: ${hoursLeft.toFixed(1)}h remaining`);
    } else if (hoursLeft <= 6) {
      priorityScore += 18;
      riskScore += 20;
      priorityReasons.push(`Dispatch deadline approaching in ${hoursLeft.toFixed(1)} hours (+18 pts)`);
      riskReasons.push(`Approaching SLA deadline (${hoursLeft.toFixed(1)}h left)`);
    } else if (hoursLeft <= 12) {
      priorityScore += 10;
      riskScore += 10;
      priorityReasons.push(`Dispatch deadline due today (${hoursLeft.toFixed(1)}h buffer) (+10 pts)`);
    } else {
      priorityReasons.push(`Comfortable dispatch deadline window (${hoursLeft.toFixed(0)}h buffer)`);
    }

    // 3. Inventory Shortage & Stock Health Factor (Max 20 pts)
    let totalShortage = 0;
    let shortageItem: { sku: string; requested: number; available: number; shortage: number } | undefined;

    for (const item of order.items) {
      const inv = inventory.find((i) => i.sku === item.sku);
      const avail = inv ? Math.max(0, inv.availableQuantity) : 0;
      const shortage = Math.max(0, item.quantity - avail);

      if (shortage > 0) {
        totalShortage += shortage;
        if (!shortageItem) {
          shortageItem = { sku: item.sku, requested: item.quantity, available: avail, shortage };
        }
      } else if (inv && (inv.status === 'LOW_STOCK' || inv.status === 'OUT_OF_STOCK')) {
        riskScore += 15;
        riskReasons.push(`SKU ${item.sku} is below warehouse safety reorder threshold`);
      }
    }

    if (totalShortage > 0 && shortageItem) {
      priorityScore += 20;
      riskScore += 35;
      priorityReasons.push(`Inventory shortage detected for ${shortageItem.sku}: Required ${shortageItem.requested}, Available ${shortageItem.available} (+20 pts)`);
      riskReasons.push(`Fulfillment blocked by stock shortage of ${shortageItem.shortage} units for ${shortageItem.sku}`);
    } else {
      priorityReasons.push('All requested order items are fully available in stock');
    }

    // 4. Fulfillment Stage & Operational Exception Factor (Max 15 pts)
    switch (order.status) {
      case 'EXCEPTION':
        priorityScore += 15;
        riskScore += 30;
        priorityReasons.push('Order is currently on EXCEPTION hold (+15 pts)');
        riskReasons.push('Active operational exception logged');
        break;
      case 'PARTIALLY_ALLOCATED':
        priorityScore += 12;
        riskScore += 20;
        priorityReasons.push('Order is PARTIALLY ALLOCATED awaiting stock (+12 pts)');
        riskReasons.push('Partial inventory reservation state');
        break;
      case 'PROCESSING':
        priorityScore += 10;
        riskScore += 10;
        priorityReasons.push('Order is in active PROCESSING queue (+10 pts)');
        break;
      case 'NEW':
        priorityScore += 5;
        break;
      case 'READY':
        riskScore = Math.max(0, riskScore - 15);
        priorityReasons.push('Order is fully packed and READY for dispatch');
        break;
      case 'DISPATCHED':
        riskScore = 0;
        priorityReasons.push('Order has been DISPATCHED');
        break;
    }

    // Cap Scores cleanly between 0 and 100
    priorityScore = Math.min(100, Math.max(0, Math.round(priorityScore)));
    riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

    // Derive Priority Level (80-100: CRITICAL, 60-79: HIGH, 30-59: NORMAL, 0-29: LOW)
    let priorityLevel: PriorityLevel = 'LOW';
    if (priorityScore >= 80) priorityLevel = 'CRITICAL';
    else if (priorityScore >= 60) priorityLevel = 'HIGH';
    else if (priorityScore >= 30) priorityLevel = 'NORMAL';

    // Derive Risk Level (80-100: CRITICAL, 60-79: HIGH, 30-59: MEDIUM, 0-29: LOW)
    let riskLevel: RiskLevel = 'LOW';
    if (riskScore >= 80) riskLevel = 'CRITICAL';
    else if (riskScore >= 60) riskLevel = 'HIGH';
    else if (riskScore >= 30) riskLevel = 'MEDIUM';

    // Recommended Action Logic
    let recommendedAction = 'Send order into standard fulfillment workflow.';
    if (totalShortage > 0) {
      recommendedAction = 'Execute Smart Allocation Engine to evaluate priority reservation and stock protection.';
    } else if (order.status === 'EXCEPTION') {
      recommendedAction = 'Inspect Exception Management Center and assign corrective resolution action.';
    } else if (hoursLeft <= 3 && order.status !== 'READY' && order.status !== 'DISPATCHED') {
      recommendedAction = 'Expedite picking and packing tasks to meet SLA deadline.';
    } else if (order.status === 'READY') {
      recommendedAction = 'Stage order at outbound shipping bay for carrier pickup.';
    }

    return {
      orderId: order.id,
      priorityScore,
      priorityLevel,
      riskScore,
      riskLevel,
      priorityReasons,
      riskReasons,
      recommendedAction,
      shortageInfo: shortageItem
    };
  }

  /**
   * Helper to assess all orders and sort by Priority Score descending
   */
  static assessAndSortOrders(orders: Order[], inventory: InventoryItem[]) {
    return orders
      .map((order) => {
        const assessment = this.assessOrder(order, inventory);
        return {
          order,
          assessment
        };
      })
      .sort((a, b) => b.assessment.priorityScore - a.assessment.priorityScore);
  }
}
