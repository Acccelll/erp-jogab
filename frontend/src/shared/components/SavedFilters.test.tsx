import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SavedFilters } from './SavedFilters';

vi.mock('@/shared/stores/preferencesStore', () => ({
  usePreferencesStore: () => ({
    savedFilters: { obras: [] },
    saveFilter: vi.fn(),
    deleteFilter: vi.fn(),
  }),
}));

describe('SavedFilters', () => {
  it('renders correctly', () => {
    render(<SavedFilters moduleId="obras" currentFilters={{}} onApply={() => {}} />);
    expect(screen.getByText('Filtros Salvos')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<SavedFilters moduleId="obras" currentFilters={{}} onApply={() => {}} />);
    fireEvent.click(screen.getByText('Filtros Salvos'));
    expect(screen.getByText('Salvar filtros atuais...')).toBeInTheDocument();
  });
});
