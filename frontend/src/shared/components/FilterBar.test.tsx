import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders children', () => {
    render(
      <FilterBar>
        <input placeholder="Buscar" />
      </FilterBar>,
    );
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
  });

  it('renders clear button when onClear is provided', () => {
    render(
      <FilterBar onClear={() => {}}>
        <span>Filtro</span>
      </FilterBar>,
    );
    expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
  });

  it('does not render clear button when onClear is omitted', () => {
    render(
      <FilterBar>
        <span>Filtro</span>
      </FilterBar>,
    );
    expect(screen.queryByText('Limpar filtros')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(
      <FilterBar onClear={onClear}>
        <span>Filtro</span>
      </FilterBar>,
    );

    await user.click(screen.getByText('Limpar filtros'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders multiple children', () => {
    render(
      <FilterBar>
        <select data-testid="select-status">
          <option>Ativo</option>
        </select>
        <select data-testid="select-tipo">
          <option>CLT</option>
        </select>
      </FilterBar>,
    );
    expect(screen.getByTestId('select-status')).toBeInTheDocument();
    expect(screen.getByTestId('select-tipo')).toBeInTheDocument();
  });
});
