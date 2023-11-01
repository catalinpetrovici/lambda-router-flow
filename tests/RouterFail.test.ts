import { describe, it, expect } from '@jest/globals';
import {
  Router,
  Response,
  IResponse,
  StatusCodes,
  Unauthorized,
} from '../src/index';
import { APIError, BadRequest } from '../src/index';

describe('Router', () => {
  it('should return NotFound status code and descriptive message when no route provided', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Requested resource is not available');
      expect(error.httpCode).toBe(StatusCodes.NOT_FOUND);
      return router.error(error);
    }
  });

  it('should return NotFound status code and descriptive message when HTTP methods routes are not matching', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.post('/auth', auth);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Requested resource is not available');
      expect(error.httpCode).toBe(StatusCodes.NOT_FOUND);
      return router.error(error);
    }
  });

  it('should return NotFound status code and descriptive message when resource routes are not matching', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.get('/users', auth);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Requested resource is not available');
      expect(error.httpCode).toBe(StatusCodes.NOT_FOUND);
      return router.error(error);
    }
  });

  it(`should return error when callback functions not provided`, async () => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.get('/auth');

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Router GET: No callbacks provided');
      expect(error.httpCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      return router.error(error);
    }
  });

  it(`should return error when handler doesn't return`, async () => {
    const auth = async (_: any, response: IResponse) => {
      response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.get('/auth', auth);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe(
        `Function ${auth.name} don't return a valid response`
      );
      expect(error.httpCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
      return router.error(error);
    }
  });

  it(`should return error when middleware return an error`, async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };
    const checkAuth = async (request: any) => {
      throw new Unauthorized('Unauthorized');
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.get('/auth', checkAuth, auth);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.message).toBe('Unauthorized');
      expect(error.httpCode).toBe(StatusCodes.UNAUTHORIZED);
      return router.error(error);
    }
  });
});
