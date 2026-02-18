import { Button } from "./Button";

jest.mock("./button.hbs?raw", () => ({
  __esModule: true,
  default:
    '<button class="button {{#if variant}}button--{{variant}}{{/if}}" type="{{type}}" {{#if disabled}}disabled{{/if}}>{{text}}</button>',
}));

function getInnerButton(root: HTMLElement): HTMLButtonElement {
  const btn = root.querySelector("button");
  if (!btn) {
    throw new Error(
      "Button template должен содержать <button> внутри компонента"
    );
  }
  return btn;
}

describe("Button", () => {
  it("рендерит текст", () => {
    const button = new Button({ text: "Click me" });
    const root = button.getContent() as HTMLElement;

    const inner = getInnerButton(root);
    expect(inner.textContent).toContain("Click me");
  });

  it("вызывает onClick при клике", () => {
    const onClick = jest.fn();
    const button = new Button({ text: "Click", onClick });
    const root = button.getContent() as HTMLElement;

    const inner = getInnerButton(root);
    inner.click();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  it("не вызывает onClick если disabled=true (если шаблон ставит disabled на <button>)", () => {
    const onClick = jest.fn();
    const button = new Button({ text: "Click", onClick, disabled: true });
    const root = button.getContent() as HTMLElement;

    const inner = getInnerButton(root);
    expect(inner.disabled).toBe(true);

    inner.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('по умолчанию type должен быть "button" (если шаблон пробрасывает type)', () => {
    const button = new Button({ text: "Click" });
    const root = button.getContent() as HTMLElement;

    const inner = getInnerButton(root);
    expect(inner.type).toBe("button");
  });

  it("variant добавляет модификатор класса (если он реализован в шаблоне)", () => {
    const button = new Button({ text: "Click", variant: "primary" });
    const root = button.getContent() as HTMLElement;

    const inner = getInnerButton(root);
    expect(inner.className).toMatch(/primary/);
  });
});
