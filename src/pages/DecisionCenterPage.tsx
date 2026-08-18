import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Activity, Zap, Shield, Target, Award,
  ArrowRight, Database, GitMerge, AlertCircle
} from 'lucide-react';
import { AnalyticsEngine } from '../services/analyticsEngine';
import { DecisionEngine } from '../services/decisionEngine';
import { WarehouseService } from '../services/warehouseService';
import { PriorityEngine } from '../services/priorityEngine';

export const DecisionCenterPage: React.FC = () => {
  const navigate = useNavigate();

  const healthScore = useMemo(() => AnalyticsEngine.calculateWarehouseHealthScore(), []);
  const auditTrail = useMemo(() => DecisionEngine.generateDecisionAuditTrail(), []);
  const topAtRiskOrders = useMemo(() => AnalyticsEngine.getTopAtRiskOrders(5), []);
  const bottlenecks = useMemo(() => AnalyticsEngine.detectBottlenecks(), []);
  const topBottlenecks = bottlenecks.slice(0, 3);

  // WM-104 Scenario Calculation
  const wm104Scenario = useMemo(() => {
    const inventoryList = WarehouseService.getInventory();
    const inventory = inventoryList.find(i => i.sku === 'WM-104');
    const orders = WarehouseService.getOrders().filter(o => o.items.some(i => i.sku === 'WM-104'));
    
    const available = inventory ? inventory.availableQuantity : 7;
    const reorderLevel = inventory ? inventory.reorderLevel : 8;
    
    const criticalOrder = orders.find(o => PriorityEngine.assessOrder(o, inventoryList).priorityLevel === 'CRITICAL') || orders[0];
    const normalOrder = orders.find(o => PriorityEngine.assessOrder(o, inventoryList).priorityLevel !== 'CRITICAL' && o.id !== criticalOrder?.id) || orders[1];

    const crNeed = criticalOrder ? criticalOrder.items.find(i => i.sku === 'WM-104')?.quantity || 10 : 10;
    const noNeed = normalOrder ? normalOrder.items.find(i => i.sku === 'WM-104')?.quantity || 5 : 5;

    return {
      sku: 'WM-104',
      available,
      reorderLevel,
      criticalOrderId: criticalOrder?.id || 'ORD-1024',
      criticalNeed: crNeed,
      criticalShortage: Math.max(0, crNeed - available),
      normalOrderId: normalOrder?.id || 'ORD-1025',
      normalNeed: noNeed,
      totalDemand: crNeed + noNeed,
      totalShortage: Math.max(0, (crNeed + noNeed) - available)
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { stroke: '#22c55e', text: 'text-green-400', badge: 'bg-green-500/20 text-green-400', level: 'EXCELLENT' };
    if (score >= 60) return { stroke: '#3b82f6', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400', level: 'GOOD' };
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400', level: 'WARNING' };
    return { stroke: '#ef4444', text: 'text-red-400', badge: 'bg-red-500/20 text-red-400', level: 'CRITICAL' };
  };

  const scoreTheme = getScoreColor(healthScore.score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (healthScore.score / 100) * circumference;

  const decisionColor = (type: string) => {
    switch(type) {
      case 'PRIORITY': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'ALLOCATION': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'EXCEPTION': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'REORDER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'BOTTLENECK': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-200">
      {/* Showcase Header */}
      <div className="bg-gradient-to-r from-cyan-950 to-indigo-950 border border-indigo-900 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain size={160} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/30">
            <Award size={14} />
            <span>Showcase Feature</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">WMSense Decision Center</h1>
          <p className="text-indigo-200 max-w-3xl text-lg">
            The core intelligence engine. It continuously monitors warehouse state, detects anomalies, assesses risks, and makes autonomous or recommended decisions to optimize fulfillment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warehouse Health Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative">
          <div className="absolute top-4 left-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Warehouse Health</h2>
          </div>
          
          <div className="relative w-48 h-48 mt-6 flex items-center justify-center">
            <svg
              role="img"
              aria-label={`Warehouse health score: ${healthScore.score.toFixed(0)} out of 100, Rating: ${scoreTheme.level}`}
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
              <circle 
                cx="50" cy="50" r="40" 
                stroke={scoreTheme.stroke} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreTheme.text}`}>{healthScore.score.toFixed(0)}</span>
              <span className={`text-[10px] mt-1 px-2 py-0.5 rounded-full font-bold ${scoreTheme.badge}`}>
                {scoreTheme.level}
              </span>
            </div>
          </div>
          
          <div className="mt-6 w-full space-y-2">
            {healthScore.reasons.map((reason, idx) => (
              <div key={idx} className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded flex items-start gap-2 border border-slate-800">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5 text-slate-500" />
                <span>{reason}</span>
              </div>
            ))}
            {healthScore.reasons.length === 0 && <p className="text-xs text-slate-500 text-center">All systems nominal.</p>}
          </div>
        </div>

        {/* Intelligence Flow Diagram */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-6">Intelligence Pipeline</h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-between flex-1 py-4 gap-2">
            <FlowStep icon={<Database />} label="DATA" desc="Real-time ingest" />
            <FlowArrow />
            <FlowStep icon={<Activity />} label="DETECTION" desc="Pattern recognition" />
            <FlowArrow />
            <FlowStep icon={<Shield />} label="RISK" desc="Impact analysis" />
            <FlowArrow />
            <FlowStep icon={<Brain />} label="DECISION" desc="Logic & rules" />
            <FlowArrow />
            <FlowStep icon={<Zap />} label="ACTION" desc="Execution" />
            <FlowArrow />
            <FlowStep icon={<Target />} label="IMPACT" desc="Optimization" active />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WM-104 Scenario Spotlight */}
        <div className="bg-slate-900 border border-cyan-900/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_15px_rgba(8,145,178,0.1)]">
          <div className="absolute top-0 right-0 bg-cyan-500/10 w-64 h-64 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="text-cyan-400" size={20} />
              <span>Conflict Resolution Spotlight</span>
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-900">LIVE SCENARIO</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-mono font-bold text-white">{wm104Scenario.sku}</div>
              <div className="text-sm">
                <span className="text-slate-400">Available: </span>
                <span className="text-white font-mono">{wm104Scenario.available}</span>
                <span className="text-slate-500 mx-2">|</span>
                <span className="text-slate-400">Reorder Level: </span>
                <span className="text-orange-400 font-mono">{wm104Scenario.reorderLevel}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-red-950/30 p-3 rounded-lg border border-red-900/50">
                <div>
                  <div className="font-mono text-sm text-red-300 font-bold">{wm104Scenario.criticalOrderId}</div>
                  <div className="text-[10px] text-red-400/80 uppercase font-semibold tracking-wider">Critical Priority</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Needs: <span className="font-mono text-white">{wm104Scenario.criticalNeed}</span></div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div>
                  <div className="font-mono text-sm text-slate-300 font-bold">{wm104Scenario.normalOrderId}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">Normal Priority</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-300">Needs: <span className="font-mono text-white">{wm104Scenario.normalNeed}</span></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
              <span className="text-sm text-slate-400">Total Demand: <span className="font-mono text-white">{wm104Scenario.totalDemand}</span></span>
              <span className="text-sm text-red-400">Shortage: <span className="font-mono">{wm104Scenario.totalShortage}</span></span>
            </div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-xl p-4 flex gap-3 items-start">
            <Brain className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-cyan-300 mb-1">Engine Decision</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Allocated {Math.min(wm104Scenario.available, wm104Scenario.criticalNeed)} units to <span className="font-mono text-cyan-200">{wm104Scenario.criticalOrderId}</span>. 
                Remaining 0 units. <span className="font-mono text-cyan-200">{wm104Scenario.normalOrderId}</span> is blocked. Triggered emergency reorder for {wm104Scenario.sku}.
              </p>
            </div>
          </div>
        </div>

        {/* Decision Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[520px]">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
            <GitMerge className="text-indigo-400" size={20} />
            <span>Decision Audit Trail</span>
          </h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {auditTrail.map((decision, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${decisionColor(decision.type)}`}>
                    {decision.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {decision.createdAt ? new Date(decision.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}) : 'Active'}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{decision.title}</h3>
                <p className="text-xs text-slate-400 mb-2">{decision.reason}</p>
                
                <div className="bg-slate-900/50 rounded p-2 mt-2">
                  <div className="text-xs flex justify-between">
                    <span className="text-slate-500">Impact:</span>
                    <span className="text-slate-300">{decision.impact}</span>
                  </div>
                  {decision.recommendedAction && (
                    <div className="text-xs flex justify-between mt-1 pt-1 border-t border-slate-800">
                      <span className="text-slate-500">Action:</span>
                      <span className="text-indigo-300 font-medium">{decision.recommendedAction}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {auditTrail.length === 0 && <p className="text-slate-500 text-sm">No decisions recorded.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top At-Risk Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <AlertCircle className="text-red-400" size={20} />
            <span>Top At-Risk Orders</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium px-2">Order</th>
                  <th className="pb-3 font-medium px-2">Risk Score</th>
                  <th className="pb-3 font-medium px-2">Stage</th>
                  <th className="pb-3 font-medium px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {topAtRiskOrders.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-3 px-2 font-mono text-indigo-300">{item.order.id}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono ${item.assessment.riskScore > 75 ? 'text-red-400' : 'text-orange-400'}`}>
                          {item.assessment.riskScore.toFixed(0)}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.assessment.riskLevel === 'HIGH' || item.assessment.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                          {item.assessment.riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{item.order.status}</td>
                    <td className="py-3 px-2 text-right">
                      <button onClick={() => navigate('/orders')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Review</button>
                    </td>
                  </tr>
                ))}
                {topAtRiskOrders.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-slate-500">No high-risk orders detected.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Bottlenecks Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <Shield className="text-orange-400" size={20} />
            <span>Bottleneck Summary</span>
          </h2>
          <div className="space-y-4">
            {topBottlenecks.map((bot, idx) => (
              <div key={idx} className="bg-slate-800/30 rounded-lg p-4 border border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-white text-sm">{bot.stage}</span>
                  <span className="font-mono text-xs text-orange-400">Score: {bot.score.toFixed(0)}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
                  <div className={`h-full rounded-full ${bot.score > 70 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(bot.score, 100)}%` }} />
                </div>
                <p className="text-xs text-slate-400">{bot.reason}</p>
              </div>
            ))}
            {topBottlenecks.length === 0 && <p className="text-slate-500 text-sm">No bottlenecks.</p>}
          </div>
        </div>
      </div>

    </div>
  );
};

const FlowStep = ({ icon, label, desc, active = false }: { icon: React.ReactNode, label: string, desc: string, active?: boolean }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[100px] text-center border transition-all duration-300 ${active ? 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_10px_rgba(8,145,178,0.2)]' : 'bg-slate-800/50 border-slate-700/50'}`}>
    <div className={`mb-2 ${active ? 'text-cyan-400' : 'text-slate-400'}`}>
      {icon}
    </div>
    <div className={`text-[11px] font-bold mb-1 tracking-wider ${active ? 'text-white' : 'text-slate-300'}`}>{label}</div>
    <div className="text-[10px] text-slate-500 leading-tight">{desc}</div>
  </div>
);

const FlowArrow = () => (
  <div className="hidden sm:flex text-slate-700 justify-center items-center">
    <ArrowRight size={16} />
  </div>
);

export default DecisionCenterPage;
