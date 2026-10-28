import React from 'react';
import {
  Menu,
  Search,
  Plus,
  RefreshCw,
  Server,
  User,
} from 'lucide-react';

export default function Navbar({
  pageTitle,
  pageSubtitle,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  onRefresh,
  isRefreshing,
  apiOnline,
  onToggleMobileMenu,
}) {
  // Format current date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleMobileMenu}
          className="mobile-nav-toggle"
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-secondary)',
          }}
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {pageTitle}
          </h1>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.125rem',
            }}
          >
            <span>{today}</span>
            {pageSubtitle && (
              <>
                <span>•</span>
                <span>{pageSubtitle}</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Middle & Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Global Search Input */}
        <div
          className="navbar-search"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Search expenses by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '2.25rem',
              paddingRight: '0.875rem',
              width: '260px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.875rem',
              backgroundColor: 'var(--bg-app)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.width = '300px';
              e.target.style.backgroundColor = 'var(--bg-surface)';
            }}
            onBlur={(e) => {
              e.target.style.width = '260px';
              e.target.style.backgroundColor = 'var(--bg-app)';
            }}
          />
        </div>

        {/* Refresh API Data Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh backend data"
            className="btn-secondary"
            style={{
              height: '38px',
              width: '38px',
              padding: 0,
              borderRadius: 'var(--radius-md)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? 'animate-spin' : ''}
              style={{
                transition: 'transform 0.5s ease',
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
          </button>
        )}

        {/* Backend Status Indicator */}
        <div
          className={`status-pill ${apiOnline ? 'online' : 'offline'}`}
          title={
            apiOnline
              ? 'Backend API is connected (http://127.0.0.1:8000)'
              : 'Backend API unreachable or CORS blocked'
          }
          style={{ height: '32px' }}
        >
          <span className="status-dot" />
          <span className="status-text" style={{ fontSize: '0.75rem' }}>
            {apiOnline ? 'API Connected' : 'API Offline'}
          </span>
        </div>

        {/* Quick Add Expense Action */}
        {onOpenAddModal && (
          <button
            id="navbar-add-expense-btn"
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{
              height: '38px',
              padding: '0 1rem',
              fontSize: '0.875rem',
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="btn-label-text">Add Expense</span>
          </button>
        )}

        {/* Simple User Profile Avatar */}
        <div
          title="Personal Account"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            border: '2px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            fontWeight: '700',
            fontSize: '0.875rem',
            flexShrink: 0,
          }}
        >
          <User size={18} />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .mobile-nav-toggle {
            display: inline-flex !important;
          }
          header {
            padding: 0 1rem !important;
          }
        }
        @media (max-width: 768px) {
          .navbar-search {
            display: none !important;
          }
          .status-text {
            display: none;
          }
          .btn-label-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
