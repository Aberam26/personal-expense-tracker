import { CATEGORY_CONFIG } from './formatCurrency';

/**
 * Computes high-level metrics from an array of expenses
 * @param {Array<{id: number, title: string, amount: number, category: string}>} expenses
 */
export function calculateDashboardMetrics(expenses = []) {
  if (!expenses || expenses.length === 0) {
    return {
      totalSpending: 0,
      totalCount: 0,
      averageExpense: 0,
      highestExpense: null,
      topCategory: null,
    };
  }

  let totalSpending = 0;
  let highest = expenses[0];

  expenses.forEach((item) => {
    const amt = Number(item.amount) || 0;
    totalSpending += amt;
    if (amt > (Number(highest?.amount) || 0)) {
      highest = item;
    }
  });

  const totalCount = expenses.length;
  const averageExpense = totalCount > 0 ? totalSpending / totalCount : 0;

  // Compute category breakdown to find top category
  const categoryMap = {};
  expenses.forEach((item) => {
    const cat = item.category || 'Other';
    const amt = Number(item.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + amt;
  });

  let topCategory = null;
  let maxCatAmount = -1;
  Object.entries(categoryMap).forEach(([category, total]) => {
    if (total > maxCatAmount) {
      maxCatAmount = total;
      topCategory = {
        category,
        total,
        percentage: totalSpending > 0 ? (total / totalSpending) * 100 : 0,
      };
    }
  });

  return {
    totalSpending,
    totalCount,
    averageExpense,
    highestExpense: highest,
    topCategory,
  };
}

/**
 * Transforms expenses into data formatted for Recharts Donut/Pie chart
 */
export function getCategoryBreakdown(expenses = []) {
  if (!expenses || expenses.length === 0) return [];

  const categoryMap = {};
  let totalSpending = 0;

  expenses.forEach((item) => {
    const cat = item.category ? item.category.trim() : 'Other';
    const amt = Number(item.amount) || 0;
    totalSpending += amt;
    if (!categoryMap[cat]) {
      categoryMap[cat] = { total: 0, count: 0 };
    }
    categoryMap[cat].total += amt;
    categoryMap[cat].count += 1;
  });

  const categoryPalette = [
    '#6366f1', // Indigo
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#14b8a6', // Teal
    '#64748b', // Slate
  ];

  return Object.entries(categoryMap)
    .map(([name, data], index) => {
      const predefined = CATEGORY_CONFIG[name]?.color;
      return {
        name,
        value: Number(data.total.toFixed(2)),
        count: data.count,
        percentage: totalSpending > 0 ? Number(((data.total / totalSpending) * 100).toFixed(1)) : 0,
        color: predefined || categoryPalette[index % categoryPalette.length],
      };
    })
    .sort((a, b) => b.value - a.value);
}

/**
 * Returns expenses sorted by ID descending (newest first)
 */
export function getRecentExpenses(expenses = [], limit = 5) {
  if (!expenses || expenses.length === 0) return [];
  return [...expenses]
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .slice(0, limit);
}
