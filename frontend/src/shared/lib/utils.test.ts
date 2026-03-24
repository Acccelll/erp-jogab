import { describe, it, expect } from 'vitest';
import { cn, formatCompetencia, formatCurrency } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const condition = false;
    expect(cn('base', condition ? 'hidden' : undefined, 'visible')).toBe('base visible');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('merges Tailwind conflicts (last wins)', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});

describe('formatCompetencia', () => {
  it('converts YYYY-MM to MM/YYYY', () => {
    expect(formatCompetencia('2026-03')).toBe('03/2026');
  });

  it('handles January', () => {
    expect(formatCompetencia('2026-01')).toBe('01/2026');
  });

  it('handles December', () => {
    expect(formatCompetencia('2025-12')).toBe('12/2025');
  });
});

describe('formatCurrency', () => {
  it('formats positive number as BRL', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1.234,56');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0,00');
  });

  it('formats negative number', () => {
    const result = formatCurrency(-500);
    expect(result).toContain('500,00');
  });

  it('formats large number with thousand separators', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('1.000.000,00');
  });
});
