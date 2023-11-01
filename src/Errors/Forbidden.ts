import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class Forbidden extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    httpCode: IStatusCodes = StatusCodes.FORBIDDEN,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, httpCode, isOperational);
  }
}

export default Forbidden;
