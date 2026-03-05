export const generateSampleData = () => {
  const data = [];
  const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Cancelled', 'Returned'];
  const products = ['Laptop Pro', 'Wireless Mouse', 'Mechanical Keyboard', '4K Monitor', 'USB-C Hub'];
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'WA'];
  const damageStatuses = ['None', 'None', 'None', 'None', 'None', 'Damaged', 'Lost in Transport'];

  const startDate = new Date('2023-01-01');
  
  for (let i = 0; i < 500; i++) {
    const date = new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);
    const product = products[Math.floor(Math.random() * products.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const damageStatus = status === 'Returned' || status === 'Cancelled' 
      ? damageStatuses[Math.floor(Math.random() * damageStatuses.length)]
      : 'None';
      
    const units = Math.floor(Math.random() * 5) + 1;
    const price = product === 'Laptop Pro' ? 1200 : product === '4K Monitor' ? 400 : product === 'Mechanical Keyboard' ? 150 : product === 'USB-C Hub' ? 50 : 30;
    const revenue = units * price;
    const profit = revenue * (Math.random() * 0.3 + 0.1); // 10% to 40% margin
    
    data.push({
      Date: date.toISOString().split('T')[0],
      Product: product,
      SKU: `SKU-${product.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      State: state,
      Status: status,
      Damage_Status: damageStatus,
      Units: units,
      Revenue: revenue,
      Profit: profit,
    });
  }
  
  // Sort by date
  return data.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
};
