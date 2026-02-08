module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts", "**/*.spec.ts"],

  moduleNameMapper: {
    "^nanoid$": "<rootDir>/src/mocks/nanoidMock.ts",
    "^.+\\?raw$": "<rootDir>/src/mocks/rawMock.ts",
    "\\.(css|scss|sass)$": "<rootDir>/src/mocks/styleMock.ts",
    "\\.(hbs)$": "<rootDir>/src/__mocks__/templateMock.js",
  },

  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
};
