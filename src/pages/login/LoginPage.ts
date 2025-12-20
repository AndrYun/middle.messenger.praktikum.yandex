import { Block } from "../../core";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Link } from "../../components/link";
import type { LoginPageProps } from "./types";
import template from "./login.hbs?raw";

export class LoginPage extends Block<LoginPageProps> {
  constructor(props: LoginPageProps) {
    super("div", {
      ...props,
      loginInput: new Input({
        label: "Логин",
        type: "text",
        name: "login",
        placeholder: "ivanivanov",
        value: "ivanivanov",
        onBlur: () => {
          (this.children.loginInput as Input).validate();
        },
      }),
      passwordInput: new Input({
        label: "Пароль",
        type: "password",
        name: "password",
        placeholder: "••••••••••••",
        onBlur: () => {
          (this.children.passwordInput as Input).validate();
        },
      }),
      submitButton: new Button({
        text: "Авторизоваться",
        type: "submit",
        variant: "primary",
        onClick: (e) => this.handleSubmit(e),
      }),
      registerLink: new Link({
        text: "Sign up",
        href: "#",
        variant: "primary",
        onClick: (e) => {
          e.preventDefault();
          window.navigateTo("register");
        },
      }),
    });
  }

  private handleSubmit(e: MouseEvent): void {
    e.preventDefault();

    const loginInput = this.children.loginInput as Input;
    const passwordInput = this.children.passwordInput as Input;

    const isLoginValid = loginInput.validate();
    const isPasswordValid = passwordInput.validate();

    if (!isLoginValid || !isPasswordValid) {
      console.log("Форма содержит ошибки");
      return;
    }

    const data = {
      login: loginInput.getValue(),
      password: passwordInput.getValue(),
    };

    console.log("Login data:", data);

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  protected render(): string {
    return template;
  }
}
