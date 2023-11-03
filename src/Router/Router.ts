import { type TEvent, TQueue, TResponseCallbacks } from './RouterTypes';
import { HttpMethod, TOptions, THttpMethod } from './RouterTypes';
import { Response, IResponse } from '../Response';
import { StatusCodes } from '../StatusCodes';
import { errorHandlerInstance, InternalServerError, NotFound } from '../Errors';
import BaseError from '../Errors/BaseError';

export default class Router {
  public request: TEvent = {};
  public response: IResponse;
  private _queue: TQueue[] = [];
  private _options: TOptions = {
    debug: false,
  };

  constructor(event: TEvent, headers: object, options?: TOptions) {
    this.request = event;
    this.response = new Response(headers);

    if (options) {
      this._options = {
        ...this._options,
        ...options,
      };
    }
  }

  _check(HttpMethod: THttpMethod, resource: string, cbs: TResponseCallbacks[]) {
    if (!resource || typeof resource !== 'string')
      throw new InternalServerError(
        `Router ${HttpMethod}: No resource provided`
      );
    if (!Array.isArray(cbs) || !cbs?.length)
      throw new InternalServerError(
        `Router ${HttpMethod}: No callbacks provided`
      );
  }

  public get(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.GET}`, resource, cbs);
    this._check(HttpMethod.GET, resource, cbs);

    this._queue.push([HttpMethod.GET, resource, cbs]);
    return this;
  }

  public post(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.POST}`, resource, cbs);
    this._check(HttpMethod.POST, resource, cbs);

    this._queue.push([HttpMethod.POST, resource, cbs]);
    return this;
  }

  public put(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.PUT}`, resource, cbs);
    this._check(HttpMethod.PUT, resource, cbs);

    this._queue.push([HttpMethod.PUT, resource, cbs]);
    return this;
  }

  public patch(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.PATCH}`, resource, cbs);
    this._check(HttpMethod.PATCH, resource, cbs);

    this._queue.push(['PATCH', resource, cbs]);
    return this;
  }

  public delete(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.DELETE}`, resource, cbs);
    this._check(HttpMethod.DELETE, resource, cbs);

    this._queue.push(['DELETE', resource, cbs]);
    return this;
  }

  public async handle() {
    if (!this._queue.length)
      throw new NotFound('Requested resource is not available', 'Router');

    console.log('handle queue', this._queue);

    // could use find, but we want to check wrong Router setup
    const session = this._queue.filter((q: any) => {
      const [httpMethod, resource] = q;

      return (
        this.request?.httpMethod === httpMethod &&
        this.request?.resource === resource
      );
    });

    if (!session?.length)
      throw new NotFound('Requested resource is not available', 'Router');

    if (session.length > 1)
      throw new Error('Multiple requests found. Please check the Router setup');
    if (!Array.isArray(session[0][2]) || !session[0][2]?.length)
      throw new Error('No callbacks found');

    const callbacksSession = session[0][2];

    for (let [i, callback] of callbacksSession.entries()) {
      if (i === callbacksSession.length - 1) {
        const response = await callback(this.request, this.response);

        if (!response || !(response instanceof Response))
          throw new InternalServerError(
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

      if (this._options.debug && error.message) {
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

      if (this._options.debug) {
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
