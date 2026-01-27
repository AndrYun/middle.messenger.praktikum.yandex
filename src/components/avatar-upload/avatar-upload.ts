import { Block } from "../../core";
import { Button } from "../button";
import type { AvatarUploadProps } from "./types";
import template from "./avatar-upload.hbs?raw";

export class AvatarUpload extends Block<AvatarUploadProps> {
  private selectedFile: File | null = null;

  constructor(props: AvatarUploadProps) {
    super("div", {
      ...props,
      submitButton: new Button({
        text: "Поменять",
        type: "button",
        variant: "primary",
        onClick: () => this.handleSubmit(),
      }),
      events: {
        click: (e: Event) => this.handleClick(e),
        change: (e: Event) => this.handleFileChange(e),
      },
    });
  }

  private handleClick(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.classList.contains("avatar-upload__link")) {
      e.preventDefault();
      const input = this.element?.querySelector(".avatar-upload__input");

      if (input instanceof HTMLInputElement) {
        input.click();
      }
    }
  }

  // Обработчик выбора файла
  private handleFileChange(e: Event): void {
    const target = e.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const file = target.files?.[0];

    if (file) {
      this.selectedFile = file;

      this.setProps({
        error: undefined,
        fileName: undefined,
      });

      // Валидация типа файла
      if (!file.type.startsWith("image/")) {
        this.setProps({
          error: "Можно загружать только изображения",
          fileName: undefined,
        });
        return;
      }

      // Валидация размера (максимум 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.setProps({
          error: "Размер файла не должен превышать 5MB",
          fileName: undefined,
        });
        return;
      }

      // Обновляем UI с именем файла
      this.setProps({
        fileName: file.name,
        error: undefined,
      });

      if (this.props.onChange) {
        this.props.onChange(file);
      }
    }
  }

  private async handleSubmit(): Promise<void> {
    if (!this.selectedFile) {
      this.setProps({ error: "Нужно выбрать файл" });
      return;
    }

    const submitButton = this.children.submitButton as Button;
    submitButton.setProps({ disabled: true, text: "Загрузка..." });

    try {
      if (this.props.onChange) {
        await this.props.onChange(this.selectedFile);
      }

      this.reset();
    } catch (error: any) {
      const errorMessage = error?.reason || "Ошибка при загрузке файла";
      this.setProps({ error: errorMessage });

      submitButton.setProps({ disabled: false, text: "Поменять" });
    }

    // пока просто выводим в консоль
    console.log("Uploading file:", this.selectedFile.name);
  }

  // Получить выбранный файл
  public getFile(): File | null {
    return this.selectedFile;
  }

  // сборос выбора файла
  public reset(): void {
    this.selectedFile = null;
    const input = this.element?.querySelector(".avatar-upload__input");

    if (input instanceof HTMLInputElement) {
      input.value = "";
    }

    this.setProps({
      fileName: undefined,
      error: undefined,
    });
  }

  protected render(): string {
    return template;
  }
}
