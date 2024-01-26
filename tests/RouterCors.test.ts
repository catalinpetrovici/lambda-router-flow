import { describe, it, expect } from '@jest/globals';
import { Router, type IResponse, StatusCodes } from '../src/index';

describe('Router', () => {
  it(`should return a valid response with the '*' as a value for the Access-Control-Allow-Origin`, async () => {
    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:4173',
      },
    };
    const router = new Router(event, {}, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should respond with the correct Access-Control-Allow-Origin header when provided with a specific origin when Router headers is a string`, async () => {
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:3001',
      },
    };

    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const router = new Router(event, headers, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers['Access-Control-Allow-Origin']).toBe(
        'http://localhost:3001'
      );

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should return with the correct Access-Control-Allow-Origin header when the origin is different `, async () => {
    const headers = {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:4173',
      },
    };

    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const router = new Router(event, headers, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers['Access-Control-Allow-Origin']).toBe(
        'http://localhost:3001'
      );

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should respond with the correct Access-Control-Allow-Origin header when provided with a specific origin when Router headers is an Array`, async () => {
    const headers = {
      'Access-Control-Allow-Origin': [
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:4002',
      ],
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:4002',
      },
    };

    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const router = new Router(event, headers, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers['Access-Control-Allow-Origin']).toBe(
        'http://localhost:4002'
      );

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should return an valid response with "undefined" as a value for the Access-Control-Allow-Origin`, async () => {
    const headers = {
      'Access-Control-Allow-Origin': [
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:4002',
      ],
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:8800',
      },
    };

    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const router = new Router(event, headers, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).not.toHaveProperty(
        'Access-Control-Allow-Origin'
      );
      expect(response.headers['Access-Control-Allow-Origin']).toBeUndefined();

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it(`should respond with the correct Access-Control-Allow-Origin value when multiple requests from multiple origins were made`, async () => {
    const headers = {
      'Access-Control-Allow-Origin': [
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:4002',
      ],
    };

    const event = {
      httpMethod: 'GET',
      path: '/users',
      headers: {
        origin: 'http://localhost:4002',
      },
    };

    const getUsers = async (_: any, response: IResponse) => {
      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    async function firstRequest() {
      const router = new Router(event, headers, { cors: true });

      try {
        router.get('/users', getUsers);

        const response = await router.handle();
        if (!response) return expect(true).toBe(false);

        expect(response).toHaveProperty('statusCode');
        expect(response).toHaveProperty('body');
        expect(response).toHaveProperty('headers');

        expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
        expect(response.headers['Access-Control-Allow-Origin']).toBe(
          'http://localhost:4002'
        );

        expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
        expect(response.statusCode).toBe(StatusCodes.OK);

        return response;
      } catch (error: any) {
        expect(true).toBe(false);
        return router.error(error);
      }
    }

    async function secondRequest() {
      const router = new Router(event, headers, { cors: true });

      try {
        router.post('/users', getUsers);

        const response = await router.handle();
        if (!response) return expect(true).toBe(false);

        expect(response).toHaveProperty('statusCode');
        expect(response).toHaveProperty('body');
        expect(response).toHaveProperty('headers');

        expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
        expect(response.headers['Access-Control-Allow-Origin']).toBe(
          'http://localhost:3002'
        );

        expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
        expect(response.statusCode).toBe(StatusCodes.OK);

        return response;
      } catch (error: any) {
        expect(true).toBe(false);
        return router.error(error);
      }
    }

    await firstRequest();

    event.headers.origin = 'http://localhost:3002';
    event.httpMethod = 'POST';

    await secondRequest();
  });
});
