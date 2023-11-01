import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class Unauthorized extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    httpCode: IStatusCodes = StatusCodes.UNAUTHORIZED,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, httpCode, isOperational);
  }
}

export default Unauthorized;
