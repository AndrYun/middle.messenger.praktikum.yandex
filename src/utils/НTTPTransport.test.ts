import HTTPTransport from "./HTTPTransport";

type MockXHR = {
  open: jest.Mock;
  send: jest.Mock;
  setRequestHeader: jest.Mock;

  withCredentials: boolean;
  timeout: number;

  status: number;
  statusText: string;

  response?: string;

  onload: null | (() => void);
  onerror: null | (() => void);
  onabort: null | (() => void);
  ontimeout: null | (() => void);
};

function createMockXHR(): MockXHR {
  return {
    open: jest.fn(),
    send: jest.fn(),
    setRequestHeader: jest.fn(),

    withCredentials: false,
    timeout: 0,

    status: 200,
    statusText: "OK",

    response: undefined,

    onload: null,
    onerror: null,
    onabort: null,
    ontimeout: null,
  };
}

describe("HTTPTransport", () => {
  let transport: HTTPTransport;
  let xhr: MockXHR;

  let xhrSpy: { mockRestore: () => void };

  beforeEach(() => {
    transport = HTTPTransport.getInstance();
    xhr = createMockXHR();

    xhrSpy = jest
      .spyOn(
        globalThis as unknown as { XMLHttpRequest: typeof XMLHttpRequest },
        "XMLHttpRequest"
      )
      .mockImplementation(() => xhr as unknown as XMLHttpRequest);
  });

  afterEach(() => {
    xhrSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it("Singleton: возвращает один и тот же экземпляр", () => {
    const a = HTTPTransport.getInstance();
    const b = HTTPTransport.getInstance();
    expect(a).toBe(b);
  });

  it("GET: формирует query и резолвит JSON-ответ", async () => {
    xhr.status = 200;
    xhr.response = JSON.stringify({ ok: true });

    const promise = transport.get<{ ok: boolean }>("/test", {
      data: { id: 1 },
    });

    xhr.onload?.();

    await expect(promise).resolves.toEqual({ ok: true });

    expect(xhr.open).toHaveBeenCalledWith(
      "GET",
      expect.stringContaining("https://ya-praktikum.tech/api/v2/test?id=1")
    );
    expect(xhr.send).toHaveBeenCalledTimes(1);
  });

  it('Network error: reject с Error("Request failed")', async () => {
    const promise = transport.get("/test");

    xhr.onerror?.();

    await expect(promise).rejects.toThrow("Request failed");
  });

  it("HTTP error: при 404 reject-ит распарсенный JSON", async () => {
    xhr.status = 404;
    xhr.statusText = "Not Found";
    xhr.response = JSON.stringify({ reason: "Not Found" });

    const promise = transport.get("/test");

    xhr.onload?.();

    await expect(promise).rejects.toEqual({ reason: "Not Found" });
  });

  it("POST: выставляет Content-Type и отправляет JSON", async () => {
    xhr.status = 200;
    xhr.response = JSON.stringify({ success: true });

    const data = { name: "test", value: 123 };
    const promise = transport.post<{ success: boolean }>("/test", { data });

    xhr.onload?.();

    await expect(promise).resolves.toEqual({ success: true });

    expect(xhr.open).toHaveBeenCalledWith(
      "POST",
      "https://ya-praktikum.tech/api/v2/test"
    );
    expect(xhr.setRequestHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json"
    );
    expect(xhr.send).toHaveBeenCalledWith(JSON.stringify(data));
  });
});
