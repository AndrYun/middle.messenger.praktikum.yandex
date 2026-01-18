import type { Router } from "../core";
declare global {
  interface Window {
    router: Router;
  }
}

export {};
