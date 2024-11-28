import { HTTPSTATUS, type HttpStatusCode } from "@/configs/http-config";
import { ErrorCode } from "@/enums/error-code";
import { AppError } from "./app-error";

export class NotFoundException extends AppError {
  constructor(message = "Resource not found", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.NOT_FOUND,
      errorCode || ErrorCode.RESOURCE_NOT_FOUND
    );
  }
}

export class BadRequestException extends AppError {
  constructor(message = "Bad Request", errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode);
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = "Unauthorized Access", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.UNAUTHORIZED,
      errorCode || ErrorCode.ACCESS_UNAUTHORIZED
    );
  }
}

export class InternalServerException extends AppError {
  constructor(message = "Internal Server Error", errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}

export class HttpException extends AppError {
  constructor(
    statusCode: HttpStatusCode,
    errorCode?: ErrorCode,
    message = "Http Exception Error"
  ) {
    super(message, statusCode, errorCode);
  }
}