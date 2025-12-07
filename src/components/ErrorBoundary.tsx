import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>We apologize for the inconvenience. Please try refreshing the page.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



import { z } from 'zod';

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        throw new ValidationError(
          firstError.message,
          firstError.path.join('.'),
          firstError.code
        );
      }
      throw error;
    }
  };
};

export const validateField = <T>(
  value: unknown,
  schema: z.ZodSchema<T>,
  fieldName: string
): T => {
  try {
    return schema.parse(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new ValidationError(
        `${fieldName}: ${firstError.message}`,
        fieldName,
        firstError.code
      );
    }
    throw error;
  }
};

export const safeValidate = <T>(
  data: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: ValidationError } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: new ValidationError(
          firstError.message,
          firstError.path.join('.'),
          firstError.code
        )
      };
    }
    return {
      success: false,
      error: new ValidationError('Unknown validation error')
    };
  }
};