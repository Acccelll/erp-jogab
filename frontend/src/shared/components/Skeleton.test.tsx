import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import { TableSkeleton } from './TableSkeleton';
import { CardSkeleton } from './CardSkeleton';

describe('Skeleton Components', () => {
  it('renders Skeleton with correct variant classes', () => {
    const { container: textSkel } = render(<Skeleton variant="text" />);
    expect(textSkel.firstChild).toHaveClass('rounded');

    const { container: circleSkel } = render(<Skeleton variant="circle" />);
    expect(circleSkel.firstChild).toHaveClass('rounded-full');
  });

  it('renders TableSkeleton with specified rows', () => {
    const { container } = render(<TableSkeleton rows={3} showHeader={false} />);
    // Each row has a circle skeleton + N text skeletons.
    // We check for pulse animation elements
    const pulses = container.querySelectorAll('.animate-pulse');
    // 3 rows * (1 circle + 4 default cols) = 15 pulses
    expect(pulses.length).toBe(15);
  });

  it('renders CardSkeleton', () => {
    const { container } = render(<CardSkeleton rows={2} />);
    const pulses = container.querySelectorAll('.animate-pulse');
    // 1 avatar + 2 title lines + 2 * 2 data lines = 7 pulses
    expect(pulses.length).toBe(7);
  });
});
