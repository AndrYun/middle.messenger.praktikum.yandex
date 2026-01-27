import HTTPTransport from "../utils/HTTPTransport";
import type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  SearchUserRequest,
} from "./types";

const userAPI = new HTTPTransport();

export class UserAPI {
  static updateProfile(data: UpdateProfileRequest): Promise<User> {
    return userAPI.put<User>("/user/profile", { data });
  }

  static updateAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("avatar", file);

    return userAPI.put<User>("/user/profile/avatar", { data: formData });
  }

  static changePassword(data: ChangePasswordRequest): Promise<void> {
    return userAPI.put<void>("/user/password", { data });
  }

  static getUserById(id: number): Promise<User> {
    return userAPI.get<User>(`/user/${id}`);
  }

  static searchUsers(data: SearchUserRequest): Promise<User[]> {
    return userAPI.post<User[]>("/user/search", { data });
  }
}
