// Optimisations de performance
import { debounce } from 'lodash';

export const DEBOUNCE_DELAY = 300;

export const debouncedSearch = debounce((searchFn: Function) => {
  searchFn();
}, DEBOUNCE_DELAY);

export const memoizedValue = <T>(value: T): T => {
  return value;
};

export const measurePerformance = async (fn: Function): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};