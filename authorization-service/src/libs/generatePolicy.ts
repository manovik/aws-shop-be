import { APIGatewayAuthorizerResult } from "aws-lambda";

export const generatePolicy = (principalId: string, Effect = 'Deny', Resource: string): APIGatewayAuthorizerResult => {
  console.log(JSON.stringify({principalId, Effect, Resource}));
  
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect,
          Action: 'execute-api:Invoke',
          Resource,
        }
      ]
    }
  }
};
