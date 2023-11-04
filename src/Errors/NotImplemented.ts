import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class NotImplemented extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.NOT_IMPLEMENTED,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default NotImplemented;
