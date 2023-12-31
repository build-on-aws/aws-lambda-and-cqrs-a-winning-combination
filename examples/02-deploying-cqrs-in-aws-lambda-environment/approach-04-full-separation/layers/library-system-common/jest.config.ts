import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testTimeout: 30000,
  testMatch: ["**/test/**/*.test.ts"],
  preset: "ts-jest",
  modulePathIgnorePatterns: ["<rootDir>/library-system-common"],
};
export default config;
