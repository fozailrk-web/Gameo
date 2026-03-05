import React, { useState } from 'react';
import { ChartViewType, DashboardState } from '../types';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ComposedChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PackageX, AlertTriangle, TrendingDown, RefreshCcw } from 'lucide-react';

interface CenterCanvasProps {
  dashboardData: DashboardState | null;
  showStory?: boolean;
}

const mockWeekData = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 1200 },
];

const mockMonthData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 6000 },
  { name: 'Apr', value: 8000 },
  { name: 'May', value: 5000 },
  { name: 'Jun', value: 9000 },
  { name: 'Jul', value: 11000 },
  { name: 'Aug', value: 10000 },
  { name: 'Sep', value: 8500 },
  { name: 'Oct', value: 7000 },
  { name: 'Nov', value: 12000 },
  { name: 'Dec', value: 15000 },
];

const mockTopProducts = [
  { name: 'Wireless Earbuds Pro', revenue: 120000, profit: 45000 },
  { name: 'Smart Watch Series 5', revenue: 95000, profit: 30000 },
  { name: 'Ergonomic Chair', revenue: 80000, profit: 20000 },
  { name: 'Mechanical Keyboard', revenue: 60000, profit: 15000 },
  { name: '4K Monitor', revenue: 55000, profit: 10000 },
];

const mockStateData = [
  { name: 'California', value: 450000 },
  { name: 'New York', value: 320000 },
  { name: 'Texas', value: 280000 },
  { name: 'Florida', value: 210000 },
  { name: 'Illinois', value: 150000 },
  { name: 'Washington', value: 120000 },
];

const mockSkuData = [
  { name: 'SKU-101', revenue: 4000, units: 240 },
  { name: 'SKU-102', revenue: 3000, units: 139 },
  { name: 'SKU-103', revenue: 2000, units: 980 },
  { name: 'SKU-104', revenue: 2780, units: 390 },
  { name: 'SKU-105', revenue: 1890, units: 480 },
  { name: 'SKU-106', revenue: 2390, units: 380 },
  { name: 'SKU-107', revenue: 3490, units: 430 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const CenterCanvas = ({ dashboardData, showStory = false }: CenterCanvasProps) => {
  const [selectedView, setSelectedView] = useState<ChartViewType>('week');

  if (!dashboardData) return null;

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        
        {/* KPI Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard title="Total Revenue" value={dashboardData.kpis.totalRevenue} />
          <KpiCard title="Profit" value={dashboardData.kpis.profit} />
          <KpiCard title="Units Sold" value={dashboardData.kpis.unitsSold} />
          <KpiCard title="Cancelled" value={dashboardData.kpis.cancelledOrders} />
          <KpiCard title="Returned" value={dashboardData.kpis.returnedOrders} />
          <KpiCard title="AOV" value={dashboardData.kpis.aov} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Visualization */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white">Revenue Analysis</h3>
              <select 
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value as ChartViewType)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="week">Week-wise Revenue</option>
                <option value="month">Month-wise Revenue</option>
                <option value="top5">Top 5 Products</option>
                <option value="state">State-wise Revenue</option>
                <option value="sku">SKU Performance</option>
              </select>
            </div>
            <div className="flex-1">
              {selectedView === 'week' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockWeekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWeek" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#f8fafc' }} 
                      cursor={{fill: '#ffffff05'}}
                    />
                    <Bar dataKey="value" fill="url(#colorWeek)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {selectedView === 'month' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockMonthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              {selectedView === 'top5' && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockTopProducts} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} cursor={{fill: '#ffffff05'}} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Revenue" />
                    <Bar dataKey="profit" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Profit" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
              {selectedView === 'state' && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockStateData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {mockStateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {selectedView === 'sku' && (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockSkuData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
                    <Line yAxisId="right" type="monotone" dataKey="units" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Units Sold" />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Data Insights Engine */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Data Insights
            </h3>
            <div className="space-y-4 flex-1">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Highest Revenue Day</div>
                <div className="text-lg text-emerald-400 font-semibold">{dashboardData.insights.highestRevenueDay}</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs text-slate-400 uppercase font-bold mb-2">Top Products</div>
                <ul className="space-y-1">
                  {dashboardData.insights.topProducts.map((p, i) => (
                    <li key={i} className="text-sm text-slate-200 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                <div className="text-xs text-red-400 uppercase font-bold mb-2">Anomalies Detected</div>
                <ul className="space-y-1 list-disc pl-4">
                  {dashboardData.insights.anomalies.map((a, i) => (
                    <li key={i} className="text-sm text-slate-300">{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Logistics Failure Analysis */}
          <div className={`bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl ${!showStory ? 'lg:col-span-3' : ''}`}>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PackageX className="w-5 h-5 text-rose-400" />
              Logistics Failures
            </h3>
            <div className={`grid gap-4 ${!showStory ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <PackageX className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{dashboardData.logistics.damagedCount}</div>
                <div className="text-xs text-slate-400 mt-1">Damaged Products</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <TrendingDown className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{dashboardData.logistics.lostInTransport}</div>
                <div className="text-xs text-slate-400 mt-1">Lost in Transport</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{dashboardData.logistics.cancellationRate}</div>
                <div className="text-xs text-slate-400 mt-1">Cancellation Rate</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-center">
                <RefreshCcw className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{dashboardData.logistics.returnRate}</div>
                <div className="text-xs text-slate-400 mt-1">Return Rate</div>
              </div>
            </div>
          </div>

          {/* Story Generator Output */}
          {showStory && (
            <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4">Cinematic Story Script</h3>
              <div className="flex-1 bg-slate-950 rounded-xl border border-white/5 p-4 overflow-y-auto">
                <p className="text-slate-300 leading-relaxed font-serif text-lg italic">
                  "{dashboardData.story}"
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const KpiCard = ({ title, value }: { title: string, value: string | number }) => (
  <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-lg flex flex-col justify-center">
    <div className="text-xs text-slate-400 mb-1 font-medium">{title}</div>
    <div className="text-xl font-extrabold text-white tracking-tight">{value}</div>
  </div>
);
