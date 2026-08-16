import type {
  RiskLevel,
  Order
} from '../types/warehouse';
import { WarehouseService } from './warehouseService';
import { PriorityEngine } from './priorityEngine';
import type { PriorityAssessment } from './priorityEngine';

// ─── Result Interfaces ─────────────────────────────────────────────

export interface OperationalKPIs {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  fulfilledOrders: number;
  blockedOrders: number;
  delayedOrders: number;
  exceptionOrders: number;
  totalSKUs: number;
  lowStockSKUs: number;
  outOfStockSKUs: number;
  damagedSKUs: number;
  openExceptions: number;
  criticalExceptions: number;
  readyForDispatch: number;
  inTransit: number;
  delivered: number;
}

export interface FulfillmentFunnelStage {
  stage: string;
  label: string;
  count: number;
  color: string;
}

export type BottleneckStage =
  | 'INVENTORY'
  | 'ALLOCATION'
  | 'PICKING'
  | 'PACKING'
  | 'QUALITY_CHECK'
  | 'EXCEPTIONS'
  | 'DISPATCH';

export interface BottleneckResult {
  stage: BottleneckStage;
  score: number;
  affectedOrders: number;
  affectedSKUs: number;
  reason: string;
  recommendedAction: string;
  route: string;
}

export interface WarehouseHealthResult {
  score: number;
  level: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  reasons: string[];
}

export interface InventoryRiskInsight {
  sku: string;
  productName: string;
  available: number;
  totalDemand: number;
  shortage: number;
  affectedOrders: string[];
  recommendation: string;
}

export interface OperationalInsight {
  id: string;
  severity: RiskLevel;
  message: string;
  route?: string;
}

export interface RecommendedAction {
  id: string;
  priority: number;
  title: string;
  impact: string;
  route: string;
}

export interface AtRiskOrder {
  order: Order;
  assessment: PriorityAssessment;
}

// ─── Analytics Engine ───────────────────────────────────────────────

export class AnalyticsEngine {
  /**
   * Calculate all operational KPIs from live data
   */
  static calculateOperationalKPIs(): OperationalKPIs {
    const orders = WarehouseService.getOrders();
    const inventory = WarehouseService.getInventory();
    const exceptions = WarehouseService.getExceptions();
    const dispatches = WarehouseService.getDispatches();

    const pendingStatuses = ['NEW', 'PROCESSING'];
    const inProgressStatuses = ['ALLOCATED', 'PARTIALLY_ALLOCATED', 'PICKING', 'PACKING', 'QUALITY_CHECK'];
    const fulfilledStatuses = ['DISPATCHED'];
    const blockedStatuses = ['EXCEPTION'];

    // Delayed = deadline passed but not dispatched
    const now = new Date();
    const delayedOrders = orders.filter(
      (o) => new Date(o.dispatchDeadline) < now && !fulfilledStatuses.includes(o.status) && o.status !== 'READY'
    ).length;

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => pendingStatuses.includes(o.status)).length,
      inProgressOrders: orders.filter((o) => inProgressStatuses.includes(o.status)).length,
      fulfilledOrders: orders.filter((o) => fulfilledStatuses.includes(o.status)).length,
      blockedOrders: orders.filter((o) => blockedStatuses.includes(o.status)).length,
      delayedOrders,
      exceptionOrders: orders.filter((o) => o.status === 'EXCEPTION').length,
      totalSKUs: inventory.length,
      lowStockSKUs: inventory.filter((i) => i.status === 'LOW_STOCK').length,
      outOfStockSKUs: inventory.filter((i) => i.status === 'OUT_OF_STOCK').length,
      damagedSKUs: inventory.filter((i) => i.status === 'DAMAGED').length,
      openExceptions: exceptions.filter((e) => e.status !== 'RESOLVED').length,
      criticalExceptions: exceptions.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length,
      readyForDispatch: orders.filter((o) => o.status === 'READY').length,
      inTransit: dispatches.filter((d) => d.status === 'DISPATCHED').length,
      delivered: dispatches.filter((d) => d.status === 'DELIVERED').length,
    };
  }

  /**
   * Calculate fulfillment rate (0–100) with zero-division safety
   */
  static calculateFulfillmentRate(): { rate: number; fulfilled: number; total: number } {
    const orders = WarehouseService.getOrders();
    const total = orders.length;
    const fulfilled = orders.filter((o) => o.status === 'DISPATCHED').length;
    const rate = total > 0 ? Math.round((fulfilled / total) * 1000) / 10 : 0;
    return { rate, fulfilled, total };
  }

  /**
   * Calculate order counts at each lifecycle stage for funnel visualization
   */
  static calculateStageCounts(): FulfillmentFunnelStage[] {
    const orders = WarehouseService.getOrders();
    return [
      { stage: 'NEW', label: 'New Orders', count: orders.filter((o) => o.status === 'NEW').length, color: '#64748b' },
      { stage: 'PROCESSING', label: 'Processing', count: orders.filter((o) => o.status === 'PROCESSING').length, color: '#3b82f6' },
      { stage: 'ALLOCATED', label: 'Allocated', count: orders.filter((o) => o.status === 'ALLOCATED' || o.status === 'PARTIALLY_ALLOCATED').length, color: '#8b5cf6' },
      { stage: 'PICKING', label: 'Picking', count: orders.filter((o) => o.status === 'PICKING').length, color: '#f59e0b' },
      { stage: 'PACKING', label: 'Packing', count: orders.filter((o) => o.status === 'PACKING').length, color: '#10b981' },
      { stage: 'QUALITY_CHECK', label: 'Quality Check', count: orders.filter((o) => o.status === 'QUALITY_CHECK').length, color: '#06b6d4' },
      { stage: 'READY', label: 'Ready for Dispatch', count: orders.filter((o) => o.status === 'READY').length, color: '#22c55e' },
      { stage: 'DISPATCHED', label: 'Dispatched', count: orders.filter((o) => o.status === 'DISPATCHED').length, color: '#14b8a6' },
      { stage: 'EXCEPTION', label: 'Exception', count: orders.filter((o) => o.status === 'EXCEPTION').length, color: '#ef4444' },
    ];
  }

  /**
   * Detect and rank bottlenecks across 7 operational stages.
   * Score = (pendingImpact × 10) + (blockedImpact × 20) + (exceptionImpact × 25) + (criticalPriorityImpact × 30)
   */
  static detectBottlenecks(): BottleneckResult[] {
    const orders = WarehouseService.getOrders();
    const inventory = WarehouseService.getInventory();
    const pickingTasks = WarehouseService.getPickingTasks();
    const packingTasks = WarehouseService.getPackingTasks();
    const qualityChecks = WarehouseService.getQualityChecks();
    const exceptions = WarehouseService.getExceptions();

    const bottlenecks: BottleneckResult[] = [];

    // 1. INVENTORY bottleneck
    const lowStockSKUs = inventory.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK');
    const inventoryShortageOrders = orders.filter((o) =>
      o.items.some((item) => {
        const inv = inventory.find((i) => i.sku === item.sku);
        return !inv || inv.availableQuantity < item.quantity;
      })
    );
    const criticalInventoryOrders = inventoryShortageOrders.filter(
      (o) => o.priority === 'CRITICAL' || o.priority === 'HIGH'
    );
    bottlenecks.push({
      stage: 'INVENTORY',
      score: Math.min(100,
        (lowStockSKUs.length * 10) +
        (inventoryShortageOrders.length * 20) +
        (criticalInventoryOrders.length * 30)
      ),
      affectedOrders: inventoryShortageOrders.length,
      affectedSKUs: lowStockSKUs.length,
      reason: lowStockSKUs.length > 0
        ? `${lowStockSKUs.length} SKU(s) below safety stock levels. ${inventoryShortageOrders.length} order(s) have demand exceeding available stock.`
        : 'All inventory levels are within normal parameters.',
      recommendedAction: lowStockSKUs.length > 0
        ? 'Review replenishment recommendations for critical SKUs and issue purchase orders.'
        : 'No action required.',
      route: '/inventory'
    });

    // 2. ALLOCATION bottleneck
    const waitingAllocation = orders.filter(
      (o) => o.allocationStatus === 'WAITING' || o.allocationStatus === 'BLOCKED'
    );
    const partialAllocations = orders.filter((o) => o.status === 'PARTIALLY_ALLOCATED');
    const criticalWaiting = waitingAllocation.filter(
      (o) => o.priority === 'CRITICAL' || o.priority === 'HIGH'
    );
    bottlenecks.push({
      stage: 'ALLOCATION',
      score: Math.min(100,
        (waitingAllocation.length * 10) +
        (partialAllocations.length * 20) +
        (criticalWaiting.length * 30)
      ),
      affectedOrders: waitingAllocation.length + partialAllocations.length,
      affectedSKUs: new Set(waitingAllocation.flatMap((o) => o.items.map((i) => i.sku))).size,
      reason: waitingAllocation.length > 0
        ? `${waitingAllocation.length} order(s) waiting for allocation. ${partialAllocations.length} partially allocated.`
        : 'All eligible orders have been allocated.',
      recommendedAction: waitingAllocation.length > 0
        ? 'Run Smart Allocation Engine to process waiting orders by priority.'
        : 'No action required.',
      route: '/allocation'
    });

    // 3. PICKING bottleneck
    const pendingPicks = pickingTasks.filter((t) => t.status === 'NOT_STARTED');
    const inProgressPicks = pickingTasks.filter((t) => t.status === 'IN_PROGRESS');
    const exceptionPicks = pickingTasks.filter((t) => t.status === 'EXCEPTION');
    const criticalPicks = pickingTasks.filter(
      (t) => t.priority === 'CRITICAL' || t.priority === 'HIGH'
    ).filter((t) => t.status !== 'PICKED');
    bottlenecks.push({
      stage: 'PICKING',
      score: Math.min(100,
        (pendingPicks.length * 10) +
        (exceptionPicks.length * 25) +
        (criticalPicks.length * 30)
      ),
      affectedOrders: new Set([...pendingPicks, ...inProgressPicks, ...exceptionPicks].map((t) => t.orderId)).size,
      affectedSKUs: new Set([...pendingPicks, ...inProgressPicks, ...exceptionPicks].map((t) => t.sku)).size,
      reason: pendingPicks.length + exceptionPicks.length > 0
        ? `${pendingPicks.length} picking task(s) not started. ${exceptionPicks.length} picking exception(s) reported.`
        : 'All picking tasks are progressing normally.',
      recommendedAction: exceptionPicks.length > 0
        ? 'Resolve picking exceptions and prioritize high-priority incomplete tasks.'
        : pendingPicks.length > 0
          ? 'Assign pending picking tasks to available warehouse staff.'
          : 'No action required.',
      route: '/picking'
    });

    // 4. PACKING bottleneck
    const pendingPacking = packingTasks.filter((t) => t.status === 'NOT_STARTED');
    const inProgressPacking = packingTasks.filter((t) => t.status === 'IN_PROGRESS');
    const criticalPacking = packingTasks.filter(
      (t) => t.priority === 'CRITICAL' || t.priority === 'HIGH'
    ).filter((t) => t.status !== 'PACKED');
    bottlenecks.push({
      stage: 'PACKING',
      score: Math.min(100,
        (pendingPacking.length * 10) +
        (inProgressPacking.length * 10) +
        (criticalPacking.length * 30)
      ),
      affectedOrders: new Set([...pendingPacking, ...inProgressPacking].map((t) => t.orderId)).size,
      affectedSKUs: 0,
      reason: pendingPacking.length + inProgressPacking.length > 0
        ? `${pendingPacking.length} order(s) awaiting packing. ${inProgressPacking.length} in progress.`
        : 'All packing tasks completed.',
      recommendedAction: criticalPacking.length > 0
        ? 'Prioritize critical order packing tasks immediately.'
        : pendingPacking.length > 0
          ? 'Clear the packing queue for pending orders.'
          : 'No action required.',
      route: '/packing'
    });

    // 5. QUALITY_CHECK bottleneck
    const qcPending = orders.filter((o) => o.status === 'QUALITY_CHECK');
    const qcFailed = qualityChecks.filter((q) => q.status === 'FAIL');
    const criticalQCOrders = qcPending.filter(
      (o) => o.priority === 'CRITICAL' || o.priority === 'HIGH'
    );
    bottlenecks.push({
      stage: 'QUALITY_CHECK',
      score: Math.min(100,
        (qcPending.length * 10) +
        (qcFailed.length * 25) +
        (criticalQCOrders.length * 30)
      ),
      affectedOrders: qcPending.length + qcFailed.length,
      affectedSKUs: 0,
      reason: qcFailed.length > 0
        ? `${qcFailed.length} QC failure(s) detected. ${qcPending.length} order(s) waiting for quality verification.`
        : qcPending.length > 0
          ? `${qcPending.length} order(s) awaiting quality check.`
          : 'All quality checks are current.',
      recommendedAction: qcFailed.length > 0
        ? 'Review QC failures and trigger exception resolution or replacement picks.'
        : qcPending.length > 0
          ? 'Process pending quality checks.'
          : 'No action required.',
      route: '/packing'
    });

    // 6. EXCEPTIONS bottleneck
    const openExceptions = exceptions.filter((e) => e.status !== 'RESOLVED');
    const criticalExceptions = openExceptions.filter(
      (e) => e.severity === 'CRITICAL' || e.severity === 'HIGH'
    );
    const exceptionOrderIds = new Set(openExceptions.map((e) => e.orderId));
    bottlenecks.push({
      stage: 'EXCEPTIONS',
      score: Math.min(100,
        (openExceptions.length * 10) +
        (criticalExceptions.length * 25) +
        (criticalExceptions.length * 30)
      ),
      affectedOrders: exceptionOrderIds.size,
      affectedSKUs: new Set(openExceptions.filter((e) => e.sku).map((e) => e.sku!)).size,
      reason: openExceptions.length > 0
        ? `${openExceptions.length} unresolved exception(s). ${criticalExceptions.length} are high/critical severity.`
        : 'All exceptions resolved.',
      recommendedAction: criticalExceptions.length > 0
        ? 'Resolve critical exceptions blocking fulfillment immediately.'
        : openExceptions.length > 0
          ? 'Review and resolve open exceptions.'
          : 'No action required.',
      route: '/exceptions'
    });

    // 7. DISPATCH bottleneck
    const readyOrders = orders.filter((o) => o.status === 'READY');
    const readyButNotDispatched = readyOrders.length;
    const criticalReady = readyOrders.filter(
      (o) => o.priority === 'CRITICAL' || o.priority === 'HIGH'
    );
    bottlenecks.push({
      stage: 'DISPATCH',
      score: Math.min(100,
        (readyButNotDispatched * 10) +
        (criticalReady.length * 30)
      ),
      affectedOrders: readyButNotDispatched,
      affectedSKUs: 0,
      reason: readyButNotDispatched > 0
        ? `${readyButNotDispatched} order(s) ready but not yet dispatched.`
        : 'All ready orders have been dispatched.',
      recommendedAction: criticalReady.length > 0
        ? 'Dispatch critical orders immediately to meet SLA deadlines.'
        : readyButNotDispatched > 0
          ? 'Process outbound dispatch for ready orders.'
          : 'No action required.',
      route: '/dispatch'
    });

    // Sort by score DESC
    return bottlenecks.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate Warehouse Health Score (0–100) with explainable reasons
   */
  static calculateWarehouseHealthScore(): WarehouseHealthResult {
    const kpis = this.calculateOperationalKPIs();
    const fulfillment = this.calculateFulfillmentRate();
    const bottlenecks = this.detectBottlenecks();
    const topBottleneck = bottlenecks[0];

    let score = 100;
    const reasons: string[] = [];

    // 1. Fulfillment Rate contribution (40% weight)
    const fulfillmentPenalty = Math.round((100 - fulfillment.rate) * 0.4);
    if (fulfillmentPenalty > 0) {
      score -= fulfillmentPenalty;
      reasons.push(`Fulfillment rate is ${fulfillment.rate}% (${fulfillment.fulfilled}/${fulfillment.total} orders dispatched)`);
    }

    // 2. Exception penalty
    if (kpis.openExceptions > 0) {
      const exceptionPenalty = Math.min(20, kpis.openExceptions * 5 + kpis.criticalExceptions * 5);
      score -= exceptionPenalty;
      reasons.push(`${kpis.openExceptions} unresolved exception(s) (${kpis.criticalExceptions} critical/high)`);
    }

    // 3. Inventory health penalty
    const inventoryRiskCount = kpis.lowStockSKUs + kpis.outOfStockSKUs;
    if (inventoryRiskCount > 0) {
      const invPenalty = Math.min(15, inventoryRiskCount * 4);
      score -= invPenalty;
      reasons.push(`${kpis.lowStockSKUs} low-stock and ${kpis.outOfStockSKUs} out-of-stock SKU(s)`);
    }

    // 4. Blocked/Exception orders penalty
    if (kpis.blockedOrders > 0) {
      const blockedPenalty = Math.min(15, kpis.blockedOrders * 5);
      score -= blockedPenalty;
      reasons.push(`${kpis.blockedOrders} order(s) currently blocked by exceptions`);
    }

    // 5. Top bottleneck impact
    if (topBottleneck && topBottleneck.score > 30) {
      const bottleneckPenalty = Math.min(10, Math.round(topBottleneck.score * 0.1));
      score -= bottleneckPenalty;
      reasons.push(`Top bottleneck: ${topBottleneck.stage} (score ${topBottleneck.score})`);
    }

    // 6. Delayed orders penalty
    if (kpis.delayedOrders > 0) {
      const delayedPenalty = Math.min(10, kpis.delayedOrders * 3);
      score -= delayedPenalty;
      reasons.push(`${kpis.delayedOrders} order(s) past dispatch deadline`);
    }

    // Clamp score
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Determine level
    let level: WarehouseHealthResult['level'] = 'EXCELLENT';
    if (score < 40) level = 'CRITICAL';
    else if (score < 60) level = 'WARNING';
    else if (score < 80) level = 'GOOD';

    if (reasons.length === 0) {
      reasons.push('All warehouse systems operating within normal parameters.');
    }

    return { score, level, reasons };
  }

  /**
   * Get top at-risk orders using PriorityEngine
   */
  static getTopAtRiskOrders(limit: number = 5): AtRiskOrder[] {
    const orders = WarehouseService.getOrders();
    const inventory = WarehouseService.getInventory();
    return PriorityEngine.assessAndSortOrders(orders, inventory)
      .filter(({ assessment }) => assessment.riskLevel === 'CRITICAL' || assessment.riskLevel === 'HIGH')
      .slice(0, limit)
      .map(({ order, assessment }) => ({ order, assessment }));
  }

  /**
   * Generate inventory risk insights (SKUs where demand exceeds supply)
   */
  static generateInventoryRiskInsights(): InventoryRiskInsight[] {
    const orders = WarehouseService.getOrders();
    const inventory = WarehouseService.getInventory();

    // Build demand map from unfulfilled orders
    const demandMap = new Map<string, { total: number; orders: string[] }>();
    for (const order of orders) {
      if (order.status === 'DISPATCHED') continue;
      for (const item of order.items) {
        const existing = demandMap.get(item.sku) || { total: 0, orders: [] };
        existing.total += item.quantity;
        existing.orders.push(order.id);
        demandMap.set(item.sku, existing);
      }
    }

    const insights: InventoryRiskInsight[] = [];
    for (const inv of inventory) {
      const demand = demandMap.get(inv.sku);
      if (!demand) continue;
      const shortage = Math.max(0, demand.total - inv.availableQuantity);
      if (shortage > 0 || inv.status === 'LOW_STOCK' || inv.status === 'OUT_OF_STOCK') {
        insights.push({
          sku: inv.sku,
          productName: inv.productName,
          available: inv.availableQuantity,
          totalDemand: demand.total,
          shortage,
          affectedOrders: demand.orders,
          recommendation: shortage > 0
            ? `Replenish at least ${shortage} unit(s) from ${inv.supplier}. Current shortage blocks ${demand.orders.length} order(s).`
            : `Stock is low (${inv.availableQuantity} units). Monitor demand closely.`,
        });
      }
    }
    return insights.sort((a, b) => b.shortage - a.shortage);
  }

  /**
   * Generate human-readable operational insights
   */
  static generateOperationalInsights(): OperationalInsight[] {
    const kpis = this.calculateOperationalKPIs();
    const bottlenecks = this.detectBottlenecks();
    const insights: OperationalInsight[] = [];
    let id = 1;

    if (kpis.blockedOrders > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'CRITICAL',
        message: `${kpis.blockedOrders} order(s) are currently blocked by exceptions.`,
        route: '/exceptions'
      });
    }
    if (kpis.outOfStockSKUs > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'HIGH',
        message: `${kpis.outOfStockSKUs} SKU(s) are completely out of stock.`,
        route: '/inventory?status=OUT_OF_STOCK'
      });
    }
    if (kpis.lowStockSKUs > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'MEDIUM',
        message: `${kpis.lowStockSKUs} SKU(s) are below safety reorder level.`,
        route: '/inventory?status=LOW_STOCK'
      });
    }
    if (kpis.criticalExceptions > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'HIGH',
        message: `${kpis.criticalExceptions} critical/high severity exception(s) need resolution.`,
        route: '/exceptions'
      });
    }
    if (kpis.readyForDispatch > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'MEDIUM',
        message: `${kpis.readyForDispatch} order(s) are packed and ready for carrier dispatch.`,
        route: '/dispatch'
      });
    }
    if (kpis.delayedOrders > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: 'CRITICAL',
        message: `${kpis.delayedOrders} order(s) have passed their dispatch deadline.`,
        route: '/orders'
      });
    }
    const topBottleneck = bottlenecks[0];
    if (topBottleneck && topBottleneck.score > 0) {
      insights.push({
        id: `insight-${id++}`,
        severity: topBottleneck.score >= 60 ? 'HIGH' : 'MEDIUM',
        message: `Top bottleneck detected at ${topBottleneck.stage} stage (score: ${topBottleneck.score}/100).`,
        route: topBottleneck.route
      });
    }

    return insights;
  }

  /**
   * Generate ranked recommended actions with navigation
   */
  static generateRecommendedActions(): RecommendedAction[] {
    const kpis = this.calculateOperationalKPIs();
    const riskInsights = this.generateInventoryRiskInsights();
    const bottlenecks = this.detectBottlenecks();
    const riskOrders = this.getTopAtRiskOrders(3);
    const actions: RecommendedAction[] = [];
    let priority = 1;

    // Highest-risk inventory
    if (riskInsights.length > 0) {
      const topRisk = riskInsights[0];
      actions.push({
        id: `action-${priority}`,
        priority: priority++,
        title: `Replenish ${topRisk.sku} (${topRisk.productName})`,
        impact: `${topRisk.shortage} unit shortage affecting ${topRisk.affectedOrders.length} order(s)`,
        route: '/inventory'
      });
    }

    // Critical exceptions
    if (kpis.criticalExceptions > 0) {
      actions.push({
        id: `action-${priority}`,
        priority: priority++,
        title: `Resolve ${kpis.criticalExceptions} critical exception(s)`,
        impact: `${kpis.blockedOrders} order(s) blocked from fulfillment`,
        route: '/exceptions'
      });
    }

    // Top at-risk order
    if (riskOrders.length > 0) {
      const topOrder = riskOrders[0];
      actions.push({
        id: `action-${priority}`,
        priority: priority++,
        title: `Prioritize ${topOrder.order.id} (${topOrder.order.customer})`,
        impact: `Risk score: ${topOrder.assessment.riskScore}/100 — ${topOrder.assessment.recommendedAction}`,
        route: '/orders'
      });
    }

    // Top bottleneck
    const topBottleneck = bottlenecks.find((b) => b.score > 0);
    if (topBottleneck) {
      actions.push({
        id: `action-${priority}`,
        priority: priority++,
        title: `Resolve ${topBottleneck.stage} bottleneck`,
        impact: `Score: ${topBottleneck.score}/100 — ${topBottleneck.affectedOrders} order(s) affected`,
        route: topBottleneck.route
      });
    }

    // Ready orders
    if (kpis.readyForDispatch > 0) {
      actions.push({
        id: `action-${priority}`,
        priority: priority++,
        title: `Dispatch ${kpis.readyForDispatch} ready order(s)`,
        impact: 'Orders packed and verified, awaiting carrier pickup',
        route: '/dispatch'
      });
    }

    return actions;
  }
}
