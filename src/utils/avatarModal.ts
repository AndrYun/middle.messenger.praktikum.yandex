export function initAvatarModal(): void {
  const avatarButton = document.getElementById('avatarButton');
  const modal = document.getElementById('avatarModal');
  const overlay = modal?.querySelector('.modal__overlay');
  const fileSelectLink = document.getElementById('fileSelectLink');
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  const submitButton = modal?.querySelector('.button');

  if (!avatarButton || !modal) return;

  avatarButton.addEventListener('click', () => {
    modal.classList.add('modal--open');
  });

  overlay?.addEventListener('click', () => {
    closeModal();
  });

  // Открытие выбора файла
  fileSelectLink?.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      updateFileDisplay(file.name);
      hideError();
    }
  });

  submitButton?.addEventListener('click', (e) => {
    e.preventDefault();

    if (!fileInput?.files?.length) {
      showError('Нужно выбрать файл');
    } else {
      // Здесь будет отправка файла на сервер
      console.log('Файл выбран:', fileInput.files[0].name);
      closeModal();
    }
  });

  function updateFileDisplay(name: string): void {
    const fileName = modal?.querySelector('.avatar-upload__file-name');
    const link = modal?.querySelector('.avatar-upload__link');

    if (fileName && link) {
      const nameSpan = document.createElement('span');
      nameSpan.className = 'avatar-upload__file-name';
      nameSpan.textContent = name;

      // Заменяем ссылку на имя файла
      link.parentElement?.replaceChild(nameSpan, link);
    }
  }

  function showError(message: string): void {
    const errorContainer = modal?.querySelector('.avatar-upload__error');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.classList.add('avatar-upload__error--visible');
    } else {
      // Создаем элемент ошибки, если его нет
      const error = document.createElement('span');
      error.className = 'avatar-upload__error avatar-upload__error--visible';
      error.textContent = message;
      modal?.querySelector('.avatar-upload__selector')?.after(error);
    }
  }

  function hideError(): void {
    const error = modal?.querySelector('.avatar-upload__error');
    error?.classList.remove('avatar-upload__error--visible');
  }

  function closeModal(): void {
    if (!modal) return;

    modal.classList.remove('modal--open');
    resetForm();
  }

  function resetForm(): void {
    if (fileInput) {
      fileInput.value = '';
    }

    const fileName = modal?.querySelector('.avatar-upload__file-name');
    if (fileName) {
      const link = document.createElement('a');
      link.href = '#';
      link.id = 'fileSelectLink';
      link.className = 'avatar-upload__link';
      link.textContent = 'Выбрать файл на компьютере';

      fileName.parentElement?.replaceChild(link, fileName);

      // Переподключаем обработчик
      link.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput?.click();
      });
    }

    hideError();
  }
}
