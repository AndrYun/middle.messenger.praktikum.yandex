declare global {
  interface Window {
    navigateTo: (pageName: string) => void;
  }
}

export {};
