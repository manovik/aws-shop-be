import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
  resources: {
    Resources: {
      Outputs: {
        basicAuthorizerLambdaArn: {
          Value: {
            'Fn::GetAtt': ['basicAuthorizer', 'Arn']
          },
          Export: {
            Name: 'basicAuthorizerArn'
          }
        }
      }
    }
  }
}
