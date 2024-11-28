import { HTTPSTATUS, type HttpStatusCode } from "@/configs/http-config";
import type { ErrorCode } from "@/enums/error-code";


export class AppError extends Error {
  statusCode: HttpStatusCode;
  errorCode?: ErrorCode;

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}