import { Store } from "./Store";

describe("Store", () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe("Singleton", () => {
    it("должен возвращать один экземпляр", () => {
      const store1 = new Store();
      const store2 = new Store();

      expect(store1).toBe(store2);
    });
  });

  describe("getState()", () => {
    it("должен возвращать текущее состояние", () => {
      const state = store.getState();

      expect(state).toHaveProperty("user");
      expect(state).toHaveProperty("chats");
      expect(state).toHaveProperty("messages");
    });
  });

  describe("setUser()", () => {
    it("должен устанавливать пользователя", () => {
      const user = {
        id: 1,
        login: "test",
        first_name: "Test",
        second_name: "User",
        display_name: "TestUser",
        email: "test@test.com",
        phone: "1234567890",
        avatar: "/avatar.webp",
      };

      store.setUser(user);

      expect(store.getState().user).toEqual(user);
    });

    it("должен устанавливать isAuthenticated в true при наличии пользователя", () => {
      const user = {
        id: 1,
        login: "test",
        first_name: "Test",
        second_name: "User",
        display_name: "TestUser",
        email: "test@test.com",
        phone: "1234567890",
        avatar: "/avatar.webp",
      };

      store.setUser(user);

      expect(store.getState().isAuthenticated).toBe(true);
    });

    it("должен устанавливать isAuthenticated в false при user = null", () => {
      store.setUser(null);

      expect(store.getState().isAuthenticated).toBe(false);
    });
  });

  describe("subscribe()", () => {
    it("должен вызывать callback при изменении state", () => {
      const callback = jest.fn();
      store.subscribe(callback);

      store.setUser(null);

      expect(callback).toHaveBeenCalled();
    });

    it("должен возвращать функцию отписки", () => {
      const callback = jest.fn();
      const unsubscribe = store.subscribe(callback);

      unsubscribe();
      store.setUser(null);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("setChats()", () => {
    it("должен устанавливать список чатов", () => {
      const chats = [
        {
          id: 1,
          title: "Chat 1",
          avatar: null,
          unread_count: 0,
          created_by: 1,
          last_message: null,
        },
        {
          id: 2,
          title: "Chat 2",
          avatar: null,
          unread_count: 2,
          created_by: 1,
          last_message: null,
        },
      ];

      store.setChats(chats);

      expect(store.getState().chats).toEqual(chats);
    });
  });

  describe("selectChat()", () => {
    it("должен выбирать чат", () => {
      store.selectChat(123);

      expect(store.getState().selectedChatId).toBe(123);
    });

    it("должен сохранять выбранный чат в localStorage", () => {
      store.selectChat(123);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "selectedChatId",
        "123"
      );
    });
  });

  describe("setMessages()", () => {
    it("должен устанавливать сообщения", () => {
      const messages = [
        {
          id: 1,
          user_id: 1,
          chat_id: 1,
          type: "message",
          time: "2024-01-01",
          content: "Hello",
        },
      ];

      store.setMessages(messages);

      expect(store.getState().messages).toHaveLength(1);
    });
  });

  describe("clearMessages()", () => {
    it("должен очищать сообщения", () => {
      const messages = [
        {
          id: 1,
          user_id: 1,
          chat_id: 1,
          type: "message",
          time: "2024-01-01",
          content: "Hello",
        },
      ];
      store.setMessages(messages);

      store.clearMessages();

      expect(store.getState().messages).toHaveLength(0);
    });
  });
});
