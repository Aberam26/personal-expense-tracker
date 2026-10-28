import React from 'react';
import { Plus } from 'lucide-react';
import ExpenseTable from '../components/ExpenseTable';
import { formatLKR } from '../utils/formatCurrency';

export default function Expenses({
  expenses = [],
  isLoading = false,
  onOpenAddModal,
  onEditExpense,
  onDeleteExpense,
  searchQuery,
  setSearchQuery,
  totalSpending,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            All Expenses
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Manage, filter, search, edit, and delete your expense records
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Quick Summary Pill */}
          <div
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}
          >
            Total: <strong>{formatLKR(totalSpending)}</strong> ({expenses.length} records)
          </div>

          <button
            id="expenses-add-btn"
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Table Component */}
      <ExpenseTable
        expenses={expenses}
        isLoading={isLoading}
        onEditExpense={onEditExpense}
        onDeleteExpense={onDeleteExpense}
        onOpenAddModal={onOpenAddModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
