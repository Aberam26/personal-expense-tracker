import React, { useState } from 'react';
import {
  Server,
  RefreshCw,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  Info,
  Database,
  Code2,
} from 'lucide-react';
import { API_BASE_URL } from '../services/expenseApi';

export default function Settings({ apiOnline, apiError, onRetryApi, isRetrying }) {
  const [copied, setCopied] = useState(false);

  const corsCode = `from fastapi.middleware.cors import CORSMiddleware

# Add CORS Middleware to your existing FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(corsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      <div>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Application Settings & API Configuration
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Configure environment preferences, inspect backend status, and view API integration details
        </p>
      </div>

      {/* Backend API Connection Status Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: apiOnline ? 'var(--success-light)' : 'var(--danger-light)',
                color: apiOnline ? 'var(--success)' : 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Server size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: '700' }}>Backend API Connection</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Target: <code>{API_BASE_URL}</code>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`status-pill ${apiOnline ? 'online' : 'offline'}`}>
              <span className="status-dot" />
              <span>{apiOnline ? 'Online & Healthy' : 'Disconnected / Blocked'}</span>
            </span>

            <button
              onClick={onRetryApi}
              disabled={isRetrying}
              className="btn btn-secondary btn-sm"
              title="Test connection"
            >
              <RefreshCw
                size={14}
                style={{ animation: isRetrying ? 'spin 1s linear infinite' : 'none' }}
              />
              <span>{isRetrying ? 'Testing...' : 'Test Ping'}</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--danger-light)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger-text)',
              fontSize: '0.8125rem',
              marginBottom: '1rem',
            }}
          >
            <strong>Connection Diagnostic:</strong> {apiError}
          </div>
        )}

        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          The React frontend connects directly to your existing FastAPI backend endpoints (
          <code>GET /</code>, <code>GET /expenses</code>, <code>POST /expenses</code>,{' '}
          <code>GET /expenses/highest</code>, <code>GET /expenses/&#123;id&#125;</code>,{' '}
          <code>PUT /expenses/&#123;id&#125;</code>, <code>DELETE /expenses/&#123;id&#125;</code>).
        </div>
      </div>

      {/* Currency & Localization Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coins size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '700' }}>Currency & Localization</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Default financial display standard
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
              Sri Lankan Rupee (LKR)
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sample: <code>LKR 1,500.00</code>
            </div>
          </div>
          <span
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-text)',
              fontSize: '0.75rem',
              fontWeight: '700',
            }}
          >
            Default Currency
          </span>
        </div>
      </div>

      {/* FastAPI CORS Helper Card */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--info-light)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Code2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '700' }}>FastAPI CORS Configuration</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Required to allow browser requests to reach your local FastAPI server
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
          If browser requests from <code>http://localhost:5173</code> encounter CORS restrictions, add this to your <code>main.py</code>:
        </p>

        <div
          style={{
            position: 'relative',
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
          }}
        >
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#334155',
              color: '#ffffff',
              borderRadius: '4px',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <pre style={{ margin: 0, overflowX: 'auto' }}>{corsCode}</pre>
        </div>
      </div>

      {/* Application Stack Info */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Info size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.0625rem', fontWeight: '700' }}>About ExpenseFlow</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Frontend build specifications
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.8125rem',
          }}
        >
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Architecture</span>
            <strong style={{ color: 'var(--text-primary)' }}>React 18 + Vite</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Charts</span>
            <strong style={{ color: 'var(--text-primary)' }}>Recharts 2.x</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Icons</span>
            <strong style={{ color: 'var(--text-primary)' }}>Lucide React</strong>
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Backend</span>
            <strong style={{ color: 'var(--text-primary)' }}>FastAPI + PostgreSQL</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
