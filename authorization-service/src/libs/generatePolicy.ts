import { APIGatewayAuthorizerResult } from "aws-lambda";

export const generatePolicy = (principalId: string, Effect = 'Deny', Resource: string): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: 'string',
    Statement: [
      {
        Effect,
        Action: '',
        Resource,
      }
    ]
  }
});