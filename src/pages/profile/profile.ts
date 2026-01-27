import { Block } from "../../core";
import { ProfileField } from "../../components/profile-field";
import { Link } from "../../components/link";
import { Modal } from "../../components/modal";
import { AvatarUpload } from "../../components/avatar-upload";
import type { ProfilePageProps } from "./types";
import template from "./profile.hbs?raw";
import { AuthAPI } from "../../api/AuthApi";
import { store } from "../../store/Store";
import { UserAPI } from "../../api";
import { ProfileData } from "./types";
import { Avatar } from "../../components/avatar";

export class ProfilePage extends Block<ProfilePageProps> {
  constructor(props?: ProfilePageProps) {
    const currentUser = store.getState().user;
    const defaultData = props?.data || {
      email: currentUser?.email || "",
      login: currentUser?.login || "",
      first_name: currentUser?.first_name || "",
      second_name: currentUser?.second_name || "",
      display_name: currentUser?.display_name || "",
      phone: currentUser?.phone || "",
      avatar: currentUser?.avatar || "",
    };

    // cоздаем компонент загрузки аватара
    const avatarUpload = new AvatarUpload({
      onChange: async (file) => {
        console.log("File selected:", file);

        try {
          const updatedUser = await UserAPI.updateAvatar(file);

          store.setUser(updatedUser);

          console.log("✅ Avatar updated:", updatedUser);

          // закрываем модалку
          avatarModal.close();

          // обновляем страницу чтобы показать новый аватар
          window.router.go("/settings");
        } catch (error: any) {
          alert("Ошибка при загрузке аватара");
        }
      },
    });

    // cоздаем модалку
    const avatarModal = new Modal({
      title: "Загрузите файл",
      isOpen: false,
      content: avatarUpload,
    });

    const data = props?.data || defaultData;

    super("div", {
      ...props,
      data,
      avatarModal,
      profileAvatar: new Avatar({
        avatar: data.avatar,
        first_name: data.first_name,
        size: "large",
        onClick: () => {
          avatarModal.open();
        },
      }),
      emailField: new ProfileField({
        label: "Почта",
        value: data.email,
      }),
      loginField: new ProfileField({
        label: "Логин",
        value: data.login,
      }),
      firstNameField: new ProfileField({
        label: "Имя",
        value: data.first_name,
      }),
      secondNameField: new ProfileField({
        label: "Фамилия",
        value: data.second_name,
      }),
      displayNameField: new ProfileField({
        label: "Имя в чате",
        value: data.display_name,
      }),
      phoneField: new ProfileField({
        label: "Телефон",
        value: data.phone,
      }),
      editLink: new Link({
        text: "Изменить данные",
        href: "/profile-edit",
        variant: "primary",
        onClick: (e) => {
          e.preventDefault();
          window.router.go("/profile-edit");
        },
      }),
      passwordLink: new Link({
        text: "Изменить пароль",
        href: "/profile-password",
        variant: "primary",
        onClick: (e) => {
          e.preventDefault();
          window.router.go("/profile-password");
        },
      }),
      logoutLink: new Link({
        text: "Выйти",
        href: "/",
        variant: "danger",
        onClick: (e) => {
          e.preventDefault();
          this.handleLogout();
        },
      }),
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof Element)) {
      return;
    }

    const backButton = target.closest(".profile-page__back");

    // вернуться
    if (backButton) {
      e.preventDefault();
      window.router.go("/messenger");
      return;
    }

    if (target.closest(".profile-page__avatar-circle")) {
      const modal = this.children.avatarModal;
      if (modal instanceof Modal) {
        modal.open();
      }
    }
  }

  private async handleLogout(): Promise<void> {
    try {
      await AuthAPI.logout();
      store.setUser(null);
      window.router.go("/");
    } catch (error) {
      alert(error);
    }
  }

  protected componentDidMount(): void {
    // ✅ Подписываемся на изменения store
    store.subscribe(() => {
      this.updateUserData();
    });
  }

  private updateUserData(): void {
    const currentUser = store.getState().user;

    if (!currentUser) {
      return;
    }

    const data: ProfileData = {
      email: currentUser.email,
      login: currentUser.login,
      first_name: currentUser.first_name,
      second_name: currentUser.second_name,
      display_name: currentUser.display_name,
      phone: currentUser.phone,
      avatar: currentUser.avatar,
    };

    this.setProps({ data });

    // апдейтим все поля
    (this.children.profileAvatar as Avatar).setProps({
      avatar: data.avatar,
      firstName: data.first_name,
    });
    (this.children.emailField as ProfileField).setProps({ value: data.email });
    (this.children.loginField as ProfileField).setProps({ value: data.login });
    (this.children.firstNameField as ProfileField).setProps({
      value: data.first_name,
    });
    (this.children.secondNameField as ProfileField).setProps({
      value: data.second_name,
    });
    (this.children.displayNameField as ProfileField).setProps({
      value: data.display_name,
    });
    (this.children.phoneField as ProfileField).setProps({ value: data.phone });
  }

  protected render(): string {
    return template;
  }
}
