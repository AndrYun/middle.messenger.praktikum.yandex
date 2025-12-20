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

type HTTPMethod = (
  url: string,
  options?: OptionsWithoutMethod
) => Promise<unknown>;

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
  private createMethod(method: METHODS): HTTPMethod {
    return (url, options = {}) => this.request(url, { ...options, method });
  }

  public get = this.createMethod(METHODS.GET);
  public post = this.createMethod(METHODS.POST);
  public put = this.createMethod(METHODS.PUT);
  public delete = this.createMethod(METHODS.DELETE);

  private request<R = unknown>(url: string, options: Options): Promise<R> {
    const { headers = {}, method, data, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      const requestUrl =
        isGet && data
          ? `${url}${queryStringify(
              data as Record<string, string | number | boolean>
            )}`
          : url;
      xhr.open(method, requestUrl);

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        resolve(xhr as R);
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
      } else {
        xhr.send(data as XMLHttpRequestBodyInit);
      }
    });
  }
}

export default HTTPTransport;
