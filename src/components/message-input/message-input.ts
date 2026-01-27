import { Block } from "../../core";
import type { MessageInputProps } from "./types";
import { validateField } from "../../utils/validation";
import template from "./message-input.hbs?raw";
import { Button } from "../button";

export class MessageInput extends Block<MessageInputProps> {
  constructor(props: MessageInputProps) {
    super("form", {
      ...props,
      attr: {
        class: "message-input",
      },
      attachButton: new Button({
        text: "📎",
        type: "button",
        variant: "secondary",
        onClick: () => {
          if (props.onAttach) {
            props.onAttach();
          }
        },
      }),
      sendButton: new Button({
        text: "→",
        type: "submit",
        variant: "primary",
        onClick: (e) => this.handleSubmit(e),
      }),
      placeholder: props.placeholder || "Сообщение",
      events: {
        submit: (e: Event) => this.handleSubmit(e),
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.closest(".message-input__attach")) {
      if (this.props.onAttach) {
        this.props.onAttach();
      }
    }
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();

    const input = this.element?.querySelector<HTMLInputElement>(
      ".message-input__field"
    );
    const message = input?.value.trim();

    const error = validateField("message", message || "");

    if (error) {
      console.error("Validation error:", error);
      return;
    }

    if (this.props.onSubmit && message) {
      this.props.onSubmit(message);
    }
    this.clear();
  }

  // получить тек знач
  public getValue(): string {
    const input = this.element?.querySelector<HTMLInputElement>(
      ".message-input__field"
    );
    return input?.value || "";
  }

  // очищаем поле
  public clear(): void {
    const textarea = this.element?.querySelector<HTMLTextAreaElement>(
      ".message-input__field"
    );
    if (textarea) {
      textarea.value = "";
    }
  }

  protected render(): string {
    return template;
  }
}
