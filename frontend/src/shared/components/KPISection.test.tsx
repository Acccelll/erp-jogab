import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPISection, KPICard } from './KPISection';

describe('KPISection', () => {
  it('renders children', () => {
    render(
      <KPISection>
        <div data-testid="child">Card</div>
      </KPISection>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <KPISection>
        <div data-testid="card-1">Card 1</div>
        <div data-testid="card-2">Card 2</div>
        <div data-testid="card-3">Card 3</div>
      </KPISection>,
    );
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });

  it('uses grid layout', () => {
    const { container } = render(
      <KPISection>
        <div>Card</div>
      </KPISection>,
    );
    expect(container.firstChild).toHaveClass('grid');
  });
});

describe('KPICard', () => {
  it('renders label and value', () => {
    render(<KPICard label="Total de Obras" value={42} />);
    expect(screen.getByText('Total de Obras')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<KPICard label="Status" value="Ativo" />);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<KPICard label="Custo" value={100} subtitle="+5% vs mês anterior" />);
    expect(screen.getByText('+5% vs mês anterior')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<KPICard label="Custo" value={100} />);
    expect(screen.queryByText('+5%')).not.toBeInTheDocument();
  });

  it('applies green color for up trend', () => {
    render(<KPICard label="Custo" value={100} subtitle="+5%" trend="up" />);
    const subtitle = screen.getByText('+5%');
    expect(subtitle).toHaveClass('text-success');
  });

  it('applies red color for down trend', () => {
    render(<KPICard label="Custo" value={100} subtitle="-3%" trend="down" />);
    const subtitle = screen.getByText('-3%');
    expect(subtitle).toHaveClass('text-danger');
  });

  it('applies gray color for neutral trend', () => {
    render(<KPICard label="Custo" value={100} subtitle="0%" trend="neutral" />);
    const subtitle = screen.getByText('0%');
    expect(subtitle).toHaveClass('text-text-muted');
  });

  it('renders value of 0 correctly', () => {
    render(<KPICard label="Pendentes" value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
