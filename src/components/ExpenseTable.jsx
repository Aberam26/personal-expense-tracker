import React, { useState, useMemo } from 'react';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Calendar,
} from 'lucide-react';
import { formatLKR, formatDate, getCategoryStyle, DEFAULT_CATEGORY_LIST } from '../utils/formatCurrency';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export default function ExpenseTable({
  expenses = [],
  isLoading = false,
  onEditExpense,
  onDeleteExpense,
  onOpenAddModal,
  searchQuery = '',
  setSearchQuery,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'this-month', 'last-7-days'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'id-desc', 'id-asc', 'amount-desc', 'amount-asc', 'title-asc'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & sort expenses
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...expenses];

    // Search filter (title or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (exp) =>
          exp.title?.toLowerCase().includes(q) ||
          exp.category?.toLowerCase().includes(q) ||
          String(exp.id).includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (exp) => exp.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Date range filter
    if (dateFilter !== 'all') {
      const now = new Date();
      result = result.filter((exp) => {
        if (!exp.created_at) return true;
        const d = new Date(exp.created_at);
        if (isNaN(d.getTime())) return true;

        if (dateFilter === 'this-month') {
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }
        if (dateFilter === 'last-7-days') {
          const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
          return diffDays >= 0 && diffDays <= 7;
        }
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
      if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'id-asc') return Number(a.id) - Number(b.id);
      if (sortBy === 'id-desc') return Number(b.id) - Number(a.id);
      if (sortBy === 'date-asc') {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeA - timeB;
      }
      // default: 'date-desc'
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [expenses, searchQuery, selectedCategory, dateFilter, sortBy]);


  // Pagination calculation
  const totalItems = filteredAndSortedExpenses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedExpenses = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return filteredAndSortedExpenses.slice(start, start + itemsPerPage);
  }, [filteredAndSortedExpenses, validCurrentPage, itemsPerPage]);

  if (isLoading) {
    return <LoadingState message="Loading expenses from backend..." />;
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="No expenses recorded yet"
        description="Start tracking your expenses by adding your first record using the button below."
        actionText="Add First Expense"
        onAction={onOpenAddModal}
      />
    );
  }

  return (
    <div className="card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
      {/* Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.25rem',
        }}
      >
        {/* Search & Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              placeholder="Search title, category, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                paddingLeft: '2.2rem',
                fontSize: '0.875rem',
                height: '36px',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: '36px',
                fontSize: '0.875rem',
                paddingRight: '2rem',
              }}
            >
              <option value="All">All Categories</option>
              {DEFAULT_CATEGORY_LIST.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Preset Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                height: '36px',
                fontSize: '0.875rem',
              }}
            >
              <option value="all">All Dates</option>
              <option value="this-month">This Month</option>
              <option value="last-7-days">Last 7 Days</option>
            </select>
          </div>
        </div>

        {/* Sort Dropdown & Record Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: '36px',
                fontSize: '0.875rem',
              }}
            >
              <option value="date-desc">Date: Newest First</option>
              <option value="date-asc">Date: Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
            </select>
          </div>

          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {totalItems} {totalItems === 1 ? 'record' : 'records'}
          </span>
        </div>
      </div>

      {/* Table Container */}
      {filteredAndSortedExpenses.length === 0 ? (
        <EmptyState
          isSearch
          title="No matching expenses"
          description="Try adjusting your search query, date filter, or category filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setDateFilter('all');
          }}
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
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
                <th style={{ padding: '0.75rem 1rem', width: '80px' }}>ID</th>
                <th style={{ padding: '0.75rem 1rem', width: '130px' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                <th style={{ padding: '0.75rem 1rem', width: '150px' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', width: '150px' }}>Amount</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map((expense) => {
                const catStyle = getCategoryStyle(expense.category);
                return (
                  <tr
                    key={expense.id}
                    className="table-row-hover"
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {/* Expense ID */}
                    <td
                      style={{
                        padding: '1rem',
                        fontWeight: '700',
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      #{expense.id}
                    </td>

                    {/* Date */}
                    <td
                      style={{
                        padding: '1rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8125rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatDate(expense.created_at)}
                    </td>

                    {/* Title */}
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          fontWeight: '600',
                          color: 'var(--text-primary)',
                          display: 'block',
                        }}
                      >
                        {expense.title}
                      </span>
                    </td>


                    {/* Category Badge */}
                    <td style={{ padding: '1rem' }}>
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
                        {expense.category || 'Other'}
                      </span>
                    </td>

                    {/* Amount formatted as LKR */}
                    <td
                      style={{
                        padding: '1rem',
                        textAlign: 'right',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: '0.9375rem',
                      }}
                    >
                      {formatLKR(expense.amount)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                        }}
                      >
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="btn-ghost"
                          title="Edit expense"
                          style={{
                            padding: '0.375rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => onDeleteExpense(expense)}
                          className="btn-ghost"
                          title="Delete expense"
                          style={{
                            padding: '0.375rem',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--danger)',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            marginTop: '0.75rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>
            Page <strong>{validCurrentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validCurrentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.375rem 0.625rem' }}
            >
              <ChevronLeft size={15} />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validCurrentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.375rem 0.625rem' }}
            >
              <span>Next</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .table-row-hover:hover {
          background-color: var(--bg-surface-hover) !important;
        }
      `}</style>
    </div>
  );
}
