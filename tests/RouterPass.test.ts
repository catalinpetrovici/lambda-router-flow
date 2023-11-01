import { describe, it, expect } from '@jest/globals';
import { Router, IResponse, StatusCodes } from '../src/index';

describe('Router', () => {
  it('should return a valid response for GET HTTP method and for a specific API Gateway resource', async () => {
    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'GET',
      resource: '/users',
    };
    const router = new Router(event, headers);

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      expect(response?.statusCode).toBe(StatusCodes.OK);
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return a valid response for POST HTTP method and for a specific API Gateway resource', async () => {
    const addUser = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'POST',
      resource: '/users',
    };
    const router = new Router(event, headers);

    try {
      router.post('/users', addUser);

      const response = await router.handle();
      expect(response?.statusCode).toBe(StatusCodes.OK);
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return a valid response for PATCH HTTP method and for a specific API Gateway resource', async () => {
    const updateUser = async (_: any, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        name: 'Joe',
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'PATCH',
      resource: '/users/{userId}',
    };
    const router = new Router(event, headers);

    try {
      router.patch('/users/{userId}', updateUser);

      const response = await router.handle();
      expect(response?.statusCode).toBe(StatusCodes.OK);
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return a valid response for DELETE HTTP method and for a specific API Gateway resource', async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event = {
      httpMethod: 'DELETE',
      resource: '/users/{userId}',
    };
    const router = new Router(event, headers);

    try {
      router.delete('/users/{userId}', auth);

      const response = await router.handle();
      expect(response?.statusCode).toBe(StatusCodes.OK);
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });
});
