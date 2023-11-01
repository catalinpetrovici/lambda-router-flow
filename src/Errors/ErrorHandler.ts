import BaseError from './BaseError';

class ErrorHandler {
  async handleError(err: Error) {
    console.error(
      'ErrorHandler: Uncaught Exception! Not caught by a programming construct or by the programmer!',
      err,
      err.stack
    );
  }

  isTrustedError(error: Error) {
    return error instanceof BaseError && error.isOperational;
  }
}

export const errorHandlerInstance = new ErrorHandler();
