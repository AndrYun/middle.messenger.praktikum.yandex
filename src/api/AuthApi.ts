import { HTTPTransport } from "../utils";
import type {
  SignUpRequest,
  SignInRequest,
  SignUpResponse,
  User,
} from "./types";

const authAPI = HTTPTransport.getInstance();

export class AuthAPI {
  static signup(data: SignUpRequest): Promise<SignUpResponse> {
    return authAPI.post<SignUpResponse>("/auth/signup", { data });
  }

  static signin(data: SignInRequest): Promise<void> {
    return authAPI.post<void>("/auth/signin", { data });
  }

  static getUser(): Promise<User> {
    return authAPI.get<User>("/auth/user");
  }

  static logout(): Promise<void> {
    return authAPI.post<void>("/auth/logout");
  }
}
