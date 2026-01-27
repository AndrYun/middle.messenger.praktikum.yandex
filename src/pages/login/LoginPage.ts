import { Block } from "../../core";
import { Button } from "../../components/button";
import { Input } from "../../components/input";
import { Link } from "../../components/link";
import type { LoginFormData, LoginPageProps } from "./types";
import template from "./login.hbs?raw";
import { AuthAPI } from "../../api/AuthApi";
import { store } from "../../store/Store";

export class LoginPage extends Block<LoginPageProps> {
  constructor(props?: LoginPageProps) {
    super("div", {
      ...props,
      loginInput: new Input({
        label: "Логин",
        type: "text",
        name: "login",
        placeholder: "ivanivanov",
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
          window.router.go("/sign-up");
        },
      }),
    });
  }

  private async handleSubmit(e: MouseEvent): Promise<void> {
    e.preventDefault();

    const loginInput = this.children.loginInput as Input;
    const passwordInput = this.children.passwordInput as Input;

    const isLoginValid = loginInput.validate();
    const isPasswordValid = passwordInput.validate();

    if (!isLoginValid || !isPasswordValid) {
      return;
    }

    const data: LoginFormData = {
      login: loginInput.getValue(),
      password: passwordInput.getValue(),
    };

    const submitButton = this.children.submitButton as Button;
    submitButton.setProps({ disabled: true, text: "Please wait..." });

    try {
      await AuthAPI.signin(data);

      const user = await AuthAPI.getUser();

      // сохраняем юзера в стор
      store.setUser(user);

      // после успешной авторизации идем в чаты
      window.router.go("/messenger");
    } catch (error: any) {
      const errorMessage = error?.reason || "Ошибка авторизации";

      passwordInput.setProps({ error: errorMessage });
    } finally {
      submitButton.setProps({ disabled: false, text: "Авторизоваться" });
    }
  }

  protected render(): string {
    return template;
  }
}
