import React from 'react';
import { ReceiptText, Plus, SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No expenses found',
  description = 'You have not added any expenses yet or no records match your criteria.',
  actionText = 'Add Expense',
  onAction,
  isSearch = false,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-subtle)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        {isSearch ? <SearchX size={26} /> : <ReceiptText size={26} />}
      </div>

      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '0.375rem',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          marginBottom: onAction ? '1.5rem' : '0',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
          style={{
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Plus size={16} />
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
