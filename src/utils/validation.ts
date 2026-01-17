export type ValidationRule = (value: string) => string | null;

export interface ValidationRules {
  [key: string]: ValidationRule;
}

const VALIDATION_REGEX = {
  NAME: /^[A-ZА-ЯЁ][a-zA-Zа-яёА-ЯЁ-]*$/,
  LOGIN: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?\d{10,15}$/,
} as const;

export const validationRules: ValidationRules = {
  /**
    Имя, Фамилия
    - Латиница или кириллица
    - Первая буква заглавная
    - Без пробелов и цифр
    - Допустим только дефис
   */
  first_name: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    const regex = VALIDATION_REGEX.NAME;
    if (!regex.test(value)) {
      return "Первая буква должна быть заглавной, только буквы и дефис";
    }
    return null;
  },

  second_name: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    const regex = VALIDATION_REGEX.NAME;
    if (!regex.test(value)) {
      return "Первая буква должна быть заглавной, только буквы и дефис";
    }
    return null;
  },

  /**
    Логин
   - От 3 до 20 символов
   - Латиница
   - Может содержать цифры, но не состоять из них
   - Без пробелов
   - Допустимы дефис и нижнее подчёркивание
   */
  login: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    if (value.length < 3 || value.length > 20) {
      return "Логин должен быть от 3 до 20 символов";
    }
    const regex = VALIDATION_REGEX.LOGIN;
    if (!regex.test(value)) {
      return "Логин может содержать латиницу, цифры, дефис и подчеркивание";
    }
    if (/^\d+$/.test(value)) {
      return "Логин не может состоять только из цифр";
    }
    return null;
  },

  /**
    Email
   - Латиница
   - Может включать цифры и спецсимволы (дефис, подчеркивание)
   - Обязательно @ и точка после нее
   - Перед точкой должны быть буквы
   */
  email: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    const regex = VALIDATION_REGEX.EMAIL;
    if (!regex.test(value)) {
      return "Введите корректный email";
    }
    return null;
  },

  /**
   Пароль
   - От 8 до 40 символов
   - Обязательно хотя бы одна заглавная буква
   - Обязательно хотя бы одна цифра
   */
  password: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    if (value.length < 8 || value.length > 40) {
      return "Пароль должен быть от 8 до 40 символов";
    }
    if (!/[A-Z]/.test(value)) {
      return "Пароль должен содержать хотя бы одну заглавную букву";
    }
    if (!/\d/.test(value)) {
      return "Пароль должен содержать хотя бы одну цифру";
    }
    return null;
  },

  /**
    Телефон
   - От 10 до 15 символов
   - Состоит из цифр
   - Может начинаться с плюса
   */
  phone: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    const regex = VALIDATION_REGEX.PHONE;
    if (!regex.test(value)) {
      return "Телефон должен содержать от 10 до 15 цифр, может начинаться с +";
    }
    return null;
  },

  /**
    Сообщение
    - Не должно быть пустым
   */
  message: (value: string): string | null => {
    if (!value || value.trim() === "") {
      return "Сообщение не может быть пустым";
    }
    return null;
  },

  /**
    Отображаемое имя (display_name)
    - Аналогично first_name
   */
  display_name: (value: string): string | null => {
    if (!value) {
      return "Поле обязательно для заполнения";
    }
    const regex = VALIDATION_REGEX.NAME;
    if (!regex.test(value)) {
      return "Первая буква должна быть заглавной, только буквы и дефис";
    }
    return null;
  },
};

/**
Валидировать поле
 */
export function validateField(name: string, value: string): string | null {
  const rule = validationRules[name];
  if (!rule) {
    return null; // Нет правила для этого поля
  }
  return rule(value);
}

/**
Валидировать форму целиком
 */
export function validateForm(
  data: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(data).forEach((fieldName) => {
    const error = validateField(fieldName, data[fieldName]);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}
