import { Block } from "./Block";
import type { BlockProps } from "./Block";

type Lifecycle = {
  componentDidMount: () => void;
  componentDidUpdate: (oldProps: unknown, newProps: unknown) => boolean;
  componentWillUnmount: () => void;
};

class TestBlock extends Block<BlockProps> {
  constructor(props: BlockProps = {}) {
    super("div", props);
  }

  protected render(): string {
    return `<div class="test">{{text}}</div>`;
  }
}

describe("Block", () => {
  let block: TestBlock;

  beforeEach(() => {
    block = new TestBlock({ text: "Hello" });
  });

  it("componentDidMount должен вызываться после монтирования", () => {
    const spy = jest.spyOn(block as unknown as Lifecycle, "componentDidMount");

    block.dispatchComponentDidMount();

    expect(spy).toHaveBeenCalled();
  });

  it("componentDidUpdate должен вызываться после setProps", () => {
    const spy = jest.spyOn(block as unknown as Lifecycle, "componentDidUpdate");

    block.setProps({ text: "Updated" });

    expect(spy).toHaveBeenCalled();
  });

  it("должен добавлять обработчики событий", () => {
    const onClick = jest.fn();

    const blockWithEvents = new TestBlock({
      events: { click: onClick },
    });

    blockWithEvents.getContent()?.click();

    expect(onClick).toHaveBeenCalled();
  });
});
