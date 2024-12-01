
import { validateRequest } from "@/validators/request";
import { type RequestHandler, Router } from "express";
import { authController } from "../auth.module";
import { registerSchema } from "../schemas/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema) as RequestHandler,
  authController.register
);


// biome-ignore lint/style/noDefaultExport: <explanation>
export default router;
