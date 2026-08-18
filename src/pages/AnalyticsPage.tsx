import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, BarChart3, AlertTriangle, AlertCircle, 
  Package, Boxes, TrendingDown, ArrowRight,
  ShieldAlert, CheckCircle2, Zap
} from 'lucide-react';
import { AnalyticsEngine } from '../services/analyticsEngine';

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const kpis = useMemo(() => AnalyticsEngine.calculateOperationalKPIs(), []);
  const fulfillment = useMemo(() => AnalyticsEngine.calculateFulfillmentRate(), []);
  const funnelStages = useMemo(() => AnalyticsEngine.calculateStageCounts(), []);
  const bottlenecks = useMemo(() => AnalyticsEngine.detectBottlenecks(), []);
  const inventoryRisks = useMemo(() => AnalyticsEngine.generateInventoryRiskInsights(), []);
  const insights = useMemo(() => AnalyticsEngine.generateOperationalInsights(), []);
  const recommendedActions = useMemo(() => AnalyticsEngine.generateRecommendedActions(), []);

  const topBottleneck = bottlenecks.length > 0 ? bottlenecks[0] : null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-200">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={120} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium mb-4">
            <BarChart3 size={14} />
            <span>Control Tower</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Operational Analytics & Bottleneck Detection</h1>
          <p className="text-slate-400 max-w-2xl">
            Real-time insights into warehouse operations, fulfillment pipeline, and automated bottleneck detection.
          </p>
        </div>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Total Orders" value={kpis.totalOrders} subtitle={`${fulfillment.rate.toFixed(1)}% Fulfilled`} icon={<Package />} />
        <KPICard title="In Progress" value={kpis.inProgressOrders} icon={<Activity />} />
        <KPICard title="Blocked/Exception" value={kpis.blockedOrders} color="text-red-400" icon={<AlertCircle />} />
        <KPICard title="Low/Out Stock SKUs" value={kpis.lowStockSKUs + kpis.outOfStockSKUs} color="text-orange-400" icon={<Boxes />} />
        <KPICard title="Open Exceptions" value={kpis.openExceptions} color="text-red-400" icon={<AlertTriangle />} />
        <KPICard title="Ready for Dispatch" value={kpis.readyForDispatch} color="text-green-400" icon={<CheckCircle2 />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Fulfillment Funnel */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <TrendingDown className="text-indigo-400" size={20} />
            <span>Fulfillment Pipeline</span>
          </h2>
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => {
              const maxCount = Math.max(...funnelStages.map(s => s.count), 1);
              const width = `${(stage.count / maxCount) * 100}%`;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-300">{stage.stage}</span>
                    <span className="font-mono text-slate-400">{stage.count}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
            {funnelStages.length === 0 && <p className="text-slate-500 text-sm">No pipeline data available.</p>}
          </div>
        </div>

        {/* Bottleneck Detection Panel */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <ShieldAlert className="text-orange-400" size={20} />
            <span>Bottleneck Detection</span>
          </h2>
          
          {topBottleneck ? (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs text-orange-400 font-bold tracking-wider uppercase mb-1">Top Bottleneck</div>
                  <h3 className="text-lg font-semibold text-white">{topBottleneck.stage}</h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-400">{topBottleneck.score.toFixed(0)}</div>
                  <div className="text-xs text-slate-400">Severity Score</div>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-3">{topBottleneck.reason}</p>
              
              <div className="w-full bg-slate-800 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(topBottleneck.score, 100)}%` }} />
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Affected Orders: <span className="font-mono text-white">{topBottleneck.affectedOrders}</span></span>
                {topBottleneck.recommendedAction && (
                  <span className="text-orange-300 font-medium">{topBottleneck.recommendedAction}</span>
                )}
              </div>
            </div>
          ) : (
             <p className="text-slate-500 text-sm mb-6">No bottlenecks detected.</p>
          )}

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 mb-2">All Detected Bottlenecks</h4>
            {bottlenecks.slice(1).map((bot, idx) => (
              <div key={idx} className="flex items-center space-x-4 bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                <div className="w-32 flex-shrink-0 text-sm font-medium text-slate-300">{bot.stage}</div>
                <div className="flex-grow">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{bot.affectedOrders} orders affected</span>
                    <span className="text-slate-400">Score: {bot.score.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${bot.score > 70 ? 'bg-red-500' : bot.score > 40 ? 'bg-orange-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min(bot.score, 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Risk Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
          <AlertTriangle className="text-yellow-400" size={20} />
          <span>Inventory Risk Analysis</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <caption className="sr-only">Inventory risk analysis showing SKU demand versus availability and shortage impact</caption>
            <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-tl-lg">SKU</th>
                <th scope="col" className="px-4 py-3">Product Name</th>
                <th scope="col" className="px-4 py-3 text-right">Available</th>
                <th scope="col" className="px-4 py-3 text-right">Demand</th>
                <th scope="col" className="px-4 py-3 text-right">Shortage</th>
                <th scope="col" className="px-4 py-3 text-right">Affected Orders</th>
                <th scope="col" className="px-4 py-3 rounded-tr-lg">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRisks.map((risk, idx) => (
                <tr key={idx} className={`border-b border-slate-800/50 hover:bg-slate-800/30 ${risk.sku === 'WM-104' ? 'bg-indigo-500/10' : ''}`}>
                  <td className="px-4 py-3 font-mono text-indigo-300">{risk.sku}</td>
                  <td className="px-4 py-3">{risk.productName}</td>
                  <td className="px-4 py-3 text-right font-mono">{risk.available}</td>
                  <td className="px-4 py-3 text-right font-mono">{risk.totalDemand}</td>
                  <td className="px-4 py-3 text-right font-mono text-red-400">{risk.shortage}</td>
                  <td className="px-4 py-3 text-right font-mono">{risk.affectedOrders.length}</td>
                  <td className="px-4 py-3 text-yellow-300/90">{risk.recommendation}</td>
                </tr>
              ))}
              {inventoryRisks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-4 text-center text-slate-500">No inventory risks detected.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operational Insights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <Zap className="text-cyan-400" size={20} />
            <span>Operational Insights</span>
          </h2>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                <div className="flex-shrink-0 mt-0.5">
                  {insight.severity === 'HIGH' ? <AlertCircle className="text-red-400" size={18} /> : 
                   insight.severity === 'MEDIUM' ? <AlertTriangle className="text-orange-400" size={18} /> : 
                   <Activity className="text-blue-400" size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{insight.message}</p>
                </div>
              </div>
            ))}
            {insights.length === 0 && <p className="text-slate-500 text-sm">No insights generated.</p>}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2 mb-6">
            <CheckCircle2 className="text-emerald-400" size={20} />
            <span>Recommended Actions</span>
          </h2>
          <div className="space-y-4">
            {recommendedActions.map((action, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-800 group hover:border-indigo-500/50 transition-colors">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-mono text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-0.5">{action.title}</h4>
                    <p className="text-xs text-slate-400">{action.impact}</p>
                  </div>
                </div>
                <button 
                  onClick={() => action.route ? navigate(action.route) : null}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  View <ArrowRight size={14} />
                </button>
              </div>
            ))}
            {recommendedActions.length === 0 && <p className="text-slate-500 text-sm">No recommended actions.</p>}
          </div>
        </div>
      </div>

    </div>
  );
};

const KPICard = ({ title, value, subtitle, icon, color = "text-indigo-400" }: { title: string, value: number, subtitle?: string, icon: React.ReactNode, color?: string }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col h-full">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 bg-slate-800 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
    <div className="mt-auto">
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-slate-400 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  </div>
);

export default AnalyticsPage;
