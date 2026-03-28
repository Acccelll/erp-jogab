import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock react-virtualized-auto-sizer for all tests
vi.mock('react-virtualized-auto-sizer', () => ({
  default: ({ children }: any) => children({ height: 500, width: 1000 }),
  AutoSizer: ({ children }: any) => children({ height: 500, width: 1000 }),
  __esModule: true,
}));

// Mock react-window for all tests
vi.mock('react-window', () => {
  const List = ({ children, rowCount, itemData, rowComponent: Row, children: childrenProp }: any) => {
    const items = [];
    const actualRowCount = rowCount || 0;
    const actualRow = Row || childrenProp;
    const data = itemData;

    for (let i = 0; i < actualRowCount; i++) {
      items.push(<div key={i}>{actualRow({ index: i, style: {}, data: data })}</div>);
    }
    return <div data-testid="virtual-list">{items}</div>;
  };
  return {
    List,
    __esModule: true,
  };
});

afterEach(() => {
  cleanup();
});
