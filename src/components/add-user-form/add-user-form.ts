import { Block } from "../../core";
import { Input } from "../input";
import { Button } from "../button";
import { ChatAPI } from "../../api/ChatApi";
import type { AddUserFormProps } from "./types";
import template from "./add-user-form.hbs?raw";

export class AddUserForm extends Block<AddUserFormProps> {
  constructor(props: AddUserFormProps) {
    super("form", {
      ...props,
      loginInput: new Input({
        label: "Логин",
        type: "text",
        name: "login",
        placeholder: "ivanivanov",
      }),
      searchButton: new Button({
        text: "Найти",
        type: "button",
        variant: "secondary",
        onClick: () => this.handleSearch(),
      }),
      submitButton: new Button({
        text: "Добавить",
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

    if (!this.props.foundUser) {
      const loginInput = this.children.loginInput as Input;
      loginInput.setProps({ error: "Сначала найдите пользователя" });
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(this.props.foundUser.id);
    }
  }

  private async handleSearch(): Promise<void> {
    const loginInput = this.children.loginInput as Input;
    const login = loginInput.getValue();

    if (!login) {
      loginInput.setProps({ error: "Введите логин" });
      return;
    }

    const searchButton = this.children.searchButton as Button;
    searchButton.setProps({ disabled: true, text: "Поиск..." });

    try {
      const users = await ChatAPI.searchUsers({ login });

      if (users.length === 0) {
        loginInput.setProps({ error: "Пользователь не найден" });
      } else {
        // сэйвим найденного пользователя
        this.setProps({ foundUser: users[0] });
        loginInput.setProps({ error: "" });
        console.log("Найден пользователь:", users[0]);
      }
    } catch (error: unknown) {
      loginInput.setProps({ error: "Ошибка поиска" });
    } finally {
      searchButton.setProps({ disabled: false, text: "Найти" });
    }
  }

  public reset(): void {
    (this.children.loginInput as Input).setValue("");
    this.setProps({ foundUser: undefined });
  }

  protected render(): string {
    return template;
  }
}
