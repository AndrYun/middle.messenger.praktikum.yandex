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

    this._meta = {
      tagName,
      props: props as P,
    };

    this.props = this._makePropsProxy(props as P);
    this.eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: P) {
    const children: Record<string, Block | Block[]> = {};
    const props: Record<string, unknown> = {};
    const lists: Record<string, unknown[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (
        Array.isArray(value) &&
        value.length > 0 && // ✅ Проверяем что массив не пустой
        value.every((item) => item instanceof Block)
      ) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  // DOM
  private _createResources(): void {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  // инициализвация
  protected init(): void {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  // монтирование в дом
  private _componentDidMount(): void {
    this.componentDidMount();

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((ch) => ch.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  // переопределяем после монтирования
  protected componentDidMount(): void {}

  // эммитим о монитировании компоенента
  public dispatchComponentDidMount(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);
    if (shouldUpdate) {
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  // переопределение апдейта
  protected componentDidUpdate(_oldProps: P, _newProps: P): boolean {
    return true;
  }

  public setProps = (nextProps: Partial<P>): void => {
    if (!nextProps) {
      return;
    }

    const oldProps = { ...this.props };
    const { children, props } = this._getChildren(nextProps as P);

    if (Object.keys(children).length) {
      Object.assign(this.children, children);
    }

    if (Object.keys(props).length) {
      Object.assign(this.props, props);
    }

    this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, this.props);
  };

  // получаем дом элемент компонента
  get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const block = this.render();

    if (!this._element) {
      return;
    }

    this._removeEvents();
    this._element.innerHTML = "";

    const template = Handlebars.compile(block);
    const fragment = this._createDocumentElement(
      "template"
    ) as HTMLTemplateElement;
    fragment.innerHTML = template({ ...this.props, ...this.lists });

    // меняем заглушки на реальные компоненты
    this._replaceStubs(fragment.content);

    this._element.appendChild(fragment.content);
    this._addEvents();
    this._addAttributes();
  }

  // меняем заглушки на реальные комп
  private _replaceStubs(fragment: DocumentFragment): void {
    Object.entries(this.children).forEach(([key, child]) => {
      const stub = fragment.querySelector(`[data-id="${key}"]`);

      if (!stub) {
        return;
      }

      if (Array.isArray(child)) {
        child.forEach((ch) => {
          const content = ch.getContent();
          if (content) {
            stub.before(content);
          }
        });
        stub.remove();
      } else {
        const content = child.getContent();
        if (content) {
          stub.replaceWith(content);
        }
      }
    });
  }

  protected abstract render(): string;

  public getContent(): HTMLElement | null {
    return this.element;
  }

  // Proxy для отслеживания изменений props
  private _makePropsProxy(props: P): P {
    return new Proxy(props, {
      get: (target, prop: string) => {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set: (target, prop: string, value) => {
        const oldProps = { ...target };
        target[prop as keyof P] = value;
        this.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty: () => {
        throw new Error("Нет доступа");
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  // обработчики
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

  // показываем
  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "block";
    }
  }

  // скрываем
  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "none";
    }
  }

  public getProps(): P {
    return this.props;
  }
}
