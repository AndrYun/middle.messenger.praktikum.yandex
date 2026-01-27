import { Block } from "../../core";
import { ChatItem } from "../../components/chat-item";
import { ChatHeader } from "../../components/chat-header";
import { ChatMenu } from "../../components/chat-menu";
import { Message } from "../../components/message";
import { MessageInput } from "../../components/message-input";
import { Modal } from "../../components/modal";
import { AddUserForm } from "../../components/add-user-form";
import type { ChatPageProps } from "./types";
import template from "./chat.hbs?raw";
import { store } from "../../store";
import { CreateChatForm } from "../../components/create-chat-form";
import { webSocketService } from "../../services/WebSocketService";
import { Button } from "../../components/button";
import { ChatAPI } from "../../api/ChatApi";
import { RemoveUserForm } from "../../components/remove-user-form";

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
      selectedChat,
      chatList: [],
      messageList: [],
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });

    this.initializeComponents(chats, selectedChatId, selectedChat);
  }

  // метод для инициализации компонентов
  private initializeComponents(
    chats: any[],
    selectedChatId: number | null,
    selectedChat: any
  ): void {
    // Меню чата
    this.chatMenu = new ChatMenu({
      isOpen: false,
      onAddUser: () => {
        this.chatMenu.close();
        this.openAddUserModal();
      },
      onRemoveUser: () => {
        this.chatMenu.close();
        this.openRemoveUserModal();
      },
    });

    const addUserForm = new AddUserForm({
      onSubmit: async (userId: number) => {
        await this.addUserToChat(userId);
      },
    });

    this.addUserModal = new Modal({
      title: "Добавить пользователя",
      isOpen: false,
      content: addUserForm,
      onClose: () => {
        addUserForm.reset();
      },
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
        // Загружаем пользователей при открытии
        const selectedChatId = store.getState().selectedChatId;
        if (selectedChatId) {
          await removeUserForm.loadUsers(selectedChatId);
        }
      },
      onClose: () => {
        removeUserForm.reset();
      },
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
      onClose: () => {
        createChatForm.reset();
      },
    });

    const chatList = this.createChatList(chats, selectedChatId);

    this.setProps({
      chatList,
      createChatButton: new Button({
        text: "+ Создать",
        type: "button",
        variant: "primary",
        onClick: () => {
          this.createChatModal.open();
        },
      }),
      chatHeader: selectedChat
        ? new ChatHeader({
            name: selectedChat.title,
            avatar: selectedChat.avatar,
            onMenuClick: () => {
              this.chatMenu.toggle();
            },
          })
        : null,
      chatMenu: this.chatMenu,
      messageInput: new MessageInput({
        placeholder: "Сообщение",
        onSubmit: (message) => {
          this.sendMessage(message);
        },
        onAttach: () => {
          alert("Прикрепить файл");
        },
      }),
      addUserModal: this.addUserModal,
      removeUserModal: this.removeUserModal,
      createChatModal: this.createChatModal,
    });
  }

  protected async componentDidMount(): Promise<void> {
    await this.loadChats();

    store.subscribe(() => {
      const state = store.getState();

      // апдейтим список чатов
      this.updateChatsFromStore();

      // апдейтим сообщения из store
      this.updateMessagesFromStore(state.messages.reverse());
    });

    // слушаем новые сообщения для обновления списка чатов
    window.addEventListener(
      "newChatMessage",
      this.handleNewChatMessage.bind(this)
    );

    const selectedChatId = store.getState().selectedChatId;
    if (selectedChatId) {
      await this.connectToChat(selectedChatId);
    }
  }

  // апдейтим сообщения из стора
  private updateMessagesFromStore(messages: any[]): void {
    const currentUser = store.getState().user;

    if (!currentUser) {
      return;
    }

    // Преобразуем в компоненты Message
    const messageComponents = messages.map(
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

    // сетим
    this.setProps({
      messageList: messageComponents,
    });

    // Рендерим
    setTimeout(() => {
      this.renderMessageList();
      this.scrollToBottom();
    }, 100);
  }

  // удаления пользователя
  private async removeUserFromChat(userId: number): Promise<void> {
    const selectedChatId = store.getState().selectedChatId;

    if (!selectedChatId) {
      return;
    }

    try {
      await ChatAPI.deleteUsersFromChat({
        users: [userId],
        chatId: selectedChatId,
      });

      this.removeUserModal.close();

      alert("Пользователь удален из чата");

      await this.loadChats();
    } catch (error: any) {
      alert("Ошибка при удалении пользователя");
    }
  }

  private handleNewChatMessage = async (event: Event): Promise<void> => {
    const customEvent = event as CustomEvent;
    const message = customEvent.detail;

    // апдейтим конкретный чат в store без полной перезагрузки
    const chats = store.getState().chats;
    const currentUser = store.getState().user;

    const updatedChats = chats.map((chat) => {
      if (chat.id === message.chat_id) {
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
          // величиваем счетчик только если сообщение не от текущего пользователя
          // и чат не выбран
          unread_count:
            message.user_id !== currentUser?.id &&
            chat.id !== store.getState().selectedChatId
              ? (chat.unread_count || 0) + 1
              : chat.unread_count || 0,
        };
      }
      return chat;
    });

    // чат с новым сообщением поднимается наверх
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

  protected componentWillUnmount(): void {
    if (this.unsubscribeMessages) {
      this.unsubscribeMessages();
    }

    // отписка от события
    window.removeEventListener("newChatMessage", this.handleNewChatMessage);

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }

    webSocketService.disconnect();
  }

  private async loadChats(): Promise<void> {
    try {
      const chats = await ChatAPI.getChats();
      const chatsWithUnreadCounts = await Promise.all(
        chats.map(async (chat) => {
          try {
            const { unread_count } = await ChatAPI.getNewMessagesCount(chat.id);
            return {
              ...chat,
              unread_count, //  актуальный счетчик из API
            };
          } catch (error) {
            console.error(
              "Error loading unread count for chat:",
              chat.id,
              error
            );
            return chat; // ошибка - используем данные из /chats
          }
        })
      );

      store.setChats(chatsWithUnreadCounts);

      this.updateChatsFromStore();
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }

  private createChatList(
    chats: any[],
    selectedChatId: number | null
  ): ChatItem[] {
    const currentUser = store.getState().user;

    const chatItems = chats.map((chat) => {
      const lastMessage = chat.last_message;

      const item = new ChatItem({
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
        onClick: (id: number) => {
          this.handleChatSelect(id);
        },
      });

      return item;
    });

    return chatItems;
  }

  private updateChatsFromStore(): void {
    const chats = store.getState().chats;
    const selectedChatId = store.getState().selectedChatId;
    const selectedChat = chats.find((chat) => chat.id === selectedChatId);

    const newChatList = this.createChatList(chats, selectedChatId);

    this.setProps({
      chats,
      selectedChat,
      chatList: newChatList,
      chatHeader: selectedChat
        ? new ChatHeader({
            name: selectedChat.title,
            avatar: selectedChat.avatar,
            onMenuClick: () => {
              this.chatMenu.toggle();
            },
          })
        : null,
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof Element)) {
      return;
    }

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

      store.clearMessages();

      this.setProps({ messageList: [] });
      this.renderMessageList();

      store.selectChat(chatId);

      await this.connectToChat(chatId);
    } catch (error) {
      alert("Ошибка при переключении чата");
    }
  }

  private async connectToChat(chatId: number): Promise<void> {
    try {
      // Получаем токен для WebSocket
      const { token } = await ChatAPI.getChatToken(chatId);

      await webSocketService.connect(chatId, token);
    } catch (error) {
      alert("Ошибка подключения к чату");
    }
  }

  private pollInterval: ReturnType<typeof setInterval> | null = null;

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const messagesContainer = document.querySelector(".chat-page__messages");
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    });
  }

  private renderMessageList(): void {
    const messageListContainer = document.querySelector(
      '.chat-page__messages [data-id="messageList"]'
    );

    if (!messageListContainer) {
      return;
    }

    messageListContainer.innerHTML = "";

    const messageList = this.children.messageList;

    if (!Array.isArray(messageList) || messageList.length === 0) {
      messageListContainer.innerHTML =
        '<p class="chat-page__empty-messages">Нет сообщений</p>';
      return;
    }

    messageList.forEach((message) => {
      const content = message.getContent();
      if (content) {
        messageListContainer.appendChild(content);
        message.dispatchComponentDidMount();
      }
    });
  }

  private sendMessage(text: string): void {
    webSocketService.sendMessage(text);

    if (!text.trim()) {
      return;
    }

    const messageInput = this.children.messageInput as MessageInput;
    if (messageInput && typeof messageInput.clear === "function") {
      messageInput.clear();
    }
  }

  private async createChat(title: string): Promise<void> {
    try {
      const newChat = await ChatAPI.createChat({ title });

      await this.loadChats();

      this.createChatModal.close();

      store.selectChat(newChat.id);

      await this.connectToChat(newChat.id);
    } catch (error: any) {
      alert("Ошибка при создании чата");
    }
  }

  private async addUserToChat(userId: number): Promise<void> {
    const selectedChatId = store.getState().selectedChatId;

    if (!selectedChatId) {
      return;
    }

    try {
      await ChatAPI.addUsersToChat({
        users: [userId],
        chatId: selectedChatId,
      });

      this.addUserModal.close();

      await this.loadChats();
      alert("Пользователь добавлен в чат");
    } catch (error: any) {
      alert("Ошибка при добавлении пользователя");
    }
  }

  private openAddUserModal(): void {
    this.addUserModal.open();
  }

  private openRemoveUserModal(): void {
    alert("Функция удаления пользователя");
  }

  protected render(): string {
    return template;
  }
}
