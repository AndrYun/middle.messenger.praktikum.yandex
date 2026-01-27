import { Block } from "../../core";
import type { ModalProps } from "./types";
import template from "./modal.hbs?raw";

export class Modal extends Block<ModalProps> {
  constructor(props: ModalProps) {
    super("div", {
      ...props,
      attr: {
        class: `modal ${props.isOpen ? "modal--open" : ""}`,
      },
      isOpen: props.isOpen || false,
      events: {
        click: (e: Event) => this.handleOverlayClick(e),
      },
    });
  }

  private handleOverlayClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.classList.contains("modal__overlay")) {
      this.close();
    }
  }

  public async open(): Promise<void> {
    this.setProps({ isOpen: true });
    this.element?.classList.add("modal--open");

    if (this.props.onOpen && typeof this.props.onOpen === "function") {
      setTimeout(async () => {
        if (this.props.onOpen) {
          await this.props.onOpen();
        }
      }, 0);
    }
  }

  public close(): void {
    this.setProps({ isOpen: false });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  protected render(): string {
    return template;
  }
}
