import { describe, it, expect } from '@jest/globals';
import {
  Router,
  type IResponse,
  StatusCodes,
  Unauthorized,
} from '../src/index';
import BaseError from '../src/Errors/BaseError';
import { TEvent } from '../src/Router/RouterTypes';

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
      path: '/users',
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
      path: '/users',
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
    const updateUser = async (event: TEvent, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        name: 'Joe',
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event: TEvent = {
      httpMethod: 'PATCH',
      path: '/users/018d4256-7f6b-7289-a377-c9ad75702090',
    };
    const router = new Router(event, headers);

    try {
      router.patch('/users/{userId+}', updateUser);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"name":"Joe"}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      expect(event.routerFlow?.pathParameters?.userId).toBe(
        '018d4256-7f6b-7289-a377-c9ad75702090'
      );

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return a valid response for DELETE HTTP method and for a specific API Gateway resource', async () => {
    const auth = async (_: TEvent, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        data: [],
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event: TEvent = {
      httpMethod: 'DELETE',
      path: '/users/018d4257-1623-7aae-8b75-adf7f1c7c714',
    };
    const router = new Router(event, headers);

    try {
      router.delete('/users/{userId+}', auth);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"data":[]}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      expect(event.routerFlow?.pathParameters?.userId).toBe(
        '018d4257-1623-7aae-8b75-adf7f1c7c714'
      );

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return a valid response for OPTIONS HTTP method and for a specific API Gateway resource', async () => {
    const updateUser = async (_: any, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        status: 'Success',
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event: TEvent = {
      httpMethod: 'OPTIONS',
      path: '/users/018d4257-75e1-7ce2-8ead-1a8c9346cf6b',
    };
    const router = new Router(event, headers);

    try {
      router.options('/users/{userId+}', updateUser);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"status":"Success"}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      expect(event.routerFlow?.pathParameters?.userId).toBe(
        '018d4257-75e1-7ce2-8ead-1a8c9346cf6b'
      );

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
      path: '/auth',
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
      path: '/auth',
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

  it(`should return a valid response for GET HTTP method and for nested path`, async () => {
    const updateUser = async (_: any, response: IResponse) => {
      return response.status(StatusCodes.OK).json({
        status: 'Success',
      });
    };

    const headers = {
      'Access-Control-Allow-Origin': '*',
    };

    const event: TEvent = {
      httpMethod: 'GET',
      path: '/users/018d4255-ea19-7947-ba82-f665f4609999/messages/018d4256-2470-76cd-9233-4c0b528e3f99/comments/018d4256-4890-7092-95ab-774f15b64737/likes',
    };
    const router = new Router(event, headers);

    try {
      router.get(
        '/users/{userId+}/messages/{messageId+}/comments/{commentId+}/likes',
        updateUser
      );
      router.post(
        '/users/{userId+}/messages/{messageId+}/comments/{commentId+}/likes',
        updateUser
      );
      router.delete(
        '/users/{userId+}/messages/{messageId+}/comments/{commentId+}/likes',
        updateUser
      );
      router.patch(
        '/users/{userId+}/messages/{messageId+}/comments/{commentId+}/likes',
        updateUser
      );

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.body).toBe('{"status":"Success"}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      expect(event.routerFlow?.pathParameters?.userId).toBe(
        '018d4255-ea19-7947-ba82-f665f4609999'
      );
      expect(event.routerFlow?.pathParameters?.messageId).toBe(
        '018d4256-2470-76cd-9233-4c0b528e3f99'
      );
      expect(event.routerFlow?.pathParameters?.commentId).toBe(
        '018d4256-4890-7092-95ab-774f15b64737'
      );

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });
});
