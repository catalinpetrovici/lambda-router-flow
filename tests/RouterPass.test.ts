import { describe, it, expect } from '@jest/globals';
import { Router, IResponse, StatusCodes, Unauthorized } from '../src/index';
import BaseError from '../src/Errors/BaseError';

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
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      console.log('error', error);
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
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"data":[]}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
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
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"name":"Joe"}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
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
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"data":[]}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should pass when error router is trusted`, async () => {
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
      if (error instanceof BaseError) {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);

        const response = router.error(error);
        if (!response) return expect(true).toBe(false);

        expect(response.body).toBe('{"message":"Unauthorized"}');
        expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);

        return response;
      } else expect(true).toBe(false);
    }
  });

  it(`should pass when error router is not trusted`, async () => {
    const auth = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [],
      });
    };
    const checkAuth = async (request: any) => {
      throw new Error('Unauthorized');
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
      if (error instanceof BaseError) {
        expect(true).toBe(false);
      } else {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBeUndefined();

        const response = router.error(error);
        if (!response) return expect(true).toBe(false);

        expect(response.body).toBe(
          '{"message":"Something went wrong try again later..."}'
        );
        expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);

        return response;
      }
    }
  });
});
