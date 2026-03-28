import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualizedTable } from './VirtualizedTable';

describe('VirtualizedTable Interactions', () => {
  const columns = [
    { key: 'id', header: 'ID', width: 100, sortable: true },
    { key: 'name', header: 'Name', width: 200 },
  ];

  const data = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
  ];

  it('triggers onSort when a sortable header is clicked', () => {
    const onSort = vi.fn();
    render(
      <VirtualizedTable
        data={data}
        columns={columns}
        onSort={onSort}
      />
    );

    fireEvent.click(screen.getByText('ID'));
    expect(onSort).toHaveBeenCalledWith('id');
  });

  it('triggers onSelectRow when a row checkbox is clicked', () => {
    const onSelectRow = vi.fn();
    render(
      <VirtualizedTable
        data={data}
        columns={columns}
        onSelectRow={onSelectRow}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // First row checkbox
    expect(onSelectRow).toHaveBeenCalledWith('1');
  });

  it('triggers onSelectAll when the header checkbox is clicked', () => {
    const onSelectAll = vi.fn();
    render(
      <VirtualizedTable
        data={data}
        columns={columns}
        onSelectAll={onSelectAll}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Header checkbox
    expect(onSelectAll).toHaveBeenCalled();
  });

  it('triggers onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn();
    render(
      <VirtualizedTable
        data={data}
        columns={columns}
        onRowClick={onRowClick}
      />
    );

    fireEvent.click(screen.getByText('John Doe'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });
});
