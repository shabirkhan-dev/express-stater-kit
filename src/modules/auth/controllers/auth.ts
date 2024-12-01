import { HTTPSTATUS } from "@/configs/http-config";
import type { Request, Response } from "express";
import type { AuthService } from "../services/auth";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const user = await this.authService.register(req.body);
    res.status(HTTPSTATUS.CREATED).json({
      message: "User created successfully",
      data: user,
    });
  }
}