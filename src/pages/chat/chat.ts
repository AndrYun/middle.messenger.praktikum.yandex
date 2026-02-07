import { Block } from "../../core";
import { ChatItem } from "../../components/chat-item";
import { ChatHeader } from "../../components/chat-header";
import { ChatMenu } from "../../components/chat-menu";
import { Message } from "../../components/message";
import { MessageInput } from "../../components/message-input";
import { Modal } from "../../components/modal";
import { AddUserForm } from "../../components/add-user-form";
import type { ChatPageProps, WSMessage } from "./types";
import template from "./chat.hbs?raw";
import { store } from "../../store";
import { CreateChatForm } from "../../components/create-chat-form";
import { webSocketService } from "../../services/WebSocketService";
import { Button } from "../../components/button";
import type { Chat } from "../../api/types";
import { ChatAPI } from "../../api/ChatApi";
import { RemoveUserForm } from "../../components/remove-user-form";

class EmptyMessages extends Block {
  constructor() {
    super("p", { attr: { class: "chat-page__empty-messages" } });
  }
  protected render(): string {
    return "Нет сообщений";
  }
}

export class ChatPage extends Block<ChatPageProps> {
  private chatMenu!: ChatMenu;
  private addUserModal!: Modal;
  private removeUserModal!: Modal;
  private createChatModal!: Modal;

  private unsubscribeMessages?: () => void;

  constructor(props?: ChatPageProps) {
    const chats = store.getState().chats;
    const selectedChatId = store.getState().selectedChatId;
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    super("div", {
      ...props,
      chats,
      selectedChat: selectedChat || null,
      chatList: [],
      messageList: [new EmptyMessages()],
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });

    this.initializeComponents(chats, selectedChatId, selectedChat);
  }

  private initializeComponents(
    chats: Chat[],
    selectedChatId: number | null,
    selectedChat: Chat | undefined
  ): void {
    const addUserForm = new AddUserForm({
      onSubmit: async (userId: number) => {
        await this.addUserToChat(userId);
      },
    });

    this.addUserModal = new Modal({
      title: "Добавить пользователя",
      isOpen: false,
      content: addUserForm,
      onClose: () => addUserForm.reset(),
    });

    const removeUserForm = new RemoveUserForm({
      onSubmit: async (userId: number) => {
        await this.removeUserFromChat(userId);
      },
    });

    this.removeUserModal = new Modal({
      title: "Удалить пользователя",
      isOpen: false,
      content: removeUserForm,
      onOpen: async () => {
        const selectedId = store.getState().selectedChatId;
        if (selectedId) {
          await removeUserForm.loadUsers(selectedId);
        }
      },
      onClose: () => removeUserForm.reset(),
    });

    this.chatMenu = new ChatMenu({
      isOpen: false,
      onAddUser: () => {
        this.chatMenu.close();
        this.openAddUserModal();
      },
      onRemoveUser: () => {
        this.chatMenu.close();
        this.removeUserModal.open();
      },
    });

    const createChatForm = new CreateChatForm({
      onSubmit: async (title: string) => {
        await this.createChat(title);
      },
    });

    this.createChatModal = new Modal({
      title: "Создать чат",
      isOpen: false,
      content: createChatForm,
      onClose: () => createChatForm.reset(),
    });

    const chatList = this.createChatList(chats, selectedChatId);

    this.setProps({
      chatList,
      createChatButton: new Button({
        text: "+ Создать",
        type: "button",
        variant: "primary",
        onClick: () => this.createChatModal.open(),
      }),
      chatHeader: selectedChat
        ? new ChatHeader({
            name: selectedChat.title,
            avatar: selectedChat.avatar,
            onMenuClick: () => this.chatMenu.toggle(),
          })
        : null,
      chatMenu: this.chatMenu,
      messageInput: new MessageInput({
        placeholder: "Сообщение",
        // onSubmit: (message) => this.sendMessage(message),
        onSubmit: (message) => {
          void this.sendMessage(message);
        },
        onAttach: () => alert("Прикрепить файл"),
      }),
      addUserModal: this.addUserModal,
      removeUserModal: this.removeUserModal,
      createChatModal: this.createChatModal,
    });
  }

  protected async componentDidMount(): Promise<void> {
    await this.loadChats();

    // ВАЖНО: сохраняем unsubscribe, иначе будет утечка подписчиков
    this.unsubscribeMessages = store.subscribe(() => {
      const state = store.getState();
      this.updateChatsFromStore();
      this.updateMessagesFromStore([...state.messages]);
    });

    // добавляем/снимаем один и тот же reference (arrow function)
    window.addEventListener("newChatMessage", this.handleNewChatMessage);

    const selectedChatId = store.getState().selectedChatId;
    if (selectedChatId) {
      await this.connectToChat(selectedChatId);
    }
  }

  protected componentWillUnmount(): void {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
      this.unsubscribeMessages = undefined;
    }

    window.removeEventListener("newChatMessage", this.handleNewChatMessage);

    webSocketService.disconnect();
    store.clearMessages();
  }

  private updateMessagesFromStore(messages: WSMessage[]): void {
    const currentUser = store.getState().user;
    const selectedChatId = store.getState().selectedChatId;
    if (!currentUser || !selectedChatId) return;

    const normalized = [...messages].sort((a, b) => {
      const ta = Date.parse(a.time);
      const tb = Date.parse(b.time);
      if (!Number.isNaN(ta) && !Number.isNaN(tb)) return ta - tb;
      return (a.id ?? 0) - (b.id ?? 0);
    });

    const messageComponents =
      normalized.length === 0
        ? [new EmptyMessages()]
        : normalized.map(
            (msg) =>
              new Message({
                id: msg.id,
                text: msg.content,
                time: new Date(msg.time).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                isMy: msg.user_id === currentUser.id,
              })
          );

    this.setProps({ messageList: messageComponents });

    // скроллим только если есть реальные сообщения
    if (normalized.length > 0) {
      requestAnimationFrame(() => this.scrollToBottom());
    }
  }

  private handleNewChatMessage = async (event: Event): Promise<void> => {
    const customEvent = event as CustomEvent;
    const message = customEvent.detail;

    const chats = store.getState().chats;
    const currentUser = store.getState().user;
    const selectedChatId = store.getState().selectedChatId;

    const updatedChats = chats.map((chat) => {
      if (chat.id !== message.chat_id) return chat;

      const shouldIncrementUnread =
        !!currentUser &&
        message.user_id !== currentUser.id &&
        chat.id !== selectedChatId;

      return {
        ...chat,
        last_message: {
          user: {
            id: message.user_id,
            first_name: "",
            second_name: "",
            display_name: "",
            login: "",
            avatar: "",
            email: "",
            phone: "",
          },
          time: message.time,
          content: message.content,
        },
        unread_count: shouldIncrementUnread
          ? (chat.unread_count || 0) + 1
          : chat.unread_count || 0,
      };
    });

    updatedChats.sort((a, b) => {
      const timeA = a.last_message?.time
        ? new Date(a.last_message.time).getTime()
        : 0;
      const timeB = b.last_message?.time
        ? new Date(b.last_message.time).getTime()
        : 0;
      return timeB - timeA;
    });

    store.setChats(updatedChats);
  };

  private async loadChats(): Promise<void> {
    try {
      const chats = await ChatAPI.getChats();
      const chatsWithUnreadCounts = await Promise.all(
        chats.map(async (chat) => {
          try {
            const { unread_count } = await ChatAPI.getNewMessagesCount(chat.id);
            return { ...chat, unread_count };
          } catch (error) {
            console.error(
              "Ошибка загрузки unread_count для чата:",
              chat.id,
              error
            );
            return chat;
          }
        })
      );

      store.setChats(chatsWithUnreadCounts);
      this.updateChatsFromStore();
    } catch (error) {
      console.error("Ошибка загрузки чатов:", error);
    }
  }

  private createChatList(
    chats: Chat[],
    selectedChatId: number | null
  ): ChatItem[] {
    const currentUser = store.getState().user;

    return chats.map((chat) => {
      const lastMessage = chat.last_message;

      return new ChatItem({
        id: chat.id,
        name: chat.title,
        lastMessage: lastMessage?.content || "Нет сообщений",
        time: lastMessage?.time
          ? new Date(lastMessage.time).toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
        unreadCount: chat.unread_count || 0,
        avatar: chat.avatar,
        isYou: lastMessage ? lastMessage.user.id === currentUser?.id : false,
        active: chat.id === selectedChatId,
        onClick: (id: number) => this.handleChatSelect(id),
      });
    });
  }

  private updateChatsFromStore(): void {
    const chats = store.getState().chats;
    const selectedChatId = store.getState().selectedChatId;
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    const newChatList = this.createChatList(chats, selectedChatId);

    this.setProps({
      chats,
      selectedChat: selectedChat || null,
      chatList: newChatList,
      chatHeader: selectedChat
        ? new ChatHeader({
            name: selectedChat.title,
            avatar: selectedChat.avatar,
            onMenuClick: () => this.chatMenu.toggle(),
          })
        : null,
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof Element)) return;

    if (target.closest(".chat-page__profile-link")) {
      e.preventDefault();
      window.router.go("/settings");
      return;
    }

    if (
      !target.closest(".chat-header__menu") &&
      !target.closest(".chat-menu")
    ) {
      this.chatMenu.close();
    }
  }

  private async handleChatSelect(chatId: number): Promise<void> {
    try {
      await webSocketService.disconnect();

      store.selectChat(chatId);

      const chats = store.getState().chats;
      store.setChats(
        chats.map((c) => (c.id === chatId ? { ...c, unread_count: 0 } : c))
      );
      this.updateChatsFromStore();

      store.clearMessages();
      await this.connectToChat(chatId);
    } catch (error) {
      alert("Ошибка при переключении чата");
    }
  }

  private async connectToChat(chatId: number): Promise<void> {
    try {
      const { token } = await ChatAPI.getChatToken(chatId);
      await webSocketService.connect(chatId, token);
    } catch (error) {
      alert("Ошибка подключения к чату");
    }
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const root = this.getContent();
      const messagesContainer = root?.querySelector(
        ".chat-page__messages"
      ) as HTMLElement | null;

      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  }

  private async sendMessage(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;

    const state = store.getState();
    const selectedChatId = state.selectedChatId;
    const user = state.user;

    if (!selectedChatId || !user) return;

    if (!webSocketService.isConnectedTo(selectedChatId)) {
      try {
        await this.connectToChat(selectedChatId);
      } catch (e) {
        alert("Не удалось подключиться к чату");
        return;
      }
    }

    const nowIso = new Date().toISOString();

    const updatedChats = [...state.chats].map((chat) => {
      if (chat.id !== selectedChatId) return chat;

      return {
        ...chat,
        last_message: {
          user: user,
          time: nowIso,
          content: trimmed,
        },
        unread_count: 0,
      };
    });

    // Поднимаем чат наверх
    updatedChats.sort((a, b) => {
      const timeA = a.last_message?.time
        ? new Date(a.last_message.time).getTime()
        : 0;
      const timeB = b.last_message?.time
        ? new Date(b.last_message.time).getTime()
        : 0;
      return timeB - timeA;
    });

    store.setChats(updatedChats);

    const ok = webSocketService.sendMessage(trimmed);
    if (!ok) {
      alert("Не удалось отправить сообщение: нет соединения");
      return;
    }

    const messageInput = this.children.messageInput as MessageInput;
    messageInput?.clear?.();
  }

  private async createChat(title: string): Promise<void> {
    try {
      const result = await ChatAPI.createChat({ title });
      await this.loadChats();
      this.createChatModal.close();

      const newChatId = result?.id;
      if (typeof newChatId === "number") {
        store.selectChat(newChatId);
        await this.connectToChat(newChatId);
      }
    } catch (error: unknown) {
      alert("Ошибка при создании чата");
    }
  }

  private async addUserToChat(userId: number): Promise<void> {
    const selectedChatId = store.getState().selectedChatId;
    if (!selectedChatId) return;

    try {
      await ChatAPI.addUsersToChat({
        users: [userId],
        chatId: selectedChatId,
      });

      this.addUserModal.close();
      await this.loadChats();
      alert("Пользователь добавлен в чат");
    } catch (error) {
      alert("Ошибка при добавлении пользователя");
    }
  }

  private async removeUserFromChat(userId: number): Promise<void> {
    const selectedChatId = store.getState().selectedChatId;
    if (!selectedChatId) return;

    try {
      await ChatAPI.deleteUsersFromChat({
        users: [userId],
        chatId: selectedChatId,
      });

      this.removeUserModal.close();
      alert("Пользователь удалён из чата");

      await this.loadChats();
    } catch (error) {
      alert("Ошибка при удалении пользователя");
    }
  }

  private openAddUserModal(): void {
    this.addUserModal.open();
  }

  protected render(): string {
    return template;
  }
}
