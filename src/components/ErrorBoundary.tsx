import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary" style={{
          padding: '2rem',
          margin: '2rem',
          border: '2px solid #ef4444',
          borderRadius: '8px',
          backgroundColor: '#fef2f2'
        }}>
          <h2 style={{ color: '#dc2626' }}>Something went wrong</h2>
          <details style={{ marginTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error details
            </summary>
            <pre style={{
              marginTop: '0.5rem',
              padding: '1rem',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {this.state.error?.message}
            </pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
