import React from 'react';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Settings,
  X,
  Wallet,
  ArrowUpRight,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  totalSpendingFormatted,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'expenses', label: 'All Expenses', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsOpenMobile) {
      setIsOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsOpenMobile(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`sidebar ${isOpenMobile ? 'mobile-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 999,
          transition: 'transform 0.25s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* App Branding */}
        <div
          style={{
            height: 'var(--navbar-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.35)',
              }}
            >
              <Wallet size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Expense<span style={{ color: 'var(--primary)' }}>Flow</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Finance Dashboard
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            className="mobile-close-btn"
            onClick={() => setIsOpenMobile(false)}
            aria-label="Close sidebar"
            style={{
              display: 'none',
              padding: '0.375rem',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              padding: '0 0.75rem 0.625rem',
            }}
          >
            Menu
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    width: '100%',
                    padding: '0.75rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.9375rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary-border)' : 'transparent',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.3 : 1.9}
                    style={{
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Spend Info Pill in Sidebar */}
        <div
          style={{
            padding: '1.25rem',
            margin: '0 1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Total Spent</span>
            <ArrowUpRight size={14} />
          </div>
          <div
            style={{
              fontSize: '1.125rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
            }}
          >
            {totalSpendingFormatted || 'LKR 0.00'}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: '0.25rem',
            }}
          >
            Real-time synced with backend
          </div>
        </div>
      </aside>

      {/* Responsive styles embedded for mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
          .mobile-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
