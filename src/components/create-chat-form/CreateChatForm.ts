import { Block } from "../../core";
import { Input } from "../input";
import { Button } from "../button";
import type { CreateChatFormProps } from "./types";
import template from "./create-chat-form.hbs?raw";

export class CreateChatForm extends Block<CreateChatFormProps> {
  constructor(props: CreateChatFormProps) {
    super("form", {
      ...props,
      titleInput: new Input({
        label: "Название чата",
        type: "text",
        name: "title",
        placeholder: "Введите название",
      }),
      submitButton: new Button({
        text: "Создать",
        type: "submit",
        variant: "primary",
        onClick: (e) => this.handleSubmit(e),
      }),
      events: {
        submit: (e: Event) => {
          e.preventDefault();
        },
      },
    });
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    const titleInput = this.children.titleInput as Input;
    const title = titleInput.getValue();

    if (!title) {
      titleInput.setProps({ error: "Введите название чата" });
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(title);
    }
  }

  public reset(): void {
    (this.children.titleInput as Input).setValue("");
  }

  protected render(): string {
    return template;
  }
}
