import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class Unauthorized extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.UNAUTHORIZED,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default Unauthorized;
