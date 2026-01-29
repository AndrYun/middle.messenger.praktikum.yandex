import type { User } from "../api/types";
import type { Chat } from "../api/types";
import { WSMessage } from "../pages/chat/types";

type StoreState = {
  user: User | null;
  isAuthenticated: boolean;
  chats: Chat[];
  selectedChatId: number | null;
  messages: WSMessage[];
};

type Listener = () => void;

export class Store {
  private static __instance: Store | null = null;
  private state: StoreState = {
    user: null,
    isAuthenticated: false,
    chats: [],
    selectedChatId: this.loadSelectedChatId(),
    messages: [],
  };
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (Store.__instance) {
      return Store.__instance;
    }

    Store.__instance = this;
  }

  // установка сообщения
  public setMessages(messages: WSMessage[]): void {
    this.setState({ messages });
  }
  // доб одно сообщение
  public addMessage(message: WSMessage): void {
    this.setState({
      messages: [...this.state.messages, message],
    });
  }
  // клининг сообщений
  public clearMessages(): void {
    this.setState({ messages: [] });
  }

  public getState(): StoreState {
    return this.state;
  }

  public setState(newState: Partial<StoreState>): void {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  private loadSelectedChatId(): number | null {
    const saved = localStorage.getItem("selectedChatId");
    return saved ? parseInt(saved, 10) : null;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  public setUser(user: User | null): void {
    this.setState({
      user,
      isAuthenticated: !!user,
    });
  }

  public setChats(chats: Chat[]): void {
    this.setState({ chats });
  }

  public addChat(chat: Chat): void {
    const updatedChats = [chat, ...this.state.chats];
    this.setState({
      chats: updatedChats,
    });
  }

  public selectChat(chatId: number | null): void {
    this.setState({ selectedChatId: chatId });

    if (chatId) {
      localStorage.setItem("selectedChatId", chatId.toString());
    } else {
      localStorage.removeItem("selectedChatId");
    }
  }
}

export const store = new Store();
