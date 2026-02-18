import { Router } from "./Router";
import { Block } from "./Block";

class TestPage extends Block {
  constructor() {
    super("div");
  }
  protected render(): string {
    return "<div>Test Page</div>";
  }
}

type RouterTestAccess = {
  routes: unknown[];
};

function resetRouterSingleton(): void {
  (Router as unknown as { __instance: unknown }).__instance = null;
}

describe("Router", () => {
  let router: Router;
  let rootElement: HTMLElement;

  beforeEach(() => {
    resetRouterSingleton();

    rootElement = document.createElement("div");
    rootElement.id = "app";
    document.body.appendChild(rootElement);

    router = new Router("#app");
  });

  afterEach(() => {
    document.body.removeChild(rootElement);
    window.history.pushState({}, "", "/");

    resetRouterSingleton();
  });

  it("use(): должен регистрировать несколько роутов", () => {
    router
      .use("/", TestPage)
      .use("/about", TestPage)
      .use("/contacts", TestPage);

    const routes = (router as unknown as RouterTestAccess).routes;
    expect(routes).toHaveLength(3);
  });

  it("go(): должен переходить на новый роут", () => {
    router.use("/", TestPage).use("/about", TestPage).start();

    router.go("/about");

    expect(window.location.pathname).toBe("/about");
  });
});
