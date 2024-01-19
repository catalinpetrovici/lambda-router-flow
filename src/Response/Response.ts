import { StatusCodes, type IStatusCodes } from '../StatusCodes';
import ms, { type StringValue } from './ms';

export interface ICookieOptions {
  path?: string;
  domain?: string;
  maxAge?: StringValue;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Lax' | 'None' | 'Strict';
}

export interface IResponse {
  set: (property: string, value: number | string | boolean) => IResponse;
  status: (statusCode: IStatusCodes) => IResponse;
  cookie: (name: string, value: string, options?: ICookieOptions) => IResponse;
  json: (response: object | string) => IResponse;
  send: () => {
    statusCode: number;
    body: string;
    headers: {
      [key: string]: any;
    };
  };
}

export default class Response implements IResponse {
  statusCode: IStatusCodes = StatusCodes.INTERNAL_SERVER_ERROR;
  headers: {
    [key: string]: number | string | boolean;
  } = {};
  response: string | object | undefined;

  constructor(headers: object) {
    this.headers = {
      ...headers,
    };
    this.response = undefined;
  }

  private _randomizeCase(input: string): string {
    const randomCase = (char: string) =>
      Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();

    return input.split('').map(randomCase).join('');
  }

  private _isJson(item: object | string) {
    let value = typeof item !== 'string' ? JSON.stringify(item) : item;
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
    return typeof value === 'object' && value !== null;
  }

  public set(property: string, value: number | string | boolean) {
    if (!property || !value) throw new Error('Invalid property or value');
    this.headers[property] = value;

    return this;
  }

  public status(statusCode: IStatusCodes) {
    if (typeof statusCode !== 'number') {
      throw new Error('Invalid statusCode');
    }

    this.statusCode = statusCode;
    return this;
  }

  public cookie(name: string, value: string, options?: ICookieOptions) {
    if (typeof name !== 'string' || typeof value !== 'string') {
      throw new Error('Invalid cookie name or value');
    }

    let { path, domain, maxAge, httpOnly, secure, sameSite } = options || {};

    let corsOptions = '';

    if (path) {
      corsOptions += ` Path=${path};`;
    }

    if (domain) {
      corsOptions += ` Domain=${path};`;
    }

    if (maxAge) {
      corsOptions += ` expires=${new Date(
        Date.now() + ms(maxAge)
      ).toUTCString()};`;
    }

    if (httpOnly) {
      corsOptions += ' HttpOnly;';
    }

    if (secure) {
      corsOptions += ' Secure;';
    }

    if (sameSite) {
      if (sameSite === 'None') {
        corsOptions += ` SameSite=None; ${secure ? '' : 'Secure;'}`;
      } else {
        corsOptions += ` SameSite=${sameSite};`;
      }
    }

    const cookie = `${name}=${value};${corsOptions}`;

    let SET_COOKIE = this._randomizeCase('SET-COOKIE');

    while (this.headers[SET_COOKIE]) {
      SET_COOKIE = this._randomizeCase('SET-COOKIE');
    }

    this.headers[SET_COOKIE] = cookie;

    return this;
  }

  public json(response: object | string) {
    if (!this._isJson(response)) throw new Error('Invalid JSON format');

    this.response = response;
    return this;
  }

  public send(): {
    statusCode: number;
    body: string;
    headers: {
      [key: string]: any;
    };
  } {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify(this.response),
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
    };
  }
}
