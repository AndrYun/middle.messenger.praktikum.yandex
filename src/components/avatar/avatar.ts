import { Block } from "../../core";
import type { AvatarProps } from "./types";
import template from "./avatar.hbs?raw";

export class Avatar extends Block<AvatarProps> {
  constructor(props: AvatarProps) {
    super("div", {
      ...props,
      size: props.size || "medium",
      events: {
        click: (e: Event) => this.handleClick(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof Element)) {
      return;
    }

    const avatarCircle = target.closest(".profile-avatar");
    if (avatarCircle && this.props.onClick) {
      e.preventDefault();
      this.props.onClick();
    }
  }

  protected render(): string {
    return template;
  }
}
