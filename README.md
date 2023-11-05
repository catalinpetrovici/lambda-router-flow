# LambdaRouterFlow

LambdaRouterFlow is a simple router for AWS Lambda.

### Example Lambda Application

```javascript
import Router from 'lambda-router-flow';
import Service from './services/index.mjs';
import Check from './middlewares/index.mjs';
import { headers } from './CORS-settings.mjs';

export const handler = async (event) => {
  const debug = event?.requestContext?.stage === 'dev';
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
router.get('/roles', Validate.body, Check.permissions, Service.getAllRoles);

export async function body(request, response, sessionStorage) {
  const result = userSchema.safeParse(request.body);
  if (!result.success)
    throw new BadRequest(`Object doesn't match schema`, 'body');
}

export async function permissions(request, response, sessionStorage) {
  // check permissions
  if (!isAuthorized) throw new Unauthorized('Unauthorized', 'permissions');
}
```

```javascript
router.before(Validate.Headers).after(Service.cacheResponse);

router.get('/roles', Service.getAllRoles);

// OR

router.before(Validate.Headers);

router.get('/roles', Service.getAllRoles);

router.after(Service.triggerLambda);
```

## Service Example

```javascript
import { ServiceError, StatusCodes } from 'lambda-router-flow';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

export async function getAllRoles(request, response, sessionStorage) {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  try {
    const command = new ScanCommand({
      TableName: 'UserRoles',
    });

    const UserRolesRecords = await docClient.send(command);
    const Items = UserRolesRecords.Items;

    return response.status(StatusCodes.OK).json({
      length: Items.length,
      data: Items,
    });
  } catch (error) {
    // format @aws-sdk errors
    const DebugErrorMessage = {};

    throw new ServiceError(
      error.message,
      'getAllRoles',
      DebugErrorMessage,
      error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
```

## Error handling

LambdaRouterFlow have it's own custom Errors

```javascript
/**
 * returns bad request with custom message
 * @params  {string} message            - Custom message
 * @params  {string} methodName         - Name of the parent function
 * @params  {object} DebugErrorMessage  - Custom object error message
 */
throw new BadRequest('Invalid HTTP method or resource', 'Router');

throw new Forbidden('---', 'Router');
throw new Unauthorized('---', 'Router');
throw new TooManyRequests('---', 'Router');
throw new InternalServerError('---', 'Router');
throw new NotFound('---', 'Router');
throw new NotImplemented('---', 'Router');
throw new ServiceUnavailable('---', 'Router');

throw new ServiceError('---', 'Router', StatusCodes.INTERNAL_SERVER_ERROR);
```
