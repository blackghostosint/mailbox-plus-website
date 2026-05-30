import { beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Global setup before each test
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});
