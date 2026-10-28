/**
 * Format a number into Sri Lankan Rupees (LKR) standard format.
 * Example: 1500 -> "LKR 1,500.00"
 */
export function formatLKR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'LKR 0.00';
  }
  const numericAmount = Number(amount);
  return `LKR ${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format compact LKR for small badges or chart labels
 * Example: 150000 -> "LKR 150k"
 */
export function formatCompactLKR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'LKR 0';
  }
  const numericAmount = Number(amount);
  if (numericAmount >= 1_000_000) {
    return `LKR ${(numericAmount / 1_000_000).toFixed(1)}M`;
  }
  if (numericAmount >= 1_000) {
    return `LKR ${(numericAmount / 1_000).toFixed(1)}k`;
  }
  return `LKR ${numericAmount.toFixed(0)}`;
}

/**
 * Format ISO date string into readable format: "Oct 28, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Format ISO date with time: "Oct 28, 2026, 12:07 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Predefined category colors and metadata for visual harmony
 */
export const CATEGORY_CONFIG = {
  Food: {
    color: '#f59e0b',
    bgColor: '#fef3c7',
    textColor: '#92400e',
    borderColor: '#fde68a',
    icon: 'Utensils',
  },
  Transportation: {
    color: '#3b82f6',
    bgColor: '#dbeafe',
    textColor: '#1e40af',
    borderColor: '#bfdbfe',
    icon: 'Car',
  },
  Transport: {
    color: '#3b82f6',
    bgColor: '#dbeafe',
    textColor: '#1e40af',
    borderColor: '#bfdbfe',
    icon: 'Car',
  },
  Housing: {
    color: '#6366f1',
    bgColor: '#e0e7ff',
    textColor: '#3730a3',
    borderColor: '#c7d2fe',
    icon: 'Home',
  },
  Utilities: {
    color: '#10b981',
    bgColor: '#d1fae5',
    textColor: '#065f46',
    borderColor: '#a7f3d0',
    icon: 'Zap',
  },
  Entertainment: {
    color: '#8b5cf6',
    bgColor: '#ede9fe',
    textColor: '#5b21b6',
    borderColor: '#ddd6fe',
    icon: 'Film',
  },
  Healthcare: {
    color: '#ec4899',
    bgColor: '#fce7f3',
    textColor: '#9d174d',
    borderColor: '#fbcfe8',
    icon: 'HeartPulse',
  },
  Shopping: {
    color: '#06b6d4',
    bgColor: '#cffafe',
    textColor: '#155e75',
    borderColor: '#a5f3fc',
    icon: 'ShoppingBag',
  },
  Education: {
    color: '#14b8a6',
    bgColor: '#ccfbf1',
    textColor: '#115e59',
    borderColor: '#99f6e4',
    icon: 'GraduationCap',
  },
  Personal: {
    color: '#f43f5e',
    bgColor: '#ffe4e6',
    textColor: '#9f1239',
    borderColor: '#fecdd3',
    icon: 'User',
  },
  Travel: {
    color: '#eab308',
    bgColor: '#fef9c3',
    textColor: '#854d0e',
    borderColor: '#fef08a',
    icon: 'Plane',
  },
  Other: {
    color: '#64748b',
    bgColor: '#f1f5f9',
    textColor: '#334155',
    borderColor: '#e2e8f0',
    icon: 'Tag',
  },
};

export const DEFAULT_CATEGORY_LIST = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Personal',
  'Other',
];

export function getCategoryStyle(categoryName) {
  if (!categoryName) return CATEGORY_CONFIG.Other;
  const match = Object.keys(CATEGORY_CONFIG).find(
    (key) => key.toLowerCase() === categoryName.trim().toLowerCase()
  );
  return match ? CATEGORY_CONFIG[match] : CATEGORY_CONFIG.Other;
}
