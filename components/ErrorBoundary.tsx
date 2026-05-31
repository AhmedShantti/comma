'use client';

import React, { ReactNode, Component, ReactElement } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and handling React errors
 * Prevents entire app from crashing when a component fails
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0f0e0d',
              color: '#d45454',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ maxWidth: 500 }}>
              <h1 style={{ fontSize: '2rem', marginBottom: 16 }}>Something went wrong</h1>
              <p style={{ color: '#888', marginBottom: 24, lineHeight: 1.6 }}>
                An unexpected error occurred. Please refresh the page and try again.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <pre
                  style={{
                    background: '#1a1918',
                    padding: 12,
                    borderRadius: 6,
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    overflow: 'auto',
                    maxHeight: 200,
                    color: '#d45454',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
