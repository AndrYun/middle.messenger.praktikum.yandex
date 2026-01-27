import { Block } from "../../core";
import { Button } from "../button";
import { UserItem } from "../user-item";
import { ChatAPI } from "../../api/ChatApi";
import type { RemoveUserFormProps } from "./types";
import template from "./remove-user-form.hbs?raw";

export class RemoveUserForm extends Block<RemoveUserFormProps> {
  private selectedUserId: number | null = null;

  constructor(props: RemoveUserFormProps) {
    super("div", {
      ...props,
      attr: {
        class: "remove-user-form",
      },
      removeButton: new Button({
        text: "Удалить",
        type: "button",
        variant: "primary",
        onClick: () => this.handleRemove(),
      }),
    });
  }

  public async loadUsers(chatId: number): Promise<void> {
    try {
      console.log("📥 Loading users for chat:", chatId);

      // Показываем загрузку
      this.setProps({
        isLoading: true,
        userList: [],
      });

      const users = await ChatAPI.getChatUsers(chatId);

      console.log("✅ Loaded users:", users.length, users);

      // ✅ Создаем UserItem компоненты
      const userItems = users.map(
        (user) =>
          new UserItem({
            id: user.id,
            login: user.login,
            first_name: user.first_name,
            second_name: user.second_name,
            avatar: user.avatar,
            role: user.role,
            onClick: () => this.handleUserSelect(user.id),
          })
      );

      this.setProps({
        isLoading: false,
        userList: userItems,
        hasUsers: userItems.length > 0,
      });

      console.log("✅ UserItems created:", userItems.length);
    } catch (error) {
      console.error("❌ Error loading users:", error);
      this.setProps({
        isLoading: false,
        userList: [],
        hasUsers: false,
      });
    }
  }

  private handleUserSelect(userId: number): void {
    this.selectedUserId = userId;

    // ✅ Визуально выделяем выбранного пользователя
    const userItems = this.children.userList;
    if (Array.isArray(userItems)) {
      userItems.forEach((item) => {
        const itemElement = item.getContent();
        const itemId = item.getProps().id;

        if (itemElement) {
          if (itemId === userId) {
            itemElement.classList.add("user-item--selected");
          } else {
            itemElement.classList.remove("user-item--selected");
          }
        }
      });
    }

    console.log("Selected user:", userId);
  }

  private handleRemove(): void {
    if (!this.selectedUserId) {
      alert("Выберите пользователя для удаления");
      return;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(this.selectedUserId);
    }
  }

  public reset(): void {
    this.selectedUserId = null;
    this.setProps({
      userList: [],
      isLoading: false,
      hasUsers: false,
    });
  }

  protected render(): string {
    return template;
  }
}
