import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./mocks/server";

import "@testing-library/jest-dom";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = "";
  thresholds = [];

  constructor() {
    // Mock constructor - no implementation needed for tests
  }
  disconnect() {
    // Mock disconnect - no implementation needed for tests
  }
  observe() {
    // Mock observe - no implementation needed for tests
  }
  unobserve() {
    // Mock unobserve - no implementation needed for tests
  }
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {
    // Mock constructor - no implementation needed for tests
  }
  disconnect() {
    // Mock disconnect - no implementation needed for tests
  }
  observe() {
    // Mock observe - no implementation needed for tests
  }
  unobserve() {
    // Mock unobserve - no implementation needed for tests
  }
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock scrollTo
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});
