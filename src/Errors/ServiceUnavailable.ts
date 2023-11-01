import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import BaseError from './BaseError';

class ServiceUnavailable extends BaseError {
  constructor(
    message: string,
    methodName: string = '',
    DebugErrorMessage: object = {},
    httpCode: IStatusCodes = StatusCodes.SERVICE_UNAVAILABLE,
    isOperational: boolean = true
  ) {
    super(message, methodName, DebugErrorMessage, httpCode, isOperational);
  }
}

export default ServiceUnavailable;
