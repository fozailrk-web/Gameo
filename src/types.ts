export type ChartViewType = 'week' | 'month' | 'top5' | 'state' | 'sku';

export interface KPIData {
  totalRevenue: string;
  profit: string;
  unitsSold: string;
  cancelledOrders: string;
  returnedOrders: string;
  aov: string;
}

export interface InsightsData {
  highestRevenueDay: string;
  topProducts: string[];
  anomalies: string[];
}

export interface LogisticsData {
  damagedCount: number;
  lostInTransport: number;
  cancellationRate: string;
  returnRate: string;
}

export interface DashboardState {
  kpis: KPIData;
  insights: InsightsData;
  logistics: LogisticsData;
  story: string;
}
