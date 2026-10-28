import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--success)';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--danger)';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--primary)';
        }

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: '500' }}>
              {toast.message}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="btn-ghost"
              style={{ padding: '0.25rem', color: 'var(--text-muted)' }}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
