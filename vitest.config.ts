import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts"],
      exclude: [
        "src/lib/dtc-*.ts",
        "src/lib/stripe.ts",
        "src/lib/types.ts",
        "src/lib/providers/index.ts",
        "src/lib/providers/types.ts",
      ],
      reporter: ["text", "text-summary", "json-summary"],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
