import { get, post } from "../axiosClient";
import type {
  CreateUserPayload,
  UserSignInPayload,
} from "@/validators/user-validators";

class UserService {
  static async createUser({ reqBody }: { reqBody: CreateUserPayload }) {
    const response = await post({ path: "/users", reqBody });
    return response;
  }

  static async signIn({ reqBody }: { reqBody: UserSignInPayload }) {
    const response = await post({ path: "/users/sign-in", reqBody });
    return response;
  }

  static async getUsers() {
    const response = await get({ path: "/users" });
    return response;
  }

  static async getUserById({ userId }: { userId: string }) {
    const response = await get({ path: `/users/${userId}` });
    return response;
  }
}

export default UserService;
