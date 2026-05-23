import { post } from "../axiosClient";
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
}

export default UserService;
