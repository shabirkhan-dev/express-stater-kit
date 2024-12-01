import type { RegisterSchema } from "../schemas/auth";
import type { UserSchema } from "../schemas/user";

export class AuthService {
  register = async (data: RegisterSchema): Promise<UserSchema> => {
    const user = await {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    return user;
  };
}
