enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

type Options = {
  method?: METHODS;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
};

type OptionsWithoutMethod = Omit<Options, "method">;

function queryStringify(
  data: Record<string, string | number | boolean>
): string {
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const separator = index < keys.length - 1 ? "&" : "";
    return `${result}${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}${separator}`;
  }, "?");
}

class HTTPTransport {
  private static instance: HTTPTransport | null = null;
  private apiUrl = "https://ya-praktikum.tech/api/v2";

  private constructor() {}

  public static getInstance(): HTTPTransport {
    if (!HTTPTransport.instance) {
      HTTPTransport.instance = new HTTPTransport();
    }
    return HTTPTransport.instance;
  }

  public get<R = unknown>(
    url: string,
    options?: OptionsWithoutMethod
  ): Promise<R> {
    return this.request<R>(url, { ...options, method: METHODS.GET });
  }

  public post<R = unknown>(
    url: string,
    options?: OptionsWithoutMethod
  ): Promise<R> {
    return this.request<R>(url, { ...options, method: METHODS.POST });
  }

  public put<R = unknown>(
    url: string,
    options?: OptionsWithoutMethod
  ): Promise<R> {
    return this.request<R>(url, { ...options, method: METHODS.PUT });
  }

  public delete<R = unknown>(
    url: string,
    options?: OptionsWithoutMethod
  ): Promise<R> {
    return this.request<R>(url, { ...options, method: METHODS.DELETE });
  }

  private request<R = unknown>(url: string, options: Options): Promise<R> {
    const { headers = {}, method, data, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      const fullUrl = `${this.apiUrl}${url}`;

      const requestUrl =
        isGet && data
          ? `${fullUrl}${queryStringify(
              data as Record<string, string | number | boolean>
            )}`
          : fullUrl;
      xhr.open(method, requestUrl);

      xhr.withCredentials = true;

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        if (xhr.status === 401) {
          // импорт store и router
          import("../store/Store").then(({ store }) => {
            store.setUser(null);
          });

          import("../main").then(() => {
            if (window.router) {
              window.router.go("/");
            }
          });

          reject({ reason: "Unauthorized" });
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = xhr.response ? JSON.parse(xhr.response) : {};
            resolve(response as R);
          } catch (e) {
            resolve(xhr.response as R);
          }
        } else {
          try {
            const error = JSON.parse(xhr.response);
            reject(error);
          } catch (e) {
            reject(new Error(`HTTP Error ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onabort = () => {
        reject(new Error("Request aborted"));
      };

      xhr.onerror = () => {
        reject(new Error("Request failed"));
      };

      xhr.timeout = timeout;
      xhr.ontimeout = () => {
        reject(new Error("Request timeout"));
      };

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(JSON.stringify(data));
      }
    });
  }
}

export default HTTPTransport;
