import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Tag, FileText, AlertCircle, Calendar } from 'lucide-react';
import { DEFAULT_CATEGORY_LIST } from '../utils/formatCurrency';

export default function ExpenseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEditing = Boolean(initialData && initialData.id);

  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [expenseDate, setExpenseDate] = useState(getTodayDateString());
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setAmount(initialData.amount !== undefined ? String(initialData.amount) : '');
      const cat = initialData.category || 'Food';
      if (DEFAULT_CATEGORY_LIST.includes(cat)) {
        setCategory(cat);
        setIsCustomCategory(false);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setIsCustomCategory(true);
        setCustomCategory(cat);
      }

      if (initialData.created_at) {
        try {
          const d = new Date(initialData.created_at);
          if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            setExpenseDate(`${year}-${month}-${day}`);
          } else {
            setExpenseDate(getTodayDateString());
          }
        } catch {
          setExpenseDate(getTodayDateString());
        }
      } else {
        setExpenseDate(getTodayDateString());
      }
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setCustomCategory('');
      setIsCustomCategory(false);
      setExpenseDate(getTodayDateString());
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    if (val === 'Custom') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
      setCustomCategory('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be 100 characters or fewer';
    }

    const numAmount = parseFloat(amount);
    if (amount === '' || isNaN(numAmount)) {
      newErrors.amount = 'Amount is required and must be a number';
    } else if (numAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    const effectiveCategory = isCustomCategory ? customCategory.trim() : category.trim();
    if (!effectiveCategory) {
      newErrors.category = 'Category is required';
    } else if (effectiveCategory.length > 50) {
      newErrors.category = 'Category must be 50 characters or fewer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const effectiveCategory = isCustomCategory ? customCategory.trim() : category.trim();

    // Construct ISO string for created_at with current time if user selected today, or at noon UTC
    let createdAtPayload = null;
    if (expenseDate) {
      try {
        const parts = expenseDate.split('-');
        if (parts.length === 3) {
          const now = new Date();
          const d = new Date(
            parseInt(parts[0], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[2], 10),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds()
          );
          createdAtPayload = d.toISOString();
        }
      } catch {
        createdAtPayload = new Date().toISOString();
      }
    }

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: effectiveCategory,
    };

    if (createdAtPayload) {
      payload.created_at = createdAtPayload;
    }

    onSubmit(payload);
  };


  return (
    <div
      className="modal-overlay"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
              }}
            >
              {isEditing ? `Edit Expense #${initialData.id}` : 'Add New Expense'}
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {isEditing
                ? 'Update expense details and save changes to backend'
                : 'Enter details to record a new personal expense'}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-ghost"
            style={{ padding: '0.375rem', borderRadius: 'var(--radius-sm)' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Title Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="expense-title"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}
            >
              Expense Title <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <FileText
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                id="expense-title"
                type="text"
                placeholder="e.g. Lunch with team, Fuel, Rent"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  paddingLeft: '2.25rem',
                  borderColor: errors.title ? 'var(--danger)' : undefined,
                }}
              />
            </div>
            {errors.title && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--danger)',
                  fontSize: '0.75rem',
                  marginTop: '0.375rem',
                }}
              >
                <AlertCircle size={13} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Amount Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="expense-amount"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}
            >
              Amount (LKR) <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                }}
              >
                LKR
              </span>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: null }));
                }}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  paddingLeft: '2.8rem',
                  borderColor: errors.amount ? 'var(--danger)' : undefined,
                }}
              />
            </div>
            {errors.amount && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--danger)',
                  fontSize: '0.75rem',
                  marginTop: '0.375rem',
                }}
              >
                <AlertCircle size={13} />
                <span>{errors.amount}</span>
              </div>
            )}
          </div>

          {/* Date Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="expense-date"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}
            >
              Expense Date
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                id="expense-date"
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  paddingLeft: '2.25rem',
                }}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div style={{ marginBottom: '1.5rem' }}>

            <label
              htmlFor="expense-category"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
              }}
            >
              Category <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Tag
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <select
                id="expense-category"
                value={category}
                onChange={handleCategoryChange}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  paddingLeft: '2.25rem',
                  borderColor: errors.category ? 'var(--danger)' : undefined,
                }}
              >
                {DEFAULT_CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>
            </div>

            {/* Custom Category input if chosen */}
            {isCustomCategory && (
              <div style={{ marginTop: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Enter custom category name..."
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                  }}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    borderColor: errors.category ? 'var(--danger)' : undefined,
                  }}
                />
              </div>
            )}

            {errors.category && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  color: 'var(--danger)',
                  fontSize: '0.75rem',
                  marginTop: '0.375rem',
                }}
              >
                <AlertCircle size={13} />
                <span>{errors.category}</span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-expense-btn"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ fontSize: '0.875rem' }}
            >
              {isSubmitting ? (
                <span>{isEditing ? 'Updating...' : 'Saving...'}</span>
              ) : (
                <>
                  <Check size={16} strokeWidth={2.5} />
                  <span>{isEditing ? 'Save Changes' : 'Create Expense'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
