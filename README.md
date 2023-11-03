# LambdaRouterFlow

LambdaRouterFlow is a very simple router for AWS Lambda.

### Example Lambda Application

```javascript
import Router from 'lambda-router-flow';
import Service from './services/index.mjs';
import Check from './middlewares/index.mjs';
import { headers } from './CORS-settings.mjs';

export const handler = async (event) => {
  const debug =
    event.headers.DEBUG === 'true' || event?.requestContext?.stage === 'dev';
  const router = new Router(event, headers, { debug });

  try {
    router.get('/roles', Service.getAllRoles);
    router.post('/roles', Check.permissions, Service.addRole);

    router.get('/roles/{roleId+}', Service.getRole);
    router.patch('/roles/{roleId+}', Check.permissions, Service.updateRole);
    router.delete('/roles/{roleId+}', Check.permissions, Service.deleteRole);

    return await router.handle();
  } catch (error) {
    return router.error(error);
  }
};
```

## Getting Started

Add LambdaRouterFlow to your AWS Lambda app:

```shell
npm install lambda-router-flow
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
