export function initChatInteractions(): void {
  const menuButton = document.getElementById('chatMenuButton');
  const menu = document.getElementById('chatMenu');
  const addUserButton = document.getElementById('addUserButton');
  const addUserModal = document.getElementById('addUserModal');
  const modalOverlay = addUserModal?.querySelector('.modal__overlay');

  if (!menuButton || !menu) return;

  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('chat-menu--open');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('chat-menu--open');
  });

  addUserButton?.addEventListener('click', () => {
    menu.classList.remove('chat-menu--open');
    addUserModal?.classList.add('modal--open');
  });

  modalOverlay?.addEventListener('click', () => {
    addUserModal?.classList.remove('modal--open');
  });
}
