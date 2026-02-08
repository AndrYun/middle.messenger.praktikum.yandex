type Listener<T extends unknown[] = unknown[]> = (...args: T) => void;

type Listeners = Record<string, Listener[]>;

export class EventBus {
  private listeners: Listeners = {};

  on<T extends unknown[]>(event: string, callback: Listener<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback as Listener);
  }

  off<T extends unknown[]>(event: string, callback: Listener<T>): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  emit<T extends unknown[]>(event: string, ...args: T): void {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}
