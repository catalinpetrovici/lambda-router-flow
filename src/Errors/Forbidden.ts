import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class Forbidden extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.FORBIDDEN,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default Forbidden;
