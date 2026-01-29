import Handlebars from "handlebars";
import { nanoid } from "nanoid";
import { EventBus } from "./EventBus";

// События жизненного цикла компонента
export enum BlockEvents {
  INIT = "init",
  FLOW_CDM = "flow:component-did-mount",
  FLOW_CDU = "flow:component-did-update",
  FLOW_RENDER = "flow:render",
}

export interface BlockProps {
  [key: string]: unknown;
  events?: Record<string, (event: Event) => void>;
  attr?: Record<string, string>;
}

export abstract class Block<P extends BlockProps = BlockProps> {
  static EVENTS = BlockEvents;

  private _element: HTMLElement | null = null;
  private _meta: { tagName: string; props: P };
  private eventBus: EventBus;

  protected props: P;
  protected children: Record<string, Block | Block[]>;
  protected lists: Record<string, unknown[]>;
  public id: string;

  constructor(tagName: string = "div", propsAndChildren: P = {} as P) {
    const eventBus = new EventBus();

    const { children, props, lists } = this._getChildren(propsAndChildren);

    this.children = children;
    this.lists = lists;
    this.id = nanoid(6);

    this._meta = { tagName, props: props as P };
    this.eventBus = eventBus;
    this.props = this._makePropsProxy(props as P);

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(
    propsAndChildren: P,
    prevChildren?: Record<string, Block | Block[]>
  ) {
    const children: Record<string, Block | Block[]> = {};
    const props: Record<string, unknown> = {};
    const lists: Record<string, unknown[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
        return;
      }

      if (Array.isArray(value)) {
        const wasChildArray = Array.isArray(prevChildren?.[key]);
        const isBlockArray =
          value.length > 0
            ? value.every((item) => item instanceof Block)
            : false;

        if (
          (value.length > 0 && isBlockArray) ||
          (value.length === 0 && wasChildArray)
        ) {
          children[key] = value as unknown as Block[];
        } else {
          lists[key] = value;
        }
        return;
      }

      props[key] = value;
    });

    return { children, props, lists };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  protected init(): void {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child))
        child.forEach((ch) => ch.dispatchComponentDidMount());
      else child.dispatchComponentDidMount();
    });
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(_oldProps: P, _newProps: P): boolean {
    return true;
  }

  public setProps = (nextProps: Partial<P>): void => {
    if (!nextProps) return;

    const oldProps = {
      ...(this.props as unknown as Record<string, unknown>),
    } as P;

    // Удаление ключей children/lists по null/undefined
    Object.entries(nextProps).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        if (key in this.children) delete this.children[key];
        if (key in this.lists) delete this.lists[key];
      }
    });

    const { children, props, lists } = this._getChildren(
      nextProps as P,
      this.children
    );

    if (Object.keys(children).length) Object.assign(this.children, children);
    if (Object.keys(props).length) Object.assign(this.props, props);
    if (Object.keys(lists).length) Object.assign(this.lists, lists);

    this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const block = this.render();
    if (!this._element) return;

    this._removeEvents();
    this._element.innerHTML = "";

    const template = Handlebars.compile(block);
    const fragment = this._createDocumentElement(
      "template"
    ) as HTMLTemplateElement;
    fragment.innerHTML = template({ ...this.props, ...this.lists });

    this._replaceStubs(fragment.content);

    this._element.appendChild(fragment.content);
    this._addEvents();
    this._addAttributes();
  }

  private _replaceStubs(fragment: DocumentFragment): void {
    Object.entries(this.children).forEach(([key, child]) => {
      const stub = fragment.querySelector(`[data-id="${key}"]`);
      if (!stub) return;

      if (Array.isArray(child)) {
        child.forEach((ch) => {
          const content = ch.getContent();
          if (content) stub.before(content);
        });
        stub.remove();
      } else {
        const content = child.getContent();
        if (content) stub.replaceWith(content);
      }
    });
  }

  protected abstract render(): string;

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    const eventBus = this.eventBus;

    return new Proxy(props, {
      get(target, prop: string | symbol, receiver): unknown {
        const value = Reflect.get(target as object, prop, receiver) as unknown;

        if (typeof value === "function") {
          return (value as (...args: unknown[]) => unknown).bind(target);
        }

        return value;
      },

      set(target, prop: string | symbol, value: unknown, receiver): boolean {
        const oldProps = { ...(target as Record<string, unknown>) } as P;

        const result = Reflect.set(target as object, prop, value, receiver);

        eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);

        return result;
      },

      deleteProperty(): boolean {
        throw new Error("Нет доступа");
      },
    }) as P;
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  private _addEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  private _removeEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  private _addAttributes(): void {
    const { attr = {} } = this.props;
    Object.entries(attr).forEach(([key, value]) => {
      this._element?.setAttribute(key, value);
    });
  }

  public show(): void {
    this.getContent()!.style.display = "block";
  }

  public hide(): void {
    this.getContent()!.style.display = "none";
  }

  public getProps(): P {
    return this.props;
  }
}
