import { Response, IResponse } from '../Response';
import { StatusCodes } from '../StatusCodes';
import { errorHandlerInstance, BadRequest, BaseError } from '../Errors';

export default class Router {
  request: {
    httpMethod?: string;
    resource?: string;
  };
  response: IResponse;
  queue: string[] | any = [];
  options: { [key: string]: number | string | boolean } = {
    debug: false,
  };

  constructor(event: object, headers: object, options?: object) {
    this.request = event;
    this.response = new Response(headers);

    if (options) {
      this.options = {
        ...this.options,
        ...options,
      };
    }
  }

  _check(
    resource: string,
    cbs: { (request: any, response: IResponse): void }[]
  ) {
    if (!resource || typeof resource !== 'string')
      throw new Error('Router GET: No resource provided');
    if (!Array.isArray(cbs) || !cbs?.length)
      throw new Error('Router GET: No callbacks provided');
  }

  get(
    resource: string,
    ...cbs: { (request: any, response: IResponse): void }[]
  ) {
    console.log('Router GET', resource, cbs);
    this._check(resource, cbs);

    this.queue.push(['GET', resource, cbs]);
    return this;
  }

  async post(resource: string, ...cbs: { (param: string): void }[]) {
    console.log('Router POST', resource, cbs);
    this._check(resource, cbs);

    this.queue.push(['POST', resource, cbs]);
    return this;
  }

  async patch(resource: string, ...cbs: { (param: string): void }[]) {
    console.log('Router PATCH', resource, cbs);
    this._check(resource, cbs);

    this.queue.push(['PATCH', resource, cbs]);
    return this;
  }

  async delete(resource: string, ...cbs: { (param: string): void }[]) {
    console.log('Router DELETE', resource, cbs);
    this._check(resource, cbs);

    this.queue.push(['DELETE', resource, cbs]);
    return this;
  }

  async handle() {
    if (!this.queue.length)
      throw new BadRequest('Invalid HTTP method or resource', 'Router');

    console.log('handle queue', this.queue);

    const session = this.queue.filter((q: any) => {
      // could use find, but we want to check wrong Router setup
      const [httpMethod, resource] = q;

      return (
        this.request?.httpMethod === httpMethod &&
        this.request?.resource === resource
      );
    });

    if (!session?.length)
      throw new BadRequest('Invalid HTTP method or resource', 'Router');

    if (session.length > 1)
      throw new Error('Multiple requests found. Please check the Router setup');
    if (!Array.isArray(session[0][2]) || !session[0][2]?.length)
      throw new Error('No callbacks found');

    const callbacksSession = session[0][2];

    for (let [i, callback] of callbacksSession.entries()) {
      if (i === callbacksSession.length - 1) {
        const response = await callback(this.request, this.response);

        if (!response || !(response instanceof Response))
          throw new Error(
            `Function ${callback?.name} don't return a valid response`
          );

        return this.response.send();
      }
      await callback(this.request, this.response);
    }
  }

  error(error: Error | BaseError, options?: {}) {
    if (!errorHandlerInstance.isTrustedError(error)) {
      console.log('InternalServerError', JSON.stringify(error));
      const responseError: { [key: string]: any } = {
        message: 'Something went wrong try again later...',
      };

      if (this.options.debug && error.message) {
        const DebugErrorMessage: { [key: string]: any } = {};

        DebugErrorMessage['errorSource'] = error.message;
        DebugErrorMessage.stack = error.stack;
        responseError.DebugErrorMessage = DebugErrorMessage;
      }

      return this.response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(responseError)
        .send();
    }

    if (error instanceof BaseError) {
      console.log('TrustedError', JSON.stringify(error));
      let statusCode =
        error.httpCode !== StatusCodes.OK
          ? error.httpCode
          : StatusCodes.INTERNAL_SERVER_ERROR;
      const responseError: { [key: string]: any } = {
        message: error.message,
      };

      if (this.options.debug) {
        const DebugErrorMessage: { [key: string]: any } = {
          ...error.DebugErrorMessage,
        };

        DebugErrorMessage.methodName = error.methodName;
        DebugErrorMessage.stack = error.stack;
        responseError.DebugErrorMessage = DebugErrorMessage;
      }

      return this.response.status(statusCode).json(responseError).send();
    }
  }
}
