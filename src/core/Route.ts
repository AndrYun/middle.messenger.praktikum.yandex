import type { Block } from "./Block";
import { BlockConstructor } from "./types";

export class Route {
  private pathname: string;
  private blockClass: BlockConstructor;
  private block: Block | null = null;
  private props: { rootQuery: string };

  constructor(
    pathname: string,
    view: BlockConstructor,
    props: { rootQuery: string }
  ) {
    this.pathname = pathname;
    this.blockClass = view;
    this.props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this.pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this.block) {
      const content = this.block.getContent();

      if (content && content.parentNode) {
        content.parentNode.removeChild(content);
      }
    }
  }

  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  render(): void {
    if (!this.block) {
      // создаем блок первый раз
      this.block = new this.blockClass();
    }

    // показываем существующий блок
    this.renderBlock();
  }

  private renderBlock(): void {
    if (!this.block) {
      return;
    }

    const root = document.querySelector(this.props.rootQuery);

    if (!root) {
      throw new Error(`Root element ${this.props.rootQuery} not found`);
    }

    // очищаем root
    root.innerHTML = "";

    const content = this.block.getContent();
    if (content) {
      root.appendChild(content);
    }

    // вызываем componentDidMount
    this.block.dispatchComponentDidMount();
  }
}
