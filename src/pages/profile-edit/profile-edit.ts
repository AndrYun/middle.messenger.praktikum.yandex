import { Block } from "../../core";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import type { ProfileEditPageProps } from "./types";
import type { ProfileData } from "../profile/types";
import template from "./profile-edit.hbs?raw";
import { UserAPI } from "../../api";
import { store } from "../../store";
import { Avatar } from "../../components/avatar";
import isAPIError from "../../api/types";

export class ProfileEditPage extends Block<ProfileEditPageProps> {
  constructor(props?: ProfileEditPageProps) {
    // берем данные из стора по юзеру
    const currentUser = store.getState().user;
    const defaultData = props?.data || {
      avatar: currentUser?.avatar || "",
      email: currentUser?.email || "",
      login: currentUser?.login || "",
      first_name: currentUser?.first_name || "",
      second_name: currentUser?.second_name || "",
      display_name: currentUser?.display_name || "",
      phone: currentUser?.phone || "",
    };
    const data = props?.data || defaultData;

    super("div", {
      ...props,
      data,
      profileAvatar: new Avatar({
        size: "large",
        avatar: data.avatar,
        first_name: data.first_name,
      }),
      emailInput: new Input({
        label: "Почта",
        type: "email",
        name: "email",
        value: data.email,
      }),
      loginInput: new Input({
        label: "Логин",
        type: "text",
        name: "login",
        value: data.login,
      }),
      firstNameInput: new Input({
        label: "Имя",
        type: "text",
        name: "first_name",
        value: data.first_name,
      }),
      secondNameInput: new Input({
        label: "Фамилия",
        type: "text",
        name: "second_name",
        value: data.second_name,
      }),
      displayNameInput: new Input({
        label: "Имя в чате",
        type: "text",
        name: "display_name",
        value: data.display_name,
      }),
      phoneInput: new Input({
        label: "Телефон",
        type: "tel",
        name: "phone",
        value: data.phone,
      }),
      submitButton: new Button({
        text: "Сохранить",
        type: "submit",
        variant: "primary",
        onClick: (e) => this.handleSubmit(e),
      }),
      events: {
        click: (e: Event) => this.handleBackClick(e),
      },
    });
  }

  private handleBackClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof Element)) {
      return;
    }

    const backButton = target.closest(".profile-page__back");

    if (backButton) {
      e.preventDefault();
      window.router.go("/settings");
    }
  }

  private async handleSubmit(e: MouseEvent): Promise<void> {
    e.preventDefault();

    // валидируем все поля
    const inputs = [
      this.children.emailInput,
      this.children.loginInput,
      this.children.firstNameInput,
      this.children.secondNameInput,
      this.children.displayNameInput,
      this.children.phoneInput,
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

    // собираем данные
    const data: ProfileData = {
      email: (this.children.emailInput as Input).getValue(),
      login: (this.children.loginInput as Input).getValue(),
      first_name: (this.children.firstNameInput as Input).getValue(),
      second_name: (this.children.secondNameInput as Input).getValue(),
      display_name: (this.children.displayNameInput as Input).getValue(),
      phone: (this.children.phoneInput as Input).getValue(),
    };

    const submitButton = this.children.submitButton as Button;
    const emailInput = this.children.emailInput as Input;

    submitButton.setProps({ disabled: true, text: "Saving..." });

    try {
      const updatedUser = await UserAPI.updateProfile(data);

      // в стор диспатчим обновленные данные
      store.setUser(updatedUser);

      if (this.props.onSubmit) {
        this.props.onSubmit(data);
      }
      alert("Данные сохранены!");
      window.router.go("/settings");
    } catch (error: unknown) {
      const errorMessage = isAPIError(error)
        ? error?.reason
        : "Ошибка обновления данных";

      emailInput.setProps({
        error: errorMessage,
      });
    } finally {
      submitButton.setProps({ disabled: false, text: "Сохранить" });
    }
  }

  protected render(): string {
    return template;
  }
}
