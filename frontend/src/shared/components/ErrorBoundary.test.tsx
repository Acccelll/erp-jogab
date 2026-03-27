import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test Error');
  };

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders fallback UI when an error occurs', () => {
    // Suppress console.error for this test as we expect an error
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('Test Error')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('calls onReset when clicking retry button', () => {
    const onReset = vi.fn();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Tentar Novamente'));
    expect(onReset).toHaveBeenCalled();

    spy.mockRestore();
  });
});
