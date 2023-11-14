import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testTimeout: 30000,
  testMatch: [
    "**/test/**/*.spec.ts"
  ],
  preset: "ts-jest"
};

export default config;
