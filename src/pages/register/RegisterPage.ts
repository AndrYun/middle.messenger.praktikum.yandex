import { Block } from "../../core";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Link } from "../../components/link";
import type { RegisterPageProps, RegisterData } from "./types";
import template from "./register.hbs?raw";

export class RegisterPage extends Block<RegisterPageProps> {
  constructor(props: RegisterPageProps) {
    super("div", {
      ...props,
      emailInput: new Input({
        label: "Почта",
        type: "email",
        name: "email",
        placeholder: "pochta@yandex.ru",
      }),
      loginInput: new Input({
        label: "Логин",
        type: "text",
        name: "login",
        placeholder: "ivanivanov",
      }),
      firstNameInput: new Input({
        label: "Имя",
        type: "text",
        name: "first_name",
        placeholder: "Иван",
      }),
      secondNameInput: new Input({
        label: "Фамилия",
        type: "text",
        name: "second_name",
        placeholder: "Иванов",
      }),
      phoneInput: new Input({
        label: "Телефон",
        type: "tel",
        name: "phone",
        placeholder: "+7 (999) 999 99 99",
      }),
      passwordInput: new Input({
        label: "Пароль",
        type: "password",
        name: "password",
        placeholder: "••••••••••••",
      }),
      submitButton: new Button({
        text: "Create account",
        type: "submit",
        variant: "primary",
        onClick: (e) => this.handleSubmit(e),
      }),
      loginLink: new Link({
        text: "Sign in",
        href: "#",
        variant: "primary",
        onClick: (e) => {
          e.preventDefault();
          window.router.go("/");
        },
      }),
    });
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    // Валидируем все поля
    const inputs = [
      this.children.emailInput,
      this.children.loginInput,
      this.children.firstNameInput,
      this.children.secondNameInput,
      this.children.phoneInput,
      this.children.passwordInput,
    ] as Input[];

    let isValid = true;
    inputs.forEach((input) => {
      if (!input.validate()) {
        isValid = false;
      }
    });

    if (!isValid) {
      console.log("Форма содержит ошибки");
      return;
    }

    const data: RegisterData = {
      email: (this.children.emailInput as Input).getValue(),
      login: (this.children.loginInput as Input).getValue(),
      first_name: (this.children.firstNameInput as Input).getValue(),
      second_name: (this.children.secondNameInput as Input).getValue(),
      phone: (this.children.phoneInput as Input).getValue(),
      password: (this.children.passwordInput as Input).getValue(),
    };

    console.log("Registration data:", data);

    window.router.go("/");

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  protected render(): string {
    return template;
  }
}
