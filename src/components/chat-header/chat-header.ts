import { Block } from "../../core";
import { Avatar } from "../avatar";
import type { ChatHeaderProps } from "./types";
import template from "./chat-header.hbs?raw";

export class ChatHeader extends Block<ChatHeaderProps> {
  constructor(props: ChatHeaderProps) {
    super("div", {
      ...props,
      // avatar: new Avatar({
      //   avatar: props.avatar,
      //   size: "small",
      //   first_name: props.name,
      // }),
      attr: {
        class: "chat-header",
      },
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });

    this.setProps({
      avatarComponent: new Avatar({
        avatar: props.avatar || undefined,
        size: "small",
        firstName: props.name,
      }),
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    // чекам клик по меню
    if (target.closest(".chat-header__menu")) {
      if (this.props.onMenuClick) {
        this.props.onMenuClick();
      }
    }
  }

  protected render(): string {
    return template;
  }
}
