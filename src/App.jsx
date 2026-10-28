import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import ExpenseForm from './components/ExpenseForm';
import ConfirmDialog from './components/ConfirmDialog';
import ToastNotification from './components/ToastNotification';
import ApiStatusBanner from './components/ApiStatusBanner';

import {
  checkApiStatus,
  fetchExpenses,
  fetchHighestExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from './services/expenseApi';

import { calculateDashboardMetrics } from './utils/expenseAnalytics';
import { formatLKR } from './utils/formatCurrency';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [expenses, setExpenses] = useState([]);
  const [highestExpense, setHighestExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Backend connection status
  const [apiOnline, setApiOnline] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modals & Dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    expense: null,
    isLoading: false,
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Synchronize data from backend
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setIsRefreshing(true);

    try {
      // 1. Ping API
      const statusRes = await checkApiStatus();
      setApiOnline(statusRes.isOnline);
      if (!statusRes.isOnline) {
        setApiError(statusRes.error);
        if (!isSilent) {
          addToast(statusRes.error || 'Cannot connect to FastAPI backend. Check CORS configuration.', 'error');
        }
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      } else {
        setApiError(null);
      }

      // 2. Fetch all expenses
      const expenseList = await fetchExpenses();
      setExpenses(expenseList);

      // 3. Fetch highest expense
      const highest = await fetchHighestExpense();
      setHighestExpense(highest);
    } catch (err) {
      console.error('Failed to load expense data:', err);
      setApiOnline(false);
      setApiError(err.message);
      if (!isSilent) {
        addToast(err.message || 'Failed to connect to backend', 'error');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived metrics
  const metrics = useMemo(() => {
    return calculateDashboardMetrics(expenses);
  }, [expenses]);

  // Form Handlers (Create / Edit)
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        // Update existing expense
        const updated = await updateExpense(editingExpense.id, formData);
        setExpenses((prev) =>
          prev.map((item) => (item.id === editingExpense.id ? updated : item))
        );
        addToast(`Expense "${updated.title}" updated successfully!`, 'success');
      } else {
        // Create new expense
        const created = await createExpense(formData);
        setExpenses((prev) => [...prev, created]);
        addToast(`Expense "${created.title}" recorded successfully!`, 'success');
      }

      // Refresh highest expense in background
      try {
        const highest = await fetchHighestExpense();
        setHighestExpense(highest);
      } catch (e) {
        console.warn('Failed to refresh highest expense:', e);
      }

      setIsFormOpen(false);
      setEditingExpense(null);
    } catch (err) {
      console.error('Expense form submission error:', err);
      addToast(err.message || 'Failed to save expense', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleRequestDelete = (expense) => {
    setDeleteDialog({
      isOpen: true,
      expense,
      isLoading: false,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.expense) return;
    const targetId = deleteDialog.expense.id;
    const targetTitle = deleteDialog.expense.title;

    setDeleteDialog((prev) => ({ ...prev, isLoading: true }));
    try {
      await deleteExpense(targetId);
      setExpenses((prev) => prev.filter((item) => item.id !== targetId));
      addToast(`Deleted "${targetTitle}" successfully.`, 'info');

      // Refresh highest expense
      try {
        const highest = await fetchHighestExpense();
        setHighestExpense(highest);
      } catch (e) {
        console.warn('Failed to refresh highest expense:', e);
      }

      setDeleteDialog({ isOpen: false, expense: null, isLoading: false });
    } catch (err) {
      console.error('Delete expense error:', err);
      addToast(err.message || 'Failed to delete expense', 'error');
      setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Determine current title and subtitle for Navbar
  const pageMeta = useMemo(() => {
    switch (activeTab) {
      case 'expenses':
        return {
          title: 'All Expenses',
          subtitle: 'Search, filter and edit records',
        };
      case 'analytics':
        return {
          title: 'Expense Analytics',
          subtitle: 'Category distribution & insights',
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Backend API connection & preferences',
        };
      case 'dashboard':
      default:
        return {
          title: 'Financial Dashboard',
          subtitle: 'Real-time overview of your spending',
        };
    }
  }, [activeTab]);

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        totalSpendingFormatted={formatLKR(metrics.totalSpending)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <Navbar
          pageTitle={pageMeta.title}
          pageSubtitle={pageMeta.subtitle}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'expenses' && q.trim().length > 0) {
              setActiveTab('expenses');
            }
          }}
          onOpenAddModal={handleOpenAddModal}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
          apiOnline={apiOnline}
          onToggleMobileMenu={() => setIsOpenMobile(true)}
        />

        <main className="page-container">
          {/* API Connection Warning & CORS instructions if offline */}
          <ApiStatusBanner
            isOnline={apiOnline}
            error={apiError}
            onRetry={() => loadData(false)}
            isRetrying={isLoading || isRefreshing}
          />

          {/* Active Tab Page Content */}
          {activeTab === 'dashboard' && (
            <Dashboard
              expenses={expenses}
              highestExpense={highestExpense}
              metrics={metrics}
              isLoading={isLoading}
              onOpenAddModal={handleOpenAddModal}
              onNavigateToExpenses={() => setActiveTab('expenses')}
              onEditExpense={handleOpenEditModal}
              onDeleteExpense={handleRequestDelete}
            />
          )}

          {activeTab === 'expenses' && (
            <Expenses
              expenses={expenses}
              isLoading={isLoading}
              onOpenAddModal={handleOpenAddModal}
              onEditExpense={handleOpenEditModal}
              onDeleteExpense={handleRequestDelete}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalSpending={metrics.totalSpending}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics expenses={expenses} onOpenAddModal={handleOpenAddModal} />
          )}

          {activeTab === 'settings' && (
            <Settings
              apiOnline={apiOnline}
              apiError={apiError}
              onRetryApi={() => loadData(false)}
              isRetrying={isLoading || isRefreshing}
            />
          )}
        </main>
      </div>

      {/* Add / Edit Expense Modal Form */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingExpense}
        isSubmitting={isSubmitting}
      />

      {/* Delete Expense Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Expense"
        message={
          deleteDialog.expense
            ? `Are you sure you want to delete "${deleteDialog.expense.title}" (${formatLKR(
                deleteDialog.expense.amount
              )})? This action will permanently remove it from your database.`
            : 'Are you sure you want to delete this expense?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDestructive={true}
        isLoading={deleteDialog.isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setDeleteDialog({ isOpen: false, expense: null, isLoading: false })
        }
      />

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
