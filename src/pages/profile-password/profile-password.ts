import { Block } from "../../core";
import { Input } from "../../components/input";
import { Button } from "../../components/button";
import type { ProfilePasswordPageProps, PasswordChangeData } from "./types";
import template from "./profile-password.hbs?raw";
import { UserAPI } from "../../api";
import { Avatar } from "../../components/avatar";
import { store } from "../../store";

export class ProfilePasswordPage extends Block<ProfilePasswordPageProps> {
  constructor(props?: ProfilePasswordPageProps) {
    const currentUser = store.getState().user;

    const data = currentUser;

    super("div", {
      ...props,
      data,
      profileAvatar: new Avatar({
        size: "large",
        first_name: currentUser?.first_name,
        avatar: currentUser?.avatar,
      }),
      oldPasswordInput: new Input({
        label: "Старый пароль",
        type: "password",
        name: "password",
        placeholder: "••••••••••••",
      }),
      newPasswordInput: new Input({
        label: "Новый пароль",
        type: "password",
        name: "password",
        placeholder: "••••••••••••",
      }),
      newPasswordConfirmInput: new Input({
        label: "Повторите новый пароль",
        type: "password",
        name: "password",
        placeholder: "••••••••••••",
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

    const oldPasswordInput = this.children.oldPasswordInput as Input;
    const newPasswordInput = this.children.newPasswordInput as Input;
    const newPasswordConfirmInput = this.children
      .newPasswordConfirmInput as Input;

    // dалидируем все поля
    const isOldValid = oldPasswordInput.validate();
    const isNewValid = newPasswordInput.validate();
    const isConfirmValid = newPasswordConfirmInput.validate();

    if (!isOldValid || !isNewValid || !isConfirmValid) {
      console.log("Форма содержит ошибки");
      return;
    }

    const oldPassword = oldPasswordInput.getValue();
    const newPassword = newPasswordInput.getValue();
    const confirmPassword = newPasswordConfirmInput.getValue();

    // проверка на совпадение паролей
    if (newPassword !== confirmPassword) {
      newPasswordConfirmInput.setProps({ error: "Пароли не совпадают" });
      return;
    }

    const data: PasswordChangeData = {
      oldPassword,
      newPassword,
    };

    const submitButton = this.children.submitButton as Button;
    submitButton.setProps({ disabled: true, text: "Сохранение..." });

    try {
      // ✅ Отправляем запрос на изменение пароля
      await UserAPI.changePassword(data);

      if (this.props?.onSubmit) {
        this.props.onSubmit(data);
      }
      alert("Пароль успешно изменен!");
      window.router.go("/settings");
    } catch (error: any) {
      let errorMessage = "Ошибка при изменении пароля";

      if (error?.reason === "Password is incorrect") {
        errorMessage = "Неверный старый пароль";
      } else if (error?.reason) {
        errorMessage = error.reason;
      }

      oldPasswordInput.setProps({
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
