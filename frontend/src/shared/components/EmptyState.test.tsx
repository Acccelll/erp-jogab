import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nenhum item encontrado" />);
    expect(screen.getByText('Nenhum item encontrado')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Vazio" description="Tente ajustar os filtros" />);
    expect(screen.getByText('Tente ajustar os filtros')).toBeInTheDocument();
  });

  it('does not render description when omitted', () => {
    render(<EmptyState title="Vazio" />);
    expect(screen.queryByText('Tente ajustar os filtros')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<EmptyState title="Vazio" icon={<span data-testid="icon">🔍</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action when provided', () => {
    render(<EmptyState title="Vazio" action={<button>Adicionar</button>} />);
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  it('does not render action or icon containers when omitted', () => {
    const { container } = render(<EmptyState title="Vazio" />);
    // Only h3 and wrapper divs should exist, no icon/action wrappers
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState title="Vazio" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
