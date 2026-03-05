import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const calculateKPIs = (data: any[]) => {
  if (!data || data.length === 0) return null;

  const totalRevenue = data.reduce((sum, row) => sum + (Number(row.Revenue) || 0), 0);
  const totalProfit = data.reduce((sum, row) => sum + (Number(row.Profit) || 0), 0);
  const totalUnits = data.reduce((sum, row) => sum + (Number(row.Units) || 0), 0);
  
  const cancelledOrders = data.filter(row => row.Status === 'Cancelled').length;
  const returnedOrders = data.filter(row => row.Status === 'Returned').length;
  
  const completedOrders = data.filter(row => row.Status === 'Completed').length;
  const aov = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  return {
    totalRevenue,
    totalProfit,
    totalUnits,
    cancelledOrders,
    returnedOrders,
    aov
  };
};

export const calculateLogisticsFailures = (data: any[]) => {
  if (!data || data.length === 0) return null;

  const damagedProducts = data.filter(row => row.Damage_Status === 'Damaged').length;
  const lostInTransport = data.filter(row => row.Damage_Status === 'Lost in Transport').length;
  
  const totalOrders = data.length;
  const cancelledOrders = data.filter(row => row.Status === 'Cancelled').length;
  const returnedOrders = data.filter(row => row.Status === 'Returned').length;

  const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;
  const returnRate = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;

  return {
    damagedProducts,
    lostInTransport,
    cancellationRate,
    returnRate
  };
};

export const getChartData = (data: any[]) => {
  if (!data || data.length === 0) return null;

  // Month-wise Revenue
  const monthMap = new Map();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  data.forEach(row => {
    if (!row.Date) return;
    const date = new Date(row.Date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = monthNames[date.getMonth()];
    
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, { name: monthName, revenue: 0, sortKey: monthKey });
    }
    monthMap.get(monthKey).revenue += (Number(row.Revenue) || 0);
  });
  
  const monthWiseRevenue = Array.from(monthMap.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(item => ({ month: item.name, revenue: item.revenue }));

  // Day-of-Week Revenue
  const dayMap = new Map();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  data.forEach(row => {
    if (!row.Date) return;
    const date = new Date(row.Date);
    const dayIndex = date.getDay();
    dayMap.set(dayIndex, (dayMap.get(dayIndex) || 0) + (Number(row.Revenue) || 0));
  });
  
  const weekWiseRevenue = dayNames.map((name, index) => ({
    week: name,
    revenue: dayMap.get(index) || 0
  }));

  // Top 5 Products by Profit
  const productMap = new Map();
  data.forEach(row => {
    if (!row.Product) return;
    productMap.set(row.Product, (productMap.get(row.Product) || 0) + (Number(row.Profit) || 0));
  });
  const topProducts = Array.from(productMap.entries())
    .map(([product, profit]) => ({ product, profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  // State-wise Revenue
  const stateMap = new Map();
  data.forEach(row => {
    if (!row.State) return;
    stateMap.set(row.State, (stateMap.get(row.State) || 0) + (Number(row.Revenue) || 0));
  });
  const stateWiseRevenue = Array.from(stateMap.entries())
    .map(([state, revenue]) => ({ state, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    monthWiseRevenue,
    weekWiseRevenue,
    topProducts,
    stateWiseRevenue
  };
};

export const generateDataSummary = (data: any[], kpis: any, logistics: any) => {
  if (!data || data.length === 0) return "No data available.";
  
  return `
    Dataset Summary:
    - Total Rows: ${data.length}
    - Total Revenue: $${kpis.totalRevenue.toFixed(2)}
    - Total Profit: $${kpis.totalProfit.toFixed(2)}
    - Total Units Sold: ${kpis.totalUnits}
    - Cancelled Orders: ${kpis.cancelledOrders}
    - Returned Orders: ${kpis.returnedOrders}
    - Average Order Value (AOV): $${kpis.aov.toFixed(2)}
    
    Logistics Issues:
    - Damaged Products: ${logistics.damagedProducts}
    - Lost in Transport: ${logistics.lostInTransport}
    - Cancellation Rate: ${logistics.cancellationRate.toFixed(2)}%
    - Return Rate: ${logistics.returnRate.toFixed(2)}%
  `;
};
