import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

export default class ServiceError extends BaseError {
  constructor(
    message: string,
    methodName: string,
    DebugErrorMessage: object = {},
    statusCode: IStatusCodes = StatusCodes.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message, methodName, DebugErrorMessage, statusCode, isOperational);
  }
}
