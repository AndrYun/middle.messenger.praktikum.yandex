import { EventBus } from "./EventBus";

describe("EventBus", () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe("on()", () => {
    it("должен регистрировать callback для события", () => {
      const callback = jest.fn();

      eventBus.on("test-event", callback);
      eventBus.emit("test-event");

      expect(callback).toHaveBeenCalled();
    });

    it("должен регистрировать несколько callbacks для одного события", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      eventBus.on("test-event", callback1);
      eventBus.on("test-event", callback2);
      eventBus.emit("test-event");

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe("off()", () => {
    it("должен отписывать callback от события", () => {
      const callback = jest.fn();
      eventBus.on("test-event", callback);

      eventBus.off("test-event", callback);
      eventBus.emit("test-event");

      expect(callback).not.toHaveBeenCalled();
    });

    it("должен отписывать только указанный callback", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      eventBus.on("test-event", callback1);
      eventBus.on("test-event", callback2);

      eventBus.off("test-event", callback1);
      eventBus.emit("test-event");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("не должен выбрасывать ошибку при отписке несуществующего события", () => {
      expect(() => {
        eventBus.off("nonexistent", jest.fn());
      }).not.toThrow();
    });
  });

  describe("emit()", () => {
    it("должен вызывать все callbacks с переданными аргументами", () => {
      const callback = jest.fn();
      const args = ["arg1", "arg2", 123];
      eventBus.on("test-event", callback);

      eventBus.emit("test-event", ...args);

      expect(callback).toHaveBeenCalledWith(...args);
    });

    it("должен вызывать callbacks в порядке регистрации", () => {
      const order: number[] = [];
      const callback1 = jest.fn(() => order.push(1));
      const callback2 = jest.fn(() => order.push(2));
      const callback3 = jest.fn(() => order.push(3));

      eventBus.on("test-event", callback1);
      eventBus.on("test-event", callback2);
      eventBus.on("test-event", callback3);

      eventBus.emit("test-event");

      expect(order).toEqual([1, 2, 3]);
    });

    it("не должен выбрасывать ошибку при emit несуществующего события", () => {
      expect(() => {
        eventBus.emit("nonexistent");
      }).not.toThrow();
    });
  });
});
