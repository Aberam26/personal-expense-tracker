import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check, RefreshCw } from 'lucide-react';

export default function ApiStatusBanner({ isOnline, error, onRetry, isRetrying }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isOnline) return null;

  const corsSnippet = `from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:5173", "http://127.0.0.1:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(corsSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertCircle size={20} />
          </div>
          <div>
            <h4
              style={{
                fontSize: '0.9375rem',
                fontWeight: '700',
                color: '#92400e',
                lineHeight: 1.3,
              }}
            >
              Cannot connect to FastAPI backend at http://127.0.0.1:8000
            </h4>
            <p
              style={{
                fontSize: '0.8125rem',
                color: '#b45309',
                marginTop: '0.125rem',
              }}
            >
              {error || 'The backend may not be running or browser requests are blocked by CORS.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-secondary"
            style={{
              fontSize: '0.8125rem',
              padding: '0.375rem 0.75rem',
              backgroundColor: '#fef3c7',
              borderColor: '#fde68a',
              color: '#92400e',
            }}
          >
            <span>{isExpanded ? 'Hide CORS Instructions' : 'View CORS Fix'}</span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="btn btn-primary"
              style={{
                fontSize: '0.8125rem',
                padding: '0.375rem 0.75rem',
                backgroundColor: '#d97706',
                borderColor: '#b45309',
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: isRetrying ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isRetrying ? 'Testing...' : 'Retry Connection'}</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #fde68a',
            fontSize: '0.8125rem',
            color: '#78350f',
          }}
        >
          <p style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>
            To allow the React frontend to communicate with your FastAPI backend, add{' '}
            <strong>CORSMiddleware</strong> to your <code>main.py</code>:
          </p>
          <div
            style={{
              position: 'relative',
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
              overflowX: 'auto',
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
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
            <pre style={{ margin: 0 }}>{corsSnippet}</pre>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#92400e' }}>
            Also ensure your backend is running: <code>fastapi dev main.py</code> or{' '}
            <code>uvicorn main:app --reload --port 8000</code>.
          </p>
        </div>
      )}
    </div>
  );
}
