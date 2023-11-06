![Lambda-router-flow-Logo-1](https://github.com/catalinpetrovici/lambda-router-flow/assets/73588411/33a8588e-cc99-4c3c-ad63-fd07b2c687d3)

LambdaRouterFlow is a simple and lightweight routing solution for AWS Lambda applications. It enables easy route definitions, middleware implementation, and error handling.

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

To incorporate LambdaRouterFlow into your AWS Lambda application, use npm for the package installation:

```shell
npm install lambda-router-flow
```

## Routes Definition

Creating routes in LambdaRouterFlow is a breeze.

1. Initiate an instance of Router.
2. Provide the event and headers as parameters.
3. Use methods like _router.get()_, _router.post()_, etc., to define routes.
4. Return _await router.handle()_.

```javascript
router.get('/roles', Handlers.getAllRoles);
```

Each route method takes two arguments:

- a string that defines the path
- a function that defines what happens when that route is hit.

## Middlewares

Middlewares within LambdaRouterFlow are designed to execute actions between the request and response. The only way to stop the router middleware chain is to throw an error:

```javascript
router.get('/roles', Validate.body, Check.permissions, Service.getAllRoles);

export async function body(request, response, sessionStorage) {
  const result = userSchema.safeParse(request.body);
  // define schema
  if (!result.success)
    throw new BadRequest(`Object doesn't match schema`, 'body');
}

export async function permissions(request, response, sessionStorage) {
  // check permissions
  if (!isAuthorized) throw new Unauthorized('Unauthorized', 'permissions');
}
```

### Before and After Middlewares

Before middleware is designed to execute before all middlewares.

After middleware is designed to execute after the Service function returns a valid response.

```javascript
router.before(Validate.Headers).after(Service.cacheResponse);

router.get('/roles', Service.getAllRoles);

// OR

router.before(Validate.Headers);

router.get('/roles', Service.getAllRoles);

router.after(Service.triggerLambda);
```

## Service Example

Here's an example of a GET service that retrieves all roles from a DynamoDB table:

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

LambdaRouterFlow provides custom errors for enhanced error management

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
