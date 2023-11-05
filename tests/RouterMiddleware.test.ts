import { describe, it, expect } from '@jest/globals';
import { Router, IResponse, StatusCodes, Unauthorized } from '../src/index';
import BaseError from '../src/Errors/BaseError';
import { afterEach } from 'node:test';
import { HttpMethod } from '../src/Router/RouterTypes';

describe('Router', () => {
  it('should pass when before and after middleware are valid', async () => {
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
      router.after((request) => {
        expect(request.httpMethod).toBe(HttpMethod.GET);
        expect(request.resource).toBe('/users');
      });

      router.get('/users', getUsers);

      // @ts-ignore
      router.after((request) => {
        expect(request.httpMethod).toBe(HttpMethod.GET);
        expect(request.resource).toBe('/users');
      });

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

  it('should pass when before middleware is invalid', async () => {
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
      // @ts-ignore
      router.before('x');

      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      return response;
    } catch (error: any) {
      console.log('error####', error);

      if (error instanceof BaseError) {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        return router.error(error);
      } else {
        expect(true).toBe(false);
      }

      return router.error(error);
    }
  });

  it('should pass when after middleware is invalid', async () => {
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
      // @ts-ignore
      router.before('x').after('x');

      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      return response;
    } catch (error: any) {
      console.log('error after', error);
      expect(true).toBe(false);
      return router.error(error);
    }
  });

  it('should return Unauthorized error triggered by before middleware', async () => {
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
    const check = async () => {
      throw new Unauthorized('Unauthorized', 'check');
    };
    try {
      router.before(check);

      router.get('/users', getUsers);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      if (error instanceof BaseError) {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        return router.error(error);
      } else {
        expect(true).toBe(false);
      }

      return router.error(error);
    }
  });

  it('should return Unauthorized error triggered by before middleware', async () => {
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
    const check = async () => {
      throw new Unauthorized('Unauthorized', 'check');
    };
    try {
      router.before(() => {});

      router.get('/users', getUsers);

      router.after(check);

      await router.handle();
      expect(true).toBe(false);
    } catch (error: any) {
      if (error instanceof BaseError) {
        expect(error.message).toBe('Unauthorized');
        expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        return router.error(error);
      } else {
        expect(true).toBe(false);
      }

      return router.error(error);
    }
  });
});
