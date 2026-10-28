import React from 'react';

export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'default', // 'success', 'warning', 'info', 'primary'
  accentColor = '#6366f1',
  isLoading = false,
}) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return {
          background: 'var(--success-light)',
          color: 'var(--success-text)',
          border: '1px solid var(--success-border)',
        };
      case 'warning':
        return {
          background: 'var(--warning-light)',
          color: 'var(--warning-text)',
          border: '1px solid var(--warning-border)',
        };
      case 'info':
        return {
          background: 'var(--info-light)',
          color: 'var(--info-text)',
          border: '1px solid var(--info-border)',
        };
      case 'primary':
      default:
        return {
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          border: '1px solid var(--primary-border)',
        };
    }
  };

  return (
    <div
      className="card summary-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '140px',
      }}
    >
      {/* Top Row: Title & Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </span>

        {Icon && (
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: `${accentColor}18`,
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </div>
        )}
      </div>

      {/* Center Value */}
      <div style={{ margin: '0.25rem 0' }}>
        {isLoading ? (
          <div
            style={{
              height: '2rem',
              width: '60%',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-sm)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '1.625rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            {value}
          </div>
        )}
      </div>

      {/* Bottom Row: Subtitle & Optional Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {subtitle}
        </span>

        {badgeText && (
          <span
            style={{
              ...getBadgeStyle(),
              padding: '0.125rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.6875rem',
              fontWeight: '700',
              whiteSpace: 'nowrap',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
