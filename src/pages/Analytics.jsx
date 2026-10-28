import React, { useMemo } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Award,
  Layers,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { formatLKR, formatCompactLKR, getCategoryStyle } from '../utils/formatCurrency';
import { getCategoryBreakdown } from '../utils/expenseAnalytics';
import EmptyState from '../components/EmptyState';

export default function Analytics({ expenses = [], onOpenAddModal }) {
  const categoryData = useMemo(() => getCategoryBreakdown(expenses), [expenses]);

  const topCategory = categoryData[0] || null;

  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // Bar chart data: sorted by spending total
  const barChartData = useMemo(() => {
    return categoryData.map((cat) => ({
      name: cat.name,
      amount: cat.value,
      count: cat.count,
    }));
  }, [categoryData]);

  // Timeline data: grouped by date
  const timelineData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const dateMap = {};
    expenses.forEach((item) => {
      const dateStr = item.created_at ? item.created_at.split('T')[0] : 'Unknown';
      dateMap[dateStr] = (dateMap[dateStr] || 0) + (Number(item.amount) || 0);
    });
    return Object.entries(dateMap)
      .map(([date, amount]) => {
        let label = date;
        try {
          const d = new Date(date);
          if (!isNaN(d.getTime())) {
            label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }
        } catch {}
        return {
          rawDate: date,
          date: label,
          amount: Number(amount.toFixed(2)),
        };
      })
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [expenses]);


  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.8125rem',
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontWeight: '700', marginBottom: '0.25rem', color: '#f8fafc' }}>
            {data.name}
          </div>
          <div style={{ color: '#818cf8', fontWeight: '600' }}>
            Total: {formatLKR(data.value || data.amount)}
          </div>
          {data.percentage !== undefined && (
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.125rem' }}>
              Share: {data.percentage}% ({data.count} {data.count === 1 ? 'item' : 'items'})
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Spending Analytics
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Visual breakdown of your personal expenses and category distributions
          </p>
        </div>

        <EmptyState
          title="No analytics data available"
          description="Analytics and interactive charts will automatically render once you record expenses."
          actionText="Add First Expense"
          onAction={onOpenAddModal}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Spending Analytics & Insights
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Detailed visual breakdown calculated directly from your FastAPI expense database
        </p>
      </div>

      {/* Top Insights Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Top Category Card */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Top Spending Category
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
              }}
            >
              {topCategory?.name || 'N/A'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
              {formatLKR(topCategory?.value)} ({topCategory?.percentage}% of total)
            </div>
          </div>
        </div>

        {/* Distinct Categories */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Active Categories
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
              }}
            >
              {categoryData.length} Categories
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Across {expenses.length} recorded items
            </div>
          </div>
        </div>

        {/* Average per Category */}
        <div
          className="card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Avg Spending / Category
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
              }}
            >
              {categoryData.length > 0
                ? formatLKR(totalSpending / categoryData.length)
                : 'LKR 0.00'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Balanced distribution index
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Category Breakdown Donut Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                padding: '0.375rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
              }}
            >
              <PieIcon size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Category Spending Breakdown
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Percentage distribution across spending categories
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val, entry) => (
                    <span
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                      }}
                    >
                      {val}
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending Bar Chart */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                padding: '0.375rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--info-light)',
                color: 'var(--info)',
              }}
            >
              <BarChart3 size={18} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Spending by Category (LKR)
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Total amount spent per category
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickFormatter={(val) => formatCompactLKR(val)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => {
                    const catStyle = getCategoryStyle(entry.name);
                    return <Cell key={`bar-${index}`} fill={catStyle.color || '#6366f1'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spending Over Time Timeline Chart */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.375rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success)',
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '1.0625rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}
            >
              Spending Timeline & Daily Trends
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Historical spending trends powered by backend transaction timestamps
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={timelineData}
              margin={{ top: 15, right: 20, left: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tickFormatter={(val) => formatCompactLKR(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#spendingGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>

        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.375rem',
          }}
        >
          Detailed Category Summary
        </h3>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}
        >
          Aggregated totals, proportions, and transaction frequencies
        </p>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Transactions</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total (LKR)</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Share of Budget</th>
            </tr>
          </thead>
          <tbody>
            {categoryData.map((item) => {
              const catStyle = getCategoryStyle(item.name);
              return (
                <tr
                  key={item.name}
                  style={{
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span
                      className="category-badge"
                      style={{
                        backgroundColor: catStyle.bgColor,
                        color: catStyle.textColor,
                        borderColor: catStyle.borderColor,
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: catStyle.color,
                        }}
                      />
                      {item.name}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    {item.count} {item.count === 1 ? 'record' : 'records'}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'right',
                      fontWeight: '700',
                      color: 'var(--text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatLKR(item.value)}
                  </td>
                  <td
                    style={{
                      padding: '0.875rem 1rem',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          width: '60px',
                          height: '6px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--border-subtle)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${item.percentage}%`,
                            height: '100%',
                            backgroundColor: catStyle.color || 'var(--primary)',
                          }}
                        />
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                        {item.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
