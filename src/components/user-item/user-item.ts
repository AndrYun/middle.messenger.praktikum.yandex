import { Block } from "../../core";
import { Avatar } from "../avatar";
import type { UserItemProps } from "../user-item";
import template from "./user-item.hbs?raw";

export class UserItem extends Block<UserItemProps> {
  constructor(props: UserItemProps) {
    super("div", {
      ...props,
      attr: {
        class: "user-item",
      },
      events: {
        click: () => {
          if (this.props.onClick) {
            this.props.onClick();
          }
        },
      },
    });

    this.setProps({
      avatarComponent: new Avatar({
        avatar: props.avatar,
        size: "small",
        firstName: props.first_name,
      }),
    });
  }

  protected render(): string {
    return template;
  }
}
