import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import { DollarSign, TrendingUp, Package, XCircle, RefreshCcw, ShoppingCart, AlertTriangle, Truck } from 'lucide-react';

interface DashboardProps {
  kpis: any;
  chartData: any;
  logistics: any;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

export const Dashboard: React.FC<DashboardProps> = ({ kpis, chartData, logistics }) => {
  const [selectedChart, setSelectedChart] = useState<string>('week');

  if (!kpis || !chartData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 flex-col gap-4 p-8">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-2">
          <Package className="w-12 h-12 text-blue-200" />
        </div>
        <p className="text-lg font-medium text-slate-500">Open the menu to upload a dataset or load sample data.</p>
      </div>
    );
  }

  const tooltipStyle = { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  const renderChart = () => {
    switch (selectedChart) {
      case 'week':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.weekWiseRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'month':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData.monthWiseRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} dot={{r: 4, fill: '#ec4899', strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'products':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.topProducts} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
              <YAxis dataKey="product" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Profit']}
              />
              <Bar dataKey="profit" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30}>
                {chartData.topProducts.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'state':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData.stateWiseRevenue} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="state" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" fill="#10b981" stroke="#10b981" fillOpacity={0.1} />
              <Bar dataKey="revenue" barSize={20} fill="#10b981" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">KPI Dashboard</h1>
          <p className="text-slate-500 font-medium">Real-time metrics and visualizations derived from your dataset.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <KpiCard title="Total Revenue" value={`$${(kpis.totalRevenue / 1000).toFixed(1)}k`} icon={<DollarSign className="w-5 h-5 text-blue-600" />} bg="bg-blue-50" />
          <KpiCard title="Profit" value={`$${(kpis.totalProfit / 1000).toFixed(1)}k`} icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} bg="bg-emerald-50" />
          <KpiCard title="Units Sold" value={kpis.totalUnits.toLocaleString()} icon={<Package className="w-5 h-5 text-indigo-600" />} bg="bg-indigo-50" />
          <KpiCard title="Cancelled Orders" value={kpis.cancelledOrders.toLocaleString()} icon={<XCircle className="w-5 h-5 text-red-600" />} bg="bg-red-50" />
          <KpiCard title="Returned Orders" value={kpis.returnedOrders.toLocaleString()} icon={<RefreshCcw className="w-5 h-5 text-orange-600" />} bg="bg-orange-50" />
          <KpiCard title="Avg Order Value" value={`$${kpis.aov.toFixed(2)}`} icon={<ShoppingCart className="w-5 h-5 text-purple-600" />} bg="bg-purple-50" />
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-800">Interactive Visualizations</h2>
              <div className="relative min-w-[180px]">
                <select 
                  value={selectedChart} 
                  onChange={(e) => setSelectedChart(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer pl-10 shadow-sm"
                >
                  <option value="week">View: Revenue by Day</option>
                  <option value="month">View: Monthly Trend</option>
                  <option value="products">View: Top Products</option>
                  <option value="state">View: Regional Sales</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none border-r border-slate-200 mr-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="h-[400px] w-full">
              {renderChart()}
            </div>
          </div>

          {/* Logistics Failure Analysis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Logistics Failure Analysis
            </h2>
            
            <div className="space-y-6 flex-1">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Package className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Damaged Products</p>
                    <p className="text-xl font-bold text-slate-900">{logistics.damagedProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Truck className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Lost in Transport</p>
                    <p className="text-xl font-bold text-slate-900">{logistics.lostInTransport}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Cancellation Rate</p>
                  <p className="text-2xl font-semibold text-slate-700">{logistics.cancellationRate.toFixed(1)}<span className="text-sm text-slate-400 ml-1">%</span></p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Return Rate</p>
                  <p className="text-2xl font-semibold text-slate-700">{logistics.returnRate.toFixed(1)}<span className="text-sm text-slate-400 ml-1">%</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, icon, bg }: { title: string, value: string | number, icon: React.ReactNode, bg: string }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-500">{title}</h3>
      <div className={`p-2 rounded-lg ${bg}`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</p>
  </div>
);

