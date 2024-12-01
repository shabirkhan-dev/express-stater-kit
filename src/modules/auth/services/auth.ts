import { ErrorCode } from "@/enums/error-code";
import { BadRequestException } from "@/errors/catch-errors";
import { UserModel } from "@/models/user";
import type { RegisterSchema } from "../schemas/auth";
import type { UserSchema } from "../schemas/user";

export class AuthService {
  register = async (data: RegisterSchema): Promise<UserSchema> => {
    const {email,name,password} = data
    const existingUser =  await UserModel.exists({
      email: email,
    })
    if (existingUser) {
      throw new BadRequestException("Email already exists",ErrorCode.AUTH_EMAIL_ALREADY_EXISTS);
    }
    const user = await UserModel.create({
      name: name,
      email: email,
      password: password,

    });
    return user;
  };
}
