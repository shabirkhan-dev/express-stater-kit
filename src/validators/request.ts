import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  };
};