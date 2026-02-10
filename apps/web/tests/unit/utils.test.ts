import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDateToLocal, generatePagination } from '@/app/lib/utils';

describe('utils.ts', () => {
  describe('formatCurrency', () => {
    it('should format positive amounts correctly', () => {
      expect(formatCurrency(1000)).toBe('$10.00');
      expect(formatCurrency(2500)).toBe('$25.00');
    });

    it('should format zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatDateToLocal', () => {
    it('should format date to local string', () => {
      const result = formatDateToLocal('2024-01-15');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
      expect(result).toContain('2024');
    });
  });

  describe('generatePagination', () => {
    it('should return all pages when total is 7 or less', () => {
      expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should add ellipsis for first pages', () => {
      const result = generatePagination(1, 10);
      expect(result).toEqual([1, 2, 3, '...', 9, 10]);
    });

    it('should add ellipsis for last pages', () => {
      const result = generatePagination(10, 10);
      expect(result).toEqual([1, 2, '...', 8, 9, 10]);
    });

    it('should add ellipsis for middle pages', () => {
      const result = generatePagination(5, 10);
      expect(result).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });
  });
});
