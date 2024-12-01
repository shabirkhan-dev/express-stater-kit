import { HTTPSTATUS } from "@/configs/http-config";
import { ErrorCode } from "@/enums/error-code";
import { BadRequestException } from "@/errors/catch-errors";
import type { Request, Response } from "express";
import type { AuthService } from "../services/auth";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

   register = async (req: Request, res: Response):Promise<Response> => {
    const { email, password } = req.body;
    throw new BadRequestException("Bad Request",ErrorCode.AUTH_EMAIL_ALREADY_EXISTS)
    const user = await {
      email,
      password,
    };
    return res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  }

}
