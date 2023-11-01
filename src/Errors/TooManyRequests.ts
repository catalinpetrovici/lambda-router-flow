import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class TooManyRequests extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    httpCode: IStatusCodes = StatusCodes.TOO_MANY_REQUESTS,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, httpCode, isOperational);
  }
}

export default TooManyRequests;
