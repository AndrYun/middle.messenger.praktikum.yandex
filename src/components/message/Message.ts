import { Block } from '../../core';
import type { MessageProps } from './types';
import template from './message.hbs?raw';

export class Message extends Block<MessageProps> {
  constructor(props: MessageProps) {
    super('div', props);
  }

  protected render(): string {
    return template;
  }
}
