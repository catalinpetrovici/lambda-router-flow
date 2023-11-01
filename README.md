# LambdaRouterFlow

LambdaRouterFlow is a very simple router for AWS Lambda.

### Example Lambda Application

```javascript
import Handlers from './handlers/index.mjs';
import Check from './middlewares/index.mjs';
import Router from './router/Router.mjs';
import { headers } from './CORS-settings.mjs';

export const handler = async (event) => {
  const debug =
    event.headers.DEBUG === 'true' || event?.requestContext?.stage === 'dev';
  const router = new Router(event, headers, { debug });

  try {
    router.get('/roles', Handlers.getAllRoles);
    router.post('/roles', Check.permissions, Handlers.addRole);

    router.get('/roles/{roleId+}', Handlers.getRole);
    router.patch('/roles/{roleId+}', Check.permissions, Handlers.updateRole);
    router.delete('/roles/{roleId+}', Check.permissions, Handlers.deleteRole);

    return await router.handle();
  } catch (error) {
    return router.error(error);
  }
};
```

## Getting Started

Add LambdaRouterFlow to your AWS Lambda app:

```shell
npm add lambda-router-flow
```

## Routes Definition

```javascript
router.get('/roles', Handlers.getAllRoles);
```

## Middlewares

LambdaRouterFlow have middlewares.
The only way to stop router middleware chain is to throw an error.

```javascript
router.get('/roles', Validate.body, Check.permissions, Handlers.getAllRoles);
```

## Error handling

LambdaRouterFlow have it's own throw Errors

```javascript
/**
 * returns bad request with custom message
 * @params  {string} message            - Custom message
 * @params  {string} methodName         - Name of the parent function
 * @params  {object} DebugErrorMessage  - Custom object error message
 */
throw new BadRequest('Invalid HTTP method or resource', 'Router');
```
