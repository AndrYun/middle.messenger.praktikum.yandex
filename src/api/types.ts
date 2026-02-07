// User types
export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  phone: string;
  login: string;
  avatar: string;
  email: string;
}

// Auth requests
export interface SignUpRequest {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignInRequest {
  login: string;
  password: string;
}

// Auth responses
export interface SignUpResponse {
  id: number;
}

// User requests
export interface UpdateProfileRequest {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SearchUserRequest {
  login: string;
}

// API Error
export interface APIError {
  reason: string;
}
// guard для API ошибок
function isAPIError(error: unknown): error is APIError {
  return (
    typeof error === "object" &&
    error !== null &&
    "reason" in error &&
    typeof (error as APIError).reason === "string"
  );
}

export default isAPIError;

// Chat API
export interface Chat {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  created_by: number;
  last_message: {
    user: User;
    time: string;
    content: string;
  } | null;
}

export interface CreateChatRequest {
  title: string;
}

export interface AddUsersToChatRequest {
  users: number[];
  chatId: number;
}

export interface DeleteUsersFromChatRequest {
  users: number[];
  chatId: number;
}

export interface DeleteChatRequest {
  chatId: number;
}

export interface ChatUser extends User {
  role: string;
}
