import { Route } from "./Route";
import type { Block } from "./Block";

export class Router {
  private static __instance: Router | null = null;
  private routes: Route[] = [];
  private history: History = window.history;
  private currentRoute: Route | null = null;
  private rootQuery: string = "";

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: new (props?: any) => Block): this {
    const route = new Route(pathname, block, { rootQuery: this.rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    // кнопки назад/вперед браузера
    window.addEventListener("popstate", (event: PopStateEvent) => {
      this.onRoute((event.currentTarget as Window).location.pathname);
    });

    // первая загрузка
    this.onRoute(window.location.pathname);
  }

  private async onRoute(pathname: string): Promise<void> {
    const route = this.getRoute(pathname);

    if (!route) {
      const notFoundRoute = this.getRoute("/404");
      if (notFoundRoute) {
        this.currentRoute = notFoundRoute;
        notFoundRoute.render();
      }
      return;
    }

    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this.onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }

  getCurrentPathname(): string {
    return window.location.pathname;
  }
}

export default Router;
