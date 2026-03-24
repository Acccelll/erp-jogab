import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Obras" />);
    expect(screen.getByText('Obras')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<PageHeader title="Obras" subtitle="Listagem de obras ativas" />);
    expect(screen.getByText('Listagem de obras ativas')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<PageHeader title="Obras" />);
    expect(screen.queryByText('Listagem de obras ativas')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(<PageHeader title="Obras" actions={<button>Nova Obra</button>} />);
    expect(screen.getByRole('button', { name: 'Nova Obra' })).toBeInTheDocument();
  });

  it('does not render actions container when omitted', () => {
    const { container } = render(<PageHeader title="Obras" />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });

  it('renders h1 heading element', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
  });
});
