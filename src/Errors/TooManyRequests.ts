import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class TooManyRequests extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.TOO_MANY_REQUESTS,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default TooManyRequests;
