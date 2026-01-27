import { Block } from "../../core";
import type { ChatMenuProps } from "./types";
import template from "./chat-menu.hbs?raw";

export class ChatMenu extends Block<ChatMenuProps> {
  constructor(props: ChatMenuProps) {
    super("div", {
      ...props,
      isOpen: props.isOpen || false,
      attr: {
        class: `chat-menu ${props.isOpen ? "chat-menu--open" : ""}`,
      },
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const button = target.closest("button[data-action]") as HTMLButtonElement;

    if (!button) return;

    const { action } = button.dataset;

    if (action === "add" && this.props.onAddUser) {
      this.props.onAddUser();
    } else if (action === "remove" && this.props.onRemoveUser) {
      this.props.onRemoveUser();
    }
  }

  public open(): void {
    this.setProps({ isOpen: true });
    this.element?.classList.add("chat-menu--open");
  }

  public close(): void {
    this.setProps({ isOpen: false });
    this.element?.classList.remove("chat-menu--open");
  }

  public toggle(): void {
    this.setProps({ isOpen: !this.props.isOpen });
    this.element?.classList.toggle("chat-menu--open");
  }

  protected render(): string {
    return template;
  }
}
