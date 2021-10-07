import { APIGatewayAuthorizerCallback, APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import { generatePolicy } from "@libs/generatePolicy";

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _ctx, callback: APIGatewayAuthorizerCallback) => {
  if (event.type !== 'TOKEN') callback('Unauthorized');

  try {
    const { authorizationToken } = event;
    console.log('authorization token: ', authorizationToken);

    const creds = authorizationToken.split(' ')[1];
    if (!creds) {
      callback('Authorization failed');
      throw Error('No credentials provided!');
    }

    const buffer = Buffer.from(creds, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');

    console.log(JSON.stringify({username, password}));

    const originPassword = process.env[username];

    const effect = creds && originPassword && originPassword === password ? 'Allow' : 'Deny';

    callback(null, generatePolicy(creds, effect, event.methodArn));

  } catch (err: unknown){
    callback(`Authorization failed. Error:\n${err}`);
  }
}
