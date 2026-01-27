import HTTPTransport from "../utils/HTTPTransport";
import type {
  Chat,
  CreateChatRequest,
  AddUsersToChatRequest,
  DeleteUsersFromChatRequest,
  DeleteChatRequest,
  ChatUser,
  User,
  SearchUserRequest,
} from "./types";

const chatAPI = new HTTPTransport();

export class ChatAPI {
  static getChats(): Promise<Chat[]> {
    return chatAPI.get<Chat[]>("/chats");
  }

  static createChat(data: CreateChatRequest): Promise<Chat> {
    return chatAPI.post<Chat>("/chats", { data });
  }

  static deleteChat(
    data: DeleteChatRequest
  ): Promise<{ userId: number; result: Chat }> {
    return chatAPI.delete("/chats", { data });
  }

  static getChatUsers(chatId: number): Promise<ChatUser[]> {
    return chatAPI.get<ChatUser[]>(`/chats/${chatId}/users`);
  }

  static getNewMessagesCount(
    chatId: number
  ): Promise<{ unread_count: number }> {
    return chatAPI.get<{ unread_count: number }>(`/chats/new/${chatId}`);
  }

  static updateChatAvatar(chatId: number, file: File): Promise<Chat> {
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("chatId", chatId.toString());

    return chatAPI.put<Chat>("/chats/avatar", { data: formData });
  }

  static addUsersToChat(data: AddUsersToChatRequest): Promise<void> {
    return chatAPI.put<void>("/chats/users", { data });
  }

  static deleteUsersFromChat(data: DeleteUsersFromChatRequest): Promise<void> {
    return chatAPI.delete<void>("/chats/users", { data });
  }

  static searchUsers(data: SearchUserRequest): Promise<User[]> {
    return chatAPI.post<User[]>("/user/search", { data });
  }

  static getChatToken(chatId: number): Promise<{ token: string }> {
    return chatAPI.post<{ token: string }>(`/chats/token/${chatId}`);
  }
}
