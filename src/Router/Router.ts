import { type TEvent, TQueue, TResponseCallbacks } from './RouterTypes';
import { HttpMethod, TOptions, THttpMethod, THeaders } from './RouterTypes';
import { TMiddlewareCallbacks } from './RouterTypes';
import { Response, IResponse } from '../Response';
import { StatusCodes } from '../StatusCodes';
import { errorHandlerInstance, InternalServerError, NotFound } from '../Errors';
import BaseError from '../Errors/BaseError';

export default class Router {
  public request: TEvent = {};
  public response: IResponse;
  public sessionStorage = {};
  private _beforeCb: TMiddlewareCallbacks | undefined = undefined;
  private _afterCb: TMiddlewareCallbacks | undefined = undefined;
  private _queue: TQueue[] = [];
  private _options: TOptions = {
    debug: false,
    cors: false,
  };

  constructor(event: TEvent, headers: THeaders = {}, options?: TOptions) {
    this.request = event;

    if (options?.cors) {
      const origin = event?.headers?.Origin || event?.headers?.origin;
      this._cors(origin, headers);
    }

    this.response = new Response(headers);

    if (options) {
      this._options = {
        ...this._options,
        ...options,
      };
    }
  }

  private _check(
    HttpMethod: THttpMethod,
    resource: string,
    cbs: TResponseCallbacks[]
  ) {
    if (!resource || typeof resource !== 'string')
      throw new InternalServerError(
        `Router ${HttpMethod}: No resource provided`
      );
    if (!Array.isArray(cbs) || !cbs?.length)
      throw new InternalServerError(
        `Router ${HttpMethod}: No callbacks provided`
      );
  }

  private _cors(origin: string | undefined, headers: THeaders) {
    if (!headers) {
      throw new InternalServerError(
        'CORS policy is active, but the request contains no headers.'
      );
    }
    if (!origin) {
      throw new InternalServerError(
        'CORS policy is active, but no origin was found in the request.'
      );
    }

    if (!headers['Access-Control-Allow-Origin']) {
      headers['Access-Control-Allow-Origin'] = '*';
      return;
    }

    const allowedOrigins = headers['Access-Control-Allow-Origin'];
    if (Array.isArray(allowedOrigins)) {
      const allowedOrigin = allowedOrigins.includes(origin);

      if (allowedOrigin) {
        headers['Access-Control-Allow-Origin'] = origin;
      } else {
        delete headers['Access-Control-Allow-Origin'];
      }

      return;
    }

    if (
      typeof allowedOrigins === 'string' &&
      allowedOrigins.startsWith(origin)
    ) {
      headers['Access-Control-Allow-Origin'] = origin;

      return;
    }
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

    this._queue.push([HttpMethod.PATCH, resource, cbs]);
    return this;
  }

  public delete(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.DELETE}`, resource, cbs);
    this._check(HttpMethod.DELETE, resource, cbs);

    this._queue.push([HttpMethod.DELETE, resource, cbs]);
    return this;
  }

  public options(resource: string, ...cbs: TResponseCallbacks[]) {
    console.log(`Router ${HttpMethod.OPTIONS}`, resource, cbs);
    this._check(HttpMethod.OPTIONS, resource, cbs);

    this._queue.push([HttpMethod.OPTIONS, resource, cbs]);
    return this;
  }

  public before(callback: TMiddlewareCallbacks) {
    if (!callback) return this;
    if (
      callback.constructor.name !== 'Function' &&
      callback.constructor.name !== 'AsyncFunction'
    ) {
      console.error(
        'Router: Before method require a callback function as a parameter '
      );

      return this;
    }

    this._beforeCb = callback;

    return this;
  }

  public after(callback: TMiddlewareCallbacks) {
    if (!callback) return this;
    if (
      callback.constructor.name !== 'Function' &&
      callback.constructor.name !== 'AsyncFunction'
    ) {
      console.error(
        'Router: After method require a callback function as a parameter '
      );

      return this;
    }

    this._afterCb = callback;

    return this;
  }

  public async handle() {
    if (!this._queue.length)
      throw new NotFound('Requested resource is not available', 'Router');

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
      throw new InternalServerError(
        'Multiple requests found. Please check the Router setup'
      );
    if (!Array.isArray(session[0][2]) || !session[0][2]?.length)
      throw new InternalServerError('No callbacks found');

    const callbacksSession = session[0][2];

    if (this._beforeCb) {
      await this._beforeCb(this.request, this.response, this.sessionStorage);
    }

    for (let [i, callback] of callbacksSession.entries()) {
      if (i === callbacksSession.length - 1) {
        const response = await callback(
          this.request,
          this.response,
          this.sessionStorage
        );

        if (!response || !(response instanceof Response))
          throw new InternalServerError(
            `Function ${callback?.name} don't return a valid response`
          );

        if (this._afterCb) {
          await this._afterCb(this.request, this.response, this.sessionStorage);
        }

        return this.response.send();
      }
      await callback(this.request, this.response, this.sessionStorage);
    }
  }

  error(error: Error | BaseError, options?: {}) {
    if (!errorHandlerInstance.isTrustedError(error)) {
      console.error('InternalServerError', JSON.stringify(error));
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
      console.error('TrustedError', JSON.stringify(error));
      let statusCode =
        error.statusCode !== StatusCodes.OK
          ? error.statusCode
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
