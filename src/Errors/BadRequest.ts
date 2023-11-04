import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class BadRequest extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.BAD_REQUEST,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default BadRequest;
