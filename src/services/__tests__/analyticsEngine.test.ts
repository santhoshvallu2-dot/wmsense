import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsEngine } from '../analyticsEngine';
import { WarehouseService } from '../warehouseService';

describe('AnalyticsEngine', () => {
  beforeEach(() => {
    WarehouseService.resetAllData();
  });

  it('should calculate operational KPIs accurately from live dataset', () => {
    const kpis = AnalyticsEngine.calculateOperationalKPIs();
    expect(kpis.totalOrders).toBe(15);
    expect(kpis.totalSKUs).toBe(20);
    expect(kpis.openExceptions).toBeGreaterThan(0);
    expect(kpis.pendingOrders).toBeGreaterThanOrEqual(0);
    expect(kpis.inProgressOrders).toBeGreaterThanOrEqual(0);
    expect(kpis.lowStockSKUs).toBeGreaterThanOrEqual(0);
    expect(kpis.outOfStockSKUs).toBeGreaterThanOrEqual(0);
  });

  it('should calculate fulfillment rate and handle edge cases', () => {
    const fulfillment = AnalyticsEngine.calculateFulfillmentRate();
    expect(fulfillment.total).toBe(15);
    expect(fulfillment.rate).toBeGreaterThanOrEqual(0);
    expect(fulfillment.rate).toBeLessThanOrEqual(100);
    expect(fulfillment.fulfilled).toBeLessThanOrEqual(fulfillment.total);
  });

  it('should generate all fulfillment pipeline stage counts', () => {
    const stages = AnalyticsEngine.calculateStageCounts();
    expect(stages.length).toBe(9);
    const totalStageCounts = stages.reduce((sum, s) => sum + s.count, 0);
    expect(totalStageCounts).toBeGreaterThanOrEqual(15);
  });

  it('should detect bottlenecks across all 7 stages and rank by score descending', () => {
    const bottlenecks = AnalyticsEngine.detectBottlenecks();
    expect(bottlenecks.length).toBe(7);

    // Verify all 7 stages are represented
    const stageNames = bottlenecks.map((b) => b.stage);
    expect(stageNames).toContain('INVENTORY');
    expect(stageNames).toContain('ALLOCATION');
    expect(stageNames).toContain('PICKING');
    expect(stageNames).toContain('PACKING');
    expect(stageNames).toContain('QUALITY_CHECK');
    expect(stageNames).toContain('EXCEPTIONS');
    expect(stageNames).toContain('DISPATCH');

    // Verify sorted DESC
    for (let i = 0; i < bottlenecks.length - 1; i++) {
      expect(bottlenecks[i].score).toBeGreaterThanOrEqual(bottlenecks[i + 1].score);
    }
  });

  it('should calculate warehouse health score with explainable reasoning and level classification', () => {
    const health = AnalyticsEngine.calculateWarehouseHealthScore();
    expect(health.score).toBeGreaterThanOrEqual(0);
    expect(health.score).toBeLessThanOrEqual(100);
    expect(['EXCELLENT', 'GOOD', 'WARNING', 'CRITICAL']).toContain(health.level);
    expect(health.reasons.length).toBeGreaterThan(0);
  });

  it('should return top at-risk orders filtered by CRITICAL and HIGH risk levels', () => {
    const atRisk = AnalyticsEngine.getTopAtRiskOrders(5);
    expect(atRisk.length).toBeLessThanOrEqual(5);
    atRisk.forEach(({ assessment }) => {
      expect(['CRITICAL', 'HIGH']).toContain(assessment.riskLevel);
    });
  });

  it('should identify inventory risk insights where demand exceeds available stock', () => {
    const insights = AnalyticsEngine.generateInventoryRiskInsights();
    expect(insights.length).toBeGreaterThan(0);

    // WM-104 should be among the top shortage insights
    const wm104Insight = insights.find((i) => i.sku === 'WM-104');
    expect(wm104Insight).toBeDefined();
    expect(wm104Insight?.shortage).toBeGreaterThan(0);
    expect(wm104Insight?.affectedOrders.length).toBeGreaterThan(0);
  });

  it('should generate operational insights and ranked recommended actions', () => {
    const insights = AnalyticsEngine.generateOperationalInsights();
    expect(insights.length).toBeGreaterThan(0);
    insights.forEach((ins) => {
      expect(ins.id).toBeDefined();
      expect(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).toContain(ins.severity);
      expect(ins.message.length).toBeGreaterThan(0);
    });

    const actions = AnalyticsEngine.generateRecommendedActions();
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].priority).toBe(1);
    expect(actions[0].title.length).toBeGreaterThan(0);
    expect(actions[0].route.length).toBeGreaterThan(0);
  });
});
