import { Block } from "../../core";
import { Avatar } from "../avatar";
import type { ChatItemProps } from "./types";
import template from "./chat-item.hbs?raw";

export class ChatItem extends Block<ChatItemProps> {
  constructor(props: ChatItemProps) {
    super("div", {
      ...props,
      // avatar: new Avatar({
      //   avatar: props.avatar,
      //   size: "medium",
      //   first_name: props.name,
      // }),
      attr: {
        class: `chat-item ${props.active ? "chat-item--active" : ""}`,
      },
      events: {
        click: () => {
          if (props.onClick) {
            props.onClick(props.id);
          }
        },
      },
    });

    this.setProps({
      avatarComponent: new Avatar({
        avatar: props.avatar || undefined,
        size: "medium",
        firstName: props.name,
      }),
    });
  }

  protected render(): string {
    return template;
  }
}
