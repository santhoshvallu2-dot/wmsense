import { describe, it, expect, beforeEach } from 'vitest';
import { DecisionEngine } from '../decisionEngine';
import { WarehouseService } from '../warehouseService';

describe('DecisionEngine', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should generate explainable decision audit trail with multiple decision types', () => {
    const auditTrail = DecisionEngine.generateDecisionAuditTrail();
    expect(auditTrail.length).toBeGreaterThan(0);

    const types = new Set(auditTrail.map((d) => d.type));
    expect(types.has('PRIORITY') || types.has('ALLOCATION') || types.has('REORDER') || types.has('BOTTLENECK') || types.has('EXCEPTION')).toBe(true);

    auditTrail.forEach((decision) => {
      expect(decision.id).toBeDefined();
      expect(decision.title.length).toBeGreaterThan(0);
      expect(decision.reason.length).toBeGreaterThan(0);
      expect(decision.impact.length).toBeGreaterThan(0);
      expect(decision.recommendedAction.length).toBeGreaterThan(0);
      expect(decision.createdAt).toBeDefined();
    });
  });

  it('should include decisions for high risk/critical orders', () => {
    const auditTrail = DecisionEngine.generateDecisionAuditTrail();
    const priorityDecisions = auditTrail.filter((d) => d.type === 'PRIORITY');
    expect(priorityDecisions.length).toBeGreaterThan(0);
  });

  it('should include reorder decisions for shortage SKUs', () => {
    const auditTrail = DecisionEngine.generateDecisionAuditTrail();
    const reorderDecisions = auditTrail.filter((d) => d.type === 'REORDER');
    expect(reorderDecisions.length).toBeGreaterThan(0);
    expect(reorderDecisions.some((d) => d.relatedSku === 'WM-104')).toBe(true);
  });

  it('should avoid duplicate IDs and sort by createdAt descending', () => {
    const auditTrail = DecisionEngine.generateDecisionAuditTrail();
    const ids = auditTrail.map((d) => d.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);

    for (let i = 0; i < auditTrail.length - 1; i++) {
      const dateA = new Date(auditTrail[i].createdAt).getTime();
      const dateB = new Date(auditTrail[i + 1].createdAt).getTime();
      expect(dateA).toBeGreaterThanOrEqual(dateB);
    }
  });
});
