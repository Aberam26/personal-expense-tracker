import React from 'react';
import {
  Wallet,
  Receipt,
  TrendingUp,
  Calculator,
  ArrowRight,
  Plus,
  Crown,
  Sparkles,
} from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import { formatLKR, formatDate, getCategoryStyle } from '../utils/formatCurrency';
import { getRecentExpenses } from '../utils/expenseAnalytics';
import EmptyState from '../components/EmptyState';

export default function Dashboard({
  expenses = [],
  highestExpense = null,
  metrics,
  isLoading = false,
  onOpenAddModal,
  onNavigateToExpenses,
  onEditExpense,
  onDeleteExpense,
}) {
  const recentExpenses = getRecentExpenses(expenses, 5);

  const highestDisplayTitle = highestExpense
    ? highestExpense.title
    : metrics.highestExpense
    ? metrics.highestExpense.title
    : 'No expenses yet';

  const highestDisplayAmount = highestExpense
    ? formatLKR(highestExpense.amount)
    : metrics.highestExpense
    ? formatLKR(metrics.highestExpense.amount)
    : 'LKR 0.00';

  const highestCategory = highestExpense?.category || metrics.highestExpense?.category;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: 'none',
          boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.3)',
        }}
      >
        <div style={{ maxWidth: '600px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            <Sparkles size={13} />
            <span>Financial Overview</span>
          </div>

          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Welcome to ExpenseFlow
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
            Track, monitor, and optimize your personal expenses in Sri Lankan Rupees (LKR) with
            real-time FastAPI analytics.
          </p>
        </div>

        <div>
          <button
            id="dashboard-quick-add-btn"
            onClick={onOpenAddModal}
            className="btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#4338ca',
              fontWeight: '700',
              padding: '0.75rem 1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Record New Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {/* Total Spending */}
        <SummaryCard
          title="Total Spending"
          value={formatLKR(metrics.totalSpending)}
          subtitle="Sum of all recorded expenses"
          icon={Wallet}
          accentColor="#6366f1"
          badgeText="Active"
          badgeType="primary"
          isLoading={isLoading}
        />

        {/* Total Expenses */}
        <SummaryCard
          title="Total Expenses"
          value={metrics.totalCount.toLocaleString()}
          subtitle="Total transactions recorded"
          icon={Receipt}
          accentColor="#3b82f6"
          badgeText="Transactions"
          badgeType="info"
          isLoading={isLoading}
        />

        {/* Highest Expense */}
        <SummaryCard
          title="Highest Expense"
          value={highestDisplayAmount}
          subtitle={
            highestExpense || metrics.highestExpense
              ? `${highestDisplayTitle} (${highestCategory || 'General'})`
              : 'No expenses yet'
          }
          icon={Crown}
          accentColor="#f59e0b"
          badgeText={highestCategory || 'Max'}
          badgeType="warning"
          isLoading={isLoading}
        />

        {/* Average Expense */}
        <SummaryCard
          title="Average Expense"
          value={formatLKR(metrics.averageExpense)}
          subtitle="Average cost per expense item"
          icon={Calculator}
          accentColor="#10b981"
          badgeText="Per Expense"
          badgeType="success"
          isLoading={isLoading}
        />
      </div>

      {/* Two Column Section: Recent Expenses & Top Category Insight */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Recent Expenses Card */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                }}
              >
                Recent Expenses
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Latest transactions stored in database
              </p>
            </div>

            <button
              onClick={onNavigateToExpenses}
              className="btn-ghost"
              style={{
                fontSize: '0.8125rem',
                fontWeight: '600',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {recentExpenses.length === 0 ? (
            <EmptyState
              title="No expenses yet"
              description="Your recent expenses will appear here once added."
              actionText="Add First Expense"
              onAction={onOpenAddModal}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentExpenses.map((exp) => {
                const catStyle = getCategoryStyle(exp.category);
                return (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-light)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: catStyle.bgColor,
                          color: catStyle.textColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                        }}
                      >
                        #{exp.id}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            fontSize: '0.9375rem',
                          }}
                        >
                          {exp.title}
                        </div>
                        <span
                          className="category-badge"
                          style={{
                            backgroundColor: catStyle.bgColor,
                            color: catStyle.textColor,
                            borderColor: catStyle.borderColor,
                            padding: '0.125rem 0.5rem',
                            fontSize: '0.6875rem',
                            marginTop: '0.25rem',
                          }}
                        >
                          {exp.category}
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontWeight: '700',
                          color: 'var(--text-primary)',
                          fontSize: '0.9375rem',
                        }}
                      >
                        {formatLKR(exp.amount)}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {formatDate(exp.created_at)}
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {/* Highest Spending & Top Category Insight Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                  }}
                >
                  Spending Highlights
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Smart breakdown calculated from API data
                </p>
              </div>

              <div
                style={{
                  padding: '0.375rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                }}
              >
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Top Category Card */}
            {metrics.topCategory ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.375rem',
                  }}
                >
                  Highest Spending Category
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {metrics.topCategory.category}
                  </span>
                  <span
                    style={{
                      fontSize: '1.125rem',
                      fontWeight: '700',
                      color: 'var(--primary)',
                    }}
                  >
                    {formatLKR(metrics.topCategory.total)}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--border-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(100, metrics.topCategory.percentage)}%`,
                      height: '100%',
                      backgroundColor: 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.375rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>Share of total spending</span>
                  <span>{metrics.topCategory.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}
              >
                Add expenses to see top category analytics
              </div>
            )}

            {/* Quick API status reminder */}
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                }}
              />
              <div style={{ fontSize: '0.8125rem', color: 'var(--primary-active)' }}>
                <strong>Currency Standard:</strong> All figures presented in Sri Lankan Rupees (LKR)
                synchronized with PostgreSQL via FastAPI.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
