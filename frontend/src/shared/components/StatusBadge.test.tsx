import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('renders label text', () => {
    render(<StatusBadge label="Ativo" />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('uses default variant styles when variant is omitted', () => {
    render(<StatusBadge label="Padrão" />);
    const badge = screen.getByText('Padrão');
    expect(badge).toHaveClass('bg-neutral-200', 'text-neutral-700');
  });

  it('applies success variant styles', () => {
    render(<StatusBadge label="Aprovado" variant="success" />);
    const badge = screen.getByText('Aprovado');
    expect(badge).toHaveClass('bg-jogab-100', 'text-jogab-700');
  });

  it('applies warning variant styles', () => {
    render(<StatusBadge label="Pendente" variant="warning" />);
    const badge = screen.getByText('Pendente');
    expect(badge).toHaveClass('bg-amber-50', 'text-amber-700');
  });

  it('applies error variant styles', () => {
    render(<StatusBadge label="Rejeitado" variant="error" />);
    const badge = screen.getByText('Rejeitado');
    expect(badge).toHaveClass('bg-red-50', 'text-red-700');
  });

  it('applies info variant styles', () => {
    render(<StatusBadge label="Informação" variant="info" />);
    const badge = screen.getByText('Informação');
    expect(badge).toHaveClass('bg-accent-100', 'text-accent-600');
  });

  it('applies custom className', () => {
    render(<StatusBadge label="Custom" className="extra-class" />);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('extra-class');
  });

  it('renders as inline span element', () => {
    render(<StatusBadge label="Badge" />);
    const badge = screen.getByText('Badge');
    expect(badge.tagName).toBe('SPAN');
  });
});
