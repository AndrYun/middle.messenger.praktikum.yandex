import { Block } from '../../core';
import { Link } from '../../components/link';
import type { Error404PageProps } from './types';
import template from './error-404.hbs?raw';

export class Error404Page extends Block<Error404PageProps> {
  constructor(props: Error404PageProps) {
    super('div', {
      ...props,
      backLink: new Link({
        text: 'Назад к чатам',
        href: '#',
        variant: 'primary',
        onClick: (e) => {
          e.preventDefault();
          (window as any).navigateTo('login');
        },
      }),
    });
  }

  protected render(): string {
    return template;
  }
}
