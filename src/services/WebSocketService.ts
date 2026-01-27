import { store } from "../store/Store";

type MessageType = "message" | "file" | "sticker";

interface WSMessage {
  id?: number;
  user_id: number;
  chat_id: number;
  type: MessageType;
  time: string;
  content: string;
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

interface MessageCallback {
  (messages: WSMessage[]): void;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private messageCallbacks: Set<MessageCallback> = new Set();
  private currentChatId: number | null = null;

  public async connect(chatId: number, token: string): Promise<void> {
    if (
      this.currentChatId === chatId &&
      this.socket?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    const user = store.getState().user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    this.currentChatId = chatId;

    // Закрываем предыдущее соединение если оно было
    await this.disconnect();

    const wsUrl = `wss://ya-praktikum.tech/ws/chats/${user.id}/${chatId}/${token}`;

    return new Promise((resolve) => {
      this.socket = new WebSocket(wsUrl);

      this.socket.addEventListener("open", () => {
        // Запрашиваем старые сообщения
        this.getOldMessages();

        // Запускаем ping для поддержания соединения
        this.startPing();

        resolve();
      });

      this.socket.addEventListener("message", (event) => {
        this.handleMessage(event);
      });

      this.socket.addEventListener("close", () => {
        this.stopPing();
      });

      this.socket.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
      });
    });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve();
        return;
      }

      const currentSocket = this.socket;

      // едли же закрыт - сразу resolve
      if (currentSocket.readyState === WebSocket.CLOSED) {
        this.socket = null;
        this.stopPing();
        this.currentChatId = null;
        resolve();
        return;
      }

      // ждемс закрытия
      const onClose = () => {
        this.socket = null;
        this.stopPing();
        this.currentChatId = null;
        resolve();
      };

      currentSocket.addEventListener("close", onClose, { once: true });

      // закрываем соединение
      if (currentSocket.readyState === WebSocket.OPEN) {
        currentSocket.close();
      }

      // таймаут на случай если close не произойдет
      setTimeout(() => {
        currentSocket.removeEventListener("close", onClose);
        this.socket = null;
        this.stopPing();
        resolve();
      }, 1000);
    });
  }

  public sendMessage(content: string): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = {
      content,
      type: "message",
    };

    this.socket.send(JSON.stringify(message));
  }

  private getOldMessages(offset: number = 0): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(
      JSON.stringify({
        content: offset.toString(),
        type: "get old",
      })
    );
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);

      if (Array.isArray(data)) {
        store.setMessages(data);
      } else if (data.type === "pong") {
        // Ping-pong
      } else if (data.type === "message" || data.type === "file") {
        store.addMessage(data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  // подписка на новыве сообщения
  public onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);

    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  // реализация пинг понга
  private startPing(): void {
    this.pingInterval = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }

  // стопим пинг
  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

export const webSocketService = new WebSocketService();
