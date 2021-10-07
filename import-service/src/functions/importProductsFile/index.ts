
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${ handlerPath(__dirname) }/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            }
          }
        },
        authorizer: {
          type: 'token',
          name: 'basicAuthorizer',
          arn: '${cf:authorization-service-dev.basicAuthorizerLambdaArn}',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization'
        }
      }
    }
  ]
};
