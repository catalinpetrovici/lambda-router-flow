import { StatusCodes, type IStatusCodes } from '../StatusCodes';

class BaseError extends Error {
  methodName;
  DebugErrorMessage;
  httpCode;
  isOperational;

  constructor(
    message: string,
    methodName: string,
    DebugErrorMessage: object = {},
    httpCode: IStatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    if (methodName) {
      this.methodName = methodName;
    } else {
      this.methodName = '';
    }

    if (
      typeof DebugErrorMessage === 'object' &&
      Object.keys(DebugErrorMessage)?.length
    ) {
      this.DebugErrorMessage = DebugErrorMessage;
    }

    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export default BaseError;
