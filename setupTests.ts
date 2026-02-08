// настройка для тестов
global.window = window;
global.document = window.document;

// мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
});
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
});
global.localStorage = localStorageMock as any;

// мок для роутера
(global as any).router = {
  go: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};
