import { HTTPSTATUS } from "@/configs/http-config";
import type { Response } from "express";
import type { z } from "zod";


export const formatZodError = (res: Response, error: z.ZodError): Response => {
  const errors = error?.issues?.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTPSTATUS.BAD_REQUEST).json({
    message: "Validation failed",
    errors: errors,
  });
};
