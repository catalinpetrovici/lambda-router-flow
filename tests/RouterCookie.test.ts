import { describe, it, expect } from '@jest/globals';
import { Router, type IResponse, StatusCodes } from '../src/index';

describe('Router', () => {
  it(`should return a valid response with some cookie attached to headers`, async () => {
    const getUsers = async (_: any, response: IResponse) => {
      response.cookie('id', 'abcd-1234');
      response.cookie('id1', 'abcd-1111', { maxAge: '2h', httpOnly: true });
      response.cookie('id2', 'abcd-2222', { httpOnly: true, secure: true });
      response.cookie('id3', 'abcd-3333', {
        path: '/',
        httpOnly: true,
        secure: true,
      });
      response.cookie('id4', 'abcd-4444', {
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: true,
      });
      response.cookie('id5', 'abcd-1234', {
        path: '/',
        maxAge: '2h',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      });

      return response.status(200).json({
        data: [{ name: 'Joe' }],
        length: 1,
      });
    };

    const event = {
      httpMethod: 'GET',
      resource: '/users',
      headers: {
        origin: 'http://localhost:4173',
      },
    };
    const router = new Router(event, {}, { cors: true });

    try {
      router.get('/users', getUsers);

      const response = await router.handle();
      if (!response) return expect(true).toBe(false);

      console.log('### response', response);

      expect(response).toHaveProperty('statusCode');
      expect(response).toHaveProperty('body');
      expect(response).toHaveProperty('headers');

      expect(response.headers).toHaveProperty('Access-Control-Allow-Origin');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('*');

      expect(response.body).toBe('{"data":[{"name":"Joe"}],"length":1}');
      expect(response.statusCode).toBe(StatusCodes.OK);

      return response;
    } catch (error: any) {
      console.log('error', error);
      expect(true).toBe(false);
      return router.error(error);
    }
  });
});
