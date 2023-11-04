import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class InternalServerError extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}

export default InternalServerError;
