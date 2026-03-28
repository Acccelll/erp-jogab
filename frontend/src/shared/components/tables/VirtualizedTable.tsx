import React, { useMemo } from 'react';
// @ts-ignore
import { List as ReactWindowList } from 'react-window';
// @ts-ignore
import { AutoSizer as ReactVirtualizedAutoSizer } from 'react-virtualized-auto-sizer';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width: string | number;
  render?: (value: any, item: T) => React.ReactNode;
  sortable?: boolean;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
  onSort?: (key: keyof T | string) => void;
  sortKey?: keyof T | string;
  sortOrder?: 'asc' | 'desc';
  onRowClick?: (item: T) => void;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
  someSelected?: boolean;
  idKey?: keyof T;
  className?: string;
}

export function VirtualizedTable<T extends Record<string, any>>({
  data,
  columns,
  rowHeight = 52,
  headerHeight = 44,
  onSort,
  sortKey,
  sortOrder,
  onRowClick,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  allSelected,
  someSelected,
  idKey = 'id' as keyof T,
  className,
}: VirtualizedTableProps<T>) {
  const columnWidths = useMemo(() => {
    return columns.map((col) => col.width);
  }, [columns]);

  const Row = ({ index, style, data: itemDataProp }: any) => {
    const item = itemDataProp.items[index];
    if (!item) return null;

    const id = String(item[itemDataProp.idKey]);
    const isSelected = itemDataProp.selectedIds.includes(id);

    return (
      <div
        style={style}
        className={`flex items-center border-b border-border-default/50 transition-colors hover:bg-surface-soft ${
          isSelected ? 'bg-accent-50/30' : ''
        } ${itemDataProp.onRowClick ? 'cursor-pointer' : ''}`}
        onClick={() => itemDataProp.onRowClick?.(item)}
      >
        {itemDataProp.onSelectRow && (
          <div
            className="flex w-12 shrink-0 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => itemDataProp.onSelectRow(id)}
              className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary/20"
            />
          </div>
        )}
        {itemDataProp.columns.map((col: any, colIndex: number) => (
          <div
            key={String(col.key)}
            className="flex items-center px-4 text-sm text-text-body"
            style={{
              width: itemDataProp.columnWidths[colIndex],
              flex: typeof col.width === 'string' && col.width.includes('%') ? `0 0 ${col.width}` : '1 1 auto',
              maxWidth: typeof col.width === 'number' ? `${col.width}px` : col.width
            }}
          >
            <div className="truncate w-full">
              {col.render ? col.render(item[col.key as keyof T], item) : String(item[col.key as keyof T] ?? '')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const itemData = useMemo(() => ({
    items: data,
    columnWidths,
    onRowClick,
    onSelectRow,
    selectedIds,
    idKey,
    columns
  }), [data, columnWidths, onRowClick, onSelectRow, selectedIds, idKey, columns]);

  const TableList = (ReactWindowList as any)?.List || ReactWindowList;
  const ActualAutoSizer = (ReactVirtualizedAutoSizer as any)?.AutoSizer || (ReactVirtualizedAutoSizer as any)?.default || ReactVirtualizedAutoSizer;

  return (
    <div className={`flex h-full flex-col overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm ${className ?? ''}`}>
      {/* Header */}
      <div
        className="flex border-b border-border-default bg-surface-soft font-semibold text-text-strong"
        style={{ height: headerHeight }}
      >
        {(onSelectRow || onSelectAll) && (
          <div className="flex w-12 shrink-0 items-center justify-center">
            <input
              type="checkbox"
              checked={allSelected ?? (data.length > 0 && selectedIds.length === data.length)}
              ref={(el) => {
                if (el) el.indeterminate = !!someSelected;
              }}
              onChange={() => {
                if (onSelectAll) {
                  onSelectAll();
                } else if (onSelectRow) {
                  if (selectedIds.length === data.length) {
                    data.forEach(item => {
                      const id = String(item[idKey]);
                      if (selectedIds.includes(id)) onSelectRow(id);
                    });
                  } else {
                    data.forEach(item => {
                      const id = String(item[idKey]);
                      if (!selectedIds.includes(id)) onSelectRow(id);
                    });
                  }
                }
              }}
              className="h-4 w-4 rounded border-border-default text-brand-primary focus:ring-brand-primary/20"
            />
          </div>
        )}
        {columns.map((col, index) => (
          <div
            key={String(col.key)}
            className={`flex items-center px-4 text-xs uppercase tracking-wider text-text-muted/70 ${
              col.sortable ? 'cursor-pointer select-none hover:text-text-strong' : ''
            }`}
            style={{
              width: columnWidths[index],
              flex: typeof col.width === 'string' && col.width.includes('%') ? `0 0 ${col.width}` : '1 1 auto',
              maxWidth: typeof col.width === 'number' ? `${col.width}px` : col.width
            }}
            onClick={() => col.sortable && onSort?.(col.key)}
          >
            <div className="flex items-center gap-1.5 truncate">
              {col.header}
              {col.sortable && sortKey === col.key && (
                <span className="text-brand-primary">
                  {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1">
        {ActualAutoSizer && (
          <ActualAutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <TableList
                {...({
                  height,
                  rowCount: data.length,
                  rowHeight,
                  width,
                  itemData: itemData,
                  children: Row,
                  className: "scrollbar-hide"
                } as any)}
              />
            )}
          </ActualAutoSizer>
        )}
      </div>
    </div>
  );
}
