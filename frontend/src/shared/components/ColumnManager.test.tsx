import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColumnManager } from './ColumnManager';

vi.mock('@/shared/stores/preferencesStore', () => ({
  usePreferencesStore: () => ({
    columns: {},
    setColumns: vi.fn(),
    resetColumns: vi.fn(),
  }),
}));

describe('ColumnManager', () => {
  const defaultCols = [
    { id: '1', label: 'Col 1', visible: true },
    { id: '2', label: 'Col 2', visible: false },
  ];

  it('renders correctly', () => {
    render(<ColumnManager moduleId="obras" defaultColumns={defaultCols} onClose={() => {}} />);
    expect(screen.getByText('Personalizar colunas')).toBeInTheDocument();
    expect(screen.getByText('Col 1')).toBeInTheDocument();
    expect(screen.getByText('Col 2')).toBeInTheDocument();
  });
});
