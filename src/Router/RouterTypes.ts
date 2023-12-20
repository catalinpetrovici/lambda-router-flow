import { IResponse } from '../Response';

export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

export type THttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type TResponseCallbacks = {
  (
    request: any,
    response: IResponse,
    sessionStorage: any
  ): Promise<void | IResponse>;
};

export type TMiddlewareCallbacks = {
  (
    request: any,
    response: IResponse,
    sessionStorage: any
  ): Promise<void> | void;
};

export type TQueue = [THttpMethod, string, TResponseCallbacks[]];

export type TOptions = {
  debug?: boolean;
  cors?: boolean;
};

export type THeaders = {
  'Access-Control-Allow-Origin'?: string | string[];
  [key: string]: any;
};

export type TEvent = {
  resource?: string;
  path?: string;
  httpMethod?: THttpMethod | string;
  headers?: {
    Accept?: string;
    Host?: string;
    'User-Agent'?: string;
    'X-Amzn-Trace-Id'?: string;
    'X-Forwarded-For'?: string;
    'X-Forwarded-Port'?: string;
    'X-Forwarded-Proto'?: string;
    Origin?: string;
    origin?: string;
  };
  multiValueHeaders?: {
    Accept?: string[];
    'Accept-Encoding'?: string[];
    DEBUG?: string[];
    Host?: string[];
    'Postman-Token'?: string[];
    'User-Agent'?: string[];
    'X-Amzn-Trace-Id'?: string[];
    'X-Forwarded-For'?: string[];
    'X-Forwarded-Port'?: string[];
    'X-Forwarded-Proto'?: string[];
    Authorization?: string[];
  };
  queryStringParameters?: null | any;
  multiValueQueryStringParameters?: null | any;
  pathParameters?: null | any;
  stageVariables?: null | any;
  requestContext?: {
    resourceId?: string;
    resourcePath?: string;
    httpMethod?: THttpMethod | string;
    'content-type': string[];
    Host?: string[];
    origin?: string[];
    Referer?: string[];
    extendedRequestId?: string;
    requestTime?: string;
    path?: string;
    accountId?: string;
    protocol?: string;
    stage?: string;
    domainPrefix?: string;
    requestTimeEpoch?: number;
    requestId?: string;
    identity?: {
      cognitoIdentityPoolId?: null | any;
      accountId?: null | any;
      cognitoIdentityId?: null | any;
      caller?: null | any;
      sourceIp?: number;
      principalOrgId?: null | any;
      accessKey?: null | any;
      cognitoAuthenticationType?: null | any;
      cognitoAuthenticationProvider?: null | any;
      userArn?: null | any;
      userAgent?: string;
      user?: null | any;
    };
    domainName?: string;
    apiId?: string;
  };
  body?: object | string | null;
  isBase64Encoded?: boolean;
  [key: string]: any;
};
