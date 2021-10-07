import { APIGatewayAuthorizerCallback, APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { generatePolicy } from "@libs/generatePolicy";

export const basicAuthorizer = async (event: APIGatewayRequestAuthorizerEvent, _ctx, callback: APIGatewayAuthorizerCallback) => {
  if (event.type !== 'REQUEST') callback('Unauthorized');

  try {
    const { authorizationToken } = event.queryStringParameters;
    console.log('authorizationToken: ', authorizationToken);

    const buffer = Buffer.from(authorizationToken, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');

    const originPassword = process.env[username];

    const effect = originPassword && originPassword === password ? 'Allow' : 'Deny';

    callback(null, generatePolicy('user', effect, event.methodArn));

  } catch (err: unknown){
    callback(`Authorization failed. Error:\n${err}`);
  }
}
