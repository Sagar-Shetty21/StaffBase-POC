import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, // allow using describe/it/test without import
    environment: "jsdom", // simulate browser for React components
    include: ["**/*.test.{ts,tsx}"], // only match .test.ts / .test.tsx
  },
});
