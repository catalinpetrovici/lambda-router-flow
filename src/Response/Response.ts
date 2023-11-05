import { StatusCodes, type IStatusCodes } from '../StatusCodes';

export interface IResponse {
  set: (property: string, value: number | string | boolean) => IResponse;
  status: (statusCode: IStatusCodes) => IResponse;
  cookie: (
    name: string,
    value: string,
    options: { maxAge: number }
  ) => IResponse;
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

  isJson(item: object | string) {
    let value = typeof item !== 'string' ? JSON.stringify(item) : item;
    try {
      value = JSON.parse(value);
    } catch (e) {
      return false;
    }
    return typeof value === 'object' && value !== null;
  }

  set(property: string, value: number | string | boolean) {
    if (!property || !value) throw new Error('Invalid property or value');
    this.headers[property] = value;

    return this;
  }

  status(statusCode: IStatusCodes) {
    if (typeof statusCode !== 'number') {
      throw new Error('Invalid statusCode');
    }

    this.statusCode = statusCode;
    return this;
  }

  cookie(name: string, value: string, options: { maxAge: number }) {
    if (typeof name !== 'string' || typeof value !== 'string') {
      throw new Error('Invalid cookie name or value');
    }

    const { maxAge } = options;
    const expires = Date.now() + maxAge;

    const cookie = `${name}=${value}; expires=${new Date(
      expires
    ).toUTCString()};`;

    this.headers['SET-COOKIE'] = cookie;
    return this;
  }

  json(response: object | string) {
    console.log('Response json');
    if (!this.isJson(response)) throw new Error('Invalid JSON format');

    this.response = response;
    return this;
  }

  send(): {
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
