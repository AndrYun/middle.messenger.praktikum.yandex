import { Block } from "../../core";
import { Link } from "../../components/link";
import type { Error500PageProps } from "./types";
import template from "./error-500.hbs?raw";

export class Error500Page extends Block<Error500PageProps> {
  constructor(props?: Error500PageProps) {
    super("div", {
      ...props,
      backLink: new Link({
        text: "Назад к чатам",
        href: "#",
        variant: "primary",
        onClick: (e) => {
          e.preventDefault();
          window.router.go("/");
        },
      }),
    });
  }

  protected render(): string {
    return template;
  }
}
