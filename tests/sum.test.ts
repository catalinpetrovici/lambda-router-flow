import { describe, it, expect } from '@jest/globals';
import {
  Router,
  Response,
  StatusCodes,
  APIError,
  BadRequest,
  IResponse,
  BaseError,
} from '../src/index';

describe('test', () => {
  it('should pass', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/auth',
    };
    const router = new Router(event, headers);

    try {
      router.get('/auth', auth);

      const response = await router.handle();
      expect(response?.statusCode).toBe(200);
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should fail', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Headers':
        'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
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
      expect(error.message).toBe('Invalid HTTP method or resource');
      expect(error.httpCode).toBe(400);
      return router.error(error);
    }
  });
});
