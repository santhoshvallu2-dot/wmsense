import type { Decision } from '../types/warehouse';
import { WarehouseService } from './warehouseService';
import { PriorityEngine } from './priorityEngine';
import { AnalyticsEngine } from './analyticsEngine';

// ─── Decision Engine ────────────────────────────────────────────────

export class DecisionEngine {
  /**
   * Generate a complete explainable decision audit trail from all engines.
   * Flow: DATA → DETECTION → RISK ANALYSIS → DECISION → RECOMMENDED ACTION → EXPECTED IMPACT
   */
  static generateDecisionAuditTrail(): Decision[] {
    const existingDecisions = WarehouseService.getDecisions();
    const orders = WarehouseService.getOrders();
    const inventory = WarehouseService.getInventory();
    const exceptions = WarehouseService.getExceptions();
    const bottlenecks = AnalyticsEngine.detectBottlenecks();
    const riskInsights = AnalyticsEngine.generateInventoryRiskInsights();
    const dynamicDecisions: Decision[] = [];
    let decId = 1000;

    // 1. Priority-based decisions from PriorityEngine assessments
    const assessedOrders = PriorityEngine.assessAndSortOrders(orders, inventory);
    for (const { order, assessment } of assessedOrders) {
      if (assessment.riskLevel === 'CRITICAL' || assessment.riskLevel === 'HIGH') {
        dynamicDecisions.push({
          id: `DDEC-${decId++}`,
          type: 'PRIORITY',
          title: `${order.id} assessed as ${assessment.priorityLevel} priority (Score: ${assessment.priorityScore}/100)`,
          reason: assessment.priorityReasons.slice(0, 2).join(' '),
          impact: assessment.riskReasons.length > 0
            ? assessment.riskReasons[0]
            : 'Order requires elevated attention in fulfillment queue.',
          recommendedAction: assessment.recommendedAction,
          createdAt: new Date().toISOString(),
          relatedOrderId: order.id,
          relatedSku: assessment.shortageInfo?.sku,
        });
      }
    }

    // 2. Inventory risk decisions
    for (const insight of riskInsights) {
      if (insight.shortage > 0) {
        dynamicDecisions.push({
          id: `DDEC-${decId++}`,
          type: 'REORDER',
          title: `${insight.sku} requires replenishment (${insight.shortage} unit shortage)`,
          reason: `Available stock (${insight.available}) is insufficient for total demand (${insight.totalDemand}). ${insight.affectedOrders.length} order(s) affected.`,
          impact: `Orders ${insight.affectedOrders.join(', ')} may be delayed or blocked without replenishment.`,
          recommendedAction: insight.recommendation,
          createdAt: new Date().toISOString(),
          relatedSku: insight.sku,
          relatedOrderId: insight.affectedOrders[0],
        });
      }
    }

    // 3. Bottleneck decisions
    for (const bn of bottlenecks) {
      if (bn.score > 20) {
        dynamicDecisions.push({
          id: `DDEC-${decId++}`,
          type: 'BOTTLENECK',
          title: `${bn.stage} stage detected as bottleneck (Score: ${bn.score}/100)`,
          reason: bn.reason,
          impact: `${bn.affectedOrders} order(s) affected at the ${bn.stage} stage.`,
          recommendedAction: bn.recommendedAction,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // 4. Exception-based decisions
    const openExceptions = exceptions.filter((e) => e.status !== 'RESOLVED');
    for (const exc of openExceptions) {
      dynamicDecisions.push({
        id: `DDEC-${decId++}`,
        type: 'EXCEPTION',
        title: `Exception ${exc.id}: ${exc.type.replace(/_/g, ' ')} (${exc.severity})`,
        reason: exc.description,
        impact: `Order ${exc.orderId} is affected. ${exc.severity === 'HIGH' || exc.severity === 'CRITICAL' ? 'Fulfillment may be blocked.' : 'Monitoring required.'}`,
        recommendedAction: exc.recommendedAction,
        createdAt: exc.createdAt,
        relatedOrderId: exc.orderId,
        relatedSku: exc.sku,
      });
    }

    // Merge with existing seed decisions (avoid duplicates by ID prefix)
    const existingIds = new Set(existingDecisions.map((d) => d.id));
    const merged = [
      ...existingDecisions,
      ...dynamicDecisions.filter((d) => !existingIds.has(d.id)),
    ];

    // Sort by createdAt DESC (most recent first)
    return merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
