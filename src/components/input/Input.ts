import { Block } from "../../core";
import type { InputProps } from "./types";
import { validateField } from "../../utils/validation";
import template from "./input.hbs?raw";

export class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super("div", {
      ...props,
      value: props.value || "",
      events: {
        input: (e: Event) => this.handleInput(e),
        focus: () => this.handleFocus(),
        blur: (e: Event) => this.handleBlur(e),
      },
    });
  }

  private handleInput(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    this.setProps({ value: target.value });

    if (this.props.onInput) {
      this.props.onInput(target.value);
    }

    if (this.props.error) {
      this.setProps({ error: "" });
    }
  }

  private handleFocus(): void {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  private handleBlur(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const error = validateField(this.props.name, target.value);
    if (error) {
      this.setProps({ error });
    }

    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  // переопределяем componentDidUpdate
  protected componentDidUpdate(
    oldProps: InputProps,
    newProps: InputProps
  ): boolean {
    // сравниваем старые и новые знач пропсов
    const onlyValueChanged =
      oldProps.value !== newProps.value &&
      oldProps.error === newProps.error &&
      oldProps.label === newProps.label &&
      oldProps.placeholder === newProps.placeholder;

    if (onlyValueChanged) {
      // если изменился только value апдейтим его вручную в Доме
      const input = this.element?.querySelector<HTMLInputElement>("input");
      if (input && input.value !== newProps.value) {
        // сейвим позицию курсора
        const selectionStart = input.selectionStart;
        const selectionEnd = input.selectionEnd;

        input.value = newProps.value || "";

        // воскрешаем позицию курсора
        if (selectionStart !== null && selectionEnd !== null) {
          input.setSelectionRange(selectionStart, selectionEnd);
        }
      }

      return false; // не ререндерим
    }

    // Если изменилось что-то другое (error, label и т.д.) - делаем ре-рендер
    return true;
  }

  public getValue(): string {
    if (this.props.value) {
      return this.props.value;
    }

    const input = this.element?.querySelector<HTMLInputElement>(".input");

    if (!input) {
      console.error("Input element not found in", this.element);
      return "";
    }

    return input.value.trim();
  }

  public setValue(value: string): void {
    this.setProps({ value });

    const input = this.element?.querySelector<HTMLInputElement>(".input");
    if (input) {
      input.value = value;
    }
  }

  public getName(): string {
    return this.props.name;
  }

  public validate(): boolean {
    const value = this.getValue();
    const error = validateField(this.props.name, value);

    if (error) {
      this.setProps({ error });
      return false;
    }

    this.setProps({ error: "" });
    return true;
  }

  protected render(): string {
    return template;
  }
}
