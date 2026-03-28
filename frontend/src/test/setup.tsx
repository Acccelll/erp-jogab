import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock react-virtualized-auto-sizer for all tests
vi.mock('react-virtualized-auto-sizer', () => ({
  default: ({ children }: any) => children({ height: 500, width: 1000 }),
}));

// Mock react-window for all tests
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount, itemData }: any) => {
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      items.push(<div key={i}>{children({ index: i, style: {}, data: itemData })}</div>);
    }
    return <div data-testid="virtual-list">{items}</div>;
  },
}));

afterEach(() => {
  cleanup();
});
