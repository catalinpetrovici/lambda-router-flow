import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class NotFound extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.NOT_FOUND,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default NotFound;
